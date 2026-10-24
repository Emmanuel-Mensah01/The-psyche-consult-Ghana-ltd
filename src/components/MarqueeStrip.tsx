import React from 'react';

const items = ['Study in the USA', 'United Kingdom', 'Canada', 'Europe', 'University Admissions', 'Student Visas', 'Scholarships', 'Test Prep'];

/** Slow, endless headline ticker. Pure CSS, pauses on hover, still for reduced-motion users. */
export default function MarqueeStrip() {
  return (
    <section aria-label="Study destinations and services" className="bg-indigo-900 py-7 border-y border-white/10 overflow-hidden">
      <div className="marquee">
        <div className="marquee-track" style={{ ['--marquee-duration' as string]: '55s' }}>
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {items.map((t, i) => (
                <React.Fragment key={t}>
                  <span
                    className="px-8 font-display text-3xl md:text-5xl font-semibold uppercase tracking-wide whitespace-nowrap"
                    style={i % 2 ? { color: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.6)' } : { color: '#fff' }}
                  >
                    {t}
                  </span>
                  <span className="text-gold-400 text-2xl" aria-hidden>✦</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
