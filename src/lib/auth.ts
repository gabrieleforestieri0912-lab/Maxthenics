import jwt from 'jsonwebtoken';
import { getEnv } from './env';
import type { NextRequest } from 'next/server';

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export function getUserId(request: NextRequest | Request): string | null {
  // Check Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      if (!token) return null;
      const decoded = jwt.verify(token, getEnv().JWT_SECRET) as { userId?: string };
      if (decoded.userId && UUID_REGEX.test(decoded.userId)) {
        return decoded.userId;
      }
    } catch {
      // Token invalid or expired
    }
  }

  // Fallback to token cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader.match(/token=([^;]+)/);
  if (tokenMatch) {
    try {
      const decoded = jwt.verify(tokenMatch[1], getEnv().JWT_SECRET) as { userId?: string };
      if (decoded.userId && UUID_REGEX.test(decoded.userId)) {
        return decoded.userId;
      }
    } catch {
      // Token invalid or expired
    }
  }

  return null;
}

export function getGuestId(request: NextRequest | Request): string | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/chat_session=([^;]+)/);
  if (match) return match[1];

  // Try URL param for history endpoint
  if (request instanceof Request) {
    try {
      const url = new URL(request.url);
      return url.searchParams.get('guestId');
    } catch { /* ... */ }
  }

  return null;
}

export function getUserIdOrGuestId(request: NextRequest | Request): { userId: string | null; guestId: string | null } {
  return {
    userId: getUserId(request),
    guestId: getGuestId(request),
  };
}

export function requireAuth(
  request: NextRequest | Request,
  chat: { userId?: string | null; guestId?: string | null }
): boolean {
  const { userId, guestId } = getUserIdOrGuestId(request);

  if (userId && chat.userId === userId) return true;
  if (!userId && guestId && chat.guestId === guestId) return true;

  return false;
}
