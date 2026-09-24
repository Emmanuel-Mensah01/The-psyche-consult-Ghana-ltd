'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

interface Scholarship {
  id: number;
  name: string;
  country: string;
  flag: string;
  amount: string;
  deadline: string;
  level: string;
  type: string;
  description: string;
  eligibility: string[];
  link: string;
}

const scholarships: Scholarship[] = [
  {
    id: 1,
    name: 'Chevening Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    amount: 'Full Funding',
    deadline: 'November 2025',
    level: 'Masters',
    type: 'Government',
    description:
      'The UK government\'s global scholarship programme, funded by the Foreign, Commonwealth & Development Office. Covers tuition, living expenses, and flights.',
    eligibility: ['2+ years work experience', 'Bachelor\'s degree', 'Leadership potential', 'Return to home country after study'],
    link: '#',
  },
  {
    id: 2,
    name: 'Commonwealth Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    amount: 'Full Funding',
    deadline: 'December 2025',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'For students from Commonwealth countries to study in the UK. Covers tuition fees, living allowance, and travel costs.',
    eligibility: ['Commonwealth citizen', 'Bachelor\'s degree (2:1 or above)', 'Commitment to development'],
    link: '#',
  },
  {
    id: 3,
    name: 'Fulbright Foreign Student Program',
    country: 'United States',
    flag: '🇺🇸',
    amount: 'Full Funding',
    deadline: 'October 2025',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'Provides grants for graduate study, advanced research, and university teaching in the United States for non-US citizens.',
    eligibility: ['Bachelor\'s degree', 'English proficiency', 'Strong academic record', 'Leadership qualities'],
    link: '#',
  },
  {
    id: 4,
    name: 'Australia Awards Scholarships',
    country: 'Australia',
    flag: '🇦🇺',
    amount: 'Full Funding',
    deadline: 'April 2026',
    level: 'Undergraduate / Masters',
    type: 'Government',
    description:
      'Long-term development awards administered by the Department of Foreign Affairs and Trade. Covers tuition, living costs, and travel.',
    eligibility: ['Citizen of eligible country', 'Not currently in Australia', 'Minimum 2 years work experience'],
    link: '#',
  },
  {
    id: 5,
    name: 'DAAD Scholarships',
    country: 'Germany',
    flag: '🇩🇪',
    amount: '€934/month',
    deadline: 'October 2025',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'The German Academic Exchange Service offers scholarships for international students to study or conduct research in Germany.',
    eligibility: ['Bachelor\'s degree', 'German or English proficiency', 'Strong academic record'],
    link: '#',
  },
  {
    id: 6,
    name: 'Eiffel Excellence Scholarship',
    country: 'France',
    flag: '🇫🇷',
    amount: '€1,181/month',
    deadline: 'January 2026',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'Awarded by Campus France to attract top international students to French higher education institutions.',
    eligibility: ['Under 30 (Masters) / Under 35 (PhD)', 'Nominated by French institution', 'Excellent academic record'],
    link: '#',
  },
  {
    id: 7,
    name: 'Vanier Canada Graduate Scholarships',
    country: 'Canada',
    flag: '🇨🇦',
    amount: 'CAD $50,000/year',
    deadline: 'November 2025',
    level: 'PhD',
    type: 'Government',
    description:
      'Attracts and retains world-class doctoral students by supporting students who demonstrate leadership skills and a high standard of scholarly achievement.',
    eligibility: ['PhD student', 'Nominated by Canadian university', 'Leadership experience'],
    link: '#',
  },
  {
    id: 8,
    name: 'NZ Excellence Awards',
    country: 'New Zealand',
    flag: '🇳🇿',
    amount: 'NZD $10,000',
    deadline: 'March 2026',
    level: 'Masters / PhD',
    type: 'University',
    description:
      'Offered by New Zealand universities to attract high-achieving international students across all disciplines.',
    eligibility: ['International student', 'GPA 3.5+', 'Enrolled in NZ university'],
    link: '#',
  },
];

const levels = ['All Levels', 'Undergraduate', 'Masters', 'PhD'];
const types = ['All Types', 'Government', 'University', 'Private'];
const countries = ['All Countries', 'United Kingdom', 'United States', 'Australia', 'Germany', 'France', 'Canada', 'New Zealand'];

export default function ScholarshipsPage() {
  const [selectedLevel, setSelectedLevel] = useState('All Levels');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = scholarships.filter((s) => {
    const levelMatch = selectedLevel === 'All Levels' || s.level.includes(selectedLevel);
    const typeMatch = selectedType === 'All Types' || s.type === selectedType;
    const countryMatch = selectedCountry === 'All Countries' || s.country === selectedCountry;
    return levelMatch && typeMatch && countryMatch;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            💰 Funding Opportunities
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Scholarship <span className="text-indigo-300">Directory</span>
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
            Discover fully-funded and partial scholarships available to Ghanaian students studying abroad. Our counselors help you identify and apply for the best opportunities.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-white">
            {[['50+', 'Scholarships Listed'], ['$2M+', 'Funding Available'], ['95%', 'Application Success']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-indigo-300">{val}</div>
                <div className="text-sm text-indigo-200">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link
              href="/scholarships/apply"
              className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-3.5 rounded-full font-bold hover:bg-indigo-50 transition-all shadow-lg text-sm"
            >
              🎓 Apply for a Scholarship
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-sm font-semibold text-gray-700">Filter by:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {levels.map((l) => <option key={l}>{l}</option>)}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {types.map((t) => <option key={t}>{t}</option>)}
            </select>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {countries.map((c) => <option key={c}>{c}</option>)}
            </select>
            <span className="ml-auto text-sm text-gray-500">{filtered.length} scholarships found</span>
          </div>
        </div>
      </section>

      {/* Scholarship Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl font-semibold">No scholarships match your filters.</p>
              <p className="text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{s.flag}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{s.name}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">{s.country}</span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">{s.level}</span>
                            <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">{s.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-indigo-600">{s.amount}</div>
                        <div className="text-sm text-gray-500">Deadline: {s.deadline}</div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">{s.description}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                        className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
                      >
                        {expandedId === s.id ? 'Hide' : 'View'} Eligibility
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedId === s.id ? 'rotate-180' : ''}`}>
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      <a
                        href="/student-portal"
                        className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all"
                      >
                        Get Help Applying
                      </a>
                    </div>
                    {expandedId === s.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Eligibility Requirements:</p>
                        <ul className="space-y-1">
                          {s.eligibility.map((req) => (
                            <li key={req} className="flex items-start gap-2 text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 flex-shrink-0 mt-0.5">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                                <path d="m9 11 3 3L22 4" />
                              </svg>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Need Help Finding the Right Scholarship?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Our expert counselors will match you with scholarships you qualify for and guide you through every step of the application process.
          </p>
          <a
            href="/student-portal"
            className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all"
          >
            Book a Free Consultation
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
