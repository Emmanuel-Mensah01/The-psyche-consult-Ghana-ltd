import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Partner Universities Worldwide',
  description:
    'Browse our partner universities and colleges in the USA, UK, Canada, Spain, France and more. Apply through The Psyche Consult Ghana with free admission support.',
  path: '/universities',
  keywords: ['partner universities Ghana', 'universities accepting Ghanaian students', 'apply to universities abroad from Ghana'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
