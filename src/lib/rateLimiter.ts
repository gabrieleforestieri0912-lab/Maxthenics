/**
 * In-memory rate limiter using sliding window algorithm
 * For production, consider using Redis or a distributed rate limiting solution
 */

interface RateLimitStore {
  [key: string]: number[]; // Array of timestamps
}

const store: RateLimitStore = {};
const CLEANUP_INTERVAL = 60 * 1000; // Cleanup every minute

/**
 * Rate limiter configuration per route
 */
export const RATE_LIMIT_CONFIG = {
  // Authentication endpoints - strict limits
  'auth/login': { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  'auth/register': { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 per hour
  'auth/google': { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // AI endpoint - expensive operation
  'ai/generate-program': { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 per hour

  // Chat endpoint - moderate limits
  'chat': { maxRequests: 30, windowMs: 60 * 1000 }, // 30 per minute

  // Stripe webhook - should come from Stripe only, very strict
  'stripe/webhook': { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute

  // Default for other endpoints
  default: { maxRequests: 60, windowMs: 60 * 1000 }, // 60 per minute
} as const;

/**
 * Get client identifier from request
 */
export function getClientId(request: Request): string {
  // Try to get from auth cookie first (for logged-in users)
  const userCookie = request.headers.get('cookie') || '';
  const userMatch = userCookie.match(/maxthenicsUser=([^;]+)/);
  if (userMatch) {
    return `user_${userMatch[1]}`;
  }

  // Fallback to IP address (use X-Forwarded-For if behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return `ip_${forwardedFor.split(',')[0].trim()}`;
  }

  // Fallback to remote address using 'true-client-ip' or 'x-real-ip'
  const realIp = request.headers.get('x-real-ip') || request.headers.get('true-client-ip');
  if (realIp) {
    return `ip_${realIp}`;
  }

  // Last resort - use a consistent identifier from this connection
  return `unknown`;
}

/**
 * Check if request is within rate limit
 */
export function isRateLimited(key: string, configKey: string): { allowed: boolean; remaining: number; resetTime: number } {
  const config = RATE_LIMIT_CONFIG[configKey as keyof typeof RATE_LIMIT_CONFIG] || RATE_LIMIT_CONFIG.default;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // Initialize array for this key if not exists
  if (!store[key]) {
    store[key] = [];
  }

  // Remove timestamps outside the window
  store[key] = store[key].filter(timestamp => timestamp > windowStart);

  // Check if limit exceeded
  const requestCount = store[key].length;

  if (requestCount >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: Math.min(...store[key]) + config.windowMs };
  }

  // Record this request
  store[key].push(now);

  return {
    allowed: true,
    remaining: config.maxRequests - requestCount - 1,
    resetTime: now + config.windowMs,
  };
}

/**
 * Create rate limit headers response
 */
export function getRateLimitHeaders(key: string, configKey: string): Record<string, string> {
  const result = isRateLimited(key, configKey);
  const config = RATE_LIMIT_CONFIG[configKey as keyof typeof RATE_LIMIT_CONFIG] || RATE_LIMIT_CONFIG.default;

  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  };
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const key of Object.keys(store)) {
    const windowMs = RATE_LIMIT_CONFIG[key as keyof typeof RATE_LIMIT_CONFIG]?.windowMs
      || RATE_LIMIT_CONFIG.default.windowMs;

    const windowStart = now - windowMs;
    store[key] = store[key].filter(timestamp => timestamp > windowStart);

    // Clean up empty arrays to prevent memory leaks
    if (store[key].length === 0) {
      delete store[key];
    }
  }
}, CLEANUP_INTERVAL);
