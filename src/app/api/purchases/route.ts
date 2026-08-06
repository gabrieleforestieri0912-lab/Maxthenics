import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import type { NextRequest } from 'next/server';
import { programData } from '@/data/programs';
const JWT_SECRET = getEnv().JWT_SECRET;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get user from cookies
    const userCookie = request.cookies.get('maxthenicsUser');
    const token = request.cookies.get('token');

    if (!userCookie || !token) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 });
    }

    try {
      // Verify JWT token
      jwt.verify(token.value, JWT_SECRET);
      const userData = JSON.parse(userCookie.value);

      const user = await User.findById(userData._id);

      if (!user) {
        return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
      }

      const allPrograms = [...programData.workout, ...programData.frontLever, ...programData.planche];

      // We transform the user's purchased programs into the "Purchase" structure the frontend expects
      const purchases = user.purchases.map((programId: any) => {
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

      // If the user has an active Elite subscription, we add a virtual purchase for Calisthenics Room
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
      console.error('JWT verification error in purchases:', error);
      return NextResponse.json({ error: 'Token non valido' }, { status: 401 });
    }
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

    // Get user from cookies
    const userCookie = request.cookies.get('maxthenicsUser');
    const token = request.cookies.get('token');

    if (!userCookie || !token) {
      return NextResponse.json({ error: 'Devi accedere per sbloccare i programmi' }, { status: 401 });
    }

    // Verify JWT token
    try {
      jwt.verify(token.value, JWT_SECRET);
      const userData = JSON.parse(userCookie.value);
      const { programId } = await request.json();

      if (!programId) {
        return NextResponse.json({ error: 'ID Programma mancante' }, { status: 400 });
      }

      // purchases is an array of program IDs (strings)
      
      const user = await User.findById(userData._id);
      if (!user) {
        return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
      }

      // Check if already purchased
      if (user.purchases.includes(programId)) {
        return NextResponse.json({ message: 'Programma già sbloccato' });
      }

      const purchases = [...(user.purchases || []), programId];
      await User.findByIdAndUpdate(userData._id, { purchases });

      return NextResponse.json({ success: true, message: 'Programma sbloccato con successo' });
    } catch (error) {
      return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
    }
  } catch (error) {
    console.error('Post purchases error:', error);
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
