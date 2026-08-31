import type { Metadata } from "next";
import { faqs } from "@/data/faq";
import { programData, type ProgramDataItem } from "@/data/programs";

export const SITE_URL = "https://maxthenics.com";
export const SITE_NAME = "Maxthenics";
export const SITE_TITLE = "Maxthenics - Calisthenics Mastery";
export const DEFAULT_IMAGE = `${SITE_URL}/Img/maxthenics.png`;
export const SITE_DESCRIPTION =
  "La piattaforma definitiva per il Calisthenics. Programmi scientifici personalizzati, tracking avanzato e coaching 1:1 per sbloccare skills come Front Lever e Planche.";

const CATEGORIES = ["workout", "frontLever", "planche", "skills"] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export function getAllPrograms(): ProgramDataItem[] {
  return CATEGORIES.flatMap((c) => programData[c]);
}

export function getProgramById(id: string | number): ProgramDataItem | undefined {
  const numeric = typeof id === "number" ? id : parseInt(id, 10);
  return getAllPrograms().find((p) => p.id === numeric);
}

export function getProgramCategory(id: string | number): CategoryName | undefined {
  const numeric = typeof id === "number" ? id : parseInt(id, 10);
  for (const c of CATEGORIES) {
    if (programData[c].some((p) => p.id === numeric)) return c;
  }
  return undefined;
}

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path}`;
}

export function absoluteImage(image: string): string {
  if (image.startsWith("http")) return image;
  return `${SITE_URL}${image}`;
}

export type JsonLd = Record<string, unknown>;

/* ------------------------------------------------------------------ */
/* Metadata builders                                                   */
/* ------------------------------------------------------------------ */

interface MetaOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  /** Skip the "%s | Maxthenics" title template (used on the homepage). */
  absoluteTitle?: boolean;
}

function makeMetadata(opts: MetaOptions): Metadata {
  const url = absoluteUrl(opts.path);
  const image = absoluteImage(opts.image ?? "/Img/maxthenics.png");
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: opts.noindex
      ? { index: false, follow: false }
      : {
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
      type: opts.type ?? "website",
      locale: "it_IT",
      url,
      siteName: SITE_NAME,
      title: opts.title,
      description: opts.description,
      images: [{ url: image, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image],
    },
  };
}

export function homeMetadata(): Metadata {
  return makeMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    absoluteTitle: true,
  });
}

export function programsMetadata(): Metadata {
  return makeMetadata({
    title: "Programmi Calisthenics",
    description:
      "Accademia Maxthenics: programmi di calisthenics per tutti i livelli. Front Lever, Planche, Handstand, Back Lever, Dragon Flag, Ipertrofia a corpo libero e Prehab. Progressioni scientifiche, video 4K e accesso a vita.",
    path: "/programs",
  });
}

export function programDetailMetadata(program: ProgramDataItem): Metadata {
  return makeMetadata({
    title: `${program.title} | Protocollo`,
    description: program.description,
    path: `/program/${program.id}`,
    image: program.image,
  });
}

export function programContentMetadata(program: ProgramDataItem): Metadata {
  return makeMetadata({
    title: `${program.title} | Contenuti`,
    description: `Contenuti del programma ${program.title}: schede, progressioni e video.`,
    path: `/program/${program.id}/content`,
    image: program.image,
    noindex: true,
  });
}

export function guideMetadata(): Metadata {
  return makeMetadata({
    title: "Guida Calisthenics",
    description:
      "Guida completa al calisthenics: tecniche, progressioni, esercizi e programmi per principianti e atleti avanzati. Impara Front Lever, Planche e molto altro.",
    path: "/guide",
    type: "article",
  });
}

export function coachingMetadata(): Metadata {
  return makeMetadata({
    title: "Calisthenics Room - Coaching 1:1",
    description:
      "Coaching 1:1 premium di calisthenics. Percorso individuale con video-analisi, correzioni live e posti limitati a 5 atleti al mese.",
    path: "/calisthenics-room",
  });
}

export function legalMetadata(title: string, description: string, path: string): Metadata {
  return makeMetadata({ title, description, path, noindex: true });
}

export function noindexMetadata(): Metadata {
  return makeMetadata({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    noindex: true,
  });
}

/* ------------------------------------------------------------------ */
/* Structured data (JSON-LD) builders                                  */
/* ------------------------------------------------------------------ */

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: DEFAULT_IMAGE, width: 1200, height: 630 },
    image: DEFAULT_IMAGE,
    description: SITE_DESCRIPTION,
    sameAs: [],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    inLanguage: "it-IT",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqPageJsonLd(
  items: { question: string; answer: string }[],
  id = `${SITE_URL}/#faq`
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": id,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function homeJsonLd(): JsonLd[] {
  return [faqPageJsonLd(faqs)];
}

