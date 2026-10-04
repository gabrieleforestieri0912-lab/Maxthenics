import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import type { NextRequest } from 'next/server';

const JWT_SECRET = getEnv().JWT_SECRET;

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json() as { accessToken?: string };

    if (!accessToken) {
      return NextResponse.json({ message: 'Access token mancante' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env vars');
      return NextResponse.json({ message: 'Configurazione server errata' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      console.error('Supabase getUser error:', JSON.stringify({ message: error.message, status: error.status, name: error.name }));
      return NextResponse.json({ message: 'Token non valido: ' + error.message }, { status: 401 });
    }

    if (!supabaseUser?.email) {
      console.error('Supabase user missing email:', supabaseUser?.id);
      return NextResponse.json({ message: 'Dati utente mancanti' }, { status: 401 });
    }

    const { email, user_metadata, id: googleSub } = supabaseUser;
    const name = user_metadata?.name || email.split('@')[0];
    const avatar = user_metadata?.avatar_url || user_metadata?.picture || null;

    await dbConnect();

    // Find or create user
    let user = await User.findOne({
      $or: [
        { email },
        { googleId: googleSub },
      ],
    });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: `google_${googleSub}_${Date.now()}`,
        avatar,
        provider: 'google',
        googleId: googleSub,
      });
    } else {
      // Update existing user with Google data
      await User.findByIdAndUpdate(user._id, {
        googleId: googleSub,
        avatar,
        provider: 'google',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax' as const,
      secure: isProd,
    });

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  } catch (error) {
    console.error('Supabase callback error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ message: 'Errore del server' }, { status: 500 });
  }
}
