import Stripe from 'stripe';
import OpenAI from 'openai';
import { getEnv } from '@/lib/env';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(getEnv().STRIPE_SECRET_KEY);
  }
  return stripeInstance;
}

let openaiInstance: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({ apiKey: getEnv().OPENAI_API_KEY });
  }
  return openaiInstance;
}
