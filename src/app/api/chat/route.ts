import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isRateLimited, getRateLimitHeaders, getClientId } from '@/lib/rateLimiter';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import User from '@/models/User';
import Program from '@/models/Program';
import { getUserId } from '@/lib/auth';
import { getEnv } from '@/lib/env';
import { getOpenAI } from '@/lib/clients';
import {
  CHAT_LIMITS,
  buildIntentGuidance,
  buildSystemPrompt,
  detectIntent,
  validateMessages,
  type SthenoxProfile,
  type ValidatedMessage,
} from '@/lib/sthenox';

const GUEST_MESSAGE_LIMIT = 5;

async function callOpenAI(messages: ValidatedMessage[], signal: AbortSignal) {
  const completion = await getOpenAI().chat.completions.create(
    {
      model: getEnv().OPENAI_MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 1200,
    },
    { signal } as unknown as Record<string, unknown>,
  );

  return completion.choices[0]?.message?.content || '';
}

async function* streamOpenAI(
  messages: ValidatedMessage[],
  signal: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const stream = await getOpenAI().chat.completions.create(
    {
      model: getEnv().OPENAI_MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature: 0.7,
      max_tokens: 1200,
      stream: true,
    },
    { signal } as unknown as Record<string, unknown>,
  );

  for await (const chunk of stream) {
    if (signal.aborted) return;
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}

async function validateChatOwnership(
  chatId: string,
  userId: string | null,
  guestId: string | null,
): Promise<boolean> {
  await dbConnect();
  const chat = await Chat.findById(chatId);
  if (!chat) return false;

  if (userId && chat.userId === userId) return true;
  if (!userId && guestId && chat.guestId === guestId) return true;

  return false;
}

async function saveOrCreateChat(
  messages: ValidatedMessage[],
  aiContent: string,
  chatId?: string,
  userId: string | null = null,
  guestId: string | null = null,
) {
  await dbConnect();

  const aiMessage: ValidatedMessage = { role: 'assistant', content: aiContent };
  const finalMessages = [...messages.map((m) => ({ role: m.role, content: m.content })), aiMessage].filter(
    (m) => m.role !== 'system',
  );

  const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

  if (chatId && chatId.match(UUID_REGEX)) {
    const owned = await validateChatOwnership(chatId, userId, guestId);
    if (!owned) {
      throw new Error('Unauthorized: chat does not belong to user');
    }

    const updated = await Chat.findByIdAndUpdate(chatId, {
      messages: finalMessages,
      updatedAt: new Date().toISOString(),
    });
    return updated;
  }

  const firstUserMessage = messages.find((m) => m.role === 'user')?.content || 'Nuova Chat';
  const title = firstUserMessage.length > 30 ? firstUserMessage.slice(0, 30) + '...' : firstUserMessage;

  const savedChat = await Chat.create({
    userId: userId && userId.match(UUID_REGEX) ? userId : null,
    guestId: !userId ? guestId || `guest_${Date.now()}` : null,
    title,
    messages: finalMessages,
  });

  return savedChat;
}

/**
 * Costruisce la conversazione per il modello: system prompt Sthenox
 * (mai esposto al client) + solo gli ultimi N messaggi come contesto.
 */
function buildConversation(messages: ValidatedMessage[], profile: SthenoxProfile): ValidatedMessage[] {
  const lastUser = [...messages].reverse().find((m) => m.role === 'user');
  const intentNote = lastUser ? buildIntentGuidance(detectIntent(lastUser.content)) : '';
  const context = messages.slice(-CHAT_LIMITS.CONTEXT_MESSAGES);
  return [{ role: 'system', content: buildSystemPrompt(profile, intentNote) }, ...context];
}

/** Arricchisce il profilo client con piano attivo e tier (best-effort, mai bloccante). */
async function enrichProfile(
  base: SthenoxProfile,
  userId: string | null,
): Promise<SthenoxProfile> {
  if (!userId) return base;
  try {
    await dbConnect();
    const [user, programs] = await Promise.all([
      User.findById(userId).catch(() => null),
      Program.findByUser(userId).catch(() => []),
    ]);
    const enriched: SthenoxProfile = { ...base };
    const active = programs?.[0] as { title?: string; level?: string } | undefined;
    if (active?.title && !enriched.planTitle) {
      enriched.planTitle = active.title;
      if (active.level) enriched.planLevel = active.level;
    }
    if (user && !enriched.level) {
      const tier = (user as { subscriptionTier?: string }).subscriptionTier;
      if (tier && tier !== 'free') enriched.level = tier;
    }
    return enriched;
  } catch {
    return base;
  }
}

async function checkGuestMessageLimit(
  userId: string | null,
  guestId: string | null,
): Promise<boolean> {
  if (userId) return true;
  if (!guestId) return true;

  await dbConnect();
  const chatCount = (await Chat.find({ guestId })).length;
  return chatCount < GUEST_MESSAGE_LIMIT;
}

function rateLimitedResponse(rateLimitKey: string, message: string, status: number) {
  const response = NextResponse.json({ message: { role: 'assistant', content: message } }, { status });
  Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

function withTimeout(): { signal: AbortSignal; cancel: () => void } {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_LIMITS.MODEL_TIMEOUT_MS);
  return {
    signal: controller.signal,
    cancel: () => clearTimeout(timer),
  };
}

export async function POST(request: NextRequest) {
  try {
    const clientId = getClientId(request);
    const rateLimitKey = `chat_${clientId}`;
    const rateLimit = isRateLimited(rateLimitKey, 'chat');

    if (!rateLimit.allowed) {
      return rateLimitedResponse(
        rateLimitKey,
        'Troppe richieste. Aspetta un minuto e premi Riprova.',
        429,
      );
    }

    let body: {
      messages?: unknown;
      chatId?: string;
      guestId?: string;
      stream?: boolean;
      profile?: SthenoxProfile;
    };
    try {
      body = await request.json();
    } catch {
      return rateLimitedResponse(rateLimitKey, 'Richiesta non valida. Premi Riprova.', 400);
    }

    let messages: ValidatedMessage[];
    try {
      messages = validateMessages(body.messages);
    } catch (err) {
      return rateLimitedResponse(
        rateLimitKey,
        err instanceof Error ? err.message : 'Messaggi non validi.',
        400,
      );
    }

    const userId = getUserId(request);
    const guestId = body.guestId || (!userId ? `guest_${Date.now()}` : null);

    // Server-side guest message limit
    if (!userId) {
      const withinLimit = await checkGuestMessageLimit(userId, guestId);
      if (!withinLimit) {
        return rateLimitedResponse(
          rateLimitKey,
          'Hai raggiunto il limite di messaggi gratuito. Registrati per continuare.',
          403,
        );
      }
    }

    const profile = await enrichProfile(body.profile ?? {}, userId);
    const conversationHistory = buildConversation(messages, profile);
    const { chatId, stream } = body;

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
          Connection: 'keep-alive',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
      });

      Object.entries(getRateLimitHeaders(rateLimitKey, 'chat')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      const { signal, cancel } = withTimeout();

      (async () => {
        try {
          for await (const token of streamOpenAI(conversationHistory, signal)) {
            if (fullContent.length >= CHAT_LIMITS.MAX_RESPONSE_CHARS) break;
            fullContent += token;
            writeEvent({ token, done: false });
          }

          if (signal.aborted) {
            writeEvent({
              error: true,
              message: 'La risposta ha impiegato troppo tempo. Premi Riprova.',
              code: 'timeout',
              done: true,
            });
            return;
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
          const isAbort =
            error instanceof Error && (error.name === 'AbortError' || signal.aborted);
          writeEvent({
            error: true,
            message: isAbort
              ? 'La risposta ha impiegato troppo tempo. Premi Riprova.'
              : 'Errore durante la generazione della risposta. Premi Riprova.',
            code: isAbort ? 'timeout' : 'model_error',
            done: true,
          });
        } finally {
          cancel();
          writer.close();
        }
      })();

      return response;
    }

    // Non-streaming fallback
    const { signal, cancel } = withTimeout();
    let aiContent: string;
    try {
      const content = await callOpenAI(conversationHistory, signal);
      aiContent = content || 'Errore: risposta vuota dal modello';
    } catch (openaiError) {
      console.error(
        'OpenAI error:',
        openaiError instanceof Error ? openaiError.message : 'Unknown error',
      );
      const isAbort =
        openaiError instanceof Error &&
        (openaiError.name === 'AbortError' || signal.aborted);
      cancel();
      return rateLimitedResponse(
        rateLimitKey,
        isAbort
          ? 'La risposta ha impiegato troppo tempo. Premi Riprova.'
          : 'Servizio AI temporaneamente non disponibile. Premi Riprova.',
        isAbort ? 504 : 502,
      );
    }
    cancel();

    await dbConnect();
    const savedChat = await saveOrCreateChat(messages, aiContent, chatId, userId, guestId);

    if (!savedChat) {
      return NextResponse.json(
        { message: { role: 'assistant', content: 'Errore nel salvataggio della chat.' } },
        { status: 500 },
      );
    }

    const responseData = {
      message: { role: 'assistant', content: aiContent },
      chatId: savedChat._id.toString(),
      guestId: savedChat.guestId || guestId,
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
      { message: { role: 'assistant', content: 'Errore del server. Premi Riprova.' } },
      { status: 500 },
    );
  }
}
