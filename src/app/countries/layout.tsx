import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Study Abroad Destinations: USA, UK, Canada, Spain, France & More',
  description:
    'Compare study destinations for Ghanaian students: tuition, living costs, visa steps, work rights and partner universities in the USA, UK, Canada, Australia, Spain, France and more.',
  path: '/countries',
  keywords: ['study abroad destinations', 'best countries to study abroad from Ghana', 'study in USA', 'study in UK', 'study in Canada'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
