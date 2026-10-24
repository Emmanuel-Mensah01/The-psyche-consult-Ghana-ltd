import React from 'react';
import { OFFICE_NAME, OFFICE_ADDRESS_LINES, OFFICE_EMBED_URL, OFFICE_MAPS_URL, OFFICE_DIRECTIONS_URL } from '@/lib/office';

export default function OfficeMap() {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border-2 border-indigo-100 bg-white shadow-md" id="find-us">
      <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-center p-8 sm:p-10">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-3">Find us</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-5">Visit our Accra office</h3>
          <address className="not-italic text-lg text-gray-600 leading-relaxed mb-8">
            {OFFICE_ADDRESS_LINES.map((l) => (
              <span key={l} className="block">{l}</span>
            ))}
          </address>
          <div className="flex flex-wrap gap-3">
            <a
              href={OFFICE_DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-indigo-900 px-6 py-3 font-bold text-white hover:bg-indigo-800 transition-colors"
            >
              Get directions
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
            <a
              href={OFFICE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-indigo-900 px-6 py-3 font-bold text-indigo-900 hover:bg-indigo-50 transition-colors"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
        <div className="min-h-[320px] lg:min-h-[420px]">
          <iframe
            title={`Map showing ${OFFICE_NAME}`}
            src={OFFICE_EMBED_URL}
            className="h-full w-full min-h-[320px] lg:min-h-[420px] border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
