'use client';
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-indigo-900">
      {/* Photo: right side on desktop, fading into the navy background so the headline stays clear of the faces */}
      <div
        className="hidden lg:block absolute inset-y-0 right-0 w-[56%]"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
        }}
      >
        <img
          src="/assets/images/hero-ambassadors.jpg"
          srcSet="/assets/images/hero-ambassadors-900.jpg 900w, /assets/images/hero-ambassadors.jpg 1536w"
          sizes="56vw"
          alt="Two Psyche Consult study abroad ambassadors in branded T-shirts at our office in Ghana"
          className="w-full h-full object-cover object-[50%_30%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-indigo-900/10" />
      </div>
      {/* Phone: photo as the background, anchored at the bottom and fading up into the navy behind the text */}
      <div
        className="lg:hidden absolute inset-x-0 bottom-0 h-[340px]"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 40%)',
        }}
      >
        <img
          src="/assets/images/hero-ambassadors-900.jpg"
          alt="Two Psyche Consult study abroad ambassadors in branded T-shirts at our office in Ghana"
          className="w-full h-full object-cover object-[50%_30%]"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-indigo-900/10" />
      </div>
      {/* Light shade behind the menu so the links stay readable over the photo */}
      <div className="hidden lg:block absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-900/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 lg:h-40 bg-gradient-to-t from-indigo-900 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-32 pb-[320px] lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
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

      </div>
    </section>
  );
}
