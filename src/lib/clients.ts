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
    const env = getEnv();
    openaiInstance = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      // xKiro gateway (OpenAI-compatible). Se non impostato, usa default OpenAI.
      // Docs: baseURL deve finire con /v1, es. https://api.xkiro.com/v1
      baseURL: env.OPENAI_BASE_URL || undefined,
      timeout: 120_000,
      maxRetries: 2,
    });
  }
  return openaiInstance;
}
