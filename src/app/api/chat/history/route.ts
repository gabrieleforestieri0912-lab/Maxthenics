import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Chat from '@/models/Chat';
import type { NextRequest } from 'next/server';
import { getUserId, getGuestId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserId(request);
    let guestId = getGuestId(request);

    // URL param overrides cookie for guest sessions
    const { searchParams } = new URL(request.url);
    const urlGuestId = searchParams.get('guestId');
    if (urlGuestId) guestId = urlGuestId;

    if (!userId && !guestId) {
      return NextResponse.json([]);
    }

    const query = userId
      ? { userId }
      : { guestId };

    const chats = await Chat.find(query, {
      sort: { updatedAt: -1 },
      limit: 50,
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error('History error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}
