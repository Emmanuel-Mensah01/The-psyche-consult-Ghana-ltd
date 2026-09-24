'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import DocumentsPanel, { type DocumentStats } from '@/components/student-portal/DocumentsPanel';

// ── Types ──────────────────────────────────────────────────────────────────────
interface ProfileData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  country_applying_from: string;
  passport_number: string;
  address: string;
  city: string;
  country: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  education_level: string;
  school_attended: string;
  gpa: string;
  graduation_year: string;
  institution_name: string;
  preferred_country: string;
  preferred_university: string;
  preferred_course: string;
  preferred_degree: string;
  preferred_intake: string;
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

interface Message {
  id: string;
  sender_id: string;
  subject: string | null;
  body: string;
  is_announcement: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  is_read: boolean;
  created_at: string;
  sender_profile?: { full_name: string; role: string };
}

// ── Constants ──────────────────────────────────────────────────────────────────
const EDUCATION_LEVELS = [
  'High School / Secondary', 'Diploma / HND', "Bachelor\'s Degree",
  "Master\'s Degree", 'PhD / Doctorate', 'Other',
];

const DEGREE_OPTIONS = ["Bachelor\'s", "Master\'s", 'PhD', 'Diploma', 'Certificate', 'Foundation'];
const INTAKE_OPTIONS = ['January 2025', 'September 2025', 'January 2026', 'May 2026', 'September 2026', 'January 2027', 'September 2027'];

