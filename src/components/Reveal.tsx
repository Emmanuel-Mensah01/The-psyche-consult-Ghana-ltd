'use client';
import React from 'react';
import { useReveal } from '@/lib/useReveal';

export default function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useReveal<HTMLDivElement>(delay);
  return <div ref={ref} className={className}>{children}</div>;
}
