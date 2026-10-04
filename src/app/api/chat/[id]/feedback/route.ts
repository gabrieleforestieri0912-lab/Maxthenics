import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { requireAuth } from '@/lib/auth';

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

/**
 * Record (or clear) a thumbs up/down vote on one assistant message.
 * The vote is matched by index + role + content excerpt to avoid
 * misattribution after edits or regenerations.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!UUID_REGEX.test(id)) {
      return NextResponse.json({ message: 'ID non valido' }, { status: 400 });
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json({ message: 'Chat non trovata' }, { status: 404 });
    }

    if (!requireAuth(request, chat)) {
      return NextResponse.json({ message: 'Non autorizzato' }, { status: 403 });
    }

    const body = await request.json();
    const { messageIndex, role, excerpt, value } = body as {
      messageIndex?: unknown;
      role?: unknown;
      excerpt?: unknown;
      value?: unknown;
    };

    if (
      typeof messageIndex !== 'number' ||
      !Number.isInteger(messageIndex) ||
      messageIndex < 0 ||
      role !== 'assistant' ||
      typeof excerpt !== 'string' ||
      excerpt.length === 0 ||
      (value !== 'up' && value !== 'down' && value !== null)
    ) {
      return NextResponse.json({ message: 'Dati voto non validi' }, { status: 400 });
    }

    const messages = Array.isArray(chat.messages) ? [...chat.messages] : [];
    const target = messages[messageIndex];
    if (!target || target.role !== 'assistant' || !target.content?.includes(excerpt.slice(0, 120))) {
      return NextResponse.json({ message: 'Messaggio non trovato' }, { status: 404 });
    }

    messages[messageIndex] = { ...target, feedback: value };
    await Chat.findByIdAndUpdate(id, { messages });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Feedback error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
