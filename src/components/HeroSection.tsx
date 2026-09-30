'use client';
import React from 'react';

const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 3, 1, 2];

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-indigo-900">
      <img
        src="https://img.rocket.new/generatedImages/rocket_gen_img_1d143f967-1773655474302.png"
        alt="Students studying abroad"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900/85 to-indigo-900/30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-indigo-900 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-24 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">
        <div>
          <p className="inline-flex items-center gap-3 text-gold-300 font-semibold text-sm tracking-wide mb-8">
            <span className="h-px w-10 bg-gold-400" /> Your gateway to global education
          </p>
          <h1 className="font-display font-semibold text-white text-[clamp(2.75rem,6.4vw,5.5rem)]">
            Study abroad with expert guidance.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-indigo-100/90 max-w-xl leading-relaxed">
            From university selection to visa approval, we handle every step of your study abroad journey with professional excellence.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a href="#contact" className="bg-gold-400 text-indigo-900 px-9 py-4 rounded-full font-bold text-lg hover:bg-gold-300 hover:shadow-2xl hover:shadow-gold-500/30 transition-all text-center">
              Start Your Journey
            </a>
            <a href="#services" className="border border-white/40 text-white px-9 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-900 transition-all text-center">
              Learn More
            </a>
          </div>
        </div>

        {/* Boarding pass — the memorable moment */}
        <div className="hidden lg:block justify-self-end w-full max-w-[400px] -rotate-2 hover:rotate-0 transition-transform duration-500" aria-hidden>
          <div className="relative rounded-3xl bg-white shadow-2xl shadow-black/40 overflow-hidden">
            <div className="bg-indigo-800 px-7 py-5 flex justify-between items-center text-white">
              <span className="font-display text-lg font-semibold">The Psyche Consult</span>
              <span className="text-gold-300 text-sm font-semibold">Admission Pass</span>
            </div>
            <div className="px-7 py-7">
              <div className="flex items-end justify-between">
                <div><p className="text-xs text-gray-500">From</p><p className="font-display text-5xl font-semibold text-indigo-900">ACC</p><p className="text-sm text-gray-600">Accra, Ghana</p></div>
                <span className="text-3xl text-gold-500 pb-6">✈</span>
                <div className="text-right"><p className="text-xs text-gray-500">To</p><p className="font-display text-5xl font-semibold text-indigo-900">YOU</p><p className="text-sm text-gray-600">Anywhere</p></div>
              </div>
              <dl className="mt-7 grid grid-cols-2 gap-y-4 text-sm">
                <div><dt className="text-gray-500">Services</dt><dd className="font-semibold text-gray-900">Admissions, Visa, Test prep</dd></div>
                <div><dt className="text-gray-500">Destinations</dt><dd className="font-semibold text-gray-900">USA, UK, Canada, Spain</dd></div>
                <div><dt className="text-gray-500">Offices</dt><dd className="font-semibold text-gray-900">Kumasi &amp; Accra</dd></div>
                <div><dt className="text-gray-500">Status</dt><dd className="font-semibold text-emerald-600">Ready to depart</dd></div>
              </dl>
            </div>
            <div className="relative border-t-2 border-dashed border-indigo-200 mx-0">
              <span className="absolute -left-4 -top-4 w-8 h-8 rounded-full bg-indigo-900" />
              <span className="absolute -right-4 -top-4 w-8 h-8 rounded-full bg-indigo-900" />
            </div>
            <div className="px-7 py-6 flex items-end justify-between gap-6">
              <div className="flex items-end gap-[3px] h-12">
                {bars.map((w, i) => <span key={i} className="bg-indigo-900 h-full" style={{ width: w * 2 }} />)}
              </div>
              <p className="text-xs text-gray-500 text-right">500+ students placed<br />98% success rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
