import React from 'react';
import Icon from '@/components/Icon';

const steps = [
  { step: '01', title: 'Research & Discovery', description: 'Explore universities, courses, and destinations that align with your aspirations.', icon: 'search' },
  { step: '02', title: 'Professional Counseling', description: 'Comprehensive profiling and personalized guidance from expert counselors.', icon: 'users' },
  { step: '03', title: 'Application Management', description: 'Complete support throughout your application journey.', icon: 'fileCheck' },
  { step: '04', title: 'Secure Your Future', description: 'Accept offers and complete the visa process with our expert assistance.', icon: 'plane' },
];

export default function HowItWorksSection() {
  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">A streamlined process designed for your success</p>
        </div>

        <ol className="relative grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* connecting line across the four steps (desktop) */}
          <span className="hidden lg:block absolute left-[8%] right-[8%] top-7 h-px bg-gradient-to-r from-indigo-100 via-gold-400/60 to-indigo-100" aria-hidden />
          {steps.map((s) => (
            <li key={s.step} className="relative">
              <div className="flex items-center gap-4">
                <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-900 text-gold-300 ring-8 ring-white shadow-lg shadow-indigo-900/20">
                  <Icon name={s.icon} className="h-6 w-6" />
                </span>
                <span className="font-display text-5xl font-semibold text-indigo-100 select-none" aria-hidden>{s.step}</span>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">{s.title}</h3>
              <p className="mt-2 text-gray-600 leading-relaxed">{s.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
