'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import DocumentsPanel, { type DocumentStats } from '@/components/student-portal/DocumentsPanel';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ProfileData {
  full_name: string;
  phone: string;
  nationality: string;
  preferred_country: string;
  preferred_course: string;
  education_level: string;
  passport_number: string;
  address: string;
  gender: string;
  date_of_birth: string;
}

interface Application {
  id: string;
  country_name: string | null;
  university_name: string | null;
  program_name: string | null;
  intake_name: string | null;
  degree_level: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: string;
  is_read: boolean;
  created_at: string;
}

interface Message {
  id: string;
  subject: string | null;
  body: string;
  is_read: boolean;
  is_announcement: boolean;
  created_at: string;
}

interface StudyCountry {
  id: string;
  name: string;
  flag_emoji: string | null;
  description: string | null;
  image_url: string | null;
}

interface University {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  logo_url: string | null;
  country_id: string;
  is_partner: boolean;
}

interface Program {
  id: string;
  name: string;
  degree_level: string;
  duration: string | null;
  tuition_fee: string | null;
  entry_requirements: string | null;
  university_id: string;
}

interface Intake {
  id: string;
  intake_name: string;
  start_date: string | null;
  application_deadline: string | null;
  is_open: boolean;
  university_id: string;
  program_id: string | null;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const APPLICATION_STAGES: Record<string, { label: string; color: string; bg: string; step: number }> = {
  application_received:             { label: 'Application Received',          color: 'text-blue-700',   bg: 'bg-blue-50',   step: 1 },
  profile_under_review:             { label: 'Profile Under Review',          color: 'text-indigo-700', bg: 'bg-indigo-50', step: 2 },
  documents_being_verified:         { label: 'Documents Being Verified',      color: 'text-purple-700', bg: 'bg-purple-50', step: 3 },
  documents_complete:               { label: 'Documents Complete',            color: 'text-teal-700',   bg: 'bg-teal-50',   step: 4 },
  university_application_submitted: { label: 'University Application Submitted', color: 'text-cyan-700', bg: 'bg-cyan-50', step: 5 },
  awaiting_university_response:     { label: 'Awaiting University Response',  color: 'text-amber-700',  bg: 'bg-amber-50',  step: 6 },
  offer_received:                   { label: 'Offer Received',                color: 'text-orange-700', bg: 'bg-orange-50', step: 7 },
  student_accepted_offer:           { label: 'Student Accepted Offer',        color: 'text-lime-700',   bg: 'bg-lime-50',   step: 8 },
  visa_documentation_in_progress:   { label: 'Visa Documentation in Progress', color: 'text-green-700', bg: 'bg-green-50', step: 9 },
  visa_application_submitted:       { label: 'Visa Application Submitted',    color: 'text-emerald-700', bg: 'bg-emerald-50', step: 10 },
  visa_decision_received:           { label: 'Visa Decision Received',        color: 'text-sky-700',    bg: 'bg-sky-50',    step: 11 },
  travel_preparation:               { label: 'Travel Preparation',            color: 'text-violet-700', bg: 'bg-violet-50', step: 12 },
  process_completed:                { label: 'Process Completed',             color: 'text-green-800',  bg: 'bg-green-100', step: 13 },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function computeProfileCompletion(profile: ProfileData | null): number {
  if (!profile) return 0;
  const fields = [
    profile.full_name, profile.phone, profile.nationality, profile.preferred_country,
    profile.preferred_course, profile.education_level, profile.passport_number,
    profile.address, profile.gender, profile.date_of_birth,
  ];
  const filled = fields.filter((f) => f && f.trim() !== '').length;
  return Math.round((filled / fields.length) * 100);
}

// ── Apply Modal ────────────────────────────────────────────────────────────────
interface ApplyModalProps {
  countries: StudyCountry[];
  universities: University[];
  programs: Program[];
  intakes: Intake[];
  userId: string;
  onClose: () => void;
  onSuccess: () => void;
}

function ApplyModal({ countries, universities, programs, intakes, userId, onClose, onSuccess }: ApplyModalProps) {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedIntake, setSelectedIntake] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredUniversities = universities.filter((u) => !selectedCountry || u.country_id === selectedCountry);
  const filteredPrograms = programs.filter((p) => !selectedUniversity || p.university_id === selectedUniversity);
  const filteredIntakes = intakes.filter((i) => (!selectedUniversity || i.university_id === selectedUniversity) && (!selectedProgram || !i.program_id || i.program_id === selectedProgram));

  const country = countries.find((c) => c.id === selectedCountry);
  const university = universities.find((u) => u.id === selectedUniversity);
  const program = programs.find((p) => p.id === selectedProgram);
  const intake = intakes.find((i) => i.id === selectedIntake);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCountry) { setError('Please select a country'); return; }
    setSubmitting(true); setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.from('student_applications').insert({
        user_id: userId,
        country_id: selectedCountry || null,
        university_id: selectedUniversity || null,
        program_id: selectedProgram || null,
        intake_id: selectedIntake || null,
        country_name: country?.name || null,
        university_name: university?.name || null,
        program_name: program?.name || null,
        intake_name: intake?.intake_name || null,
        degree_level: program?.degree_level || null,
        status: 'application_received',
      });
      if (err) throw err;
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally { setSubmitting(false); }
  };

  const selectClass = "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-sm";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Submit Application</h2>
            <p className="text-sm text-gray-500 mt-0.5">Your profile and documents will be automatically attached</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Country <span className="text-red-500">*</span></label>
            <select required value={selectedCountry} onChange={(e) => { setSelectedCountry(e.target.value); setSelectedUniversity(''); setSelectedProgram(''); setSelectedIntake(''); }} className={selectClass}>
              <option value="">Select a country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.flag_emoji} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">University</label>
            <select value={selectedUniversity} onChange={(e) => { setSelectedUniversity(e.target.value); setSelectedProgram(''); setSelectedIntake(''); }} className={selectClass}>
              <option value="">Select a university</option>
              {filteredUniversities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Program / Course</label>
            <select value={selectedProgram} onChange={(e) => { setSelectedProgram(e.target.value); setSelectedIntake(''); }} className={selectClass}>
              <option value="">Select a program</option>
              {filteredPrograms.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.degree_level})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Intake</label>
            <select value={selectedIntake} onChange={(e) => setSelectedIntake(e.target.value)} className={selectClass}>
              <option value="">Select an intake</option>
              {filteredIntakes.map((i) => <option key={i.id} value={i.id}>{i.intake_name}{i.application_deadline ? ` (Deadline: ${formatDate(i.application_deadline)})` : ''}</option>)}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border-2 border-gray-200 text-gray-700 py-2.5 rounded-xl font-semibold text-sm hover:border-gray-300 transition-colors">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-xl font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Submitting...</> : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function StudentPortalDashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [countries, setCountries] = useState<StudyCountry[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'opportunities' | 'applications'>('overview');
  const [docStats, setDocStats] = useState<DocumentStats>({ total: 0, uploaded: 0, pending: 0, verified: 0, needsAttention: 0 });
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/student-portal/login');
  }, [user, loading, router]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const supabase = createClient();
      const [profileRes, appsRes, notifsRes, msgsRes, countriesRes, univRes, progsRes, intakesRes] = await Promise.all([
        supabase.from('user_profiles').select('full_name,phone,nationality,preferred_country,preferred_course,education_level,passport_number,address,gender,date_of_birth').eq('id', user.id).single(),
        supabase.from('student_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
        supabase.from('messages').select('id,subject,body,is_read,is_announcement,created_at').or(`recipient_id.eq.${user.id},is_announcement.eq.true`).order('created_at', { ascending: false }).limit(5),
        supabase.from('study_countries').select('*').eq('is_active', true).order('display_order'),
        supabase.from('universities').select('*').eq('is_active', true).order('display_order'),
        supabase.from('programs').select('*').eq('is_active', true),
        supabase.from('intakes').select('*').eq('is_open', true),
      ]);
      if (!profileRes.error) setProfile(profileRes.data);
      if (!appsRes.error) setApplications(appsRes.data || []);
      if (!notifsRes.error) setNotifications(notifsRes.data || []);
      if (!msgsRes.error) setMessages(msgsRes.data || []);
      if (!countriesRes.error) setCountries(countriesRes.data || []);
      if (!univRes.error) setUniversities(univRes.data || []);
      if (!progsRes.error) setPrograms(progsRes.data || []);
      if (!intakesRes.error) setIntakes(intakesRes.data || []);
    } catch (err) { console.error(err); }
    finally { setDataLoading(false); }
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSignOut = async () => {
    try { await signOut(); } catch (_err) { /* ignore */ }
    router.replace('/student-portal/login');
  };

  const markNotificationRead = async (id: string) => {
    const supabase = createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n));
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || profile?.full_name || user?.email?.split('@')[0] || 'Student';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  const profileCompletion = computeProfileCompletion(profile);
  const unreadMessages = messages.filter((m) => !m.is_read).length;
  const unreadNotifications = notifications.filter((n) => !n.is_read).length;
  const latestApp = applications[0];
  const latestStage = latestApp ? (APPLICATION_STAGES[latestApp.status] || APPLICATION_STAGES['application_received']) : null;

  const filteredUniversities = selectedCountryFilter
    ? universities.filter((u) => u.country_id === selectedCountryFilter)
    : universities;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">The Psyche Consult Ghana Ltd</span>
            </Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <span className="text-indigo-600 font-semibold hidden sm:block text-sm">Student Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveTab('documents')} className="relative flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="hidden sm:block">Documents</span>
              {docStats.needsAttention > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{docStats.needsAttention}</span>}
            </button>
            <Link href="/student-portal/profile" className="relative flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span className="hidden sm:block">Profile</span>
              {unreadMessages > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">{unreadMessages}</span>}
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{initials}</div>
              <span className="text-gray-700 font-medium hidden sm:block text-sm">{displayName}</span>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Apply Success Banner */}
        {applySuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Application submitted successfully!</p>
              <p className="text-xs text-green-700 mt-0.5">Your profile and documents have been automatically attached. Our team will review your application shortly.</p>
            </div>
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10">
            <p className="text-indigo-200 font-medium mb-1">Welcome back,</p>
            <h1 className="text-3xl font-bold mb-2">{displayName} 👋</h1>
            <p className="text-indigo-100 max-w-lg text-sm">Your study abroad journey is in progress. Browse opportunities, submit applications, and track your progress below.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button onClick={() => { setShowApplyModal(true); setApplySuccess(false); }}
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                Submit Application
              </button>
              <Link href="/student-portal/profile"
                className="inline-flex items-center gap-2 bg-white/20 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition-all text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                My Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-full sm:w-auto sm:inline-flex">
          {([
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'documents', label: 'Documents', icon: '📄', badge: docStats.needsAttention || docStats.total },
            { key: 'opportunities', label: 'Study Opportunities', icon: '🌍' },
            { key: 'applications', label: 'My Applications', icon: '📋', badge: applications.length },
          ] as { key: typeof activeTab; label: string; icon: string; badge?: number }[]).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
              {tab.badge ? <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${tab.key === 'documents' && docStats.needsAttention > 0 ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>{tab.badge}</span> : null}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Profile Complete', value: `${profileCompletion}%`, sub: profileCompletion < 100 ? 'Complete your profile' : 'All done!', color: profileCompletion === 100 ? 'text-green-600' : 'text-indigo-600', onClick: () => router.push('/student-portal/profile') },
                { label: 'Applications', value: applications.length, sub: `${applications.filter((a) => a.status !== 'process_completed').length} active`, color: 'text-purple-600', onClick: () => setActiveTab('applications') },
                { label: 'Documents', value: docStats.total, sub: `${docStats.verified} verified`, color: 'text-teal-600', onClick: () => setActiveTab('documents') },
                { label: 'Messages', value: unreadMessages, sub: 'unread messages', color: 'text-rose-600', onClick: () => router.push('/student-portal/profile') },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 cursor-pointer hover:border-indigo-200 transition-colors"
                  onClick={stat.onClick}>
                  <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Profile Completion Bar */}
            {profileCompletion < 100 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-amber-800 text-sm">Complete your profile to improve your application</p>
                  <Link href="/student-portal/profile" className="text-xs text-amber-700 font-semibold hover:underline">Complete Now →</Link>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full transition-all" style={{ width: `${profileCompletion}%` }} />
                </div>
                <p className="text-xs text-amber-600 mt-1">{profileCompletion}% complete</p>
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Latest Application Status */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>📋</span> Current Application Status
                </h3>
                {latestApp && latestStage ? (
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{latestApp.university_name || 'Application Submitted'}</p>
                    <p className="text-xs text-gray-500 mb-3">{latestApp.program_name} · {latestApp.country_name}</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold ${latestStage.bg} ${latestStage.color}`}>
                      <span className="w-2 h-2 rounded-full bg-current opacity-60" />
                      {latestStage.label}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Step {latestStage.step} of 13 · Updated {formatDate(latestApp.updated_at)}</p>
                    <button onClick={() => setActiveTab('applications')} className="mt-3 text-xs text-indigo-600 font-semibold hover:underline">View full timeline →</button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-400 text-sm mb-3">No applications yet</p>
                    <button onClick={() => setShowApplyModal(true)} className="text-xs bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">Submit Application</button>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>🔔</span> Notifications
                  {unreadNotifications > 0 && <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">{unreadNotifications}</span>}
                </h3>
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">No notifications</p>
                ) : (
                  <div className="space-y-2">
                    {notifications.slice(0, 4).map((n) => (
                      <div key={n.id} onClick={() => markNotificationRead(n.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-colors ${!n.is_read ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'}`}>
                        <div className="flex items-start gap-2">
                          {!n.is_read && <span className="w-2 h-2 bg-indigo-500 rounded-full mt-1 flex-shrink-0" />}
                          <div>
                            <p className="text-xs font-semibold text-gray-800">{n.title}</p>
                            {n.body && <p className="text-xs text-gray-500 mt-0.5">{n.body}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Messages */}
            {messages.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2"><span>💬</span> Recent Messages</h3>
                  <Link href="/student-portal/profile" className="text-xs text-indigo-600 font-semibold hover:underline">View All →</Link>
                </div>
                <div className="space-y-2">
                  {messages.slice(0, 3).map((msg) => (
                    <div key={msg.id} className={`p-3 rounded-xl ${!msg.is_read ? 'bg-indigo-50 border border-indigo-100' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {!msg.is_read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                          {msg.is_announcement && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">Announcement</span>}
                          <p className="text-xs font-semibold text-gray-800 truncate">{msg.subject || 'Message from Psyche Consult'}</p>
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatDate(msg.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Required Actions */}
            {(profileCompletion < 100 || docStats.needsAttention > 0) && (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><span>⚡</span> Required Actions</h3>
                <div className="space-y-2">
                  {profileCompletion < 100 && (
                    <Link href="/student-portal/profile" className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-300 transition-colors">
                      <span className="text-amber-500">⚠️</span>
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Complete your profile</p>
                        <p className="text-xs text-amber-600">{profileCompletion}% complete — fill in missing details</p>
                      </div>
                    </Link>
                  )}
                  {docStats.needsAttention > 0 && (
                    <button onClick={() => setActiveTab('documents')} className="w-full flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl hover:border-red-300 transition-colors text-left">
                      <span className="text-red-500">📄</span>
                      <div>
                        <p className="text-sm font-semibold text-red-800">Documents need attention</p>
                        <p className="text-xs text-red-600">{docStats.needsAttention} document(s) rejected or require re-upload</p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {/* Mounted whenever the dashboard loads (not just when this tab is opened) so the
            Overview stats and the Documents nav badge always reflect the latest upload status. */}
        <div className={activeTab === 'documents' ? '' : 'hidden'}>
          <DocumentsPanel
            title="My Documents"
            subtitle="Upload the documents your consultant needs — they're reviewed by our team and the status updates here."
            onStatsChange={setDocStats}
          />
        </div>

        {/* ── OPPORTUNITIES TAB ── */}
        {activeTab === 'opportunities' && (
          <div className="space-y-6">
            {dataLoading ? (
              <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>
            ) : (
              <>
                {/* Countries */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Study Destinations</h2>
                  {countries.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                      <p className="text-sm">No study destinations available yet. Check back soon!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {countries.map((c) => (
                        <button key={c.id} onClick={() => setSelectedCountryFilter(selectedCountryFilter === c.id ? '' : c.id)}
                          className={`bg-white rounded-2xl border p-4 text-left hover:border-indigo-300 transition-all ${selectedCountryFilter === c.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100'}`}>
                          <div className="text-3xl mb-2">{c.flag_emoji || '🌍'}</div>
                          <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                          {c.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>}
                          <p className="text-xs text-indigo-600 mt-2 font-semibold">{universities.filter((u) => u.country_id === c.id).length} universities</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Universities */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                      Universities {selectedCountryFilter ? `in ${countries.find((c) => c.id === selectedCountryFilter)?.name}` : ''}
                    </h2>
                    {selectedCountryFilter && (
                      <button onClick={() => setSelectedCountryFilter('')} className="text-xs text-gray-500 hover:text-gray-700 font-medium">Clear filter ×</button>
                    )}
                  </div>
                  {filteredUniversities.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400">
                      <p className="text-sm">No universities available for this destination yet.</p>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredUniversities.map((u) => {
                        const uniPrograms = programs.filter((p) => p.university_id === u.id);
                        const uniIntakes = intakes.filter((i) => i.university_id === u.id);
                        const countryName = countries.find((c) => c.id === u.country_id)?.name;
                        return (
                          <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:border-indigo-200 transition-colors">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">🏛️</div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-gray-900 text-sm leading-tight">{u.name}</p>
                                <p className="text-xs text-gray-500">{u.location}{countryName ? `, ${countryName}` : ''}</p>
                                {u.is_partner && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Partner University</span>}
                              </div>
                            </div>
                            {u.description && <p className="text-xs text-gray-600 mb-3 line-clamp-2">{u.description}</p>}
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>📚 {uniPrograms.length} programs</span>
                              <span>📅 {uniIntakes.length} intakes</span>
                            </div>
                            {uniPrograms.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {uniPrograms.slice(0, 3).map((p) => (
                                  <div key={p.id} className="flex items-center justify-between text-xs">
                                    <span className="text-gray-700 truncate">{p.name}</span>
                                    <span className="text-indigo-600 font-semibold ml-2 flex-shrink-0">{p.degree_level}</span>
                                  </div>
                                ))}
                                {uniPrograms.length > 3 && <p className="text-xs text-gray-400">+{uniPrograms.length - 3} more programs</p>}
                              </div>
                            )}
                            <button onClick={() => setShowApplyModal(true)}
                              className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors">
                              Apply Now
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">My Applications ({applications.length})</h2>
              <button onClick={() => setShowApplyModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                New Application
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <p className="text-gray-500 font-medium">No applications yet</p>
                <p className="text-gray-400 text-sm mt-1">Browse study opportunities and submit your first application</p>
                <button onClick={() => { setActiveTab('opportunities'); }} className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  Browse Opportunities
                </button>
              </div>
            ) : (
              applications.map((app) => {
                const stage = APPLICATION_STAGES[app.status] || APPLICATION_STAGES['application_received'];
                const stageKeys = Object.keys(APPLICATION_STAGES);
                const currentIdx = stageKeys.indexOf(app.status);
                return (
                  <div key={app.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-gray-900">{app.university_name || 'University TBD'}</h3>
                        <p className="text-sm text-gray-500">{app.program_name || 'Program TBD'} · {app.degree_level || ''} · {app.country_name || ''}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Intake: {app.intake_name || '—'} · Applied: {formatDate(app.created_at)}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${stage.bg} ${stage.color} whitespace-nowrap`}>{stage.label}</span>
                    </div>

                    {/* Full 13-stage timeline */}
                    <div className="mt-4 border-t border-gray-50 pt-4">
                      <p className="text-xs font-semibold text-gray-500 mb-3">Application Progress — Step {stage.step} of 13</p>
                      <div className="space-y-2">
                        {stageKeys.map((key, idx) => {
                          const s = APPLICATION_STAGES[key];
                          const done = idx < currentIdx;
                          const active = idx === currentIdx;
                          const upcoming = idx > currentIdx;
                          return (
                            <div key={key} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${active ? 'bg-indigo-50' : ''}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${done ? 'bg-green-500 text-white' : active ? 'bg-indigo-600 text-white ring-2 ring-indigo-200' : 'bg-gray-200 text-gray-400'}`}>
                                {done ? '✓' : s.step}
                              </div>
                              <span className={`text-xs font-medium ${active ? 'text-indigo-700 font-semibold' : done ? 'text-green-700' : upcoming ? 'text-gray-400' : 'text-gray-600'}`}>
                                {s.label}
                              </span>
                              {active && <span className="ml-auto text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-semibold">Current</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && user && (
        <ApplyModal
          countries={countries}
          universities={universities}
          programs={programs}
          intakes={intakes}
          userId={user.id}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setApplySuccess(true);
            fetchData();
            setTimeout(() => setApplySuccess(false), 8000);
          }}
        />
      )}
    </div>
  );
}
