import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/db';
import User, { IUser } from '@/models/User';
import { getEnv } from '@/lib/env';
import { isRateLimited, getRateLimitHeaders } from '@/lib/rateLimiter';

const stripe = new Stripe(getEnv().STRIPE_SECRET_KEY);
const endpointSecret = getEnv().STRIPE_WEBHOOK_SECRET;

const processedEvents = new Set<string>();

export async function POST(request: Request) {
  try {
    // Rate limiting - webhook should be strictly limited (only Stripe should call this)
    const rateLimitKey = `webhook_${new URL(request.url).hostname}`;
    const rateLimit = isRateLimited(rateLimitKey, 'stripe/webhook');

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    await dbConnect();

    const body = await request.text();
    const sig = request.headers.get('stripe-signature');

    if (!sig) {
      console.error('Webhook error: Missing stripe-signature header');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err instanceof Error ? err.message : 'Unknown error');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Idempotency check: skip already processed events
    if (processedEvents.has(event.id)) {
      return NextResponse.json({ received: true, idempotent: true });
    }
    processedEvents.add(event.id);

    // Cleanup old entries after 10,000 processed events
    if (processedEvents.size > 10000) {
      const iter = processedEvents.values();
      for (let i = 0; i < 1000; i++) {
        const val = iter.next();
        if (val.done) break;
        processedEvents.delete(val.value);
      }
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const itemsJson = session.metadata?.items;
        const tier = session.metadata?.tier as IUser['subscriptionTier'];

        if (userId && userId !== 'guest') {
          try {
            const updateData: {
              $push?: { purchases: { $each: string[] } };
              subscriptionStatus?: string;
              subscriptionTier?: string;
            } = {};
            
            if (itemsJson) {
              const items = JSON.parse(itemsJson);
              updateData.$push = {
                purchases: {
                  $each: items.map((item: { id: string }) => item.id),
                },
              };
            }

            if (tier) {
              updateData.subscriptionStatus = 'active';
              updateData.subscriptionTier = tier;
            }

            await User.findByIdAndUpdate(userId, updateData);
            console.log(`✅ Checkout completed for user ${userId}`);
          } catch (updateError) {
            console.error('Failed to update user after checkout:', updateError instanceof Error ? updateError.message : 'Unknown error');
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        const tier = subscription.metadata?.tier as IUser['subscriptionTier'];

        if (userId) {
          try {
            await User.findByIdAndUpdate(userId, {
              subscriptionStatus: subscription.status === 'active' ? 'active' : 'inactive',
              subscriptionTier: tier || 'free',
            });
            console.log(`✅ Subscription updated for user ${userId}: ${subscription.status}`);
          } catch (updateError) {
            console.error('Failed to update user subscription:', updateError instanceof Error ? updateError.message : 'Unknown error');
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          try {
            await User.findByIdAndUpdate(userId, {
              subscriptionStatus: 'canceled',
              subscriptionTier: 'free',
            });
            console.log(`❌ Subscription canceled for user ${userId}`);
          } catch (updateError) {
            console.error('Failed to update user after cancellation:', updateError instanceof Error ? updateError.message : 'Unknown error');
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    const response = NextResponse.json({ received: true });

    // Rate limit headers
    Object.entries(getRateLimitHeaders(rateLimitKey, 'stripe/webhook')).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error('Webhook error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}