'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface University {
  id: string;
  name: string;
  location: string | null;
  ranking: string | null;
  display_order: number;
}

const staticUniversities = [
  'The University of Sydney',
  'University of Toronto',
  'Stanford University',
  'University of Oxford',
  'University of Cambridge',
  'University of Auckland',
  'Arizona State University',
  'University of Birmingham',
  'Trinity College Dublin',
  'University of Amsterdam',
  'Politecnico di Milano',
  'University of British Columbia',
  'University of Manchester',
  'American University of Dubai',
  'National University of Singapore',
];

export default function UniversitiesSection() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const supabase = createClient();
        const [dataResult, countResult] = await Promise.all([
          supabase
            .from('universities')
            .select('id, name, location, ranking, display_order')
            .eq('is_active', true)
            .eq('is_partner', true)
            .order('display_order', { ascending: true })
            .limit(15),
          supabase
            .from('universities')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)
            .eq('is_partner', true),
        ]);
        const data = dataResult.data;
        const count = countResult.count;
        if (data && data.length > 0) {
          setUniversities(data);
          setTotalCount(count);
        }
      } catch {
        // fall back to static
      } finally {
        setLoading(false);
      }
    };
    fetchUniversities();
  }, []);

  const displayNames: string[] =
    universities.length > 0
      ? universities.map((u) => u.name)
      : staticUniversities;

  const displayCount = totalCount !== null && totalCount > 0 ? `${totalCount}+` : '452+';

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Partner Universities</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Direct partnerships with {displayCount} top institutions worldwide
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl h-20 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
            {displayNames.map((uni) => (
              <div
                key={uni}
                className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200 flex items-center justify-center text-center hover:border-indigo-300 transition-all"
              >
                <p className="font-semibold text-gray-700 text-sm">{uni}</p>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          <a
            href="/universities"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            View All {displayCount} Partner Universities
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
