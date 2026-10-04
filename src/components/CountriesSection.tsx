'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Flag from '@/components/Flag';

interface Country {
  id: string;
  name: string;
  flag_emoji: string | null;
  display_order: number;
  is_featured?: boolean | null;
}

// Counts shown on the original site; used as a floor until every partner school is loaded in the database.
const staticCountries = [
  { flag: '🇺🇸', name: 'United States', universities: 108, slug: 'united-states' },
  { flag: '🇬🇧', name: 'United Kingdom', universities: 144, slug: 'united-kingdom' },
  { flag: '🇨🇦', name: 'Canada', universities: 47, slug: 'canada' },
  { flag: '🇦🇺', name: 'Australia', universities: 24, slug: 'australia' },
  { flag: '🇩🇪', name: 'Germany', universities: 12, slug: 'germany' },
  { flag: '🇫🇷', name: 'France', universities: 30, slug: 'france' },
  { flag: '🇳🇱', name: 'Netherlands', universities: 7, slug: 'netherlands' },
  { flag: '🇮🇪', name: 'Ireland', universities: 10, slug: 'ireland' },
  { flag: '🇳🇿', name: 'New Zealand', universities: 10, slug: 'new-zealand' },
  { flag: '🇪🇸', name: 'Spain', universities: 23, slug: 'spain' },
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CountriesSection() {
  const [dbCountries, setDbCountries] = useState<Country[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const supabase = createClient();
        const [cRes, uRes] = await Promise.all([
          supabase
            .from('study_countries')
            .select('id, name, flag_emoji, display_order, is_featured')
            .eq('is_active', true)
            .order('display_order', { ascending: true }),
          supabase.from('universities').select('country_id').eq('is_active', true).eq('is_partner', true).limit(5000),
        ]);
        const all = cRes.data || [];
        const featured = all.filter((c) => c.is_featured);
        const base = (featured.length > 0 ? featured : all).filter((c) => c.name.toLowerCase() !== 'singapore');
        const spain = all.find((c) => c.name.toLowerCase() === 'spain');
        if (spain && !base.some((c) => c.id === spain.id)) base.push(spain);
        setDbCountries(base.slice(0, 10));

        const tally: Record<string, number> = {};
        (uRes.data || []).forEach((u: { country_id: string | null }) => {
          if (u.country_id) tally[u.country_id] = (tally[u.country_id] || 0) + 1;
        });
        setCounts(tally);
      } catch {
        // fall back to static
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const staticFor = (name: string) => staticCountries.find((c) => c.name.toLowerCase() === name.toLowerCase());

  const cards =
    dbCountries.length > 0
      ? dbCountries.map((c) => ({
          key: c.id,
          flag: c.flag_emoji || staticFor(c.name)?.flag || '🌍',
          name: c.name,
          slug: toSlug(c.name),
          universities: counts[c.id] || 0,
        }))
      : staticCountries.map((c) => ({ key: c.slug, flag: c.flag, name: c.name, slug: c.slug, universities: c.universities }));

  return (
    <section id="countries" className="py-28 bg-indigo-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Study Destinations</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We help students gain admission to top universities worldwide
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-indigo-100 rounded-2xl h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {cards.filter((c) => c.universities > 0).map((country) => (
              <a
                key={country.key}
                href={`/countries/${country.slug}`}
                className="group relative overflow-hidden rounded-2xl bg-indigo-900 p-6 text-left ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:ring-gold-400/60 hover:shadow-2xl hover:shadow-indigo-900/30"
              >
                <div className="mb-8 flex justify-between items-start"><Flag emoji={country.flag} width={64} /><span className="text-gold-400 text-xl transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden>↗</span></div>
                <h3 className="font-display text-xl font-semibold text-white mb-1">{country.name}</h3>
                <p className="text-sm text-gold-300">{country.universities} partner universities</p>
              </a>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href="/countries"
            className="inline-flex items-center gap-2 bg-indigo-900 text-white px-8 py-3.5 rounded-full font-bold hover:bg-gold-500 hover:text-indigo-900 transition-all transform hover:scale-105"
          >
            Explore All Countries
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

