import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import { requireAuth } from '@/lib/auth';

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
      return NextResponse.json(
        { message: 'ID non valido' },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(id);

    if (!chat) {
      return NextResponse.json(
        { message: 'Chat non trovata' },
        { status: 404 }
      );
    }

    return NextResponse.json(chat);
  } catch (error) {
    console.error('Get chat error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
      return NextResponse.json(
        { message: 'ID non valido' },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json(
        { message: 'Chat non trovata' },
        { status: 404 }
      );
    }

    if (!requireAuth(request, chat)) {
      return NextResponse.json(
        { message: 'Non autorizzato' },
        { status: 403 }
      );
    }

    const { title } = await request.json();

    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { message: 'Titolo non valido' },
        { status: 400 }
      );
    }

    await Chat.findByIdAndUpdate(id, { title, updatedAt: new Date().toISOString() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update chat error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    const { id } = await params;

    if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
      return NextResponse.json(
        { message: 'ID non valido' },
        { status: 400 }
      );
    }

    const chat = await Chat.findById(id);
    if (!chat) {
      return NextResponse.json(
        { message: 'Chat non trovata' },
        { status: 404 }
      );
    }

    if (!requireAuth(request, chat)) {
      return NextResponse.json(
        { message: 'Non autorizzato' },
        { status: 403 }
      );
    }

    await Chat.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete chat error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}