const APPLICATION_STAGES: Record<string, { label: string; color: string; bg: string; step: number }> = {
  application_received:         { label: 'Application Received',          color: 'text-blue-700',   bg: 'bg-blue-50',   step: 1 },
  profile_under_review:         { label: 'Profile Under Review',          color: 'text-indigo-700', bg: 'bg-indigo-50', step: 2 },
  documents_being_verified:     { label: 'Documents Being Verified',      color: 'text-purple-700', bg: 'bg-purple-50', step: 3 },
  documents_complete:           { label: 'Documents Complete',            color: 'text-teal-700',   bg: 'bg-teal-50',   step: 4 },
  university_application_submitted: { label: 'University Application Submitted', color: 'text-cyan-700', bg: 'bg-cyan-50', step: 5 },
  awaiting_university_response: { label: 'Awaiting University Response',  color: 'text-amber-700',  bg: 'bg-amber-50',  step: 6 },
  offer_received:               { label: 'Offer Received',                color: 'text-orange-700', bg: 'bg-orange-50', step: 7 },
  student_accepted_offer:       { label: 'Student Accepted Offer',        color: 'text-lime-700',   bg: 'bg-lime-50',   step: 8 },
  visa_documentation_in_progress: { label: 'Visa Documentation in Progress', color: 'text-green-700', bg: 'bg-green-50', step: 9 },
  visa_application_submitted:   { label: 'Visa Application Submitted',    color: 'text-emerald-700', bg: 'bg-emerald-50', step: 10 },
  visa_decision_received:       { label: 'Visa Decision Received',        color: 'text-sky-700',    bg: 'bg-sky-50',    step: 11 },
  travel_preparation:           { label: 'Travel Preparation',            color: 'text-violet-700', bg: 'bg-violet-50', step: 12 },
  process_completed:            { label: 'Process Completed',             color: 'text-green-800',  bg: 'bg-green-100', step: 13 },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
// ── Component ──────────────────────────────────────────────────────────────────
export default function StudentProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'preferences' | 'documents' | 'applications' | 'messages'>('personal');
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '', email: '', phone: '', date_of_birth: '', gender: '',
    nationality: '', country_applying_from: '', passport_number: '',
    address: '', city: '', country: '',
    emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relation: '',
    education_level: '', school_attended: '', gpa: '', graduation_year: '', institution_name: '',
    preferred_country: '', preferred_university: '', preferred_course: '',
    preferred_degree: '', preferred_intake: '',
  });
  const [docStats, setDocStats] = useState<DocumentStats>({ total: 0, uploaded: 0, pending: 0, verified: 0, needsAttention: 0 });
  const [applications, setApplications] = useState<Application[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/student-portal/login');
  }, [user, loading, router]);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) return;
    // If no user after auth loaded, stop loading state (redirect effect will handle navigation)
    if (!user) {
      setDataLoading(false);
      return;
    }
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const supabase = createClient();
        const [profileRes, appsRes, msgsRes] = await Promise.all([
          supabase.from('user_profiles').select('*').eq('id', user.id).single(),
          supabase.from('student_applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
          supabase.from('messages').select('*, sender_profile:sender_id(full_name, role)').or(`recipient_id.eq.${user.id},is_announcement.eq.true`).order('created_at', { ascending: false }),
        ]);
        if (profileRes.data) {
          const d = profileRes.data;
          setProfile({
            full_name: d.full_name || '', email: d.email || user.email || '',
            phone: d.phone || '', date_of_birth: d.date_of_birth || '',
            gender: d.gender || '', nationality: d.nationality || '',
            country_applying_from: d.country_applying_from || '',
            passport_number: d.passport_number || '', address: d.address || '',
            city: d.city || '', country: d.country || '',
            emergency_contact_name: d.emergency_contact_name || '',
            emergency_contact_phone: d.emergency_contact_phone || '',
            emergency_contact_relation: d.emergency_contact_relation || '',
            education_level: d.education_level || '', school_attended: d.school_attended || '',
            gpa: d.gpa || '', graduation_year: d.graduation_year || '',
            institution_name: d.institution_name || '',
            preferred_country: d.preferred_country || '',
            preferred_university: d.preferred_university || '',
            preferred_course: d.preferred_course || '',
            preferred_degree: d.preferred_degree || '',
            preferred_intake: d.preferred_intake || '',
          });
        }
        if (!appsRes.error) setApplications(appsRes.data || []);
        if (!msgsRes.error) setMessages(msgsRes.data || []);
      } catch (err) { console.error(err); }
      finally { setDataLoading(false); }
    };
    fetchData();
  }, [user, loading]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true); setSaveError(null); setSaveSuccess(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('user_profiles').update({
        full_name: profile.full_name, phone: profile.phone,
        date_of_birth: profile.date_of_birth || null, gender: profile.gender || null,
        nationality: profile.nationality, country_applying_from: profile.country_applying_from || null,
        passport_number: profile.passport_number, address: profile.address,
        city: profile.city, country: profile.country,
        emergency_contact_name: profile.emergency_contact_name || null,
        emergency_contact_phone: profile.emergency_contact_phone || null,
        emergency_contact_relation: profile.emergency_contact_relation || null,
        education_level: profile.education_level, school_attended: profile.school_attended || null,
        gpa: profile.gpa, graduation_year: profile.graduation_year || null,
        institution_name: profile.institution_name,
        preferred_country: profile.preferred_country, preferred_university: profile.preferred_university || null,
        preferred_course: profile.preferred_course, preferred_degree: profile.preferred_degree || null,
        preferred_intake: profile.preferred_intake || null,
      }).eq('id', user.id);
      if (error) throw error;
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally { setSaving(false); }
  };

  const handleMarkRead = async (msgId: string) => {
    const supabase = createClient();
    await supabase.from('messages').update({ is_read: true }).eq('id', msgId);
    setMessages((prev) => prev.map((m) => m.id === msgId ? { ...m, is_read: true } : m));
  };

  const handleSendReply = async () => {
    if (!replyBody.trim() || !user) return;
    setSendingReply(true);
    try {
      const supabase = createClient();
      // Find admin user to reply to
      const { data: adminProfile } = await supabase.from('user_profiles').select('id').eq('role', 'admin').limit(1).single();
      if (!adminProfile) throw new Error('No admin found');
      await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: adminProfile.id,
        subject: selectedMsg ? `Re: ${selectedMsg.subject || 'Message'}` : 'Student Reply',
        body: replyBody,
      });
      setReplyBody('');
      setSelectedMsg(null);
    } catch (err) { console.error(err); }
    finally { setSendingReply(false); }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-gray-900 text-sm";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const tabs = [
    { key: 'personal', label: 'Personal', icon: '👤' },
    { key: 'academic', label: 'Academic', icon: '🎓' },
    { key: 'preferences', label: 'Preferences', icon: '🎯' },
    { key: 'documents', label: 'Documents', icon: '📄', badge: docStats.needsAttention },
    { key: 'applications', label: 'Applications', icon: '📋', badge: applications.length },
    { key: 'messages', label: 'Messages', icon: '💬', badge: unreadCount },
  ] as { key: typeof activeTab; label: string; icon: string; badge?: number }[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/student-portal/dashboard')} className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
              Back to Dashboard
            </button>
            <span className="text-gray-300">|</span>
            <span className="text-gray-900 font-semibold text-sm">My Profile</span>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60">
            {saving ? <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : null}
            {saving ? 'Saving...' : saveSuccess ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {saveError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{saveError}</div>}

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all relative ${activeTab === tab.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge ? <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">{tab.badge}</span> : null}
            </button>
          ))}
        </div>

        {/* ── PERSONAL TAB ── */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
            <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Full Name</label><input type="text" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Email Address</label><input type="email" value={profile.email} disabled className={`${inputClass} bg-gray-50 cursor-not-allowed`} /></div>
              <div><label className={labelClass}>Phone Number</label><input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Date of Birth</label><input type="date" value={profile.date_of_birth} onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Gender</label>
                <select value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {['Male', 'Female', 'Prefer not to say'].map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>Nationality</label><input type="text" value={profile.nationality} onChange={(e) => setProfile({ ...profile, nationality: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Country Applying From</label><input type="text" value={profile.country_applying_from} onChange={(e) => setProfile({ ...profile, country_applying_from: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Passport Number</label><input type="text" value={profile.passport_number} onChange={(e) => setProfile({ ...profile, passport_number: e.target.value })} className={inputClass} /></div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2"><label className={labelClass}>Residential Address</label><input type="text" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>City</label><input type="text" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className={inputClass} /></div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3 mt-2">Emergency Contact</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div><label className={labelClass}>Contact Name</label><input type="text" value={profile.emergency_contact_name} onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Contact Phone</label><input type="tel" value={profile.emergency_contact_phone} onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Relationship</label><input type="text" value={profile.emergency_contact_relation} onChange={(e) => setProfile({ ...profile, emergency_contact_relation: e.target.value })} className={inputClass} /></div>
              </div>
            </div>
          </div>
        )}

        {/* ── ACADEMIC TAB ── */}
        {activeTab === 'academic' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Academic Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Highest Qualification</label>
                <select value={profile.education_level} onChange={(e) => setProfile({ ...profile, education_level: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div><label className={labelClass}>School / Institution Attended</label><input type="text" value={profile.school_attended} onChange={(e) => setProfile({ ...profile, school_attended: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Institution Name (University)</label><input type="text" value={profile.institution_name} onChange={(e) => setProfile({ ...profile, institution_name: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>GPA / Grade</label><input type="text" value={profile.gpa} onChange={(e) => setProfile({ ...profile, gpa: e.target.value })} placeholder="e.g. 3.5 / 4.0 or A" className={inputClass} /></div>
              <div><label className={labelClass}>Graduation Year</label><input type="text" value={profile.graduation_year} onChange={(e) => setProfile({ ...profile, graduation_year: e.target.value })} placeholder="e.g. 2023" className={inputClass} /></div>
            </div>
          </div>
        )}

        {/* ── PREFERENCES TAB ── */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Study Preferences</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelClass}>Preferred Country</label><input type="text" value={profile.preferred_country} onChange={(e) => setProfile({ ...profile, preferred_country: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Preferred University (Optional)</label><input type="text" value={profile.preferred_university} onChange={(e) => setProfile({ ...profile, preferred_university: e.target.value })} className={inputClass} /></div>
              <div><label className={labelClass}>Preferred Course</label><input type="text" value={profile.preferred_course} onChange={(e) => setProfile({ ...profile, preferred_course: e.target.value })} className={inputClass} /></div>
              <div>
                <label className={labelClass}>Preferred Degree</label>
                <select value={profile.preferred_degree} onChange={(e) => setProfile({ ...profile, preferred_degree: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {DEGREE_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Preferred Intake</label>
                <select value={profile.preferred_intake} onChange={(e) => setProfile({ ...profile, preferred_intake: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  {INTAKE_OPTIONS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === 'documents' && (
          <DocumentsPanel
            title="My Documents"
            subtitle="Upload the documents your consultant needs — they're reviewed by our team and the status updates here."
            onStatsChange={setDocStats}
          />
        )}

        {/* ── APPLICATIONS TAB ── */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <p className="text-gray-500 font-medium">No applications yet</p>
                <p className="text-gray-400 text-sm mt-1">Go to the dashboard to browse and apply to universities</p>
                <Link href="/student-portal/dashboard" className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                  Browse Opportunities
                </Link>
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
                        <p className="text-sm text-gray-500">{app.program_name} · {app.degree_level} · {app.country_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Intake: {app.intake_name || '—'} · Applied: {formatDate(app.created_at)}</p>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${stage.bg} ${stage.color} whitespace-nowrap`}>{stage.label}</span>
                    </div>
                    {/* Progress Timeline */}
                    <div className="mt-4">
                      <div className="flex items-center gap-1 overflow-x-auto pb-2">
                        {stageKeys.map((key, idx) => {
                          const s = APPLICATION_STAGES[key];
                          const done = idx <= currentIdx;
                          const active = idx === currentIdx;
                          return (
                            <React.Fragment key={key}>
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? (active ? 'bg-indigo-600 text-white ring-2 ring-indigo-200' : 'bg-green-500 text-white') : 'bg-gray-200 text-gray-400'}`}>
                                {done && !active ? '✓' : s.step}
                              </div>
                              {idx < stageKeys.length - 1 && <div className={`flex-shrink-0 h-0.5 w-4 ${idx < currentIdx ? 'bg-green-400' : 'bg-gray-200'}`} />}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Current stage: <span className="font-semibold text-indigo-600">{stage.label}</span> (Step {stage.step} of 13)</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-gray-300"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                <p className="text-gray-500 text-sm">No messages yet</p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {messages.map((msg) => (
                    <div key={msg.id} onClick={() => { setSelectedMsg(msg); handleMarkRead(msg.id); }}
                      className={`bg-white rounded-xl border p-4 cursor-pointer hover:border-indigo-200 transition-colors ${!msg.is_read ? 'border-indigo-300 bg-indigo-50/30' : 'border-gray-100'}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {msg.is_announcement && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">Announcement</span>}
                            {!msg.is_read && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                            <p className="font-semibold text-gray-900 text-sm truncate">{msg.subject || 'Message from Psyche Consult'}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{msg.body}</p>
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply form */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Send a Message to Psyche Consult</h3>
                  <textarea value={replyBody} onChange={(e) => setReplyBody(e.target.value)} rows={3}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-sm resize-none" />
                  <button onClick={handleSendReply} disabled={sendingReply || !replyBody.trim()}
                    className="mt-3 flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60">
                    {sendingReply ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
