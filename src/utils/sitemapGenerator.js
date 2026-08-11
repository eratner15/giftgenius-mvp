import { generateSEOUrls } from '../data/seoKeywords';

export const generateSitemap = () => {
  const baseUrl = 'https://giftgenius-mvp.netlify.app';
  const seoUrls = generateSEOUrls();

  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/how-it-works', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' }
  ];

  // SEO landing pages
  const seoPages = seoUrls.slice(0, 1000).map(page => ({
    url: page.url,
    priority: page.commercialIntent > 0.8 ? '0.9' : '0.7',
    changefreq: 'weekly',
    lastmod: new Date().toISOString().split('T')[0]
  }));

  const allPages = [...staticPages, ...seoPages];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
};

export const generateRobotsTxt = () => {
  const baseUrl = 'https://giftgenius-mvp.netlify.app';

  return `User-agent: *
Allow: /

# High-priority pages for crawling
Allow: /gifts/*
Allow: /about
Allow: /how-it-works
Allow: /faq
Allow: /contact

# Block admin and development paths
Disallow: /admin
Disallow: /dev
Disallow: /_next
Disallow: /api

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1`;
};

// Generate files for public directory
export const createSEOFiles = () => {
  const sitemap = generateSitemap();
  const robots = generateRobotsTxt();

  return {
    sitemap,
    robots
  };
};