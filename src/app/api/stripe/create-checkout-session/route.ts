import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import { getStripe } from '@/lib/clients';

const CLIENT_URL = getEnv().CLIENT_URL;

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { cartItems, userId, tier } = await request.json() as {
      cartItems?: Array<{ id: string; title: string; price: number; image?: string; quantity?: number; level?: string; description?: string }>;
      userId?: string;
      tier?: string;
    };

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { message: 'Carrello vuoto' },
        { status: 400 }
      );
    }

    // Validate cart items
    for (const item of cartItems) {
      if (!item.id || !item.title || !item.price || item.price <= 0) {
        return NextResponse.json(
          { message: 'Articolo carrello non valido' },
          { status: 400 }
        );
      }
    }

    const lineItems = cartItems.map((item) => {
      let imageUrl: string | null = null;
      if (item.image) {
        if (item.image.startsWith('http')) {
          imageUrl = item.image;
        } else {
          const imagePath = item.image.startsWith('/') ? item.image : `/${item.image}`;
          imageUrl = `${CLIENT_URL}${imagePath}`;
        }
      }

      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.title || 'Programma',
            description: item.level || item.description || 'Maxthenics Program',
            images: imageUrl ? [imageUrl] : [],
          },
          unit_amount: Math.round((item.price || 0) * 100), // Convert to cents
        },
        quantity: item.quantity || 1,
      };
    });

    let customerId: string | null = null;
    if (userId) {
      const user = await User.findById(userId);
      if (user?.stripeCustomerId) {
        customerId = user.stripeCustomerId;
      } else if (user?.email) {
        try {
          const customer = await getStripe().customers.create({
            email: user.email,
            metadata: { userId: user._id.toString() },
          });
          customerId = customer.id;
          await User.findByIdAndUpdate(userId, { stripeCustomerId: customer.id });
        } catch (customerError) {
          console.error('Stripe customer creation error:', customerError instanceof Error ? customerError.message : 'Unknown error');
          // Continue without customer ID
        }
      }
    }

    // Build success and cancel URLs
    const successUrl = `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${CLIENT_URL}/cart`;

    // Validate URLs are from same origin
    if (!successUrl.startsWith('http://') && !successUrl.startsWith('https://')) {
      throw new Error('Invalid CLIENT_URL for success redirect');
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: userId || 'guest',
        tier: tier || 'free',
        items: JSON.stringify(cartItems.map(i => ({ id: i.id, title: i.title }))),
      },
    };

    // Only add customer if we have one
    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        message: 'Errore durante il checkout',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
      },
      { status: 500 }
    );
  }
}