import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import type { NextRequest } from 'next/server';
import { programData, getAllProgramsList } from '@/data/programs';
const JWT_SECRET = getEnv().JWT_SECRET;

function getUserIdFromToken(request: NextRequest): string | null {
  const token = request.cookies.get('token');
  if (!token) return null;

  try {
    const decoded = jwt.verify(token.value, JWT_SECRET) as { userId?: string };
    if (decoded.userId) return decoded.userId;
  } catch {
    // Token invalid
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const allPrograms = getAllProgramsList(programData);

    const purchases = user.purchases.map((programId: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const idStr = programId.toString();
      const staticProgram = allPrograms.find(p => p.id.toString() === idStr);

      return {
        id: idStr,
        _id: idStr,
        orderNumber: `ORD-${idStr.slice(-6).toUpperCase()}`,
        date: user.createdAt,
        total: staticProgram?.price || 0,
        status: 'Completato',
        items: [
          {
            title: staticProgram?.title || 'Programma Sconosciuto',
            price: staticProgram?.price || 0,
          }
        ]
      };
    });

    if (user.subscriptionStatus === 'active' && user.subscriptionTier === 'elite') {
      purchases.push({
        id: 'elite-subscription',
        _id: 'elite-subscription',
        orderNumber: 'SUBS-ELITE',
        date: user.createdAt,
        total: 0,
        status: 'Completato',
        items: [
          {
            title: 'Calisthenics Room - Elite Coaching',
            price: 0,
          }
        ]
      });
    }

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Get purchases error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const userId = getUserIdFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: 'Devi accedere per sbloccare i programmi' }, { status: 401 });
    }

    const { programId } = await request.json();

    if (!programId) {
      return NextResponse.json({ error: 'ID Programma mancante' }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    if (user.purchases.includes(programId)) {
      return NextResponse.json({ message: 'Programma già sbloccato' });
    }

    const purchases = [...(user.purchases || []), programId];
    await User.findByIdAndUpdate(userId, { purchases });

    return NextResponse.json({ success: true, message: 'Programma sbloccato con successo' });
  } catch (error) {
    console.error('Post purchases error:', error);
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
