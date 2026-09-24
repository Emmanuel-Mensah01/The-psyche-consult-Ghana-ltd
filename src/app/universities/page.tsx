'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase/client';
import Flag from '@/components/Flag';

interface Country {
  id: string;
  name: string;
  flag_emoji: string | null;
}
interface Uni {
  id: string;
  name: string;
  region: string | null;
  country_id: string | null;
  display_order: number | null;
}

// Same order as the original site; anything else (new regions added later) is appended A–Z.
const REGION_ORDER = [
  'AUSTRALIA & NEW ZEALAND',
  'CANADA',
  'USA',
  'JAPAN',
  'MALAYSIA',
  'SINGAPORE',
  'UAE',
  'EUROPE - AUSTRIA',
  'EUROPE - BELGIUM',
  'EUROPE - CYPRUS',
  'EUROPE - CZECH REPUBLIC',
  'EUROPE - FINLAND',
  'EUROPE - FRANCE',
  'EUROPE - GERMANY',
  'EUROPE - HUNGARY',
  'EUROPE - ITALY',
  'EUROPE - MALTA',
  'EUROPE - NETHERLANDS',
  'EUROPE - POLAND',
  'EUROPE - SPAIN & PORTUGAL',
  'EUROPE - SWITZERLAND',
  'EUROPE - TURKEY',
  'UK & IRELAND',
  'CHINA',
  'OTHERS',
];

export default function UniversitiesPage() {
  const [unis, setUnis] = useState<Uni[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<Set<string>>(new Set());

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const [u, c] = await Promise.all([
          supabase
            .from('universities')
            .select('id, name, region, country_id, display_order')
            .eq('is_active', true)
            .eq('is_partner', true)
            .order('display_order', { ascending: true })
            .limit(2000),
          supabase.from('study_countries').select('id, name, flag_emoji').limit(500),
        ]);
        setUnis(u.data || []);
        setCountries(c.data || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const countryById = useMemo(() => new Map(countries.map((c) => [c.id, c])), [countries]);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, Uni[]>();
    unis.forEach((u) => {
      const country = u.country_id ? countryById.get(u.country_id) : undefined;
      if (q && !u.name.toLowerCase().includes(q) && !(country?.name || '').toLowerCase().includes(q)) return;
      const key = (u.region || country?.name || 'OTHERS').toUpperCase();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(u);
    });
    const keys = Array.from(map.keys()).sort((a, b) => {
      const ia = REGION_ORDER.indexOf(a);
      const ib = REGION_ORDER.indexOf(b);
      if (ia === -1 && ib === -1) return a.localeCompare(b);
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });
    return keys.map((k) => ({ region: k, items: map.get(k)! }));
  }, [unis, countryById, query]);

  // Open the first group by default (matches the original page)
  useEffect(() => {
    if (!loading && open.size === 0 && groups.length > 0) setOpen(new Set([groups[0].region]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const toggle = (r: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(r)) next.delete(r);
      else next.add(r);
      return next;
    });

  const searching = query.trim().length > 0;
  const total = unis.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-indigo-200 hover:text-white mb-6 transition-colors">
            ← Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Partner Universities</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            We have direct partnerships with {total > 0 ? `${total}+` : '452+'} institutions worldwide, providing you with
            diverse opportunities for quality education across the globe.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a university or country…"
          className="w-full mb-8 px-5 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none bg-white"
        />

        {loading ? (
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-xl animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-500 py-16">No universities found.</p>
        ) : (
          <div className="space-y-3">
            {groups.map(({ region, items }) => {
              const isOpen = searching || open.has(region);
              return (
                <div key={region} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggle(region)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{region}</h2>
                      <p className="text-sm text-gray-500">
                        {items.length} {items.length === 1 ? 'university' : 'universities'}
                      </p>
                    </div>
                    <span className={`text-indigo-600 text-xl transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
                  </button>

                  {isOpen && (
                    <div className="grid sm:grid-cols-2 gap-3 px-6 pb-6">
                      {items.map((u) => {
                        const c = u.country_id ? countryById.get(u.country_id) : undefined;
                        return (
                          <div key={u.id} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <h3 className="font-semibold text-gray-900 text-sm">{u.name}</h3>
                            {c && (
                              <p className="text-xs text-gray-500 mt-1">
                                <Flag emoji={c.flag_emoji} width={16} className="mr-1.5 align-[-2px]" />
                                {c.name}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-10 border-2 border-indigo-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Ready to Apply?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Book a free consultation with our expert counselors to find the perfect university for your goals
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/booking" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all">
              Book Free Consultation
            </Link>
            <Link href="/countries" className="bg-white text-indigo-700 border-2 border-indigo-200 px-8 py-3 rounded-full font-bold hover:border-indigo-400 transition-all">
              Explore Countries
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
