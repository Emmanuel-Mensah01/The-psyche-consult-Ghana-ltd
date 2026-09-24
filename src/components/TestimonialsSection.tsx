'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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
  { id: 's1', student_name: 'Gifty Sarpong', destination: 'Now in USA', university: 'Hawaii Atlantic University', video_url: null, thumbnail_url: null, quote: 'Mr. Solomon Opoku was very helpful and gave me excellent choices of Universities that fit my budget and future education path. Very informative, knowledgeable, and professional!', display_order: 0 },
  { id: 's2', student_name: 'Joel Nana Appiah Obeng', destination: 'Now in USA', university: 'Fisher College - Boston, Massachusetts', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd gave me valuable advice and made the application process easier. Good people doing good deeds deserve recognition!', display_order: 1 },
  { id: 's3', student_name: 'Lawrencia Yeboah', destination: 'Now in USA', university: 'Weber State University - Utah', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd is proactive, detail-oriented, and trustworthy. They made my study abroad dream a breeze. I highly recommend them!', display_order: 2 },
  { id: 's4', student_name: 'Michael Odame', destination: 'Now in USA', university: 'Weber State University - Utah', video_url: null, thumbnail_url: null, quote: "The Psyche Consult Ghana Ltd made my travelling abroad incredibly convenient. I'm thrilled with the all-in-one support for my admission, scholarship, and visa!", display_order: 3 },
  { id: 's5', student_name: 'Alexander Dumakor', destination: 'Now in Canada', university: 'Trent University', video_url: null, thumbnail_url: null, quote: 'I got my Canadian visa through The Psyche Consult Ghana Ltd Team. They guided me through all the process. I recommend them to anyone who would like quality education abroad.', display_order: 4 },
  { id: 's6', student_name: 'Kinsky', destination: 'Now in UK', university: 'University of Huddersfield', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd really helped me achieve my aim of coming to the UK. I recommend them to everyone who would like to work or study abroad.', display_order: 5 },
  { id: 's7', student_name: 'Rita Owuredu', destination: 'Now in UK', university: 'Brunel University - London', video_url: null, thumbnail_url: null, quote: 'If you want to study outside the country, look no further than The Psyche Consult Ghana Ltd. Today, with their help, I am in the UK!', display_order: 6 },
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

  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  let embedUrl = url;
  if (isYoutube) {
    const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
    if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
  } else if (isVimeo) {
    const match = url.match(/vimeo\.com\/(\d+)/);
    if (match) embedUrl = `https://player.vimeo.com/video/${match[1]}?autoplay=1`;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
      <div className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 z-10 w-9 h-9 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
        <div className="aspect-video w-full">
          {(isYoutube || isVimeo) ? (
            <iframe src={embedUrl} title={`${name} testimonial`} className="w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
          ) : (
            <video src={url} controls autoPlay className="w-full h-full" title={`${name} testimonial`} />
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
                  {t.thumbnail_url ? (
                    <img src={t.thumbnail_url} alt={`${t.student_name} video thumbnail`} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-60 transition-opacity" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-purple-900" />
                  )}
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

        {/* Text Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayTextItems.map((t) => (
            <div key={t.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-100 hover:shadow-xl transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {t.student_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{t.student_name}</h4>
                  <p className="text-xs text-gray-600">{t.destination}</p>
                </div>
              </div>
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
              </div>
              <p className="text-sm text-indigo-600 font-semibold mb-2">{t.university}</p>
              <p className="text-gray-700 text-sm">{t.quote}</p>
            </div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoModal url={activeVideo.video_url!} name={activeVideo.student_name} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}
