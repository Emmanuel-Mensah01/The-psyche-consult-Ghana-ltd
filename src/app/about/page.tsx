'use client';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
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

const values = [
  {
    emoji: '🎯',
    title: 'Student-First',
    description: 'Every decision we make is guided by what\'s best for the student. We prioritize your goals, timeline, and budget above all else.',
  },
  {
    emoji: '🤝',
    title: 'Integrity',
    description: 'We give honest advice — even when it\'s not what you want to hear. No false promises, no inflated success rates.',
  },
  {
    emoji: '🌍',
    title: 'Global Reach',
    description: 'With partnerships across 10+ countries and 200+ universities, we open doors that most students don\'t know exist.',
  },
  {
    emoji: '📈',
    title: 'Results-Driven',
    description: 'We measure our success by yours. Our track record of visa approvals and university placements speaks for itself.',
  },
];

const team = [
  {
    name: 'Dr. Emmanuel Asante',
    role: 'Founder & Lead Counselor',
    bio: 'PhD in Education Policy from the University of Edinburgh. 12+ years guiding Ghanaian students to top universities worldwide.',
    initials: 'EA',
    color: 'bg-indigo-600',
  },
  {
    name: 'Abena Mensah',
    role: 'Head of UK & Europe Admissions',
    bio: 'Former admissions officer at a Russell Group university. Expert in UCAS applications and UK visa processes.',
    initials: 'AM',
    color: 'bg-purple-600',
  },
  {
    name: 'Kwame Boateng',
    role: 'North America Specialist',
    bio: 'MBA from University of Toronto. Specializes in US and Canadian university applications and scholarship hunting.',
    initials: 'KB',
    color: 'bg-blue-600',
  },
  {
    name: 'Efua Darko',
    role: 'Visa & Immigration Advisor',
    bio: 'Certified immigration consultant with a 97% visa approval rate across UK, Canada, Australia, and Schengen countries.',
    initials: 'ED',
    color: 'bg-teal-600',
  },
];

const milestones = [
  { year: '2015', event: 'Founded in Kumasi with a mission to democratize access to international education for Ghanaian students.' },
  { year: '2017', event: 'Opened our Accra office and expanded services to include test preparation and visa counseling.' },
  { year: '2019', event: 'Reached 200 successful student placements. Established direct partnerships with 50+ universities.' },
  { year: '2021', event: 'Launched the online student portal, enabling students across Ghana to access our services remotely.' },
  { year: '2023', event: 'Surpassed 500 student placements across 10 countries. Recognized as a top education consultancy in Ghana.' },
  { year: '2025', event: 'Expanded partnerships to 200+ universities. Introduced one-on-one consultation booking and milestone tracking.' },
];

const stats = [
  { value: '500+', label: 'Students Placed' },
  { value: '200+', label: 'University Partners' },
  { value: '10+', label: 'Countries' },
  { value: '97%', label: 'Visa Success Rate' },
];

