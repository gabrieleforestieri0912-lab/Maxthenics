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

  // Ollama AI
  OLLAMA_BASE_URL: z.string().url('OLLAMA_BASE_URL must be a valid URL'),
  OLLAMA_MODEL: z.string().min(1, 'OLLAMA_MODEL is required'),
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
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error('❌ Environment validation failed:');
    result.error.issues.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    throw new Error('Invalid environment configuration');
  }

  return result.data;
}

/**
 * Get validated environment or throw if not validated yet
 */
let validatedEnv: Env | null = null;

export function getEnv(): Env {
  if (!validatedEnv) {
    validatedEnv = validateEnv();
  }
  return validatedEnv;
}

// Validate immediately on import in production
if (process.env.NODE_ENV === 'production') {
  try {
    validatedEnv = validateEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Failed to validate environment variables:', message);
    process.exit(1);
  }
}
