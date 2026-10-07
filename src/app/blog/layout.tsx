import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Study Abroad Blog: Visas, Scholarships, IELTS & Student Life',
  description:
    'Practical guides for Ghanaian students: personal statements, scholarships, IELTS vs TOEFL, UK and Canada visas, costs of living and settling in abroad.',
  path: '/blog',
  keywords: ['study abroad blog Ghana', 'student visa guide', 'IELTS vs TOEFL', 'scholarship tips'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
