import type { MetadataRoute } from 'next';
import staticParams from '@/lib/static-params.json';

const BASE_URL = 'https://vishvamohan.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE_URL}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];

  const gradeRoutes: MetadataRoute.Sitemap = staticParams.gradeParams.map((g) => ({
    url: `${BASE_URL}/resources/${g.grade}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const subjectRoutes: MetadataRoute.Sitemap = staticParams.topicParams.map((t) => ({
    url: `${BASE_URL}/resources/${t.grade}/${t.subject}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...gradeRoutes, ...subjectRoutes];
}
