'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TravelPhoto {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
}

const INITIAL_COUNT = 6;

function Lightbox({ photo, onClose }: { photo: TravelPhoto; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={photo.title}>
      <button onClick={onClose} aria-label="Close photo" className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
      </button>
      <img src={photo.image_url!} alt={photo.title} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <div className="mt-4 text-center max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="text-white font-semibold">{photo.title}</p>
        {photo.description && <p className="text-gray-300 text-sm mt-1">{photo.description}</p>}
      </div>
    </div>
  );
}

/** A compact photo strip. Renders nothing until at least one photo is published in admin. */
export default function CEOTravelsSection() {
  const [photos, setPhotos] = useState<TravelPhoto[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [active, setActive] = useState<TravelPhoto | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('content_items')
          .select('id, title, description, image_url')
          .eq('content_type', 'travel')
          .eq('is_published', true)
          .order('display_order', { ascending: true });
        if (data) setPhotos(data.filter((p) => p.image_url));
      } catch {
        // section simply stays hidden
      }
    };
    load();
  }, []);

  if (photos.length === 0) return null;
  const visible = showAll ? photos : photos.slice(0, INITIAL_COUNT);

  return (
    <section className="py-20 bg-white" id="ceo-travels">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">CEO Travels</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Moments from our CEO&apos;s visits to universities and events abroad</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {visible.map((p) => (
            <button key={p.id} type="button" onClick={() => setActive(p)} aria-label={`View photo: ${p.title}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100 shadow-sm hover:shadow-lg transition-shadow">
              <img src={p.image_url!} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8 text-left">
                <p className="text-white text-xs md:text-sm font-semibold leading-snug line-clamp-2">{p.title}</p>
              </div>
            </button>
          ))}
        </div>
        {photos.length > INITIAL_COUNT && (
          <div className="text-center mt-8">
            <button onClick={() => setShowAll((v) => !v)} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 border border-indigo-200 px-5 py-2 rounded-xl transition-colors">
              {showAll ? 'Show fewer' : `See all ${photos.length} photos`}
            </button>
          </div>
        )}
      </div>
      {active && <Lightbox photo={active} onClose={() => setActive(null)} />}
    </section>
  );
}
