'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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
};

const staticItems: ContentItem[] = [
  { id: 'static-1', title: 'Scholarship Applications Now Open 2026', description: 'Apply now for full and partial scholarships to top universities in the USA, UK, and Canada. Limited slots available!', content_type: 'scholarship', image_url: null, link_url: null, display_order: 1, expires_at: null },
  { id: 'static-2', title: 'Free Visa Counselling Workshop', description: 'Join our free workshop on student visa applications. Learn tips and tricks from our expert advisors.', content_type: 'event', image_url: null, link_url: null, display_order: 2, expires_at: null },
  { id: 'static-3', title: 'New Partner Universities Added', description: 'We have added 15 new partner universities in Australia and Germany. Explore your options today!', content_type: 'announcement', image_url: null, link_url: null, display_order: 3, expires_at: null },
];

export default function ContentUpdatesSection() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

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
            return (
              <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 border border-white">
                {item.image_url ? (
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
                  {item.link_url && (
                    <a href={item.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                      Learn More
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
