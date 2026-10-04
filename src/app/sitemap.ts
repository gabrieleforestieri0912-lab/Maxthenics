import { MetadataRoute } from 'next';
import { getAllPrograms } from '@/lib/seo';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Stable lastmod: content changes rarely, keep the sitemap cacheable.
const LAST_MOD = '2026-08-19T00:00:00.000Z';

interface SitemapEntry {
  url: string;
  changefreq: ChangeFrequency;
  priority: number;
  lastmod: string;
}

// Static public pages (exclude auth-protected and noindex pages)
const staticPages: SitemapEntry[] = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: LAST_MOD,
  },
  {
    url: '/programs',
    changefreq: 'weekly',
    priority: 0.9,
    lastmod: LAST_MOD,
  },
  {
    url: '/guide',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: LAST_MOD,
  },
  {
    url: '/calisthenics-room',
    changefreq: 'monthly',
    priority: 0.6,
    lastmod: LAST_MOD,
  },
];

// Dynamic program pages generated from programData (all categories)
function generateProgramPages(): SitemapEntry[] {
  return getAllPrograms().map((program) => ({
    url: `/program/${program.id}`,
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: LAST_MOD,
  }));
}

const allUrls = [...staticPages, ...generateProgramPages()];

export default function sitemap(): MetadataRoute.Sitemap {
  return allUrls.map((page) => ({
    url: `https://maxthenics.com${page.url}`,
    lastModified: page.lastmod,
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));
}