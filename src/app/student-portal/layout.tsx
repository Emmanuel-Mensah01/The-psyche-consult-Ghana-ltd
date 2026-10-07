import type { Metadata } from 'next';
import { noIndex } from '@/lib/seo';

export const metadata: Metadata = { ...noIndex, title: 'Student Portal' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
