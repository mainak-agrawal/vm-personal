import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'CCBot'],
        allow: '/',
      },
    ],
    sitemap: 'https://vishvamohan.com/sitemap.xml',
    host: 'https://vishvamohan.com',
  };
}
