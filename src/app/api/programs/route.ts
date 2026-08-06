import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Program from '@/models/Program';

export async function GET() {
  try {
    await dbConnect();

    const programs = await Program.findAll();

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Get programs error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}