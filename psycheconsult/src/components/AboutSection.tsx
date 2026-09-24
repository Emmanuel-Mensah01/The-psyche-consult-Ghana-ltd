import React from 'react';

const benefits = [
  'Comprehensive profiling for accurate university matching',
  'Direct partnerships with 200+ universities worldwide',
  'Affordable test preparation with excellent results',
  'Expert visa counseling with high success rates',
  'Continuous support from application to departure',
  'Track your application progress online 24/7',
];

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose The Psyche Consult Ghana Ltd?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We are Ghana&apos;s trusted partner for international education, committed to turning your study abroad dreams into reality. Our experienced counselors provide personalized guidance every step of the way.
            </p>
            <div className="space-y-4">
              {benefits?.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1"
                  >
                    <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                    <path d="m9 11 3 3L22 4" />
                  </svg>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Decorative Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-3xl transform rotate-3" />
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-16 h-16 text-indigo-600 mb-6"
              >
                <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
                <circle cx="12" cy="8" r="6" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted Excellence</h3>
              <p className="text-gray-600 mb-6">
                With years of experience and hundreds of successful placements, we maintain the highest standards of professional service and ethical practice.
              </p>
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-12 h-12 text-indigo-600"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <path d="M16 3.128a4 4 0 0 1 0 7.744" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-gray-600">Happy Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
