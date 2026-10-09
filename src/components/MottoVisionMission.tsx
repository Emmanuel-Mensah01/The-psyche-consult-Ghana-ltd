import React from 'react';

export default function MottoVisionMission() {
  return (
    <section className="py-20 bg-gray-50" id="vision-mission" aria-labelledby="motto-heading">
      <div className="max-w-6xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 px-6 sm:px-12 py-14 text-center shadow-xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
          <div className="absolute -bottom-28 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="relative">
            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-gold-300 mb-5">Our Motto</p>
            <h2 id="motto-heading" className="text-3xl sm:text-5xl font-bold text-white leading-tight">
              &ldquo;Inspired Solutions, A Lasting Impact&rdquo;
            </h2>
            <div className="mx-auto my-8 h-1 w-16 rounded-full bg-gold-300" />
            <p className="mx-auto max-w-3xl text-lg sm:text-xl text-indigo-100 leading-relaxed">
              We provide innovative guidance and support today that will create meaningful success and positive change for a lifetime.
            </p>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <article className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-700" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
              </span>
              <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              To be a globally recognized leader in providing inspired solutions and creating lasting impact through counseling, education, recruitment, travel, hospitality, youth development, real estate, and other innovative services that empower people and organizations to thrive.
            </p>
          </article>

          <article className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-700" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
              </span>
              <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
            </div>
            <p className="text-lg text-gray-600 leading-relaxed">
              At The Psyche Consult, our mission is to deliver inspired solutions that empower people, strengthen organizations, and transform communities. Through our diverse services in mental health and counseling, education and international mobility, hospitality, recruitment, youth empowerment, construction, and real estate, we create pathways for personal growth, career advancement, and sustainable development while maintaining the highest standards of excellence, integrity, innovation, and client satisfaction.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
