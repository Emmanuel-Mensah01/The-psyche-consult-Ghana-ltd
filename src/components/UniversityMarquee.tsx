import React from 'react';

const names = [
  'Hofstra University', 'George Mason University', 'Oregon State University', 'Colorado State University',
  'University of Oklahoma', 'Texas State University', 'Rensselaer Polytechnic Institute', 'Saint Louis University',
  'Suffolk University Boston', 'University of Massachusetts Amherst', 'Illinois State University',
  'The University of Alabama at Birmingham', 'Eckerd College', 'Drew University', 'Fisher College',
  'Montclair State University', 'Southern Illinois University', 'Thomas Jefferson University',
  'Keck Graduate Institute', 'Sam Houston State University', 'Georgian College', 'Selkirk College',
  'Mount Allison University', 'INTO London', 'INTO Manchester', 'Lancaster University International Study Centre',
  'University of Exeter International Study Centre', 'University of Stirling International Study Centre',
  'The University of Manchester', 'The University Of Western Australia', 'Saint Louis University Madrid',
];

/** Partner-university ticker moving the opposite way to the headline strip. */
export default function UniversityMarquee() {
  return (
    <section aria-label="Some of our partner universities" className="bg-gray-50 py-10 overflow-hidden">
      <p className="text-center text-sm font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-6">Our partner universities</p>
      <div className="marquee marquee-reverse">
        <div className="marquee-track" style={{ ['--marquee-duration' as string]: '90s' }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={copy === 1}>
              {names.map((n) => (
                <span key={n} className="whitespace-nowrap rounded-full bg-white border border-gray-200 px-6 py-3 text-base font-semibold text-indigo-900 shadow-sm">
                  {n}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
