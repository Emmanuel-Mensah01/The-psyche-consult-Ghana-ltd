'use client';
import React from 'react';
import Icon from '@/components/Icon';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-indigo-900">
      {/* Desktop: photo on the right, fading into the navy so the headline stays clear of the faces */}
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

      {/* Phone: photo as the background, anchored at the bottom and fading up into the navy */}
      <div
        className="lg:hidden absolute inset-x-0 bottom-0 h-[330px]"
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

      {/* Fine detail: soft shade behind the menu, a hairline gold glow and a clean fade into the next section */}
      <div className="hidden lg:block absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-indigo-900/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-16 lg:h-40 bg-gradient-to-t from-indigo-900 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-6 pt-28 lg:pt-32 pb-[330px] lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-flex items-center gap-3 text-gold-300 font-semibold text-xs sm:text-sm tracking-[0.22em] uppercase mb-6 sm:mb-8">
            <span className="h-px w-10 bg-gold-300/80" aria-hidden />
            Your gateway to global education
          </p>

          <h1 className="font-display font-semibold text-white text-[clamp(2.6rem,6.2vw,5.4rem)] leading-[1.02] tracking-[-0.025em] text-balance">
            Study abroad with{' '}
            <em className="italic font-medium text-gold-300">expert guidance.</em>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-indigo-100/90 max-w-xl leading-relaxed">
            From university selection to visa approval, we handle every step of your study abroad journey with professional excellence.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
            <a
              href="/booking"
              className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold-400 px-8 py-4 text-base sm:text-lg font-bold text-indigo-900 shadow-xl shadow-gold-500/20 transition-all hover:bg-gold-300 hover:shadow-gold-500/40"
            >
              Book a Free Consultation
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
            <a href="#services" className="inline-flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white/85 underline-offset-8 hover:text-white hover:underline">
              <Icon name="sparkles" className="h-4 w-4 text-gold-300" />
              Explore our services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