const staticTestimonials: Testimonial[] = [
  { id: 's1', student_name: 'Gifty Sarpong', destination: 'Now in USA', university: 'Hawaii Atlantic University', video_url: null, thumbnail_url: null, quote: 'Mr. Solomon Opoku was very helpful and gave me excellent choices of Universities that fit my budget and future education path. Very informative, knowledgeable, and professional!', display_order: 0 },
  { id: 's2', student_name: 'Joel Nana Appiah Obeng', destination: 'Now in USA', university: 'Fisher College - Boston, Massachusetts', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd gave me valuable advice and made the application process easier. Good people doing good deeds deserve recognition!', display_order: 1 },
  { id: 's3', student_name: 'Lawrencia Yeboah', destination: 'Now in USA', university: 'Weber State University - Utah', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd is proactive, detail-oriented, and trustworthy. They made my study abroad dream a breeze. I highly recommend them!', display_order: 2 },
  { id: 's4', student_name: 'Alexander Dumakor', destination: 'Now in Canada', university: 'Trent University', video_url: null, thumbnail_url: null, quote: 'I got my Canadian visa through The Psyche Consult Ghana Ltd Team. They guided me through all the process. I recommend them to anyone who would like quality education abroad.', display_order: 3 },
  { id: 's5', student_name: 'Kinsky', destination: 'Now in UK', university: 'University of Huddersfield', video_url: null, thumbnail_url: null, quote: 'The Psyche Consult Ghana Ltd really helped me achieve my aim of coming to the UK. I recommend them to everyone who would like to work or study abroad.', display_order: 4 },
  { id: 's6', student_name: 'Rita Owuredu', destination: 'Now in UK', university: 'Brunel University - London', video_url: null, thumbnail_url: null, quote: 'If you want to study outside the country, look no further than The Psyche Consult Ghana Ltd. Today, with their help, I am in the UK!', display_order: 5 },
];

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
  </svg>
);

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from('testimonials')
          .select('id, student_name, university, destination, video_url, thumbnail_url, quote, display_order')
          .eq('is_published', true)
          .order('display_order', { ascending: true })
          .limit(6);
        if (data && data.length > 0) {
          setTestimonials(data);
        }
      } catch {
        // fall back to static
      } finally {
        setTestimonialsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const displayTestimonials = testimonials.length > 0 ? testimonials : staticTestimonials;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              🏫 Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Ghana&apos;s Trusted Partner for <span className="text-indigo-300">International Education</span>
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed">
              Since 2015, The Psyche Consult Ghana Ltd has been turning study abroad dreams into reality for hundreds of Ghanaian students. We combine deep expertise, genuine care, and global connections to give every student the best possible chance.
            </p>
          </div>
        </div>
      </section>
      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats?.map((stat) => (
              <div key={stat?.label} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-1">{stat?.value}</div>
                <div className="text-gray-600 text-sm">{stat?.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Mission & Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                We believe that every talented Ghanaian student deserves access to world-class education — regardless of their background or financial situation. Our mission is to remove the barriers that stand between ambitious students and their international education goals.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                From the moment you walk through our doors (or log into our portal), you become part of The Psyche Consult Ghana Ltd family. We don&apos;t just process applications — we invest in your future.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our team of experienced counselors, many of whom studied abroad themselves, understand the challenges and opportunities that come with international education. We use that knowledge to give you a genuine competitive edge.
              </p>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-3xl transform rotate-2 opacity-20" />
              <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl border border-indigo-100">
                <div className="text-6xl mb-6">🎓</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Why We Started</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Our founder, Dr. Emmanuel Asante, experienced firsthand the confusion and misinformation that surrounded studying abroad in Ghana. After completing his PhD in Edinburgh, he returned home with one goal: to build the resource he wished had existed when he was applying.
                </p>
                <div className="bg-white p-4 rounded-2xl border border-indigo-100">
                  <p className="text-indigo-700 font-semibold italic text-sm">
                    &ldquo;Every student who walks through our doors has a dream. Our job is to make sure that dream has a plan.&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs mt-2">— Dr. Emmanuel Asante, Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Stand For</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our values aren&apos;t just words on a wall — they shape every interaction we have with students and universities.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values?.map((v) => (
              <div key={v?.title} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="text-4xl mb-4">{v?.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v?.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{v?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experienced counselors who have walked the path themselves and are dedicated to guiding you through yours.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team?.map((member) => (
              <div key={member?.name} className="text-center group">
                <div className={`w-24 h-24 ${member?.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 group-hover:scale-105 transition-transform shadow-lg`}>
                  {member?.initials}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{member?.name}</h3>
                <p className="text-indigo-600 text-sm font-semibold mb-3">{member?.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member?.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">A decade of impact, one student at a time.</p>
          </div>
          <div className="space-y-0">
            {milestones?.map((m, i) => (
              <div key={m?.year} className="flex gap-6 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {m?.year}
                  </div>
                  {i < milestones?.length - 1 && <div className="w-0.5 h-12 bg-indigo-200 mt-1" />}
                </div>
                <div className="pb-10">
                  <p className="text-gray-700 leading-relaxed pt-3">{m?.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — live from Supabase */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Students Say</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real stories from students who achieved their international education dreams with our help.
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-6 animate-pulse">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 rounded w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayTestimonials.map((t) => (
                <div key={t.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-100 hover:shadow-xl transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {t.student_name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{t.student_name}</h4>
                      <p className="text-xs text-gray-500">{t.destination}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                  </div>
                  <p className="text-sm text-indigo-600 font-semibold mb-2">{t.university}</p>
                  {t.quote && <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Offices */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Offices</h2>
            <p className="text-xl text-gray-600">Visit us in Kumasi or Accra — or connect with us online.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                city: 'Kumasi Office',
                address: 'Tanoso Station, Opposite MultiCredit',
                emoji: '🏢',
              },
              {
                city: 'Accra Office',
                address: 'Flower St. Tabora No.3, Adjacent Orthodox Church',
                emoji: '🏙️',
              },
            ]?.map((office) => (
              <div key={office?.city} className="bg-indigo-50 rounded-2xl p-8 border border-indigo-100 text-center">
                <div className="text-5xl mb-4">{office?.emoji}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{office?.city}</h3>
                <p className="text-gray-600 mb-4">{office?.address}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>📞 +233 54 737 1731</p>
                  <p>📧 info@thepsycheconsultgh.com</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA */}
      <section className="py-20 bg-indigo-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join hundreds of Ghanaian students who trusted The Psyche Consult Ghana Ltd to guide them to their dream universities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/student-portal"
              className="bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all"
            >
              Get Started Today
            </a>
            <a
              href="/#contact"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-900 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
