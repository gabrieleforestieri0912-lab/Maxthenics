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
    const rateLimitKey = `register_${clientId}`;
    const rateLimit = isRateLimited(rateLimitKey, 'auth/register');

    if (!rateLimit.allowed) {
      const response = NextResponse.json(
        { message: 'Troppi tentativi di registrazione. Riprova più tardi.' },
        { status: 429 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/register')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    await dbConnect();

    const { name, email, password } = await request.json() as { name?: string; email?: string; password?: string };

    if (!name || !email || !password) {
      const response = NextResponse.json(
        { message: 'Nome, email e password sono obbligatori' },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/register')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const response = NextResponse.json(
        { message: 'Formato email non valido' },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/register')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Validate password strength
    if (password.length < 8) {
      const response = NextResponse.json(
        { message: 'La password deve essere di almeno 8 caratteri' },
        { status: 400 }
      );
      Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/register')).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      return response;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email già registrata' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
    });

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

    response.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax' as const,
      secure: isProd,
    });

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");

    // Rate limit headers
    Object.entries(getRateLimitHeaders(rateLimitKey, 'auth/register')).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { message: 'Errore del server' },
      { status: 500 }
    );
  }
}