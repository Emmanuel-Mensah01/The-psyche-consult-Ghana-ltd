import React from 'react';
import Icon from '@/components/Icon';

const link = 'text-indigo-200/80 hover:text-white transition-colors';

export default function Footer() {
  return (
    <footer className="bg-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Call to action */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-14 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300 mb-3">Start today</p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold leading-tight tracking-tight">Ready to begin your journey abroad?</h2>
            <p className="mt-3 text-indigo-200/80">Speak with a counselor in Accra or Kumasi. Your first consultation is free.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href="/booking" className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-8 py-4 font-bold text-indigo-900 shadow-lg shadow-gold-500/20 transition-all hover:bg-gold-300">
              Book a Free Consultation
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
            <a href="tel:+233547371731" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-4 font-semibold text-white transition-colors hover:bg-white/10">
              <Icon name="phone" className="h-4 w-4" />
              0547 371 731
            </a>
          </div>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          {/* Brand */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <Icon name="cap" className="h-8 w-8 text-gold-300" strokeWidth={1.8} />
              <span className="font-display text-xl font-semibold tracking-tight">The Psyche Consult Ghana Ltd</span>
            </div>
            <p className="max-w-sm text-indigo-200/80 leading-relaxed">Your trusted partner for international education in Ghana.</p>
            <p className="mt-4 font-display text-lg italic text-gold-300">&ldquo;Inspired Solutions, A Lasting Impact&rdquo;</p>
            <a className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 hover:text-white transition-colors" href="/student-portal">
              <Icon name="users" className="h-4 w-4" />
              Student Login
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">Services</h4>
            <ul className="space-y-3">
              <li><a className={link} href="/#services">University Selection</a></li>
              <li><a className={link} href="/#services">Application Support</a></li>
              <li><a className={link} href="/#services">Test Preparation</a></li>
              <li><a className={link} href="/#services">Visa Consulting</a></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">Quick Links</h4>
            <ul className="space-y-3">
              <li><a className={link} href="/countries">Study Destinations</a></li>
              <li><a className={link} href="/scholarships">Scholarships</a></li>
              <li><a className={link} href="/blog">Blog &amp; Resources</a></li>
              <li><a className={link} href="/booking">Book Appointment</a></li>
              <li><a className={link} href="/contact">Contact Us</a></li>
              <li><a className={link} href="/careers">Internships</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">Contact</h4>
            <ul className="space-y-4 text-indigo-200/80">
              <li className="flex gap-3">
                <Icon name="pin" className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-300" />
                <span><span className="font-semibold text-white">Accra</span><br />Flower St. Tabora No.3, Adjacent Orthodox Church, Lapaz</span>
              </li>
              <li className="flex gap-3">
                <Icon name="pin" className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-300" />
                <span><span className="font-semibold text-white">Kumasi</span><br />Tanoso Station, Opposite MultiCredit</span>
              </li>
              <li className="flex gap-3">
                <Icon name="phone" className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-300" />
                <span>
                  <a className={link} href="tel:+233547371731">+233 54 737 1731</a><br />
                  <a className={link} href="tel:+233552721414">+233 55 272 1414</a>
                </span>
              </li>
              <li className="flex gap-3">
                <Icon name="mail" className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-300" />
                <a className={link} href="mailto:info@thepsycheconsultgh.com">info@thepsycheconsultgh.com</a>
              </li>
              <li>
                <a href="https://wa.me/233273664058" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold text-green-400 hover:text-green-300 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                  </svg>
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-7 text-sm text-indigo-200/60 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 The Psyche Consult Ghana Ltd. All rights reserved.</p>
          <p>Accra &middot; Kumasi &middot; Study in the USA, UK, Canada &amp; Europe</p>
        </div>
      </div>
    </footer>
  );
}
