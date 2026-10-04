import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import type { NextRequest } from 'next/server';

const GOOGLE_CLIENT_ID = getEnv().GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = getEnv().GOOGLE_CLIENT_SECRET;
const JWT_SECRET = getEnv().JWT_SECRET;
const NEXT_PUBLIC_APP_URL = getEnv().NEXT_PUBLIC_APP_URL;
const GOOGLE_REDIRECT_URI = `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
  }

  try {
    // Get cookies from request using Next.js cookies API
    const storedState = request.cookies.get('oauth_state')?.value;
    const codeVerifier = request.cookies.get('pkce_code_verifier')?.value;

    // Validate state parameter (CSRF protection)
    if (!storedState || storedState !== state) {
      console.error('Invalid state parameter - possible CSRF attempt');
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=invalid_state`);
    }

    if (!codeVerifier) {
      console.error('Missing PKCE code verifier');
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=missing_code_verifier`);
    }

    // Exchange code for tokens with PKCE code_verifier
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: GOOGLE_REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      console.error('Token exchange failed:', { error: tokenData.error, description: tokenData.error_description });
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_token_failed`);
    }

    // Get user info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userResponse.json();

    if (!userData.id || !userData.email) {
      console.error('Invalid user data from Google');
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=invalid_google_user`);
    }

    await dbConnect();

    // Find or create user by Google ID (more secure than email)
    let user = await User.findOne({
      $or: [
        { email: userData.email },
        { googleId: userData.id },
      ],
    });

    if (!user) {
      user = await User.create({
        name: userData.name || 'User',
        email: userData.email,
        password: `google_${userData.id}_${Date.now()}`, // Random password never used
        avatar: userData.picture,
        provider: 'google',
        googleId: userData.id,
      });
    } else {
      // Update existing user with Google data if needed
      await User.findByIdAndUpdate(user._id, {
        googleId: userData.id,
        avatar: userData.picture,
        provider: 'google',
      });
    }

    // Create signed JWT token
    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Clear PKCE and state cookies (they're one-time use)
    const clearCookiesResponse = NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/`);
    clearCookiesResponse.cookies.set('pkce_code_verifier', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax' as const,
    });
    clearCookiesResponse.cookies.set('oauth_state', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax' as const,
    });

    // Set auth cookie with proper security attributes
    const isProd = process.env.NODE_ENV === 'production';
    clearCookiesResponse.cookies.set('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax' as const,
      secure: isProd,
    });

    // Security headers
    clearCookiesResponse.headers.set('X-Frame-Options', 'DENY');
    clearCookiesResponse.headers.set('X-Content-Type-Options', 'nosniff');
    clearCookiesResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    clearCookiesResponse.headers.set('Content-Security-Policy', "frame-ancestors 'none'");

    return clearCookiesResponse;
  } catch (err) {
    console.error('Google callback error:', err instanceof Error ? err.message : 'Unknown error');
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
  }
}