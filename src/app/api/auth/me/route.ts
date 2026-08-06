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

    // Get user from cookies
    const userCookie = request.cookies.get('maxthenicsUser');
    const token = request.cookies.get('token');

    if (!userCookie || !token) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      // Verify JWT token
      jwt.verify(token.value, JWT_SECRET);
      const userData = JSON.parse(userCookie.value);

      const user = await User.findById(userData._id, '-password');

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
      // Invalid token or parse error
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Auth check error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ authenticated: false });
  }
}
