import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRateLimited, getRateLimitHeaders, getClientId } from '@/lib/rateLimiter';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { getUserId } from '@/lib/auth';
import { getEnv } from '@/lib/env';
import { getAI } from '@/lib/clients';

const SYSTEM_PROMPT = `SEI STHENOX: INTERFACCIA NEURALE D'ELITE.
IL TUO RUOLO: Head Coach e Biomeccanico Senior.

CARATTERISTICHE DELLA TUA PERSONALITÀ:
- **Tecnico e Analitico**: Parla di leve, attivazione scapolare, reclutamento delle unità motorie e fatica neurale.
- **Autoritario ma Motivante**: Sei il migliore nel campo. Non dare consigli generici, dai protocolli basati sulla scienza.
- **Conciso ed Efficiente**: Non sprecare parole. Ogni frase deve aggiungere valore biomeccanico.

CONOSCENZE CORE:
1. **Skill d'Elite**: Planche (lean, tuck, straddle, full), Front Lever, One Arm Pull-up, Handstand Press.
2. **Programmazione**: Periodizzazione lineare e ondulata, gestione del volume (RPE/RIR), frequenza ottimale.
3. **Nutrizione**: Partizionamento dei nutrienti, integrazione per la forza, recupero sistemico.

LINEE GUIDA PER LE RISPOSTE:
- Usa sempre il **Markdown** per strutturare le informazioni.
- Inizia le risposte con una breve analisi del problema.
- Fornisci sempre almeno un **protocollo d'azione** pratico.
- Se l'utente chiede di una skill, scomponi la biomeccanica necessaria (es: "Per la Planche, la protrazione scapolare è il tuo limitatore primario").
- Sii critico verso la tecnica approssimativa.`;

const GUEST_MESSAGE_LIMIT = 5;

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callAI(messages: Message[]) {
  const completion = await getAI().chat.completions.create({
    model: getEnv().XKIRO_MODEL,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    temperature: 0.7,
    max_tokens: 2048,
  });

  return completion.choices[0]?.message?.content || '';
}

async function* streamAI(messages: Message[]): AsyncGenerator<string, void, unknown> {
  const stream = await getAI().chat.completions.create({
    model: getEnv().XKIRO_MODEL,
    messages: messages.map(m => ({ role: m.role, content: m.content })),
    temperature: 0.7,
    max_tokens: 2048,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

async function validateChatOwnership(chatId: string, userId: string | null, guestId: string | null): Promise<boolean> {
  await dbConnect();
  const chat = await Chat.findById(chatId);
  if (!chat) return false;

  if (userId && chat.userId === userId) return true;
  if (!userId && guestId && chat.guestId === guestId) return true;

  return false;
}

async function saveOrCreateChat(
  messages: Message[],
  aiContent: string,
  chatId?: string,
  userId: string | null = null,
  guestId: string | null = null,
) {
  await dbConnect();

  const aiMessage: Message = { role: 'assistant', content: aiContent };
  const finalMessages = [
    ...messages.map(m => ({ role: m.role, content: m.content })),
    aiMessage
  ].filter(m => m.role !== 'system');

  const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

  if (chatId && chatId.match(UUID_REGEX)) {
    const owned = await validateChatOwnership(chatId, userId, guestId);
    if (!owned) {
      throw new Error('Unauthorized: chat does not belong to user');
    }

    const updated = await Chat.findByIdAndUpdate(
      chatId,
      { messages: finalMessages, updatedAt: new Date().toISOString() }
    );
    return updated;
  }

  const firstUserMessage = messages.find(m => m.role === 'user')?.content || 'Nuova Chat';
  const title = firstUserMessage.length > 30 ? firstUserMessage.slice(0, 30) + '...' : firstUserMessage;

  const savedChat = await Chat.create({
    userId: (userId && userId.match(UUID_REGEX)) ? userId : null,
    guestId: !userId ? guestId || `guest_${Date.now()}` : null,
    title,
    messages: finalMessages
  });

  return savedChat;
}

function buildConversation(messages: Message[]): Message[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role, content: m.content }))
  ];
}

