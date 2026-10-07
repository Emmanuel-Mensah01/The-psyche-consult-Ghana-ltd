import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Scholarships for Ghanaian & African Students 2026',
  description:
    'Find and apply for scholarships to study abroad. Full and partial funding opportunities for Ghanaian and African students, with application support from our counsellors.',
  path: '/scholarships',
  keywords: ['scholarships for Ghanaian students', 'fully funded scholarships Africa', 'study abroad scholarships 2026'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
