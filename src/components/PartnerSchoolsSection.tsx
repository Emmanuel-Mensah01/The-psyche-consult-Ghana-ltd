import React from 'react';

// MSM partner schools. Edit this list to add or remove schools.
const schools = [
  'Keck Graduate Institute', 'Davis University', 'University of Tennessee, Martin',
  'University of Tennessee, Health Science Center', 'Metropolitan University', 'Lincoln University',
  'VCC', 'Barcelona Technology School', 'Neuro Business School', 'Grand Sud', 'St. Thomas University',
  'Mount Allison University', 'Georgian College', 'Selkirk College', 'Saskatchewan Colleges',
  'Sam Houston State University',
];

export default function PartnerSchoolsSection() {
  return (
    <section className="py-28 bg-indigo-50" id="msm-partner-schools">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-gold-600 font-bold text-sm tracking-widest uppercase mb-4">MSM Partner Schools</p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-indigo-900">Schools that open doors</h2>
          <p className="mt-5 text-lg text-gray-600">Our MSM partnership gives you a direct route into these institutions across North America and Europe.</p>
        </div>
        <ul className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {schools.map((name, i) => (
            <li key={name} className="group relative overflow-hidden rounded-2xl bg-white p-6 min-h-[132px] flex flex-col justify-between ring-1 ring-indigo-100 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-900 hover:shadow-2xl hover:shadow-indigo-900/20">
              <span className="font-display text-sm font-semibold text-gold-600 group-hover:text-gold-300">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-lg font-semibold leading-snug text-indigo-900 group-hover:text-white">{name}</span>
              <span className="absolute left-0 top-0 h-full w-1 bg-gold-400 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
