import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PRIVATE_PATHS = [
  "/api/",
  "/_next/",
  "/dashboard",
  "/create",
  "/my-program",
  "/my-workouts",
  "/purchase-history",
  "/chat",
  "/cart",
  "/auth/",
  "/success",
  "/feedback",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // AI / LLM crawlers are explicitly welcome: they discover Maxthenics
      // for answer engines and chat assistants.
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "Google-Extended",
          "Googlebot",
          "Bingbot",
          "Applebot",
          "cohere-ai",
          "Bytespider",
          "Amazonbot",
          "facebookexternalhit",
        ],
        allow: ["/", "/programs", "/program", "/guide", "/calisthenics-room"],
        disallow: PRIVATE_PATHS,
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}