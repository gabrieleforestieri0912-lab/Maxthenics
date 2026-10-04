import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(_request: NextRequest) {
  // Mark _request as intentionally unused to avoid ESLint warning
  void _request;

  try {
    const response = NextResponse.json({ success: true });

    // Clear auth cookies
    response.cookies.set('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax' as const,
    });

    response.cookies.set('chat_session', '', {
      httpOnly: false,
      path: '/',
      expires: new Date(0),
      sameSite: 'lax' as const,
    });

    // Security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Content-Security-Policy', "frame-ancestors 'none'");

    return response;
  } catch (error) {
    console.error('Logout error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ success: true });
  }
}
