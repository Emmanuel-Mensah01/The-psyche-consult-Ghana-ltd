'use client';
import React, { useState, useEffect } from 'react';
import Icon from '@/components/Icon';

const primary = [
  { label: 'Services', href: '/#services' },
  { label: 'Countries', href: '/countries' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
// Desktop shows every link; on phones these two sit in the small line under the menu.
const desktopAll = [
  { label: 'Services', href: '/#services' },
  { label: 'Countries', href: '/countries' },
  { label: 'CEO Travels', href: '/ceo-travels' },
  { label: 'Careers', href: '/careers' },
  { label: 'Scholarships', href: '/scholarships' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const solid = scrolled || mobileOpen;
  const link = `text-[15px] font-semibold tracking-wide transition-colors ${solid ? 'text-gray-700 hover:text-indigo-700' : 'text-white/90 hover:text-white'}`;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        solid ? 'bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(15,23,42,0.06),0_8px_30px_-12px_rgba(15,23,42,0.18)] py-3' : 'bg-transparent py-5 lg:py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-5 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <a className="flex items-center gap-2.5" href="/" onClick={() => setMobileOpen(false)}>
          <Icon name="cap" className={`h-7 w-7 ${solid ? 'text-indigo-700' : 'text-gold-300'}`} strokeWidth={1.8} />
          <span className={`font-display text-xl font-semibold tracking-tight ${solid ? 'text-gray-900' : 'text-white'}`}>
            The Psyche Consult<span className="hidden 2xl:inline font-sans text-sm font-semibold tracking-wide opacity-70"> &nbsp;Ghana Ltd</span>
          </span>
        </a>

        {/* Desktop navigation: all links visible */}
        <div className="hidden xl:flex items-center gap-4 2xl:gap-7 whitespace-nowrap">
          {desktopAll.map((i) => (
            <a key={i.label} href={i.href} className={link}>{i.label}</a>
          ))}

          <a
            href="/student-portal"
            className={`rounded-full px-5 py-2.5 text-[15px] font-bold transition-all ${
              solid ? 'bg-indigo-700 text-white hover:bg-indigo-800' : 'bg-white text-indigo-900 hover:bg-indigo-50'
            }`}
          >
            Student Portal
          </a>
          <a
            href="/booking"
            className="rounded-full bg-gold-400 px-5 py-2.5 text-[15px] font-bold text-indigo-900 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-300 hover:shadow-gold-500/40"
          >
            Book Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="xl:hidden -mr-2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={solid ? 'text-gray-900' : 'text-white'}>
            {mobileOpen ? (<><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>) : (<><path d="M4 8h16" /><path d="M4 16h16" /></>)}
          </svg>
        </button>
      </div>

      {/* Mobile menu: a short list and one clear action */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-t border-gray-100 shadow-xl max-h-[calc(100svh-64px)] overflow-y-auto">
          <div className="px-5 pt-2 pb-6">
            <ul className="divide-y divide-gray-100">
              {primary.map((i) => (
                <li key={i.label}>
                  <a href={i.href} onClick={() => setMobileOpen(false)} className="flex items-center justify-between py-3.5 text-lg font-semibold text-gray-900">
                    {i.label}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300" aria-hidden><path d="m9 18 6-6-6-6" /></svg>
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="mt-5 block rounded-full bg-gold-400 py-3.5 text-center text-base font-bold text-indigo-900 shadow-lg shadow-gold-500/20"
            >
              Book a free consultation
            </a>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-semibold text-gray-500">
              <a href="/student-portal" onClick={() => setMobileOpen(false)} className="hover:text-indigo-700">Student Portal</a>
              <a href="/ceo-travels" onClick={() => setMobileOpen(false)} className="hover:text-indigo-700">CEO Travels</a>
              <a href="/careers" onClick={() => setMobileOpen(false)} className="hover:text-indigo-700">Careers</a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
