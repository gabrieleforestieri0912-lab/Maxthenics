/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getEnv } from '@/lib/env';
import { subscriptionPlans } from '@/config/plans';
import { getStripe } from '@/lib/clients';

const CLIENT_URL = getEnv().CLIENT_URL;

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { priceId, userId, tier } = await request.json() as {
      priceId?: string;
      userId?: string;
      tier?: string;
    };

    if (!priceId) {
      return NextResponse.json(
        { message: 'Price ID richiesto' },
        { status: 400 }
      );
    }

    // Check if priceId is a plan slug (like 'base', 'pro', 'elite')
    const plan = subscriptionPlans.find(p => p.id === priceId);
    
    let lineItem: any;

    if (priceId.startsWith('price_')) {
      // Use existing Stripe Price ID
      lineItem = {
        price: priceId,
        quantity: 1,
      };
    } else if (plan) {
      // Use price_data for subscription based on plan config
      lineItem = {
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Maxthenics ${plan.name}`,
            description: plan.description,
          },
          unit_amount: Math.round(plan.price * 100), // Cents
          recurring: {
            interval: (plan.period?.toLowerCase() === 'anno' ? 'year' : 'month'),
          },
        },
        quantity: 1,
      };
    } else {
      return NextResponse.json(
        { message: 'Price ID o Piano non valido' },
        { status: 400 }
      );
    }

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
        }
      }
    }

    const successUrl = `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${CLIENT_URL}/#pricing`;

    const sessionParams: any = {
      payment_method_types: ['card'],
      line_items: [lineItem],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: {
          userId: userId || 'guest',
          tier: tier || plan?.name.toLowerCase() || 'free',
        },
      },
      metadata: {
        userId: userId || 'guest',
        tier: tier || plan?.name.toLowerCase() || 'free',
      },
    };

    if (customerId) {
      sessionParams.customer = customerId;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Subscription checkout error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      {
        message: 'Errore durante il checkout abbonamento',
        error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined,
      },
      { status: 500 }
    );
  }
}