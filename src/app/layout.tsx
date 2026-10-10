import "./globals.css";
import ChatLayoutClient from "../components/ChatLayoutClient";
import Providers from "../components/Providers";
import StructuredData from "../components/StructuredData";
import { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';
import { organizationJsonLd, websiteJsonLd } from '../lib/seo';
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://maxthenics.com"),
  title: {
    default: "Maxthenics - Calisthenics Mastery",
    template: "%s | Maxthenics",
  },
  description:
    "La piattaforma definitiva per il Calisthenics. Programmi personalizzati, tracking avanzato e coaching 1:1 per raggiungere le tue goals skills come Front Lever e Planche.",
  keywords: [
    "calisthenics",
    "front lever",
    "planche",
    "programmi allenamento",
    "bodyweight training",
    "fitness",
    "calistenics",
    "行使街",
    "街头健身",
  ],
  authors: [{ name: "Maxthenics" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://maxthenics.com",
    siteName: "Maxthenics",
    title: "Maxthenics - Calisthenics Mastery",
    description:
      "La piattaforma definitiva per il Calisthenics. Programmi personalizzati e coaching 1:1.",
    images: [
      {
        url: "/maxthenics.png",
        width: 1200,
        height: 630,
        alt: "Maxthenics - Calisthenics Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maxthenics - Calisthenics Mastery",
    description:
      "La piattaforma definitiva per il Calisthenics. Programmi personalizzati e coaching 1:1.",
    images: ["/maxthenics.png"],
  },
  icons: {
    icon: "/maxthenics.png",
    apple: "/maxthenics.png",
  },
};

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION;
if (googleVerification) {
  metadata.verification = { google: googleVerification };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${inter.variable} dark`}>
      <body className={`${inter.className} relative antialiased bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-gray-200`}>
        <StructuredData data={[organizationJsonLd(), websiteJsonLd()]} />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">{children}</main>
            {/* Plausible Analytics (solo in produzione) */}
            {process.env.NODE_ENV === 'production' && (
              <Script
                defer
                data-domain="maxthenics.com"
                src="https://plausible.io/js/script.js"
              />
            )}
            <ChatLayoutClient />
          </div>
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}