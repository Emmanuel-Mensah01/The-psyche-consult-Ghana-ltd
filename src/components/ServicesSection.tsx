import React from 'react';

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  subServices?: string[];
}

const services: Service[] = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    title: 'Travel and Tour',
    description: 'Our core study-abroad service, guiding you from admission to arrival',
    subServices: ['University Selection', 'Test Preparation', 'Application Support', 'Visa Consulting'],
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
    description: 'Professional management support for hotels, guesthouses, and hospitality businesses',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    title: 'Psychotherapy Services',
    description: 'Confidential, professional mental health and emotional wellbeing support',
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
    description: 'Fast, reliable hotel reservations and flight ticket bookings for personal, family, or business travel',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: 'Professional Counseling',
    description: 'Guidance and support for personal, academic, and career decisions',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
    title: 'Tourism (Local and International)',
    description: 'Curated tourism experiences within Ghana and to destinations abroad',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1 3 2 6 2s6-1 6-2v-5" />
      </svg>
    ),
    title: 'Training and Youth Development',
    description: 'Skills training and development programmes empowering young people for the future',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    title: 'International Recruitment Services',
    description: 'Connecting qualified candidates with legitimate employment opportunities abroad',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-white">
        <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
      </svg>
    ),
    title: 'Construction and Real Estate',
    description: 'Property development, Airbnb management, and apartment renting services',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From study abroad to travel, hospitality, and beyond — comprehensive support for every journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services?.map((service) => (
            <div
              key={service?.title}
              className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {service?.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service?.title}</h3>
              <p className="text-gray-600 mb-4">{service?.description}</p>

              {service?.subServices && (
                <ul className="space-y-2 pt-4 border-t border-gray-100">
                  {service.subServices.map((sub) => (
                    <li key={sub} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-indigo-600 font-bold">→</span>
                      <span>{sub}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
