import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Program from '@/models/Program';
import { getUserId } from '@/lib/auth';

// The single AI-generated program of the authenticated user (most recent one).
const SCALAR_FIELDS = ['title', 'description', 'level', 'price', 'image', 'exercises'] as const;

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Non autenticato' }, { status: 401 });
    }

    await dbConnect();
    const programs = await Program.findByUser(userId);
    if (programs.length === 0) {
      return NextResponse.json({ message: 'Nessun programma generato' }, { status: 404 });
    }

    return NextResponse.json(programs[0]);
  } catch (error) {
    console.error('Get my program error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = getUserId(request);
    if (!userId) {
      return NextResponse.json({ message: 'Non autenticato' }, { status: 401 });
    }

    const body = await request.json();
    const data: Record<string, unknown> = {};
    for (const key of SCALAR_FIELDS) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    await dbConnect();
    const programs = await Program.findByUser(userId);
    if (programs.length === 0) {
      const created = await Program.create({
        title: 'Programma Personalizzato',
        level: 'Intermediate',
        ...data,
        userId,
      });
      return NextResponse.json(created);
    }

    const updated = await Program.update(programs[0].id, data);
    if (!updated) {
      return NextResponse.json({ message: 'Salvataggio non riuscito' }, { status: 500 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Save my program error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