export function programJsonLd(program: ProgramDataItem, category?: CategoryName): JsonLd[] {
  const url = `/program/${program.id}`;
  const price = program.price;
  return [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Programmi Calisthenics", path: "/programs" },
      { name: program.title, path: url },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${SITE_URL}${url}#product`,
      name: program.title,
      description: program.description,
      image: absoluteImage(program.image),
      brand: { "@type": "Brand", name: SITE_NAME },
      category,
      additionalProperty: [
        { "@type": "PropertyValue", name: "Livello", value: program.level },
        { "@type": "PropertyValue", name: "Durata", value: program.duration },
        { "@type": "PropertyValue", name: "Intensità", value: program.intensity },
      ],
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}${url}`,
        priceCurrency: "EUR",
        price,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      },
    },
    faqPageJsonLd(PROGRAM_FAQS, `${SITE_URL}${url}#faq`),
  ];
}

export function guideJsonLd(): JsonLd[] {
  return [
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Guida Calisthenics", path: "/guide" },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Guida Completa al Calisthenics",
      description: guideMetadata().description,
      image: DEFAULT_IMAGE,
      url: `${SITE_URL}/guide`,
      inLanguage: "it-IT",
      author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntityOfPage: `${SITE_URL}/guide`,
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Crawler-readable content snapshot (sr-only, server-rendered)        */
/* ------------------------------------------------------------------ */

export interface CrawlableContent {
  h1: string;
  paragraphs: string[];
  list?: string[];
}

export const PROGRAM_FAQS = [
  {
    question: "Quanto dura l'accesso al programma?",
    answer:
      "Una volta sbloccato o acquistato, l'accesso al programma è a vita. Potrai consultare le schede, i video e i materiali didattici in qualsiasi momento, ovunque ti trovi.",
  },
  {
    question: "Ho bisogno di attrezzatura specifica?",
    answer:
      "La maggior parte dei nostri programmi richiede attrezzatura base da Calisthenics: sbarra per trazioni, parallele e anelli. Per programmi avanzati potrebbero essere utili bande elastiche o zavorre.",
  },
  {
    question: "E se il programma è troppo difficile per me?",
    answer:
      "Ogni programma è strutturato con propedeutiche graduali. Inoltre, forniamo alternative scalabili per ogni esercizio per adattarsi al tuo livello di partenza.",
  },
];

export function homeCrawlable(): CrawlableContent {
  return {
    h1: SITE_TITLE,
    paragraphs: [
      SITE_DESCRIPTION,
      "Maxthenics è un ecosistema di allenamento intelligente: programmi di calisthenics scientifici e personalizzati basati su biomeccanica, periodizzazione e coach AI Sthenox, per sbloccare Planche, Front Lever, Handstand e altre skills.",
      "Disponibili anche programmi per ipertrofia a corpo libero, prehab articolare, Back Lever, Dragon Flag, Human Flag e Maltese, più il servizio di coaching 1:1 Calisthenics Room.",
    ],
    list: faqs.map((f) => `${f.question} ${f.answer}`),
  };
}

export function programsCrawlable(): CrawlableContent {
  return {
    h1: "Programmi Calisthenics",
    paragraphs: [
      "Accademia Maxthenics: programmi di calisthenics per principianti, intermedi, avanzati ed elite. Ogni protocollo include progressioni scientifiche, video tutorial, accesso a vita e aggiornamenti.",
    ],
    list: getAllPrograms().map((p) => {
      const price = p.price === 0 ? "Gratuito" : `${p.price} €`;
      return `${p.title} (${p.level}, ${p.duration}, ${price}): ${p.description}`;
    }),
  };
}

export function programCrawlable(program: ProgramDataItem): CrawlableContent {
  const price = program.price === 0 ? "Gratuito" : `${program.price} €`;
  return {
    h1: program.title,
    paragraphs: [
      program.description,
      `Livello: ${program.level}. Durata: ${program.duration}. Intensità: ${program.intensity}. Prezzo: ${price}.`,
      "Il programma è strutturato in tre fasi: Condizionamento & Adattamento, Intensificazione del Volume, Picco di Forza & Mastery.",
    ],
    list: program.features,
  };
}

/* ------------------------------------------------------------------ */
/* Route resolution for the catch-all page                             */
/* ------------------------------------------------------------------ */

export interface ResolvedRoute {
  metadata: Metadata;
  jsonLd: JsonLd | JsonLd[];
  crawlable?: CrawlableContent;
}

const STATIC_NOINDEX_PATHS = new Set([
  "/cart",
  "/create",
  "/login",
  "/register",
  "/dashboard",
  "/my-program",
  "/my-workouts",
  "/purchase-history",
  "/chat",
  "/auth/callback",
  "/success",
  "/feedback",
]);

export function resolveCatchAllRoute(slug: string[]): ResolvedRoute {
  const path = `/${slug.join("/")}`;
  const [first, second] = slug;

  // Program detail: /program/:id
  if (first === "program" && second && !slug[2]) {
    const program = getProgramById(second);
    if (program) {
      return {
        metadata: programDetailMetadata(program),
        jsonLd: programJsonLd(program, getProgramCategory(second)),
        crawlable: programCrawlable(program),
      };
    }
  }

  // Program content (protected): /program/:id/content
  if (first === "program" && second && slug[2] === "content") {
    const program = getProgramById(second);
    if (program) {
      return {
        metadata: programContentMetadata(program),
        jsonLd: [],
        crawlable: undefined,
      };
    }
  }

  switch (first) {
    case "programs":
      return {
        metadata: programsMetadata(),
        jsonLd: [
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Programmi Calisthenics", path: "/programs" },
          ]),
        ],
        crawlable: programsCrawlable(),
      };
    case "guide":
      return { metadata: guideMetadata(), jsonLd: guideJsonLd(), crawlable: undefined };
    case "calisthenics-room":
      return { metadata: coachingMetadata(), jsonLd: [], crawlable: undefined };
    case "privacy":
      return {
        metadata: legalMetadata(
          "Privacy Policy",
          "Informativa sulla privacy di Maxthenics: come trattiamo i tuoi dati personali.",
          "/privacy"
        ),
        jsonLd: [],
        crawlable: undefined,
      };
    case "terms":
      return {
        metadata: legalMetadata(
          "Termini e Condizioni",
          "Termini e condizioni di utilizzo della piattaforma Maxthenics.",
          "/terms"
        ),
        jsonLd: [],
        crawlable: undefined,
      };
    default:
      if (STATIC_NOINDEX_PATHS.has(path)) {
        return { metadata: noindexMetadata(), jsonLd: [], crawlable: undefined };
      }
      // Unknown route → soft 404: keep noindex so crawlers drop it.
      return { metadata: noindexMetadata(), jsonLd: [], crawlable: undefined };
  }
}