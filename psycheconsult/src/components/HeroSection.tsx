'use client';
import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://img.rocket.new/generatedImages/rocket_gen_img_1d143f967-1773655474302.png"
          alt="Students studying abroad"
          className="object-cover w-full h-full"
          style={{ position: 'absolute', height: '100%', width: '100%', left: 0, top: 0, right: 0, bottom: 0 }} />
        
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-purple-900/90 to-indigo-800/10" />
      </div>

      {/* Animated blobs */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
        <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white font-semibold animate-fade-in">
          🌍 Your Gateway to Global Education
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
          Study Abroad with
          <span className="block bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
            Expert Guidance
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto animate-fade-in-up delay-200">
          From university selection to visa approval, we handle every step of your study abroad journey with professional excellence
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-300">
          <a
            href="#contact"
            className="group bg-white text-indigo-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105 flex items-center justify-center gap-2">
            
            Start Your Journey
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
              className="w-5 h-5 group-hover:translate-x-1 transition-transform">
              
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
          <a
            href="#services"
            className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-900 transition-all transform hover:scale-105">
            
            Learn More
          </a>
        </div>
      </div>
    </section>);

}