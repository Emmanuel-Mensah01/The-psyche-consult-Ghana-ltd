'use client';
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Flag from '@/components/Flag';
import { createClient } from '@/lib/supabase/client';
import { countryInfo } from '@/lib/countryInfo';

interface DbCountry {
  id: string;
  name: string;
  flag_emoji: string | null;
  description: string | null;
}
interface Uni {
  id: string;
  name: string;
}

const toSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export default function CountryDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug || '').toString();
  const info = countryInfo[slug];

  const [country, setCountry] = useState<DbCountry | null>(null);
  const [unis, setUnis] = useState<Uni[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data: countries } = await supabase
          .from('study_countries')
          .select('id, name, flag_emoji, description')
          .eq('is_active', true);
        const match = (countries || []).find((c) => toSlug(c.name) === slug) || null;
        setCountry(match);
        if (match) {
          const { data } = await supabase
            .from('universities')
            .select('id, name')
            .eq('country_id', match.id)
            .eq('is_active', true)
            .eq('is_partner', true)
            .order('name', { ascending: true })
            .limit(1000);
          setUnis(data || []);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? unis.filter((u) => u.name.toLowerCase().includes(q)) : unis;
  }, [unis, query]);

  const name = info?.name || country?.name || 'Study Destination';
  const flag = info?.flag || country?.flag_emoji || '🌍';
  const overview = info?.overview || country?.description || '';

  if (!info && !country && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Destination not found</h1>
        <p className="text-gray-600 mb-6">We could not find that country.</p>
        <Link href="/countries" className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold">
          See all destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white pt-16 pb-14">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/countries" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-8 transition-colors">
            ← All Destinations
          </Link>
          <div className="flex items-center gap-5">
            <Flag emoji={flag} width={96} />
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Study in {name}</h1>
              {info?.tagline && <p className="text-lg text-indigo-100 mt-2">{info.tagline}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {overview && <p className="text-lg text-gray-700 leading-relaxed">{overview}</p>}

        {/* Quick facts */}
        {info && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-5">At a glance</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ['🗣️ Language', info.language],
                ['💱 Currency', info.currency],
                ['🗓️ Intakes', info.intakes.join(' · ')],
                ['🎓 Study length', info.duration],
                ['💰 Tuition (approx.)', info.tuition],
                ['🏠 Living costs (approx.)', info.living],
              ].map(([label, value]) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">{label}</p>
                  <p className="text-sm text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Figures are approximate and change from year to year and school to school. Your counselor confirms exact costs and requirements before you apply.
            </p>
          </section>
        )}

        {info && (
          <>
            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Why study in {name}?</h2>
                <ul className="space-y-2">
                  {info.whyStudy.map((w) => (
                    <li key={w} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-600">✓</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Popular fields of study</h2>
                <div className="flex flex-wrap gap-2">
                  {info.popularFields.map((f) => (
                    <span key={f} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1.5 rounded-full font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Admission requirements</h2>
                <ul className="space-y-2">
                  {info.requirements.map((r) => (
                    <li key={r} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-indigo-500">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Student visa process</h2>
                <ol className="space-y-4">
                  {info.visaSteps.map((s, i) => (
                    <li key={s.title} className="flex gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{s.title}</p>
                        <p className="text-sm text-gray-600">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Working while studying</h2>
                <p className="text-sm text-gray-700">{info.workRights}</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">After graduation</h2>
                <p className="text-sm text-gray-700">{info.postStudy}</p>
              </div>
            </section>
          </>
        )}

        {/* Partner universities */}
        <section>
          <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Our partner universities in {name}</h2>
              {!loading && (
                <p className="text-sm text-gray-500 mt-1">
                  {unis.length} partner {unis.length === 1 ? 'institution' : 'institutions'}
                </p>
              )}
            </div>
            {unis.length > 8 && (
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search universities…"
                className="w-full sm:w-64 px-4 py-2 text-sm rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white"
              />
            )}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : shown.length === 0 ? (
            <p className="text-gray-500 text-sm bg-white rounded-2xl border border-gray-100 p-6">
              {query ? 'No universities match your search.' : 'Partner universities for this destination will be listed here soon.'}
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {shown.map((u) => (
                <div key={u.id} className="bg-white rounded-xl border border-gray-200 p-4 text-sm font-semibold text-gray-900">
                  🎓 {u.name}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* FAQ */}
        {info && info.faqs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common questions</h2>
            <div className="space-y-3">
              {info.faqs.map((f) => (
                <details key={f.q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer">{f.q}</summary>
                  <p className="text-sm text-gray-600 mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 border-2 border-indigo-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to study in {name}?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Speak with a counselor about the right school, intake and budget for you, or start your application in the student portal.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all">
              Book Free Consultation
            </Link>
            <Link
              href="/student-portal/dashboard"
              className="bg-white text-indigo-700 border-2 border-indigo-200 px-8 py-3 rounded-full font-bold hover:border-indigo-400 transition-all"
            >
              Apply in Student Portal
            </Link>
          </div>
        </section>
      </div>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
