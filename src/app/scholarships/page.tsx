'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Flag from '@/components/Flag';

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
  coverage: string[];
  eligibility: string[];
  link: string;
}

const scholarships: Scholarship[] = [
  {
    id: 1,
    name: 'Fulbright Foreign Student Program',
    country: 'United States',
    flag: '🇺🇸',
    amount: 'Full Funding',
    deadline: 'October 2026',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'Provides grants for graduate study, advanced research, and university teaching in the United States for non-US citizens.',
    coverage: ['Full tuition', 'Living stipend', 'Airfare', 'Health insurance'],
    eligibility: ['Outstanding academic record', 'Leadership potential', "Bachelor's degree", 'English proficiency'],
    link: '#',
  },
  {
    id: 2,
    name: 'Chevening Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    amount: 'Full Funding',
    deadline: 'November 2026',
    level: 'Masters',
    type: 'Government',
    description:
      "The UK government's global scholarship programme, funded by the Foreign, Commonwealth & Development Office. Covers tuition, living expenses, and flights.",
    coverage: ['Full tuition', 'Monthly stipend', 'Travel costs', 'Arrival allowance'],
    eligibility: ['2+ years work experience', 'Leadership qualities', "Bachelor's degree", 'Return to home country after study'],
    link: '#',
  },
  {
    id: 3,
    name: 'Commonwealth Shared Scholarships',
    country: 'United Kingdom',
    flag: '🇬🇧',
    amount: 'Full Funding',
    deadline: 'December 2026',
    level: 'Masters',
    type: 'Government',
    description:
      'For students from Commonwealth countries to study in the UK, aimed at those who could not otherwise afford it. Covers tuition fees, living allowance, and travel costs.',
    coverage: ['Full tuition', 'Airfare', 'Living stipend'],
    eligibility: ['Commonwealth country citizen', 'Unable to afford UK study without a scholarship', "Bachelor's degree (2:1 or above)"],
    link: '#',
  },
  {
    id: 4,
    name: 'Vanier Canada Graduate Scholarships',
    country: 'Canada',
    flag: '🇨🇦',
    amount: 'CAD 50,000/year',
    deadline: 'November 2026',
    level: 'PhD',
    type: 'Government',
    description:
      'Attracts and retains world-class doctoral students by supporting students who demonstrate leadership skills and a high standard of scholarly achievement.',
    coverage: ['Annual stipend for 3 years'],
    eligibility: ['Doctoral student', 'Nominated by a Canadian university', 'Leadership experience'],
    link: '#',
  },
  {
    id: 5,
    name: 'Australia Awards Scholarships',
    country: 'Australia',
    flag: '🇦🇺',
    amount: 'Full Funding',
    deadline: 'April 2027',
    level: 'Undergraduate, Masters, PhD',
    type: 'Government',
    description:
      'Long-term development awards administered by the Australian government. Covers tuition, living costs, and travel for citizens of eligible countries.',
    coverage: ['Full tuition', 'Return airfare', 'Living expenses', 'Health cover'],
    eligibility: ['Citizen of an eligible country', 'Strong academic record', 'Not currently residing in Australia'],
    link: '#',
  },
  {
    id: 6,
    name: 'DAAD Scholarships',
    country: 'Germany',
    flag: '🇩🇪',
    amount: '€850-€1,200/month',
    deadline: 'Varies by programme',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'The German Academic Exchange Service offers scholarships for international students to study or conduct research in Germany.',
    coverage: ['Monthly stipend', 'Health insurance', 'Travel allowance'],
    eligibility: ["Bachelor's degree with excellent grades", 'German or English proficiency depending on programme'],
    link: '#',
  },
  {
    id: 7,
    name: 'Eiffel Excellence Scholarship',
    country: 'France',
    flag: '🇫🇷',
    amount: '€1,181-€1,700/month',
    deadline: 'January 2027',
    level: 'Masters / PhD',
    type: 'Government',
    description:
      'Awarded by Campus France to attract top international students, nominated by French higher education institutions, into Masters and PhD programmes.',
    coverage: ['Monthly stipend', 'Return ticket', 'Health insurance'],
    eligibility: ['Nominated by a French institution', 'Under 30 (Masters) / under 35 (PhD)', 'Outstanding academic record'],
    link: '#',
  },
  {
    id: 8,
    name: 'Holland Scholarship',
    country: 'Netherlands',
    flag: '🇳🇱',
    amount: '€5,000',
    deadline: 'Varies by university',
    level: 'Bachelors & Masters',
    type: 'Partial funding',
    description:
      'A one-time grant from the Dutch government and participating universities to help non-EU students with the cost of tuition in their first year.',
    coverage: ['One-time grant towards tuition'],
    eligibility: ['Non-EU/EEA student', 'Good academic record', 'Admitted to a participating Dutch university'],
    link: '#',
  },
  {
    id: 9,
    name: 'Government of Ireland Scholarships',
    country: 'Ireland',
    flag: '🇮🇪',
    amount: '€16,000/year',
    deadline: 'November 2026',
    level: 'PhD',
    type: 'Government',
    description:
      'Supports outstanding PhD candidates across all disciplines to carry out research at an Irish higher education institution.',
    coverage: ['Annual stipend', 'Contribution to fees'],
    eligibility: ['Outstanding academic record', 'PhD candidate in any discipline'],
    link: '#',
  },
  {
    id: 10,
    name: 'New Zealand Development Scholarships',
    country: 'New Zealand',
    flag: '🇳🇿',
    amount: 'Full Funding',
    deadline: 'March 2027',
    level: 'Undergraduate, Masters, PhD',
    type: 'Government',
    description:
      'Supports citizens of developing countries with leadership potential to study in New Zealand and contribute to their home country’s development.',
    coverage: ['Full tuition', 'Living costs', 'Travel', 'Insurance'],
    eligibility: ['Citizen of an eligible developing country', 'Leadership potential', 'Commitment to return home after study'],
    link: '#',
  },
  {
    id: 11,
    name: 'Singapore International Graduate Award',
    country: 'Singapore',
    flag: '🇸🇬',
    amount: 'SGD 2,000-2,500/month',
    deadline: 'Varies by intake',
    level: 'PhD',
    type: 'Government',
    description:
      'A joint award for research-focused PhD candidates working with Singapore research institutes and partner universities.',
    coverage: ['Monthly stipend', 'Tuition fees', 'Conference allowance'],
    eligibility: ['Research-focused PhD candidate', 'Strong academic and research background'],
    link: '#',
  },
  {
    id: 12,
    name: 'MasterCard Foundation Scholars Program',
    country: 'Various',
    flag: '🌍',
    amount: 'Full Funding',
    deadline: 'Varies by partner university',
    level: 'Undergraduate & Masters',
    type: 'Need & Merit-based',
    description:
      'Supports academically talented African students who face economic hardship to access quality higher education and develop into future leaders.',
    coverage: ['Full tuition', 'Accommodation', 'Books', 'Living expenses'],
    eligibility: ['African student', 'Demonstrated financial need', 'Leadership potential', 'Strong academic record'],
    link: '#',
  },

];

