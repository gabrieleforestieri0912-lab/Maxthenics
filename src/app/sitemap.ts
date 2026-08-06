import { MetadataRoute } from 'next';
import { programData } from '@/data/programs';

type ChangeFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

// Static pages - public routes only (exclude auth-protected pages)
const staticPages = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/programs',
    changefreq: 'weekly',
    priority: 0.8,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/guide',
    changefreq: 'weekly',
    priority: 0.7,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/cart',
    changefreq: 'monthly',
    priority: 0.5,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/login',
    changefreq: 'monthly',
    priority: 0.3,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/register',
    changefreq: 'monthly',
    priority: 0.3,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/privacy',
    changefreq: 'yearly',
    priority: 0.2,
    lastmod: new Date().toISOString(),
  },
  {
    url: '/terms',
    changefreq: 'yearly',
    priority: 0.2,
    lastmod: new Date().toISOString(),
  },
];

// Generate dynamic program pages from programData
function generateProgramPages() {
  const pages: Array<{ url: string; lastmod: string; changefreq: string; priority: number }> = [];

  // Process workout programs
  if (programData?.workout) {
    programData.workout.forEach((program) => {
      pages.push({
        url: `/programs/${program.id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      });
      pages.push({
        url: `/program/${program.id}/content`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    });
  }

  // Process front lever programs
  if (programData?.frontLever) {
    programData.frontLever.forEach((program) => {
      pages.push({
        url: `/programs/${program.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
      pages.push({
        url: `/program/${program.id}/content`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    });
  }

  // Process planche programs
  if (programData?.planche) {
    programData.planche.forEach((program) => {
      pages.push({
        url: `/programs/${program.id}`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
      pages.push({
        url: `/program/${program.id}/content`,
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString(),
      });
    });
  }

  return pages;
}

// Combine all URLs
const allUrls = [
  ...staticPages,
  ...generateProgramPages(),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return allUrls.map((page) => ({
    url: `https://maxthenics.com${page.url}`,
    lastModified: page.lastmod,
    changeFrequency: page.changefreq as ChangeFrequency,
    priority: page.priority,
  }));
}
