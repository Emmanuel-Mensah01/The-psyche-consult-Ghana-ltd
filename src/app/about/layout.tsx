import type { Metadata } from 'next';
import { pageMeta } from '@/lib/seo';

export const metadata: Metadata = pageMeta({
  title: 'About Us: Trusted Study Abroad Consultants in Ghana',
  description:
    'Meet The Psyche Consult Ghana Ltd: our team, our mission and the students we have helped get into universities abroad. Offices in Accra and Kumasi.',
  path: '/about',
  keywords: ['about The Psyche Consult Ghana', 'study abroad team Ghana', 'education consultants Accra Kumasi'],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