const levels = ['All Levels', 'Undergraduate', 'Masters', 'PhD'];
const types = ['All Types', 'Government', 'Partial funding', 'Need & Merit-based'];
const countries = [
  'All Countries',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Ireland',
  'New Zealand',
  'Singapore',
  'Various',
];

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
            {[['200+', 'Available Scholarships'], ['$2M+', 'Secured for Students'], ['150+', 'Students Funded'], ['85%', 'Success Rate']].map(([val, label]) => (
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
                        <div><Flag emoji={s.flag} width={44} /></div>
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
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Award Amount</div>
                        <div className="text-sm text-gray-600 mt-2">{s.deadline}</div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">Deadline</div>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 text-sm leading-relaxed">{s.description}</p>

                    <div className="mt-4 grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Coverage Includes:</p>
                        <ul className="space-y-1">
                          {s.coverage.map((c) => (
                            <li key={c} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-green-600 mt-0.5">✓</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Eligibility:</p>
                        <p className="text-sm text-gray-600">{s.eligibility[0]}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => setExpandedId(expandedId === s.id ? null : s.id)}
                        className="text-sm text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
                      >
                        {expandedId === s.id ? 'Hide' : 'View'} Full Eligibility
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${expandedId === s.id ? 'rotate-180' : ''}`}>
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                      <a
                        href="/booking"
                        className="text-sm bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all"
                      >
                        Get Application Help
                      </a>
                    </div>
                    {expandedId === s.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Full Eligibility Requirements:</p>
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

      {/* Application Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Scholarship Application Tips</h2>
            <p className="text-gray-600">Expert advice to maximize your chances of success</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              ['Start Early', 'Begin your scholarship search 12-18 months before your intended start date'],
              ['Meet Requirements', 'Carefully review eligibility criteria and ensure you meet all requirements'],
              ['Strong Application', 'Craft compelling essays that showcase your achievements and future goals'],
              ['Multiple Applications', 'Apply to multiple scholarships to increase your chances of success'],
              ['Get Recommendations', 'Secure strong reference letters from professors or employers early'],
              ['Follow Instructions', 'Submit all required documents and meet deadlines without exception'],
            ].map(([title, text], i) => (
              <div key={title} className="bg-gray-50 rounded-2xl border border-gray-100 p-6">
                <div className="w-9 h-9 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center mb-4">
                  {i + 1}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Need Help Finding the Right Scholarship?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Our expert counselors have helped students secure over $2M in scholarships. Let us help you too!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/booking"
              className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all"
            >
              Book Consultation
            </a>
            <a
              href="/student-portal"
              className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              Student Portal
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
