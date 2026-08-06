import "./globals.css";
import ChatLayoutClient from "../components/ChatLayoutClient";
import Providers from "../components/Providers";
import { Metadata } from 'next';
import Script from 'next/script';
import React from 'react';

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
   verification: {
     google: process.env.NODE_ENV === 'production'
       ? "REPLACE_WITH_ACTUAL_GOOGLE_VERIFICATION_CODE"
       : "google-site-verification-code",
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
        url: "/Img/maxthenics.png",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className="relative antialiased bg-zinc-950 text-gray-200">
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
      </body>
    </html>
  );
}
