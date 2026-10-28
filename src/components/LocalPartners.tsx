import React from 'react';

const partners = ['Testimony College', 'Step Ahead Education', 'Come Study International'];

export default function LocalPartners() {
  return (
    <section className="py-16 bg-gray-50" id="local-partners" aria-labelledby="local-partners-heading">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-semibold tracking-[0.25em] uppercase text-indigo-600 mb-4">Closer to home</p>
          <h2 id="local-partners-heading" className="text-3xl sm:text-4xl font-bold text-gray-900">Our Local Partner Schools in Ghana</h2>
          <div className="mx-auto mt-6 h-1 w-16 rounded-full bg-gold-300" />
        </div>

        <ul className="grid sm:grid-cols-3 gap-6">
          {partners.map((name) => (
            <li
              key={name}
              className="group flex flex-col items-center text-center rounded-3xl bg-white border border-gray-100 px-6 py-10 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-900 text-gold-300" aria-hidden>
                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
              <h3 className="text-xl font-bold text-gray-900">{name}</h3>
              <span className="mt-3 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">Local partner · Ghana</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
