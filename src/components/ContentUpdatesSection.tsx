'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getVideoSource } from '@/lib/video';

interface ContentItem {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  image_url: string | null;
  link_url: string | null;
  display_order: number;
  expires_at: string | null;
}

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  announcement: { icon: '📢', color: 'text-blue-700', bg: 'bg-blue-100' },
  scholarship: { icon: '🎓', color: 'text-purple-700', bg: 'bg-purple-100' },
  event: { icon: '📅', color: 'text-green-700', bg: 'bg-green-100' },
  promo: { icon: '🎉', color: 'text-orange-700', bg: 'bg-orange-100' },
  video: { icon: '🎬', color: 'text-rose-700', bg: 'bg-rose-100' },
  flyer: { icon: '📋', color: 'text-indigo-700', bg: 'bg-indigo-100' },
};

const staticItems: ContentItem[] = [
  { id: 'static-1', title: 'Scholarship Applications Now Open 2026', description: 'Apply now for full and partial scholarships to top universities in the USA, UK, and Canada. Limited slots available!', content_type: 'scholarship', image_url: null, link_url: null, display_order: 1, expires_at: null },
  { id: 'static-2', title: 'Free Visa Counselling Workshop', description: 'Join our free workshop on student visa applications. Learn tips and tricks from our expert advisors.', content_type: 'event', image_url: null, link_url: null, display_order: 2, expires_at: null },
  { id: 'static-3', title: 'New Partner Universities Added', description: 'We have added 15 new partner universities in Australia and Germany. Explore your options today!', content_type: 'announcement', image_url: null, link_url: null, display_order: 3, expires_at: null },
];

function PlayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function VideoModal({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const source = getVideoSource(item.link_url || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={item.title}>
      <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close video" className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        </button>
        <div className="aspect-video w-full bg-black">
          {source.kind === 'file' ? (
            <video src={source.url} poster={item.image_url || undefined} controls autoPlay playsInline preload="auto" className="w-full h-full" title={item.title}>
              Your browser does not support video playback.
            </video>
          ) : (
            <iframe src={source.embedUrl} title={item.title} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          )}
        </div>
        <div className="p-4 bg-gray-900">
          <p className="text-white font-semibold">{item.title}</p>
          {item.description && <p className="text-gray-300 text-sm mt-1">{item.description}</p>}
        </div>
      </div>
    </div>
  );
}

function VideoThumb({ item, onPlay }: { item: ContentItem; onPlay: () => void }) {
  const source = item.link_url ? getVideoSource(item.link_url) : null;
  // Poster priority: admin-supplied thumbnail, then YouTube's auto thumbnail, then first frame of the file itself.
  const poster = item.image_url || (source && source.thumbnail) || null;

  return (
    <button type="button" onClick={onPlay} aria-label={`Play video: ${item.title}`} className="group relative block w-full aspect-video overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 text-left">
      {poster ? (
        <img src={poster} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      ) : source && source.kind === 'file' ? (
        <video src={`${source.url}#t=0.5`} preload="metadata" muted playsInline className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
      ) : null}
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-16 h-16 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/60 group-hover:bg-white/40 group-hover:scale-110 transition-all">
          <PlayIcon />
        </div>
      </div>
    </button>
  );
}

export default function ContentUpdatesSection() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<ContentItem | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('content_items')
          .select('id, title, description, content_type, image_url, link_url, display_order, expires_at')
          .eq('is_published', true)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) {
          const now = new Date();
          const active = data.filter((item) => !item.expires_at || new Date(item.expires_at) > now);
          setItems(active);
        } else {
          setItems(staticItems);
        }
      } catch {
        setItems(staticItems);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Latest Updates</h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">Stay informed about scholarships, events, and opportunities</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const type = typeConfig[item.content_type] || typeConfig['announcement'];
            const isVideo = item.content_type === 'video' && !!item.link_url;
            return (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 border border-white">
                {isVideo ? (
                  <VideoThumb item={item} onPlay={() => setActiveVideo(item)} />
                ) : item.image_url ? (
                  <div className="aspect-video overflow-hidden">
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`aspect-video flex items-center justify-center text-6xl ${type.bg} bg-opacity-30`}>
                    {type.icon}
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${type.bg} ${type.color}`}>
                      {type.icon} {item.content_type.charAt(0).toUpperCase() + item.content_type.slice(1)}
                    </span>
                    {item.expires_at && (
                      <span className="text-xs text-orange-600 font-medium">
                        Ends {new Date(item.expires_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug">{item.title}</h3>
                  {item.description && <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>}
                  {isVideo ? (
                    <button type="button" onClick={() => setActiveVideo(item)} className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                      Watch Video
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                    </button>
                  ) : (
                    item.link_url && (
                      <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                        Learn More
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                      </a>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {activeVideo && <VideoModal item={activeVideo} onClose={() => setActiveVideo(null)} />}
    </section>
  );
}
