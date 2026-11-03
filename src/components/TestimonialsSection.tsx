'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getVideoSource } from '@/lib/video';
import Flag from '@/components/Flag';

interface Testimonial {
  id: string;
  student_name: string;
  university: string;
  destination: string;
  video_url: string | null;
  thumbnail_url: string | null;
  quote: string | null;
  display_order: number;
}

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 fill-yellow-400 text-yellow-400">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

const staticTestimonials = [
  { id: 's1', student_name: 'Gifty Sarpong', destination: 'Now in USA', university: 'Hellenic American University', video_url: null, thumbnail_url: null, quote: 'Mr. Solomon Opoku was very helpful and gave me excellent choices of Universities that fit my budget and future education path. Very informative, knowledgeable, and professional!', display_order: 0 },
  { id: 's2', student_name: 'Joel Nana Appiah Obeng', destination: 'Now in USA', university: 'Fisher College - Boston, Massachusetts', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd gave me valuable advice and made the application process easier. Good people doing good deeds deserve recognition!', display_order: 1 },
  { id: 's3', student_name: 'Lawrencia Yeboah', destination: 'Now in USA', university: 'Weber State University - Utah', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd is proactive, detail-oriented, and trustworthy. They made my study abroad dream a breeze. I highly recommend them!', display_order: 2 },
  { id: 's4', student_name: 'Michael Odame', destination: 'Now in USA', university: 'Weber State University - Utah', video_url: null, thumbnail_url: null, quote: "The Psyche Consult Ghana Ltd made my travelling abroad incredibly convenient. I'm thrilled with the all-in-one support for my admission, scholarship, and visa!", display_order: 3 },
  { id: 's5', student_name: 'Alexander Dumakor', destination: 'Now in Canada', university: 'Trent University', video_url: null, thumbnail_url: null, quote: 'I got my Canadian visa through The Psyche Consult Ghana Ltd Team. They guided me through all the process. I recommend them to anyone who would like quality education abroad.', display_order: 4 },
  { id: 's6', student_name: 'Kinsky', destination: 'Now in UK', university: 'University of Huddersfield', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd really helped me achieve my aim of coming to the UK. I recommend them to everyone who would like to work or study abroad.', display_order: 5 },
  { id: 's7', student_name: 'Rita Owiredu', destination: 'Now in UK', university: 'Brunel University - London', video_url: null, thumbnail_url: null, quote: 'If you want to study outside the country, look no further than The Psyche Consult Ghana Ltd. Today, with their help, I am in the UK!', display_order: 6 },
  { id: 's8', student_name: 'Nana Kwame Sarfo', destination: 'Now in USA', university: 'Weber State University', video_url: null, thumbnail_url: null, quote: 'I am a proud product of The Psyche Consult Ghana Ltd. I had a warm reception and was walked through the entire process to pursue studies in the United States.', display_order: 7 },
];

const destinationEmoji: Record<string, string> = {
  'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'Germany': '🇩🇪',
};

function getFlag(destination: string) {
  for (const [key, flag] of Object.entries(destinationEmoji)) {
    if (destination.includes(key)) return flag;
  }
  return '🎓';
}

function VideoModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const source = getVideoSource(url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="aspect-video w-full">
          {source.kind === 'file' ? (
            <video src={source.url} controls autoPlay playsInline preload="auto" className="w-full h-full" title={`${name} testimonial`} />
          ) : (
            <iframe src={source.embedUrl} title={`${name} testimonial`} className="w-full h-full" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
          )}
        </div>
        <div className="p-4 bg-gray-900">
          <p className="text-white font-semibold">{name}&apos;s Testimonial</p>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const [videoTestimonials, setVideoTestimonials] = useState<Testimonial[]>([]);
  const [activeVideo, setActiveVideo] = useState<Testimonial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_published', true)
          .order('display_order', { ascending: true });
        if (data && data.length > 0) setVideoTestimonials(data);
      } catch {
        // silently fall back to static
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const videoItems = videoTestimonials.filter((t) => t.video_url);
  const textItems = videoTestimonials.filter((t) => !t.video_url);
  const displayTextItems = textItems.length > 0 ? textItems : staticTestimonials;
  // Repeat short lists so the endless row never shows a gap
  const loopItems = displayTextItems.length >= 8 ? displayTextItems : Array.from({ length: Math.ceil(8 / displayTextItems.length) }, () => displayTextItems).flat();

  return (
    <section className="py-24 bg-white" id="testimonials">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Success Stories</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from students who achieved their dreams with our help
          </p>
        </div>

        {/* Video Testimonials */}
        {!loading && videoItems.length > 0 && (
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              </span>
              Video Testimonials
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoItems.map((t) => (
                <div key={t.id} className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 aspect-video cursor-pointer shadow-lg hover:shadow-xl transition-all hover:-translate-y-1" onClick={() => setActiveVideo(t)}>
                  {(() => {
                    const src = getVideoSource(t.video_url!);
                    const poster = t.thumbnail_url || src.thumbnail;
                    if (poster) return <img src={poster} alt={`${t.student_name} video thumbnail`} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity" />;
                    if (src.kind === 'file') return <video src={`${src.url}#t=0.5`} preload="metadata" muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none" />;
                    return <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900" />;
                  })()}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors border-2 border-white/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-white font-bold text-sm">{t.student_name}</p>
                      <p className="text-white/80 text-xs">{t.university}</p>
                      <span className="inline-block mt-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">{getFlag(t.destination)} {t.destination}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Written testimonials: a slow, endless row of quote cards (pauses on hover, scrolls by hand if motion is reduced) */}
        <div className="marquee -mx-6" aria-label="Student testimonials">
          <div className="marquee-track gap-6 px-3" style={{ ['--marquee-duration' as string]: '110s' }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-stretch gap-6" aria-hidden={copy === 1}>
                {loopItems.map((t, i) => {
                  const flag = getFlag(t.destination);
                  return (
                    <figure
                      key={`${copy}-${t.id}-${i}`}
                      className="relative flex w-[300px] sm:w-[360px] flex-col rounded-3xl bg-white p-7 sm:p-8 ring-1 ring-indigo-100 shadow-sm"
                    >
                      <span className="absolute right-6 top-3 font-display text-7xl leading-none text-gold-400/70 select-none" aria-hidden>&rdquo;</span>
                      <div className="mb-4 flex gap-1" aria-label="5 out of 5 stars">
                        {[...Array(5)].map((_, k) => <StarIcon key={k} />)}
                      </div>
                      <blockquote className="flex-1 text-[15px] leading-relaxed text-gray-700 whitespace-normal">{t.quote}</blockquote>
                      <figcaption className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5 whitespace-normal">
                        <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-indigo-900 font-bold text-gold-300 ring-2 ring-gold-400/60">
                          {t.student_name.charAt(0)}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold text-gray-900">{t.student_name}</span>
                          <span className="block text-xs text-gray-500">{t.university}</span>
                          <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                            {flag !== '🎓' && <Flag emoji={flag} width={16} />}
                            {t.destination}
                          </span>
                        </span>
                      </figcaption>
                    </figure>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeVideo && (
        <VideoModal url={activeVideo.video_url!} name={activeVideo.student_name} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}
