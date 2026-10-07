import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CEOTravelsSection from '@/components/CEOTravelsSection';

export const metadata = {
  title: 'CEO Travels: Visits to Universities & Education Events Abroad',
  description: "Moments from our CEO's visits to universities and education events abroad.",
  alternates: { canonical: '/ceo-travels' },
};

export default function CEOTravelsPage() {
  return (
    <div className="min-h-screen bg-indigo-900">
      <Navbar />
      <header className="max-w-7xl mx-auto px-6 pt-40 pb-16">
        <h1 className="font-display text-5xl md:text-7xl font-semibold text-white">CEO Travels</h1>
        <p className="mt-6 text-xl text-indigo-200 max-w-2xl">Moments from our CEO&apos;s visits to universities and events abroad, where partnerships for your admission are built.</p>
      </header>
      <CEOTravelsSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
