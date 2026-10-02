'use client';
import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const areas = ['Admissions & Counseling', 'Visa Processing', 'Marketing & Content', 'Operations & Admin', 'No preference'];
const offices = ['Kumasi', 'Accra', 'No preference'];
const years = ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate', 'Final year / completing soon'];
const input = 'w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent';

export default function InternshipForm() {
  const [f, setF] = useState({ full_name: '', email: '', phone: '', institution: '', programme: '', year_of_study: years[0], area: areas[0], office: offices[0], availability: '', cv_link: '', message: '', enrolled: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.enrolled) { setError('Internships are open to current students only. Please confirm you are enrolled.'); return; }
    setLoading(true); setError(null);
    try {
      const { enrolled, ...row } = f;
      const { error: err } = await createClient().from('internship_applications').insert({ ...row, cv_link: row.cv_link || null, message: row.message || null });
      if (err) { console.error(err.message); setError('Something went wrong. Please try again.'); } else setDone(true);
    } catch { setError('Something went wrong. Please try again.'); }
    setLoading(false);
  };

  if (done) return (
    <div className="rounded-3xl bg-indigo-900 p-12 text-center">
      <p className="font-display text-3xl font-semibold text-white">Application received</p>
      <p className="mt-4 text-indigo-200">Thank you, {f.full_name.split(' ')[0]}. Our team will review it and contact you by email or phone.</p>
    </div>
  );

  const L = ({ t, children }: { t: string; children: React.ReactNode }) => <label className="block"><span className="block text-sm font-semibold text-gray-700 mb-2">{t}</span>{children}</label>;
  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-8 md:p-10 shadow-2xl shadow-indigo-900/10 ring-1 ring-indigo-100 space-y-5">
      <h2 className="font-display text-3xl font-semibold text-indigo-900">Apply now</h2>
      <div className="grid md:grid-cols-2 gap-5">
        <L t="Full name"><input required minLength={2} maxLength={120} className={input} value={f.full_name} onChange={set('full_name')} /></L>
        <L t="Email"><input required type="email" maxLength={200} className={input} value={f.email} onChange={set('email')} /></L>
        <L t="Phone / WhatsApp"><input required minLength={5} maxLength={40} className={input} value={f.phone} onChange={set('phone')} /></L>
        <L t="School / university"><input required maxLength={160} className={input} value={f.institution} onChange={set('institution')} /></L>
        <L t="Programme of study"><input required maxLength={160} className={input} value={f.programme} onChange={set('programme')} /></L>
        <L t="Year of study"><select className={input} value={f.year_of_study} onChange={set('year_of_study')}>{years.map((y) => <option key={y}>{y}</option>)}</select></L>
        <L t="Area of interest"><select className={input} value={f.area} onChange={set('area')}>{areas.map((y) => <option key={y}>{y}</option>)}</select></L>
        <L t="Preferred office"><select className={input} value={f.office} onChange={set('office')}>{offices.map((y) => <option key={y}>{y}</option>)}</select></L>
      </div>
      <L t="Availability (dates, days per week)"><input required maxLength={200} className={input} value={f.availability} onChange={set('availability')} placeholder="e.g. June to August, 3 days a week" /></L>
      <L t="CV or LinkedIn link (optional)"><input type="url" maxLength={300} className={input} value={f.cv_link} onChange={set('cv_link')} placeholder="https://" /></L>
      <L t="Why do you want to intern with us?"><textarea required rows={4} maxLength={2000} className={input} value={f.message} onChange={set('message')} /></L>
      <label className="flex items-start gap-3 text-sm text-gray-700">
        <input type="checkbox" className="mt-1 h-4 w-4" checked={f.enrolled} onChange={(e) => setF({ ...f, enrolled: e.target.checked })} />
        I confirm I am currently enrolled as a student.
      </label>
      {error && <p className="text-red-600 text-sm" role="alert">{error}</p>}
      <button disabled={loading} className="w-full bg-indigo-900 text-white font-bold py-4 rounded-full hover:bg-gold-500 hover:text-indigo-900 transition-all disabled:opacity-60">{loading ? 'Sending...' : 'Submit application'}</button>
    </form>
  );
}
