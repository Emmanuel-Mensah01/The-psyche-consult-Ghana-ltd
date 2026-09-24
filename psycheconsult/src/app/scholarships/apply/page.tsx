'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { createClient } from '@/lib/supabase/client';

const PROGRAM_OPTIONS = [
  'Undergraduate (Bachelor\'s Degree)',
  'Postgraduate (Master\'s Degree)',
  'Doctoral (PhD)',
  'Diploma / Certificate',
  'Foundation / Pre-University',
  'Professional Certification',
];

const COUNTRY_OPTIONS = [
  'United Kingdom',
  'United States',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'New Zealand',
  'Ireland',
  'Sweden',
  'Norway',
  'Finland',
  'Other',
];

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  program_choice: string;
  country_preference: string;
  academic_background: string;
  personal_statement: string;
  why_scholarship: string;
  future_goals: string;
}

const initialForm: FormData = {
  full_name: '',
  email: '',
  phone: '',
  program_choice: '',
  country_preference: '',
  academic_background: '',
  personal_statement: '',
  why_scholarship: '',
  future_goals: '',
};

export default function ScholarshipApplyPage() {
  const supabase = createClient();
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateStep1 = () => {
    if (!form.full_name.trim()) return 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'A valid email address is required.';
    if (!form.program_choice) return 'Please select a program level.';
    if (!form.country_preference) return 'Please select a country preference.';
    return '';
  };

  const validateStep2 = () => {
    if (!form.personal_statement.trim() || form.personal_statement.trim().length < 100)
      return 'Personal statement must be at least 100 characters.';
    if (!form.why_scholarship.trim() || form.why_scholarship.trim().length < 80)
      return 'Please explain why you deserve this scholarship (at least 80 characters).';
    return '';
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) { setError(err); return; }
    setError('');
    setSubmitting(true);
    try {
      const { error: dbError } = await supabase.from('scholarship_applications').insert({
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        program_choice: form.program_choice,
        country_preference: form.country_preference,
        academic_background: form.academic_background.trim() || null,
        personal_statement: form.personal_statement.trim(),
        why_scholarship: form.why_scholarship.trim(),
        future_goals: form.future_goals.trim() || null,
        status: 'submitted',
      });
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 pt-20">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
            <p className="text-gray-500 mb-2 text-lg">
              Thank you, <span className="font-semibold text-indigo-600">{form.full_name}</span>.
            </p>
            <p className="text-gray-500 mb-8">
              Your scholarship application has been received. Our team will review it and get back to you at <span className="font-medium text-gray-700">{form.email}</span> within 3–5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/scholarships"
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
              >
                Browse More Scholarships
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            🎓 Scholarship Application
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Apply for a <span className="text-indigo-300">Scholarship</span>
          </h1>
          <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
            Complete the form below and our counselors will match you with the best scholarship opportunities for your profile.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-6">

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-10">
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${step >= s ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${step >= s ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-gray-300 text-gray-400'}`}>
                    {step > s ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    ) : s}
                  </div>
                  <span className="text-sm font-semibold hidden sm:block">
                    {s === 1 ? 'Personal Details' : 'Essays & Goals'}
                  </span>
                </div>
                {s < 2 && <div className={`flex-1 h-0.5 rounded-full transition-all ${step > s ? 'bg-indigo-600' : 'bg-gray-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                {error}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Personal Information</h2>
                  <p className="text-sm text-gray-500">Tell us about yourself and your study preferences.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="e.g. Kwame Mensah"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+233 XX XXX XXXX"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Program Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="program_choice"
                      value={form.program_choice}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select program level</option>
                      {PROGRAM_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Country Preference <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="country_preference"
                      value={form.country_preference}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select country</option>
                      {COUNTRY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Academic Background</label>
                  <textarea
                    name="academic_background"
                    value={form.academic_background}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Briefly describe your educational history, grades, and any relevant qualifications..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  Continue to Essays
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </button>
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Essays & Goals</h2>
                  <p className="text-sm text-gray-500">Share your story and aspirations. Be specific and authentic.</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Personal Statement <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(min. 100 characters)</span>
                  </label>
                  <textarea
                    name="personal_statement"
                    value={form.personal_statement}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Introduce yourself — your background, interests, and what drives you academically and professionally..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.personal_statement.length} characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Why Do You Deserve This Scholarship? <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-1">(min. 80 characters)</span>
                  </label>
                  <textarea
                    name="why_scholarship"
                    value={form.why_scholarship}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Explain your financial need, academic merit, community involvement, or any other compelling reason..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.why_scholarship.length} characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Future Goals & Career Plans</label>
                  <textarea
                    name="future_goals"
                    value={form.future_goals}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your career aspirations and how studying abroad will help you achieve them..."
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { setStep(1); setError(''); }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22 11 13 2 9l20-7z"/></svg>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Trust signals */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { icon: '🔒', label: 'Secure & Private', sub: 'Your data is protected' },
              { icon: '⚡', label: 'Fast Review', sub: '3–5 business days' },
              { icon: '🎯', label: 'Expert Matching', sub: 'Personalised guidance' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="text-2xl mb-1">{item.icon}</div>
                <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
