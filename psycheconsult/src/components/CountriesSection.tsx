'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Country {
  id: string;
  name: string;
  flag_emoji: string | null;
  display_order: number;
}

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
  { flag: '🇸🇬', name: 'Singapore', universities: 3, slug: 'singapore' },
];

function toSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function CountriesSection() {
  const [supabaseCountries, setSupabaseCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('study_countries')
          .select('id, name, flag_emoji, display_order')
          .eq('is_active', true)
          .order('display_order', { ascending: true })
          .limit(10);
        if (data && data.length > 0) {
          setSupabaseCountries(data);
        }
      } catch {
        // fall back to static
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const usingSupabase = supabaseCountries.length > 0;

  return (
    <section id="countries" className="py-24 bg-gray-50">
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
              <div key={i} className="bg-white rounded-xl h-28 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : usingSupabase ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {supabaseCountries.map((country) => (
              <a
                key={country.id}
                href={`/countries/${toSlug(country.name)}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 text-center group"
              >
                <div className="text-5xl mb-3">{country.flag_emoji || '🌍'}</div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600 text-sm">{country.name}</h3>
              </a>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {staticCountries.map((country) => (
              <a
                key={country.slug}
                href={`/countries/${country.slug}`}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 text-center group"
              >
                <div className="text-5xl mb-3">{country.flag}</div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-indigo-600">{country.name}</h3>
                <p className="text-sm text-gray-600">{country.universities} Universities</p>
              </a>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href="/countries"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all transform hover:scale-105"
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
