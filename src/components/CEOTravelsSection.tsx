'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface TravelPhoto { id: string; title: string; description: string | null; image_url: string | null; }

function Lightbox({ photo, onClose }: { photo: TravelPhoto; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-indigo-900/95 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={photo.title}>
      <button onClick={onClose} aria-label="Close photo" className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-gold-400 hover:text-indigo-900 text-white text-xl">✕</button>
      <img src={photo.image_url!} alt={photo.title} className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl" onClick={(e) => e.stopPropagation()} />
      <div className="mt-5 text-center max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <p className="font-display text-xl text-white">{photo.title}</p>
        {photo.description && <p className="text-indigo-200 text-sm mt-2">{photo.description}</p>}
      </div>
    </div>
  );
}

/** preview = homepage scroll rail. Without it: full gallery for /ceo-travels. Photos are managed in admin (content_type 'travel'). */
export default function CEOTravelsSection({ preview = false }: { preview?: boolean }) {
  const [photos, setPhotos] = useState<TravelPhoto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState<TravelPhoto | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await createClient()
          .from('content_items').select('id, title, description, image_url')
          .eq('content_type', 'travel').eq('is_published', true)
          .order('display_order', { ascending: true });
        if (data) setPhotos(data.filter((p) => p.image_url));
      } catch { /* stays empty */ }
      setLoaded(true);
    })();
  }, []);

  if (preview && photos.length === 0) return null;
  const list = preview ? photos.slice(0, 8) : photos;

  const Card = ({ p, i }: { p: TravelPhoto; i: number }) => (
    <button
      type="button" onClick={() => setActive(p)} aria-label={`View photo: ${p.title}`}
      className={`group relative overflow-hidden rounded-[1.75rem] bg-indigo-800 text-left ring-1 ring-white/10 ${
        preview ? 'shrink-0 snap-start w-[76vw] sm:w-[330px] aspect-[3/4]' : `aspect-[4/5] ${i === 0 ? 'lg:col-span-2 lg:row-span-2 lg:aspect-auto' : ''}`
      }`}
    >
      <img src={p.image_url!} alt={p.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 via-indigo-900/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="block h-[3px] w-10 bg-gold-400 mb-4 transition-all duration-500 group-hover:w-20" />
        <p className="font-display text-white text-lg md:text-xl font-semibold leading-snug">{p.title}</p>
        {p.description && <p className="text-indigo-200 text-sm mt-2 line-clamp-2">{p.description}</p>}
      </div>
    </button>
  );

  return (
    <section id="ceo-travels" className={preview ? 'py-28 bg-indigo-900' : 'pb-28 bg-indigo-900'}>
      <div className="max-w-7xl mx-auto px-6">
        {preview && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-4xl md:text-6xl font-semibold text-white">CEO Travels</h2>
              <p className="mt-4 text-lg text-indigo-200 max-w-xl">On the ground at partner universities and education events around the world, building the relationships that open doors for you.</p>
            </div>
            <a href="/ceo-travels" className="self-start md:self-auto shrink-0 bg-gold-400 text-indigo-900 font-bold px-7 py-3.5 rounded-full hover:bg-gold-300">See all travels</a>
          </div>
        )}
        {!loaded ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">{[...Array(3)].map((_, i) => <div key={i} className="aspect-[4/5] rounded-[1.75rem] bg-indigo-800 animate-pulse" />)}</div>
        ) : list.length === 0 ? (
          <p className="text-indigo-200 text-lg">New travel photos are coming soon.</p>
        ) : preview ? (
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{list.map((p, i) => <Card key={p.id} p={p} i={i} />)}</div>
        )}
      </div>
      {active && <Lightbox photo={active} onClose={() => setActive(null)} />}
    </section>
  );
}
