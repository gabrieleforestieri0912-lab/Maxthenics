'use client';

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = 'Maxthenics',
  section,
  tags = [],
  noindex = false,
  nofollow = false,
}) => {
  const defaultTitle = "Maxthenics - Calisthenics Mastery";
  const defaultDescription = "La piattaforma definitiva per il Calisthenics. Programmi personalizzati, tracking avanzato e coaching 1:1 per raggiungere le tue goals skills come Front Lever e Planche.";
  const defaultImage = "/maxthenics.png";
  const defaultUrl = "https://maxthenics.com";

  const pageTitle = title ? `${title} | Maxthenics` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image ? (image.startsWith('http') ? image : `${defaultUrl}${image}`) : `${defaultUrl}${defaultImage}`;
  const pageUrl = url ? (url.startsWith('http') ? url : `${defaultUrl}${url}`) : defaultUrl;

  // Build robots meta
  const robotsContent = noindex
    ? 'noindex, nofollow'
    : nofollow
    ? 'index, nofollow'
    : 'index, follow';

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={pageUrl} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Maxthenics" />
      <meta property="og:locale" content="it_IT" />
      {section && <meta property="article:section" content={section} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {tags.map((tag, index) => (
        <meta property="article:tag" content={tag} key={index} />
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  );
};

export default SEO;
