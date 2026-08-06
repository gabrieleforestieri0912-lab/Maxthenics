import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import { isRateLimited, getRateLimitHeaders, getClientId } from '@/lib/rateLimiter';

const JWT_SECRET = getEnv().JWT_SECRET;

export async function POST(request: Request) {
  try {
    // Rate limiting check
    const clientId = getClientId(request);
    const rateLimitKey = `login_${clientId}`;
    const rateLimit = isRateLimited(rateLimitKey, 'auth/login');

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { message: 'Troppi tentativi. Riprova più tardi.' },
        { status: 429 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/login')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    await dbConnect();

    const { email, password } = await request.json() as { email?: string; password?: string };

    if (!email || !password) {
      const response = NextResponse.json(
        { message: 'Email e password sono obbligatori' },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/login')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response = NextResponse.json(
        { message: 'Formato email non valido' },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/login')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json(
        { message: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { message: 'Credenziali non valide' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set auth cookies
    const isProd = process.env.NODE_ENV === 'production';
    const response = NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });

    response.cookies.set('maxthenicsUser', JSON.stringify({
      _id: user._id,
      name: user.name,
      email: user.email,
    }), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax' as const,
      secure: isProd,
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax' as const,
      secure: isProd,
    });

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");

    // Rate limit headers
    Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/login')).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}