'use client';
import React, { useState } from 'react';

interface SubService {
  name: string;
  detail: string;
}

interface Service {
  icon: React.ReactNode;
  title: string;
  image: string;
  stock: string;
  description: string;
  details: string;
  highlights?: string[];
  subServices?: SubService[];
}

const services: Service[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    title: 'Travel and Tour',
    image: '/assets/services/travel-and-tour.jpg',
    stock: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=75',
    description: 'Our core study-abroad service, guiding you from admission to arrival',
    details:
      'Our flagship service, covering everything a student or traveller needs — from choosing the right university, through testing and applications, to visa approval, and on to guided tourism once you arrive.',
    subServices: [
      {
        name: 'University Selection',
        detail:
          'We help you identify and shortlist universities that match your academic profile, budget, and career goals — comparing program rankings, tuition costs, and admission requirements across our partner network of institutions.',
      },
      {
        name: 'Test Preparation',
        detail:
          'Structured coaching for IELTS, TOEFL, SAT, GRE, and GMAT — including diagnostic tests, one-on-one coaching sessions, timed mock exams, and a personalised study plan built around your target score and exam date.',
      },
      {
        name: 'Application Support',
        detail:
          'Hands-on help with every document your chosen universities require — personal statements, recommendation letters, transcripts evaluation, and application form completion — reviewed and refined before submission.',
      },
      {
        name: 'Visa Consulting',
        detail:
          'Step-by-step visa guidance from CAS/I-20 issuance to financial documentation, mock interviews, biometric appointments, and travel-readiness checks — for the UK, US, Canada, and other major study destinations.',
      },
      {
        name: 'Local Travel & Tourism',
        detail:
          'Domestic travel planning and guided tours across Ghana\'s top destinations — for leisure trips, corporate retreats, family holidays, or cultural excursions.',
      },
      {
        name: 'International Travel & Tourism',
        detail:
          'Curated international travel packages and tour itineraries for holidays, honeymoons, group trips, and educational tours abroad — flights, accommodation, and activities planned around your schedule.',
      },
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M2 20h20" />
        <path d="M4 20V10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v10" />
        <path d="M14 20V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v14" />
        <path d="M8 12h.01" />
        <path d="M8 16h.01" />
        <path d="M18 10h.01" />
        <path d="M18 14h.01" />
      </svg>
    ),
    title: 'Hospitality Management',
    image: '/assets/services/hospitality-management.jpg',
    stock: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=75',
    description: 'Professional management support for hotels, guesthouses, and hospitality businesses',
    details:
      'We support hotels, guesthouses, and short-let properties with the systems and standards needed to run a smooth, guest-ready operation.',
    highlights: [
      'Front-desk and guest services setup',
      'Staff training and standard operating procedures',
      'Booking and revenue management systems',
      'Quality assurance and guest experience audits',
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    title: 'Psychotherapy Services',
    image: '/assets/services/psychotherapy.jpg',
    stock: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=75',
    description: 'Confidential, professional mental health and emotional wellbeing support',
    details:
      'A safe, confidential space to work through life\'s challenges with a qualified professional, whether you\'re dealing with stress, a major transition, or simply need someone to talk to.',
    highlights: [
      'One-on-one counselling sessions with licensed therapists',
      'Support for anxiety, stress, grief, and life transitions',
      'Couples and family therapy sessions',
      'A confidential, judgment-free environment',
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M2 9a3 3 0 0 1 0 6" />
        <path d="M22 9a3 3 0 0 0 0 6" />
        <rect x="4" y="6" width="16" height="12" rx="2" />
        <path d="M12 10v4" />
        <path d="M9.5 12h5" />
      </svg>
    ),
    title: 'Hotel Booking and Flight Ticketing',
    image: '/assets/services/hotel-and-flights.jpg',
    stock: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=75',
    description: 'Fast, reliable hotel reservations and flight ticket bookings for personal, family, or business travel',
    details:
      'Whether you\'re travelling for business, leisure, or family reasons, we handle the logistics — reliable bookings, competitive rates, and support if plans change.',
    highlights: [
      'Domestic and international flight bookings',
      'Hotel reservations for business or leisure travel',
      'Group and corporate booking arrangements',
      'Support with rebooking and cancellations',
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Professional Counseling',
    image: '/assets/services/counseling.jpg',
    stock: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=75',
    description: 'Guidance and support for personal, academic, and career decisions',
    details:
      'One-on-one guidance for the big decisions in life — whether you\'re choosing a career path, weighing a course of study, or working through a personal goal.',
    highlights: [
      'Career path and job transition guidance',
      'Academic and course selection counselling',
      'Personal development and goal-setting sessions',
      'Confidential one-on-one consultations',
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" />
      </svg>
    ),
    title: 'Training and Youth Development',
    image: '/assets/services/youth-training.jpg',
    stock: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=75',
    description: 'Skills training and development programmes empowering young people for the future',
    details:
      'Practical skills training and mentorship designed to help young people build real, usable capabilities for work and life.',
    highlights: [
      'Vocational and soft-skills training workshops',
      'Leadership and entrepreneurship bootcamps for youth',
      'Mentorship programmes connecting youth with professionals',
      'Career readiness and job placement support',
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: 'International Recruitment Services',
    image: '/assets/services/recruitment.jpg',
    stock: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=900&q=75',
    description: 'Connecting qualified candidates with legitimate employment opportunities abroad',
    details:
      'We connect job-ready candidates with legitimate employers abroad, handling the vetting and paperwork so both sides can move with confidence.',
    highlights: [
      'Candidate screening and job matching',
      'Employment contract review and guidance',
      'Work permit and documentation support',
      'Partnerships with vetted international employers',
    ],
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
      </svg>
    ),
    title: 'Construction and Real Estate',
    image: '/assets/services/real-estate.jpg',
    stock: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=75',
    description: 'Property development, Airbnb management, and apartment renting services',
    details:
      'From listing and managing Airbnb properties to helping you find or rent an apartment, we support both property owners and tenants through the process.',
    highlights: [
      'Airbnb listing setup and guest management',
      'Apartment and property rental arrangements',
      'Construction project consultation',
      'Property inspection and maintenance coordination',
    ],
  },
];

function ServiceModal({ service, onClose }: { service: Service; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={service.title}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gradient-to-br from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            {service.icon}
          </div>
          <h3 className="text-2xl font-bold text-white">{service.title}</h3>
        </div>

        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-6 text-base">{service.details}</p>

          {service.highlights && (
            <div>
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">What&apos;s Included</h4>
              <ul className="space-y-2.5">
                {service.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                    <span className="text-indigo-600 font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.subServices && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">What&apos;s Included</h4>
              {service.subServices.map((sub) => (
                <div key={sub.name} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <p className="flex items-center gap-2 font-semibold text-gray-900 text-sm mb-1.5">
                    <span className="text-indigo-600">→</span>
                    {sub.name}
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed">{sub.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
            <a
              href="/booking"
              onClick={onClose}
              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:bg-indigo-700 transition-colors"
            >
              Book a Consultation
            </a>
            <a
              href="#contact"
              onClick={onClose}
              className="inline-block border border-gray-200 text-gray-700 px-6 py-2.5 rounded-full font-semibold text-sm hover:border-gray-300 transition-colors"
            >
              Ask a Question
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [activeService, setActiveService] = useState<Service | null>(null);

  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From study abroad to travel, hospitality, and beyond — comprehensive support for every journey. Click any service to learn more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <button
              key={service?.title}
              type="button"
              onClick={() => setActiveService(service)}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-left w-full min-h-[380px] flex flex-col justify-end bg-indigo-900"
            >
              {/* Photo background: your own file in /public/assets/services wins; otherwise the stock photo; otherwise the navy gradient */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${service.image}), url(${service.stock}), linear-gradient(135deg, #0c2559, #17408f)` }}
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/95 via-indigo-900/65 to-indigo-900/25" aria-hidden />

              <div className="relative z-10 p-8 pt-32">
                <div className="w-14 h-14 bg-white/15 backdrop-blur-sm ring-1 ring-white/25 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform text-white">
                  {service?.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{service?.title}</h3>
                <p className="text-indigo-100 mb-4">{service?.description}</p>

                {service?.subServices && (
                  <ul className="space-y-2 pt-4 border-t border-white/20">
                    {service.subServices.map((sub) => (
                      <li key={sub.name} className="flex items-center gap-2 text-sm text-white/90">
                        <span className="text-gold-300 font-bold">→</span>
                        <span>{sub.name}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <span className="inline-flex items-center gap-1.5 mt-4 text-sm font-semibold text-gold-300 group-hover:text-white transition-colors">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeService && <ServiceModal service={activeService} onClose={() => setActiveService(null)} />}
    </section>
  );
}
