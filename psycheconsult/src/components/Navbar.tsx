'use client';
import React, { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white shadow-lg py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a className="flex items-center gap-2" href="/">
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
            className={`w-8 h-8 ${scrolled ? 'text-indigo-600' : 'text-white'}`}
          >
            <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
            <path d="M22 10v6" />
            <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
          </svg>
          <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            The Psyche Consult Ghana Ltd
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <a
            href="#services"
            className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'}`}
          >
            Services
          </a>
          <a
            href="/countries"
            className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'}`}
          >
            Countries
          </a>
          <a
            href="/scholarships"
            className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'}`}
          >
            Scholarships
          </a>
          <a
            href="/blog"
            className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'}`}
          >
            Blog
          </a>
          <a
            href="#about"
            className={`font-medium transition-colors ${scrolled ? 'text-gray-700 hover:text-indigo-600' : 'text-white hover:text-indigo-200'}`}
          >
            About
          </a>
          <a
            href="/student-portal"
            className="bg-indigo-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-indigo-700 transition-all text-sm"
          >
            Student Portal
          </a>
          <a
            href="/booking"
            className={`border-2 border-indigo-600 px-5 py-2 rounded-full font-semibold transition-all text-sm ${
              scrolled
                ? 'text-indigo-600 hover:bg-indigo-600 hover:text-white' :'text-indigo-600 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            Book Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
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
            className={scrolled ? 'text-gray-900' : 'text-white'}
          >
            {mobileOpen ? (
              <>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </>
            ) : (
              <>
                <path d="M4 5h16" />
                <path d="M4 12h16" />
                <path d="M4 19h16" />
              </>
            )}
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-xl border-t border-gray-100">
          <div className="px-6 py-4 space-y-3">
            {['Services', 'Countries', 'Scholarships', 'Blog', 'About']?.map((item) => (
              <a
                key={item}
                href={item === 'Services' ? '#services' : item === 'About' ? '#about' : `/${item?.toLowerCase()}`}
                className="block font-medium text-gray-700 hover:text-indigo-600 py-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="pt-3 space-y-2 border-t border-gray-100">
              <a
                href="/student-portal"
                className="block bg-indigo-600 text-white px-4 py-2 rounded-full font-semibold text-center hover:bg-indigo-700 transition-all text-sm"
              >
                Student Portal
              </a>
              <a
                href="/booking"
                className="block border-2 border-indigo-600 text-indigo-600 px-4 py-2 rounded-full font-semibold text-center hover:bg-indigo-600 hover:text-white transition-all text-sm"
              >
                Book Now
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
