import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import InternshipForm from '@/components/InternshipForm';

export const metadata = {
  title: 'Careers & Internships | The Psyche Consult Ghana Ltd',
  description: 'Internship opportunities at The Psyche Consult for current students. Apply online.',
};

const tracks = [
  ['Admissions & Counseling', 'Support students through university selection and applications.'],
  ['Visa Processing', 'Learn documentation and visa preparation from our specialists.'],
  ['Marketing & Content', 'Create social media, design and campaign content.'],
  ['Operations & Admin', 'Keep our Kumasi and Accra offices running smoothly.'],
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <header className="bg-indigo-900 pt-40 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gold-300 font-bold text-sm tracking-widest uppercase mb-4">Careers · Students only</p>
          <h1 className="font-display text-5xl md:text-7xl font-semibold text-white max-w-4xl">Internships at The Psyche Consult</h1>
          <p className="mt-6 text-xl text-indigo-200 max-w-2xl">Open to students currently enrolled at a school or university. Gain real experience in international education consulting.</p>
        </div>
      </header>
      <section className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-[0.8fr_1.2fr] gap-16">
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-indigo-900">Where you could work</h2>
          <ul className="mt-8 space-y-4">
            {tracks.map(([t, d]) => (
              <li key={t} className="rounded-2xl bg-indigo-50 p-6 border-l-4 border-gold-400">
                <p className="font-display text-lg font-semibold text-indigo-900">{t}</p>
                <p className="text-gray-600 mt-1 text-sm">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div id="apply"><InternshipForm /></div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
