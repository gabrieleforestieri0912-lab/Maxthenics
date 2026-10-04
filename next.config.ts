import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Only allow specific domains for images in production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'maxthenics.com',
      },
      {
        protocol: 'https',
        hostname: '*.maxthenics.com',
      },
      {
        protocol: 'https',
        hostname: '*.stripe.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
    ],
  },

  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'none'; default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.stripe.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com https://*.supabase.co",
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },

  // Disable external scripts by default (remove in production if needed for Stripe/Google)
  // reactStrictMode: true, // Enabled by default in Next.js 15+

  // Ensure turbopack doesn't get confused about root
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
