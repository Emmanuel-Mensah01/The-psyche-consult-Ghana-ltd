import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ContactSection from '@/components/ContactSection';
import { pageMeta } from '@/lib/seo';

export const metadata = pageMeta({
  title: 'Contact Us: Call, WhatsApp or Visit Our Accra & Kumasi Offices',
  description:
    'Get in touch with The Psyche Consult Ghana Ltd. Call 0547 371 731 or 0552 721 414, send a message, or visit our offices in Accra (Lapaz, Tabora) and Kumasi (Tanoso).',
  path: '/contact',
  keywords: ['contact The Psyche Consult Ghana', 'study abroad consultants Accra contact', 'education consultancy Kumasi contact'],
});

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <header className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 pt-36 pb-16 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-gold-300 mb-4">We&apos;d love to hear from you</p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5">Contact Us</h1>
          <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
            Call us, message us on WhatsApp or visit one of our offices in Accra and Kumasi. Our counselors will get back to you quickly.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="tel:+233547371731" className="rounded-full bg-gold-400 px-7 py-3.5 font-bold text-indigo-900 hover:bg-gold-300 transition-colors">
              Call 0547 371 731
            </a>
            <a href="tel:+233552721414" className="rounded-full bg-gold-400 px-7 py-3.5 font-bold text-indigo-900 hover:bg-gold-300 transition-colors">
              Call 0552 721 414
            </a>
            <a
              href="https://wa.me/233273664058?text=Hello%2C%20I%20need%20help%20with%20studying%20abroad"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border-2 border-white/60 px-7 py-3 font-bold text-white hover:bg-white/10 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </header>

      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
