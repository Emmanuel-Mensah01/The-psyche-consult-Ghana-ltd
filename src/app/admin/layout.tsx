import type { Metadata } from 'next';
import { noIndex } from '@/lib/seo';

export const metadata: Metadata = { ...noIndex, title: 'Admin' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
