import { z } from 'zod';

/**
 * Environment variables validation schema
 * All required environment variables must be validated at startup
 */
const envSchema = z.object({
  // Database
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),

  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),

  // App URLs
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL'),

  // Supabase public (browser-safe)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Resend
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),

  // xKiro — unico provider AI (API OpenAI-compatible: https://api.xkiro.com/v1)
  XKIRO_API_KEY: z.string().min(1, 'XKIRO_API_KEY is required'),
  XKIRO_MODEL: z.string().min(1, 'XKIRO_MODEL is required'),
});

/**
 * Type-safe validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validate environment variables at startup
 * Throws error if any required variable is missing or invalid
 */
export function validateEnv(): Env {
  const rawEnv = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    XKIRO_API_KEY: process.env.XKIRO_API_KEY,
    XKIRO_MODEL: process.env.XKIRO_MODEL || 'openai/gpt-5-mini',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error('Environment validation failed:');
    result.error.issues.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

/**
 * Whether the code is running during a `next build` (not at server runtime).
 * During the build, server-only secrets (non NEXT_PUBLIC_*) are not yet
 * available in managed runtimes (e.g. Vercel), so we must not fail the build.
 */
function isNextBuild(): boolean {
  return process.env.NEXT_PHASE === 'phase-production-build';
}

/**
 * Validate environment variables or throw if not valid.
 * Secrets are only strictly validated at runtime (when the server runs),
 * because managed platforms (Vercel) only expose them at runtime, not during
 * `next build`. NEXT_PUBLIC_* variables are always required since they are
 * inlined into the client bundle during the build.
 */
let validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (validatedEnv) {
    return validatedEnv;
  }

  if (isNextBuild()) {
    // During build, NEXT_PUBLIC_* vars must exist (client inlining); server-only
    // secrets may be absent and are validated at runtime instead.
    const buildEnv = {
      SUPABASE_URL: process.env.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
      JWT_SECRET: process.env.JWT_SECRET || '',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
      CLIENT_URL: process.env.CLIENT_URL || '',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
      RESEND_API_KEY: process.env.RESEND_API_KEY || '',
      XKIRO_API_KEY: process.env.XKIRO_API_KEY || '',
      XKIRO_MODEL: process.env.XKIRO_MODEL || 'openai/gpt-5-mini',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    };

    validatedEnv = buildEnv as Env;
    return validatedEnv;
  }

  validatedEnv = validateEnv();
  return validatedEnv;
}
