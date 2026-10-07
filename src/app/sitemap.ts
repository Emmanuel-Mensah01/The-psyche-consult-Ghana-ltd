import type { MetadataRoute } from 'next';
import { SITE_URL, staticRoutes } from '@/lib/site';
import { countryInfo } from '@/lib/countryInfo';
import { posts } from '@/data/blogPosts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const countrySlugs = Array.from(new Set([...Object.keys(countryInfo).filter((k) => k !== 'singapore'), 'spain']));
  return [
    ...staticRoutes.map((r) => ({
      url: `${SITE_URL}${r.path === '/' ? '' : r.path}`,
      lastModified: now,
      changeFrequency: r.changeFrequency,
      priority: r.priority,
    })),
    ...countrySlugs.map((slug) => ({
      url: `${SITE_URL}/countries/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
