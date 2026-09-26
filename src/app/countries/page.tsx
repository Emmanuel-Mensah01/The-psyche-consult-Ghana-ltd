'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createClient } from '@/lib/supabase/client';
import Flag from '@/components/Flag';

interface Country {
  id: string;
  name: string;
  code: string | null;
  flag_emoji: string | null;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

interface StaticCountry {
  flag: string;
  name: string;
  universities: number;
  slug: string;
  description: string;
  students: string;
  avgCost: string;
  visaSuccess: string;
  badges: string[];
}

const staticCountries: StaticCountry[] = [
  {
    flag: '🇺🇸',
    name: 'United States',
    universities: 108,
    slug: 'united-states',
    description: 'Home to world-renowned universities like Harvard, MIT, and Stanford. Offers diverse programs and excellent research opportunities.',
    students: '120+',
    avgCost: '$30,000 - $60,000',
    visaSuccess: '95%',
    badges: ['Top-ranked universities', 'STEM OPT extension', 'Diverse culture', 'Research opportunities'],
  },
  {
    flag: '🇬🇧',
    name: 'United Kingdom',
    universities: 144,
    slug: 'united-kingdom',
    description: 'Historic universities like Oxford and Cambridge offer world-class education with shorter degree programs.',
    students: '95+',
    avgCost: '£15,000 - £35,000',
    visaSuccess: '97%',
    badges: ['1-year Masters programs', 'Post-study work visa', 'Rich history', 'Quality education'],
  },
  {
    flag: '🇨🇦',
    name: 'Canada',
    universities: 47,
    slug: 'canada',
    description: 'Welcoming immigration policies and high quality of life make Canada a top choice for international students.',
    students: '85+',
    avgCost: 'CAD 15,000 - 35,000',
    visaSuccess: '96%',
    badges: ['Pathway to PR', 'Affordable tuition', 'Safe environment', 'Work opportunities'],
  },
  {
    flag: '🇦🇺',
    name: 'Australia',
    universities: 24,
    slug: 'australia',
    description: 'Known for its excellent education system and beautiful lifestyle. Strong focus on practical learning.',
    students: '65+',
    avgCost: 'AUD 20,000 - 45,000',
    visaSuccess: '94%',
    badges: ['Excellent climate', 'Work while studying', 'Quality of life', 'Diverse programs'],
  },
  {
    flag: '🇩🇪',
    name: 'Germany',
    universities: 12,
    slug: 'germany',
    description: 'Many public universities offer tuition-free education. Strong engineering and technical programs.',
    students: '45+',
    avgCost: '€0 - €20,000',
    visaSuccess: '93%',
    badges: ['Low/No tuition', 'Strong economy', 'Engineering focus', 'Central European location'],
  },
  {
    flag: '🇫🇷',
    name: 'France',
    universities: 30,
    slug: 'france',
    description: 'Affordable education in a culturally rich country. Many English-taught programs available.',
    students: '35+',
    avgCost: '€3,000 - €15,000',
    visaSuccess: '92%',
    badges: ['Affordable tuition', 'Cultural experience', 'English programs', 'EU location'],
  },
  {
    flag: '🇳🇱',
    name: 'Netherlands',
    universities: 7,
    slug: 'netherlands',
    description: 'High-quality English-taught programs in a welcoming international environment.',
    students: '28+',
    avgCost: '€8,000 - €18,000',
    visaSuccess: '95%',
    badges: ['English taught', 'Innovation hub', 'Bike-friendly', 'Central location'],
  },
  {
    flag: '🇮🇪',
    name: 'Ireland',
    universities: 10,
    slug: 'ireland',
    description: 'Tech hub of Europe with strong connections to major companies. Friendly and welcoming culture.',
    students: '25+',
    avgCost: '€10,000 - €25,000',
    visaSuccess: '96%',
    badges: ['Tech industry', 'English speaking', 'Stay-back option', 'EU access'],
  },
  {
    flag: '🇳🇿',
    name: 'New Zealand',
    universities: 10,
    slug: 'new-zealand',
    description: 'Beautiful natural environment with world-class education. Great for outdoor enthusiasts.',
    students: '20+',
    avgCost: 'NZD 22,000 - 35,000',
    visaSuccess: '94%',
    badges: ['Natural beauty', 'Safe country', 'Work rights', 'Adventure activities'],
  },
  {
    flag: '🇸🇬',
    name: 'Singapore',
    universities: 3,
    slug: 'singapore',
    description: 'Asian education hub with top universities. Gateway to Asia with excellent career opportunities.',
    students: '18+',
    avgCost: 'SGD 20,000 - 40,000',
    visaSuccess: '97%',
    badges: ['Asian hub', 'Top universities', 'Multicultural', 'Career opportunities'],
  },
  {
    flag: '🇯🇵',
    name: 'Japan',
    universities: 12,
    slug: 'japan',
    description: 'Combines cutting-edge technology with rich tradition. A growing number of English-taught programs and strong MEXT scholarship support.',
    students: '15+',
    avgCost: '¥600,000 - ¥1,500,000',
    visaSuccess: '91%',
    badges: ['MEXT scholarships', 'Tech & innovation hub', 'Safe, low-crime society', 'Part-time work allowed'],
  },
  {
    flag: '🇲🇾',
    name: 'Malaysia',
    universities: 14,
    slug: 'malaysia',
    description: 'Affordable, high-quality education with many UK and Australian branch campuses. A popular, budget-friendly gateway into Asia.',
    students: '22+',
    avgCost: 'RM 15,000 - 40,000',
    visaSuccess: '96%',
    badges: ['Branch campuses', 'Low cost of living', 'Multicultural society', 'English-taught programs'],
  },
  {
    flag: '🇦🇪',
    name: 'United Arab Emirates',
    universities: 9,
    slug: 'united-arab-emirates',
    description: 'A fast-growing global education hub with international branch campuses in Dubai and Abu Dhabi, close to home with tax-free living.',
    students: '10+',
    avgCost: 'AED 40,000 - 90,000',
    visaSuccess: '93%',
    badges: ['International branch campuses', 'Tax-free income', 'Modern infrastructure', 'Strategic global hub'],
  },
  {
    flag: '🇦🇹',
    name: 'Austria',
    universities: 8,
    slug: 'austria',
    description: 'Low tuition fees at public universities and a high standard of living in the heart of Europe.',
    students: '8+',
    avgCost: '€1,500 - €12,000',
    visaSuccess: '92%',
    badges: ['Low tuition', 'Central European location', 'High quality of life', 'Strong engineering programs'],
  },
  {
    flag: '🇧🇪',
    name: 'Belgium',
    universities: 10,
    slug: 'belgium',
    description: "Home to top-ranked universities and the political heart of the EU, with many English-taught master's programmes.",
    students: '7+',
    avgCost: '€900 - €15,000',
    visaSuccess: '91%',
    badges: ['EU political hub', "English-taught master's", 'Central location', 'Strong research output'],
  },
  {
    flag: '🇨🇾',
    name: 'Cyprus',
    universities: 6,
    slug: 'cyprus',
    description: 'A compact, English-friendly EU destination with lower tuition costs and a Mediterranean lifestyle.',
    students: '5+',
    avgCost: '€6,000 - €12,000',
    visaSuccess: '94%',
    badges: ['EU member state', 'English-taught degrees', 'Affordable living', 'Mediterranean climate'],
  },
  {
    flag: '🇨🇿',
    name: 'Czech Republic',
    universities: 9,
    slug: 'czech-republic',
    description: "Historic universities in Prague and beyond offer low tuition and one of Europe's most affordable costs of living.",
    students: '6+',
    avgCost: '€0 - €10,000',
    visaSuccess: '92%',
    badges: ['Low cost of living', 'Free public tuition (Czech-taught)', 'Central European hub', 'Rich history'],
  },
  {
    flag: '🇫🇮',
    name: 'Finland',
    universities: 7,
    slug: 'finland',
    description: 'World-class education system with a strong focus on research and innovation, and generous scholarship opportunities.',
    students: '6+',
    avgCost: '€4,000 - €18,000',
    visaSuccess: '93%',
    badges: ['Top-ranked education system', 'Scholarship opportunities', 'Innovation & research', 'High quality of life'],
  },
  {
    flag: '🇭🇺',
    name: 'Hungary',
    universities: 8,
    slug: 'hungary',
    description: 'Affordable, high-quality medical and engineering programmes, including the Stipendium Hungaricum scholarship for African students.',
    students: '9+',
    avgCost: '€2,500 - €14,000',
    visaSuccess: '93%',
    badges: ['Stipendium Hungaricum scholarship', 'Strong medical programmes', 'Low cost of living', 'Central European location'],
  },
  {
    flag: '🇮🇹',
    name: 'Italy',
    universities: 11,
    slug: 'italy',
    description: 'Home to some of the world\'s oldest universities, with generous regional scholarships that can cover tuition and living costs.',
    students: '8+',
    avgCost: '€900 - €4,000',
    visaSuccess: '90%',
    badges: ['Regional scholarships', 'Rich cultural heritage', 'Low public tuition', 'Renowned art & design schools'],
  },
  {
    flag: '🇲🇹',
    name: 'Malta',
    universities: 5,
    slug: 'malta',
    description: 'An English-speaking EU island nation offering a safe, sunny base for study with a growing number of English-taught programmes.',
    students: '3+',
    avgCost: '€6,000 - €13,000',
    visaSuccess: '94%',
    badges: ['English-speaking EU state', 'Safe island nation', 'Mediterranean lifestyle', 'Growing student community'],
  },
  {
    flag: '🇵🇱',
    name: 'Poland',
    universities: 10,
    slug: 'poland',
    description: 'A rapidly growing study destination with affordable English-taught medical and engineering degrees.',
    students: '7+',
    avgCost: '€2,000 - €12,000',
    visaSuccess: '91%',
    badges: ['Affordable medical degrees', 'English-taught programmes', 'Growing EU economy', 'Low cost of living'],
  },
  {
    flag: '🇪🇸',
    name: 'Spain',
    universities: 13,
    slug: 'spain',
    description: 'Vibrant culture and lifestyle with affordable public university tuition and a growing number of English-taught programmes.',
    students: '9+',
    avgCost: '€750 - €9,000',
    visaSuccess: '90%',
    badges: ['Affordable public tuition', 'Vibrant culture', 'Growing English programmes', 'EU access'],
  },
  {
    flag: '🇵🇹',
    name: 'Portugal',
    universities: 9,
    slug: 'portugal',
    description: 'A welcoming, affordable EU destination with a warm climate and an increasing number of English-taught degrees.',
    students: '5+',
    avgCost: '€1,000 - €7,000',
    visaSuccess: '92%',
    badges: ['Affordable EU tuition', 'Warm climate', 'Welcoming culture', 'EU work rights'],
  },
  {
    flag: '🇨🇭',
    name: 'Switzerland',
    universities: 6,
    slug: 'switzerland',
    description: "World-leading hospitality, business, and engineering programmes in one of the world's safest and most prosperous countries.",
    students: '4+',
    avgCost: 'CHF 1,500 - 35,000',
    visaSuccess: '89%',
    badges: ['World-class hospitality schools', 'Strong job market', 'High safety & quality of life', 'Central European hub'],
  },
  {
    flag: '🇹🇷',
    name: 'Turkey',
    universities: 8,
    slug: 'turkey',
    description: 'A rapidly growing, affordable study destination bridging Europe and Asia, with government-funded Türkiye Scholarships available.',
    students: '6+',
    avgCost: '$2,000 - $8,000',
    visaSuccess: '93%',
    badges: ['Türkiye Scholarships', 'Affordable tuition', 'Bridges Europe & Asia', 'Growing university rankings'],
  },
  {
    flag: '🇨🇳',
    name: 'China',
    universities: 10,
    slug: 'china',
    description: 'One of the largest providers of the Chinese Government Scholarship, with modern campuses and a growing number of English-taught programmes.',
    students: '12+',
    avgCost: '¥20,000 - ¥40,000',
    visaSuccess: '92%',
    badges: ['Chinese Government Scholarship', 'Modern infrastructure', 'Growing global rankings', 'Affordable living costs'],
  },
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CountriesPage() {
  const [supabaseCountries, setSupabaseCountries] = useState<Country[]>([]);
  const [uniCounts, setUniCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const supabase = createClient();
        const [{ data }, { data: uniRows }] = await Promise.all([
          supabase
            .from('study_countries')
            .select('id, name, code, flag_emoji, description, image_url, display_order')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
          supabase.from('universities').select('country_id').eq('is_active', true).eq('is_partner', true).limit(5000),
        ]);
        if (data && data.length > 0) {
          setSupabaseCountries(data);
        }
        const tally: Record<string, number> = {};
        (uniRows || []).forEach((u: { country_id: string | null }) => {
          if (u.country_id) tally[u.country_id] = (tally[u.country_id] || 0) + 1;
        });
        setUniCounts(tally);
      } catch {
        // fall back to static
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const usingSupabase = supabaseCountries.length > 0;
  const statsFor = (name: string) => staticCountries.find((c) => c.name.toLowerCase() === name.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-6 transition-colors"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-bold mb-4">Study Destinations</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Explore world-class education opportunities across the globe. We help you find the perfect country that matches your goals, budget, and career aspirations.
          </p>
        </div>
      </div>

      {/* Country Cards */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="bg-gray-100 p-8 border-b-2 border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-40 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-28" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : usingSupabase ? (
          /* Live grid, enriched with the same stats used before countries were in the database */
          <div className="grid md:grid-cols-2 gap-8">
            {supabaseCountries.map((country) => {
              const slug = toSlug(country.name);
              const stats = statsFor(country.name);
              const uniCount = uniCounts[country.id] ?? stats?.universities ?? 0;
              return (
                <div
                  key={country.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 border-b-2 border-indigo-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div><Flag emoji={country.flag_emoji || stats?.flag} code={country.code} width={72} /></div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{country.name}</h2>
                        <p className="text-indigo-600 font-semibold">
                          {uniCount > 0 ? `${uniCount} Partner Universities` : country.code || ''}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{country.description || stats?.description}</p>

                    {stats && (
                      <>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-sm font-bold text-gray-900">{stats.students}</div>
                            <div className="text-xs text-gray-600">Students</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-sm font-bold text-gray-900">{stats.avgCost}</div>
                            <div className="text-xs text-gray-600">Avg. Cost/Year</div>
                          </div>
                          <div className="text-center p-3 bg-white rounded-lg">
                            <div className="text-sm font-bold text-gray-900">{stats.visaSuccess}</div>
                            <div className="text-xs text-gray-600">Visa Success</div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {stats.badges.map((badge) => (
                            <span key={badge} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                              {badge}
                            </span>
                          ))}
                        </div>
                      </>
                    )}

                    <Link
                      href={`/countries/${slug}`}
                      className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Static fallback grid */
          <div className="grid md:grid-cols-2 gap-8">
            {staticCountries.map((country) => (
              <div
                key={country.slug}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 border-b-2 border-indigo-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div><Flag emoji={country.flag} width={72} /></div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{country.name}</h2>
                        <p className="text-indigo-600 font-semibold">{country.universities} Partner Universities</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">{country.description}</p>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600 mx-auto mb-1" aria-hidden="true">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><path d="M16 3.128a4 4 0 0 1 0 7.744" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="9" cy="7" r="4" />
                      </svg>
                      <div className="text-sm font-bold text-gray-900">{country.students}</div>
                      <div className="text-xs text-gray-600">Students</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600 mx-auto mb-1" aria-hidden="true">
                        <line x1="12" x2="12" y1="2" y2="22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                      <div className="text-sm font-bold text-gray-900">{country.avgCost}</div>
                      <div className="text-xs text-gray-600">Avg. Cost/Year</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-indigo-600 mx-auto mb-1" aria-hidden="true">
                        <path d="M10 12h4" /><path d="M10 8h4" /><path d="M14 21v-3a2 2 0 0 0-4 0v3" /><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" /><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
                      </svg>
                      <div className="text-sm font-bold text-gray-900">{country.visaSuccess}</div>
                      <div className="text-xs text-gray-600">Visa Success</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {country.badges.map((badge) => (
                      <span key={badge} className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full font-medium">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/countries/${country.slug}`}
                    className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not Sure Which Country is Right for You?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Book a free consultation with our expert counselors to find your perfect study destination
          </p>
          <Link
            href="/booking"
            className="inline-block bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
          >
            Book Free Consultation
          </Link>
        </div>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
