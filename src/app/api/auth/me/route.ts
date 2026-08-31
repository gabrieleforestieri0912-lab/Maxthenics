import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import type { NextRequest } from 'next/server';

const JWT_SECRET = getEnv().JWT_SECRET;

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const tokenCookie = request.cookies.get('token');
    if (!tokenCookie) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      const decoded = jwt.verify(tokenCookie.value, JWT_SECRET) as { userId?: string };
      if (!decoded.userId) {
        return NextResponse.json({ authenticated: false });
      }

      const user = await User.findById(decoded.userId, '-password');

      if (!user) {
        return NextResponse.json({ authenticated: false });
      }

      return NextResponse.json({
        authenticated: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          subscriptionTier: user.subscriptionTier,
          subscriptionStatus: user.subscriptionStatus,
          purchases: user.purchases || [],
        },
      });
    } catch {
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Auth check error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ authenticated: false });
  }
}