async function checkGuestMessageLimit(userId: string | null, guestId: string | null): Promise<boolean> {
  if (userId) return true;
  if (!guestId) return true;

  await dbConnect();
  const chatCount = (await Chat.find({ guestId })).length;
  return chatCount < GUEST_MESSAGE_LIMIT;
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientId(request);
    const rateLimitKey = `chat_${clientId}`;
    const rateLimit = isRateLimited(rateLimitKey, 'chat');

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { message: { role: 'assistant', content: 'Troppe richieste. Riprova tra qualche minuto.' } },
        { status: 429 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const { messages, chatId, guestId: reqGuestId, stream } = await request.json() as {
      messages: Message[];
      chatId?: string;
      guestId?: string;
      stream?: boolean;
    };

    if (!messages || !Array.isArray(messages)) {
      const response = NextResponse.json(
        { message: { role: 'assistant', content: 'Errore: messaggi non validi' } },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const userId = getUserId(request);
    const guestId = reqGuestId || (!userId ? `guest_${Date.now()}` : null);

    // Server-side guest message limit
    if (!userId) {
      const withinLimit = await checkGuestMessageLimit(userId, guestId);
      if (!withinLimit) {
        const response = NextResponse.json(
          { message: { role: 'assistant', content: 'Hai raggiunto il limite di messaggi gratuito. Registrati per continuare.' } },
          { status: 403 }
        );
        Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        return response;
      }
    }

    const conversationHistory = buildConversation(messages);

    // Streaming response
    if (stream !== false) {
      let fullContent = '';

      const encoder = new TextEncoder();
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();

      const writeEvent = (data: Record<string, unknown>) => {
        writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const response = new NextResponse(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      });

      Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      (async () => {
        try {
          for await (const token of streamAI(conversationHistory)) {
            fullContent += token;
            writeEvent({ token, done: false });
          }

          const savedChat = await saveOrCreateChat(messages, fullContent, chatId, userId, guestId);

          if (!savedChat) {
            writeEvent({ error: true, message: 'Errore nel salvataggio della chat.', done: true });
          } else {
            writeEvent({
              token: '',
              done: true,
              chatId: savedChat._id.toString(),
              guestId: savedChat.guestId || guestId,
            });
          }
        } catch (error) {
          console.error('Stream error:', error instanceof Error ? error.message : 'Unknown error');
          writeEvent({
            error: true,
            message: 'Errore durante la generazione della risposta. Riprova più tardi.',
            done: true,
          });
        } finally {
          writer.close();
        }
      })();

      return response;
    }

    // Non-streaming fallback
    let aiMessage: Message;
    try {
      const content = await callAI(conversationHistory);
      aiMessage = {
        role: 'assistant',
        content: content || 'Errore: risposta vuota dal modello',
      };
    } catch (aiError) {
      console.error('xKiro AI error:', aiError instanceof Error ? aiError.message : 'Unknown error');
      aiMessage = {
        role: 'assistant',
        content: 'Servizio AI temporaneamente non disponibile. Riprova più tardi.',
      };
    }

    await dbConnect();
    const savedChat = await saveOrCreateChat(messages, aiMessage.content, chatId, userId, guestId);

    if (!savedChat) {
      return NextResponse.json(
        { message: { role: 'assistant', content: 'Errore nel salvataggio della chat.' } },
        { status: 500 }
      );
    }

    const responseData = {
      message: aiMessage,
      chatId: savedChat._id.toString(),
      guestId: savedChat.guestId || guestId
    };

    const jsonResponse = NextResponse.json(responseData);

    if (!userId && savedChat.guestId) {
      jsonResponse.cookies.set('chat_session', savedChat.guestId, {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
        sameSite: 'lax' as const,
        secure: process.env.NODE_ENV === 'production',
      });
    }

    jsonResponse.headers.set('X-Frame-Options', 'DENY');
    jsonResponse.headers.set('X-Content-Type-Options', 'nosniff');
    jsonResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
      jsonResponse.headers.set(key, value);
    });

    return jsonResponse;
  } catch (error) {
    console.error('Chat error full stack:', error);
    return NextResponse.json(
      { message: { role: 'assistant', content: 'Errore del server. Riprova.' } },
      { status: 500 }
    );
  }
}
