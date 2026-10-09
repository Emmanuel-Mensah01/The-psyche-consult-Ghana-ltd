import React from 'react';

const values = [
  {
    title: 'Excellence',
    text: 'We are committed to delivering the highest standards of quality in every service we provide. We pursue excellence through continuous improvement, professionalism, competence, and attention to detail.',
    icon: (
      <>
        <circle cx="12" cy="8" r="6" />
        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
      </>
    ),
  },
  {
    title: 'Integrity',
    text: 'We conduct our business with honesty, transparency, accountability, and ethical responsibility. We honor our commitments and build trust through fairness and credibility in all our relationships.',
    icon: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
  {
    title: 'Innovation',
    text: 'We embrace creativity, forward thinking, and continuous learning to develop inspired solutions that address evolving needs and create lasting value for our clients and communities.',
    icon: (
      <>
        <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
        <path d="M9 18h6" />
        <path d="M10 22h4" />
      </>
    ),
  },
  {
    title: 'Client-Centered Service',
    text: 'We place our clients at the heart of everything we do. We listen, understand, and respond with customized solutions that exceed expectations and create memorable experiences.',
    icon: <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />,
  },
  {
    title: 'Empowerment',
    text: 'We are dedicated to transforming lives by empowering individuals through education, counseling, skills development, career advancement, and access to opportunities that promote personal and professional growth.',
    icon: (
      <>
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </>
    ),
  },
  {
    title: 'Impact',
    text: 'We measure our success by the positive and lasting difference we make in the lives of individuals, organizations, and communities. Every action we take is driven by our desire to create meaningful and sustainable change.',
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </>
    ),
  },
];

export default function CoreValues() {
  return (
    <section className="py-20 bg-white" id="core-values" aria-labelledby="core-values-heading">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-4">What guides us</p>
          <h2 id="core-values-heading" className="text-3xl sm:text-4xl font-bold text-gray-900">Our Core Values</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold-300" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((v, i) => (
            <article
              key={v.title}
              className="relative bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="absolute top-6 right-7 text-4xl font-bold text-indigo-100 select-none" aria-hidden>
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-900 text-gold-300 mb-5" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {v.icon}
                </svg>
              </span>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
              <p className="text-gray-600 leading-relaxed">{v.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
