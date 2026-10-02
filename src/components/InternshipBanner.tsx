import React from 'react';

export default function InternshipBanner() {
  return (
    <section className="bg-indigo-900 py-24" id="internships">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[1fr_auto] gap-10 items-center">
        <div>
          <p className="text-gold-300 font-bold text-sm tracking-widest uppercase mb-4">Careers · Students only</p>
          <h2 className="font-display text-4xl md:text-6xl font-semibold text-white">Start your career with us.</h2>
          <p className="mt-5 text-lg text-indigo-200 max-w-2xl">Currently a student? Apply for an internship at The Psyche Consult and learn international education consulting from the inside.</p>
        </div>
        <a href="/careers" className="bg-gold-400 text-indigo-900 font-bold px-9 py-4 rounded-full text-lg hover:bg-gold-300 hover:shadow-2xl hover:shadow-gold-500/30 transition-all text-center">Apply for an internship</a>
      </div>
    </section>
  );
}
