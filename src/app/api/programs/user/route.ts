import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Program from '@/models/Program';
import { getUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Non autenticato' }, { status: 401 });
    }

    await dbConnect();
    const programs = await Program.findByUser(userId);

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Get user programs error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Non autenticato' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ message: 'ID programma mancante' }, { status: 400 });
    }

    await dbConnect();
    const programs = await Program.findByUser(userId);
    const owned = programs.find((p) => p.id === id || p._id === id);
    if (!owned) {
      return NextResponse.json({ message: 'Programma non trovato' }, { status: 404 });
    }

    await Program.remove(id);

    return NextResponse.json({ message: 'Programma eliminato' });
  } catch (error) {
    console.error('Delete program error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}
