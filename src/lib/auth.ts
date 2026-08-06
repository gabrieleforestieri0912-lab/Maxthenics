import jwt from 'jsonwebtoken';
import { getEnv } from './env';
import type { NextRequest } from 'next/server';

const UUID_REGEX = /^[0-9a-fA-F-]{36}$/;

export function getUserId(request: NextRequest | Request): string | null {
  let userId: string | null = null;

  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      if (!token) return null;
      const decoded = jwt.verify(token, getEnv().JWT_SECRET) as { userId?: string };
      if (decoded.userId && UUID_REGEX.test(decoded.userId)) {
        userId = decoded.userId;
      }
    } catch {
      // Token invalid or expired
    }
  }

  if (!userId) {
    const userCookie = 'maxthenicsUser';
    const cookieHeader = request.headers.get('cookie') || '';
    const match = cookieHeader.match(new RegExp(`${userCookie}=([^;]+)`));
    if (match) {
      try {
        const userData = JSON.parse(decodeURIComponent(match[1]));
        if (userData._id && typeof userData._id === 'string' && UUID_REGEX.test(userData._id)) {
          userId = userData._id;
        }
      } catch { /* ... */ }
    }
  }

  return userId;
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
