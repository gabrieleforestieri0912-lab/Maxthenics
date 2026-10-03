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

// xKiro — unico provider AI. Usa l'SDK OpenAI puntato al gateway xKiro
// (https://api.xkiro.com/v1), che espone tutti i modelli con un'unica chiave.
const XKIRO_BASE_URL = 'https://api.xkiro.com/v1';

let aiInstance: OpenAI | null = null;

export function getAI(): OpenAI {
  if (!aiInstance) {
    aiInstance = new OpenAI({
      apiKey: getEnv().XKIRO_API_KEY,
      baseURL: XKIRO_BASE_URL,
    });
  }
  return aiInstance;
}
