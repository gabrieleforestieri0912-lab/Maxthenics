import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '@/lib/pkce';
import { getEnv } from '@/lib/env';
import type { NextRequest } from 'next/server';

const GOOGLE_CLIENT_ID = getEnv().GOOGLE_CLIENT_ID;
const NEXT_PUBLIC_APP_URL = getEnv().NEXT_PUBLIC_APP_URL;
const GOOGLE_REDIRECT_URI = `${NEXT_PUBLIC_APP_URL}/api/auth/google/callback`;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
    }

    // Generate PKCE code verifier and challenge
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Generate state for CSRF protection
    const state = await generateState();

    // Build Google OAuth URL
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.set('redirect_uri', GOOGLE_REDIRECT_URI);
    googleAuthUrl.searchParams.set('response_type', 'code');
    googleAuthUrl.searchParams.set('scope', 'openid email profile');
    googleAuthUrl.searchParams.set('access_type', 'online');
    googleAuthUrl.searchParams.set('code_challenge', codeChallenge);
    googleAuthUrl.searchParams.set('code_challenge_method', 'S256');
    googleAuthUrl.searchParams.set('state', state);

    const redirectResponse = NextResponse.redirect(googleAuthUrl.toString());

    // Set PKCE and state cookies with proper security
    redirectResponse.cookies.set('pkce_code_verifier', codeVerifier, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 10, // 10 minutes
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
    });

    redirectResponse.cookies.set('oauth_state', state, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 10,
      sameSite: 'lax' as const,
      secure: process.env.NODE_ENV === 'production',
    });

    // Security headers
    redirectResponse.headers.set('X-Frame-Options', 'DENY');
    redirectResponse.headers.set('X-Content-Type-Options', 'nosniff');
    redirectResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return redirectResponse;
  } catch (error) {
    console.error('Google OAuth init error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.redirect(`${NEXT_PUBLIC_APP_URL}/login?error=google_auth_failed`);
  }
}