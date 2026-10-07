import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'Book a Free Study Abroad Consultation',
  description:
    'Book a free consultation with a study abroad counsellor in Accra or Kumasi, or online. Get advice on universities, admissions, scholarships and student visas.',
  path: '/booking',
  keywords: ['book study abroad consultation Ghana', 'free education counselling Accra', 'study abroad appointment Kumasi'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
