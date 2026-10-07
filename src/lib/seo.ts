import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

// Builds the metadata for one page. The root layout adds " | The Psyche Consult Ghana Ltd" to the title.
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: 'website' | 'article';
}): Metadata {
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: { canonical: opts.path },
    openGraph: {
      type: opts.type || 'website',
      siteName: SITE_NAME,
      locale: 'en_GH',
      url: opts.path,
      title: `${opts.title} | ${SITE_NAME}`,
      description: opts.description,
    },
    twitter: { card: 'summary_large_image', title: `${opts.title} | ${SITE_NAME}`, description: opts.description },
  };
}

export const noIndex: Metadata = { robots: { index: false, follow: false } };
