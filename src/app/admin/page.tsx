'use client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import BookingsPanel from '@/components/BookingsPanel';
import InquiriesPanel from '@/components/InquiriesPanel';

// ── Types ──────────────────────────────────────────────────────────────────────
interface StudentProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  nationality: string | null;
  country_applying_from: string | null;
  education_level: string | null;
  preferred_country: string | null;
  preferred_course: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface StudentDocument {
  id: string;
  user_id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  status: string;
  notes: string | null;
  admin_comment: string | null;
  created_at: string;
  user_profiles?: { full_name: string; email: string };
}

interface StudentApplication {
  id: string;
  user_id: string;
  country_name: string | null;
  university_name: string | null;
  program_name: string | null;
  intake_name: string | null;
  degree_level: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  user_profiles?: { full_name: string; email: string; phone: string | null };
}

interface StudyCountry {
  id: string;
  name: string;
  flag_emoji: string | null;
  description: string | null;
  is_active: boolean;
  display_order: number;
}

interface University {
  id: string;
  country_id: string | null;
  name: string;
  description: string | null;
  location: string | null;
  ranking: string | null;
  is_partner: boolean;
  is_active: boolean;
  display_order: number;
}

interface Program {
  id: string;
  university_id: string;
  name: string;
  degree_level: string;
  duration: string | null;
  tuition_fee: string | null;
  entry_requirements: string | null;
  description: string | null;
  is_active: boolean;
}

interface Intake {
  id: string;
  university_id: string;
  program_id: string | null;
  intake_name: string;
  start_date: string | null;
  application_deadline: string | null;
  is_open: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string | null;
  subject: string | null;
  body: string;
  is_announcement: boolean;
  attachment_url: string | null;
  attachment_name: string | null;
  is_read: boolean;
  created_at: string;
  sender_profile?: { full_name: string };
  recipient_profile?: { full_name: string; email: string };
}

interface Testimonial {
  id: string; student_name: string; university: string; destination: string;
  video_url: string | null; thumbnail_url: string | null; quote: string | null;
  is_published: boolean; display_order: number; created_at: string;
}

interface ContentItem {
  id: string; title: string; description: string | null; content_type: string;
  image_url: string | null; link_url: string | null; is_published: boolean;
  display_order: number; expires_at: string | null; created_at: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const APPLICATION_STAGES = [
  'application_received', 'profile_under_review', 'documents_being_verified',
  'documents_complete', 'university_application_submitted', 'awaiting_university_response',
  'offer_received', 'student_accepted_offer', 'visa_documentation_in_progress',
  'visa_application_submitted', 'visa_decision_received', 'travel_preparation', 'process_completed',
];

const STAGE_LABELS: Record<string, string> = {
  application_received: 'Application Received',
  profile_under_review: 'Profile Under Review',
  documents_being_verified: 'Documents Being Verified',
  documents_complete: 'Documents Complete',
  university_application_submitted: 'University Application Submitted',
  awaiting_university_response: 'Awaiting University Response',
  offer_received: 'Offer Received',
  student_accepted_offer: 'Student Accepted Offer',
  visa_documentation_in_progress: 'Visa Documentation in Progress',
  visa_application_submitted: 'Visa Application Submitted',
  visa_decision_received: 'Visa Decision Received',
  travel_preparation: 'Travel Preparation',
  process_completed: 'Process Completed',
};

const STAGE_COLORS: Record<string, string> = {
  application_received: 'bg-blue-50 text-blue-700',
  profile_under_review: 'bg-indigo-50 text-indigo-700',
  documents_being_verified: 'bg-purple-50 text-purple-700',
  documents_complete: 'bg-teal-50 text-teal-700',
  university_application_submitted: 'bg-cyan-50 text-cyan-700',
  awaiting_university_response: 'bg-amber-50 text-amber-700',
  offer_received: 'bg-orange-50 text-orange-700',
  student_accepted_offer: 'bg-lime-50 text-lime-700',
  visa_documentation_in_progress: 'bg-green-50 text-green-700',
  visa_application_submitted: 'bg-emerald-50 text-emerald-700',
  visa_decision_received: 'bg-sky-50 text-sky-700',
  travel_preparation: 'bg-violet-50 text-violet-700',
  process_completed: 'bg-green-100 text-green-800',
};

const DOC_STATUS_OPTIONS = ['uploaded', 'pending', 'verified', 'rejected', 're_upload'];
const DOC_STATUS_COLORS: Record<string, string> = {
  uploaded: 'bg-blue-50 text-blue-700',
  pending: 'bg-amber-50 text-amber-700',
  verified: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  re_upload: 'bg-orange-50 text-orange-700',
};

type AdminTab = 'overview' | 'students' | 'applications' | 'documents' | 'bookings' | 'inquiries' | 'opportunities' | 'messages' | 'content';

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const supabase = createClient();

  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Data
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [documents, setDocuments] = useState<StudentDocument[]>([]);
  const [countries, setCountries] = useState<StudyCountry[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [pendingBookings, setPendingBookings] = useState(0);

  const [newInquiries, setNewInquiries] = useState(0);

  // Badges for Bookings (pending) and Inquiries (new), refreshed on load
  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      const [a, c, l, ct] = await Promise.all([
        supabase.from('booking_requests').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      ]);
      setPendingBookings((a.count || 0) + (c.count || 0));
      setNewInquiries((l.count || 0) + (ct.count || 0));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Document signed URLs cache
  const [documentUrls, setDocumentUrls] = useState<Record<string, string>>({});

  // Filters
  const [studentSearch, setStudentSearch] = useState('');
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('all');
  const [docSearch, setDocSearch] = useState('');
  const [docStatusFilter, setDocStatusFilter] = useState('all');

  // Updating states
  const [updatingAppId, setUpdatingAppId] = useState<string | null>(null);
  const [updatingDocId, setUpdatingDocId] = useState<string | null>(null);
  const [docCommentEdits, setDocCommentEdits] = useState<Record<string, string>>({});
  const [savingCommentId, setSavingCommentId] = useState<string | null>(null);
  const [appNoteEdits, setAppNoteEdits] = useState<Record<string, string>>({});
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Opportunities forms
  const [oppTab, setOppTab] = useState<'countries' | 'universities' | 'programs' | 'intakes'>('countries');
  const [showCountryForm, setShowCountryForm] = useState(false);
  const [editingCountry, setEditingCountry] = useState<StudyCountry | null>(null);
  const [countryForm, setCountryForm] = useState({ name: '', flag_emoji: '', description: '', is_active: true, display_order: 0 });
  const [showUniversityForm, setShowUniversityForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [universityForm, setUniversityForm] = useState({ country_id: '', name: '', description: '', location: '', ranking: '', is_partner: false, is_active: true, display_order: 0 });
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [programForm, setProgramForm] = useState({ university_id: '', name: '', degree_level: '', duration: '', tuition_fee: '', entry_requirements: '', description: '', is_active: true });
  const [showIntakeForm, setShowIntakeForm] = useState(false);
  const [editingIntake, setEditingIntake] = useState<Intake | null>(null);
  const [intakeForm, setIntakeForm] = useState({ university_id: '', program_id: '', intake_name: '', start_date: '', application_deadline: '', is_open: true });
  const [oppSaving, setOppSaving] = useState(false);
  const [oppError, setOppError] = useState('');

  // Messaging
  const [msgRecipient, setMsgRecipient] = useState('');
  const [msgSubject, setMsgSubject] = useState('');
  const [msgBody, setMsgBody] = useState('');
  const [msgIsAnnouncement, setMsgIsAnnouncement] = useState(false);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!loading && !user) router.replace('/admin/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const role = user?.user_metadata?.role || user?.app_metadata?.role;
    const isAdminEmail = ['admin@psycheconsult.com'].includes(user?.email || '');
    setIsAdmin(role === 'admin' || isAdminEmail);
    setAuthChecking(false);
  }, [user]);

  // ── Data Fetching ─────────────────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [studentsRes, appsRes, docsRes, countriesRes, univRes, progsRes, intakesRes, msgsRes, testimonialsRes, contentRes] = await Promise.all([
        supabase.from('user_profiles').select('*').eq('role', 'student').order('created_at', { ascending: false }),
        supabase.from('student_applications').select('*, user_profiles(full_name, email, phone)').order('created_at', { ascending: false }),
        supabase.from('student_documents').select('*, user_profiles!student_documents_user_id_fkey(full_name, email)').order('created_at', { ascending: false }),
        supabase.from('study_countries').select('*').order('display_order'),
        supabase.from('universities').select('*').order('display_order'),
        supabase.from('programs').select('*'),
        supabase.from('intakes').select('*'),
        supabase.from('messages').select('*, sender_profile:sender_id(full_name), recipient_profile:recipient_id(full_name, email)').order('created_at', { ascending: false }),
        supabase.from('testimonials').select('*').order('display_order'),
        supabase.from('content_items').select('*').order('display_order'),
      ]);
      if (!studentsRes.error) setStudents(studentsRes.data || []);
      if (!appsRes.error) setApplications(appsRes.data || []);
      if (!docsRes.error) setDocuments(docsRes.data || []);
      if (!countriesRes.error) setCountries(countriesRes.data || []);
      if (!univRes.error) setUniversities(univRes.data || []);
      if (!progsRes.error) setPrograms(progsRes.data || []);
      if (!intakesRes.error) setIntakes(intakesRes.data || []);
      if (!msgsRes.error) setMessages(msgsRes.data || []);
      if (!testimonialsRes.error) setTestimonials(testimonialsRes.data || []);
      if (!contentRes.error) setContentItems(contentRes.data || []);
    } catch (err) { console.error(err); }
    finally { setDataLoading(false); }
  }, [user]);

  useEffect(() => { if (isAdmin) fetchData(); }, [isAdmin, fetchData]);

  // ── Generate signed URLs for all documents ────────────────────────────────
  useEffect(() => {
    if (documents.length === 0) return;
    const generateUrls = async () => {
      const urlMap: Record<string, string> = {};
      await Promise.all(
        documents.map(async (doc) => {
          try {
            const { data, error } = await supabase.storage
              .from('student-documents')
              .createSignedUrl(doc.file_path, 3600); // 1 hour expiry
            if (!error && data?.signedUrl) {
              urlMap[doc.id] = data.signedUrl;
            }
          } catch {
            // ignore individual failures
          }
        })
      );
      setDocumentUrls(urlMap);
    };
    generateUrls();
  }, [documents]);

  // ── Application Status Update ─────────────────────────────────────────────
  const updateAppStatus = async (id: string, newStatus: string) => {
    setUpdatingAppId(id);
    try {
      const { error } = await supabase.from('student_applications').update({ status: newStatus }).eq('id', id);
      if (!error) {
        setApplications((p) => p.map((a) => a.id === id ? { ...a, status: newStatus } : a));
        // Add progress record
        const app = applications.find((a) => a.id === id);
        if (app) {
          await supabase.from('application_progress').insert({ application_id: id, stage: newStatus, changed_by: user?.id });
          // Notify student
          await supabase.from('notifications').insert({
            user_id: app.user_id,
            title: 'Application Status Updated',
            body: `Your application status has been updated to: ${STAGE_LABELS[newStatus]}`,
            type: 'application',
          });
        }
      }
    } catch (err) { console.error(err); }
    finally { setUpdatingAppId(null); }
  };

  const saveAppNote = async (id: string) => {
    setSavingNoteId(id);
    try {
      const note = appNoteEdits[id] ?? '';
      await supabase.from('student_applications').update({ admin_notes: note || null }).eq('id', id);
      setApplications((p) => p.map((a) => a.id === id ? { ...a, admin_notes: note || null } : a));
    } catch (err) { console.error(err); }
    finally { setSavingNoteId(null); }
  };

  // ── Document Status Update ────────────────────────────────────────────────
  const updateDocStatus = async (id: string, newStatus: string) => {
    setUpdatingDocId(id);
    try {
      const { error } = await supabase.from('student_documents').update({ status: newStatus, reviewed_at: new Date().toISOString(), reviewed_by: user?.id }).eq('id', id);
      if (!error) {
        setDocuments((p) => p.map((d) => d.id === id ? { ...d, status: newStatus } : d));
        // Notify student
        const doc = documents.find((d) => d.id === id);
        if (doc) {
          await supabase.from('notifications').insert({
            user_id: doc.user_id,
            title: 'Document Status Updated',
            body: `Your ${doc.document_type} has been ${newStatus === 'verified' ? 'verified ✓' : newStatus === 'rejected' ? 'rejected — please check admin comments' : newStatus === 're_upload' ? 'flagged for re-upload' : 'reviewed'}`,
            type: 'document',
          });
        }
      }
    } catch (err) { console.error(err); }
    finally { setUpdatingDocId(null); }
  };

  const saveDocComment = async (id: string) => {
    setSavingCommentId(id);
    try {
      const comment = docCommentEdits[id] ?? '';
      await supabase.from('student_documents').update({ admin_comment: comment || null }).eq('id', id);
      setDocuments((p) => p.map((d) => d.id === id ? { ...d, admin_comment: comment || null } : d));
    } catch (err) { console.error(err); }
    finally { setSavingCommentId(null); }
  };

  const getDocumentUrl = (docId: string) => {
    return documentUrls[docId] || '';
  };

  // ── Messaging ─────────────────────────────────────────────────────────────
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim()) return;
    setSendingMsg(true);
    try {
      const payload: Record<string, unknown> = {
        sender_id: user?.id,
        body: msgBody,
        subject: msgSubject || null,
        is_announcement: msgIsAnnouncement,
      };
      if (!msgIsAnnouncement && msgRecipient) {
        payload.recipient_id = msgRecipient;
      }
      await supabase.from('messages').insert(payload);
      // Notify recipient(s)
      if (!msgIsAnnouncement && msgRecipient) {
        await supabase.from('notifications').insert({
          user_id: msgRecipient,
          title: msgSubject || 'New Message from Psyche Consult',
          body: msgBody.slice(0, 100),
          type: 'message',
        });
      } else if (msgIsAnnouncement) {
        // Notify all students
        const studentIds = students.map((s) => s.id);
        if (studentIds.length > 0) {
          await supabase.from('notifications').insert(
            studentIds.map((uid) => ({
              user_id: uid,
              title: msgSubject || 'Announcement from Psyche Consult',
              body: msgBody.slice(0, 100),
              type: 'announcement',
            }))
          );
        }
      }
      setMsgBody(''); setMsgSubject(''); setMsgRecipient(''); setMsgIsAnnouncement(false);
      setMsgSuccess(true);
      fetchData();
      setTimeout(() => setMsgSuccess(false), 4000);
    } catch (err) { console.error(err); }
    finally { setSendingMsg(false); }
  };

  // ── Opportunities CRUD ────────────────────────────────────────────────────
  const saveCountry = async () => {
    if (!countryForm.name.trim()) { setOppError('Country name is required'); return; }
    setOppSaving(true); setOppError('');
    try {
      if (editingCountry) {
        await supabase.from('study_countries').update(countryForm).eq('id', editingCountry.id);
        setCountries((p) => p.map((c) => c.id === editingCountry.id ? { ...c, ...countryForm } : c));
      } else {
        const { data } = await supabase.from('study_countries').insert(countryForm).select().single();
        if (data) setCountries((p) => [...p, data]);
      }
      setShowCountryForm(false); setEditingCountry(null);
    } catch (err: unknown) { setOppError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setOppSaving(false); }
  };

  const saveUniversity = async () => {
    if (!universityForm.name.trim()) { setOppError('University name is required'); return; }
    setOppSaving(true); setOppError('');
    try {
      const payload = { ...universityForm, country_id: universityForm.country_id || null };
      if (editingUniversity) {
        await supabase.from('universities').update(payload).eq('id', editingUniversity.id);
        setUniversities((p) => p.map((u) => u.id === editingUniversity.id ? { ...u, ...payload } : u));
      } else {
        const { data } = await supabase.from('universities').insert(payload).select().single();
        if (data) setUniversities((p) => [...p, data]);
      }
      setShowUniversityForm(false); setEditingUniversity(null);
    } catch (err: unknown) { setOppError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setOppSaving(false); }
  };

  const saveProgram = async () => {
    if (!programForm.name.trim() || !programForm.university_id) { setOppError('Program name and university are required'); return; }
    setOppSaving(true); setOppError('');
    try {
      const payload = { ...programForm, duration: programForm.duration || null, tuition_fee: programForm.tuition_fee || null, entry_requirements: programForm.entry_requirements || null, description: programForm.description || null };
      if (editingProgram) {
        await supabase.from('programs').update(payload).eq('id', editingProgram.id);
        setPrograms((p) => p.map((pr) => pr.id === editingProgram.id ? { ...pr, ...payload } : pr));
      } else {
        const { data } = await supabase.from('programs').insert(payload).select().single();
        if (data) setPrograms((p) => [...p, data]);
      }
      setShowProgramForm(false); setEditingProgram(null);
    } catch (err: unknown) { setOppError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setOppSaving(false); }
  };

  const saveIntake = async () => {
    if (!intakeForm.intake_name.trim() || !intakeForm.university_id) { setOppError('Intake name and university are required'); return; }
    setOppSaving(true); setOppError('');
    try {
      const payload = { ...intakeForm, program_id: intakeForm.program_id || null, start_date: intakeForm.start_date || null, application_deadline: intakeForm.application_deadline || null };
      if (editingIntake) {
        await supabase.from('intakes').update(payload).eq('id', editingIntake.id);
        setIntakes((p) => p.map((i) => i.id === editingIntake.id ? { ...i, ...payload } : i));
      } else {
        const { data } = await supabase.from('intakes').insert(payload).select().single();
        if (data) setIntakes((p) => [...p, data]);
      }
      setShowIntakeForm(false); setEditingIntake(null);
    } catch (err: unknown) { setOppError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setOppSaving(false); }
  };

  const handleSignOut = async () => { try { await signOut(); router.replace('/admin/login'); } catch (err) { console.error(err); } };

  // ── Guards ────────────────────────────────────────────────────────────────
  if (loading || authChecking) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" /></div>;
  }
  if (!user) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-500 mb-6">You do not have permission to access the admin dashboard.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/student-portal/dashboard" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold text-sm">Go to Student Portal</Link>
            <button onClick={handleSignOut} className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm">Sign Out</button>
          </div>
        </div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Admin';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  // Filtered data
  const filteredStudents = students.filter((s) => {
    const q = studentSearch.toLowerCase();
    return !q || s.full_name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || (s.nationality || '').toLowerCase().includes(q);
  });
  const filteredApps = applications.filter((a) => {
    const matchStatus = appStatusFilter === 'all' || a.status === appStatusFilter;
    const q = appSearch.toLowerCase();
    const name = a.user_profiles?.full_name || '';
    const matchSearch = !q || name.toLowerCase().includes(q) || (a.university_name || '').toLowerCase().includes(q) || (a.program_name || '').toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });
  const filteredDocs = documents.filter((d) => {
    const matchStatus = docStatusFilter === 'all' || d.status === docStatusFilter;
    const q = docSearch.toLowerCase();
    const name = d.user_profiles?.full_name || '';
    const matchSearch = !q || name.toLowerCase().includes(q) || d.document_type.toLowerCase().includes(q) || d.document_name.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const newStudents = students.filter((s) => {
    const d = new Date(s.created_at);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length;

  const inputClass = "w-full px-3 py-2 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-sm";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

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
              <span className="font-bold text-gray-900 hidden sm:block text-sm">The Psyche Consult</span>
            </Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <span className="text-indigo-600 font-semibold hidden sm:block text-sm">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">{initials}</div>
              <span className="text-gray-700 font-medium hidden sm:block text-sm">{displayName}</span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">Admin</span>
            </div>
            <button onClick={handleSignOut} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 transition-colors text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage students, applications, documents, opportunities, and website content</p>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 overflow-x-auto">
          {([
            { key: 'overview', label: 'Overview', icon: '📊' },
            { key: 'students', label: 'Students', icon: '👥', badge: newStudents },
            { key: 'applications', label: 'Applications', icon: '📋', badge: applications.filter((a) => a.status === 'application_received').length },
            { key: 'documents', label: 'Documents', icon: '📄', badge: documents.filter((d) => d.status === 'uploaded').length },
            { key: 'bookings', label: 'Bookings', icon: '📅', badge: pendingBookings },
            { key: 'inquiries', label: 'Inquiries', icon: '📨', badge: newInquiries },
            { key: 'opportunities', label: 'Opportunities', icon: '🌍' },
            { key: 'messages', label: 'Messages', icon: '💬' },
            { key: 'content', label: 'Content', icon: '📝' },
          ] as { key: AdminTab; label: string; icon: string; badge?: number }[]).map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span className="hidden sm:inline">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge ? <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-red-500 text-white">{tab.badge}</span> : null}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: students.length, sub: `${newStudents} new this week`, color: 'text-indigo-600' },
                { label: 'Applications', value: applications.length, sub: `${applications.filter((a) => a.status === 'application_received').length} awaiting review`, color: 'text-purple-600' },
                { label: 'Documents', value: documents.length, sub: `${documents.filter((d) => d.status === 'uploaded').length} pending review`, color: 'text-amber-600' },
                { label: 'Study Countries', value: countries.length, sub: `${universities.length} universities`, color: 'text-teal-600' },
                { label: 'Programs', value: programs.length, sub: `${intakes.filter((i) => i.is_open).length} open intakes`, color: 'text-blue-600' },
                { label: 'Messages Sent', value: messages.filter((m) => m.sender_id === user?.id).length, sub: `${messages.filter((m) => m.is_announcement).length} announcements`, color: 'text-rose-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-xs text-gray-500 font-medium mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Analytics */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Applications by Stage</h3>
                <div className="space-y-2">
                  {APPLICATION_STAGES.slice(0, 6).map((stage) => {
                    const count = applications.filter((a) => a.status === stage).length;
                    const pct = applications.length > 0 ? Math.round((count / applications.length) * 100) : 0;
                    return (
                      <div key={stage} className="flex items-center gap-3">
                        <span className="text-xs text-gray-600 w-40 truncate">{STAGE_LABELS[stage]}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                          <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 w-6 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Document Status</h3>
                <div className="space-y-2">
                  {DOC_STATUS_OPTIONS.map((status) => {
                    const count = documents.filter((d) => d.status === status).length;
                    return (
                      <div key={status} className="flex items-center justify-between">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${DOC_STATUS_COLORS[status]}`}>{status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}</span>
                        <span className="text-sm font-bold text-gray-700">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Recent Registrations */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-sm">Recent Student Registrations</h3>
                <button onClick={() => setActiveTab('students')} className="text-xs text-indigo-600 font-semibold hover:underline">View All →</button>
              </div>
              {students.slice(0, 5).map((s) => (
                <div key={s.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xs flex-shrink-0">
                    {s.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{s.full_name}</p>
                    <p className="text-xs text-gray-500 truncate">{s.email}</p>
                  </div>
                  <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(s.created_at)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STUDENTS TAB ── */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search students..." value={studentSearch} onChange={(e) => setStudentSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400" />
              </div>
              <span className="text-sm text-gray-500">{filteredStudents.length} students</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No students found</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredStudents.map((s) => {
                    const studentApps = applications.filter((a) => a.user_id === s.id);
                    const studentDocs = documents.filter((d) => d.user_id === s.id);
                    const isExpanded = expandedStudentId === s.id;
                    return (
                      <div key={s.id}>
                        <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedStudentId(isExpanded ? null : s.id)}>
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                            {s.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">{s.full_name}</p>
                            <p className="text-xs text-gray-500">{s.email} · {s.phone || 'No phone'}</p>
                            <p className="text-xs text-gray-400">{s.nationality || ''}{s.country_applying_from ? ` · Applying from ${s.country_applying_from}` : ''}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className="text-center hidden sm:block">
                              <p className="text-xs text-gray-400">Apps</p>
                              <p className="text-sm font-bold text-indigo-600">{studentApps.length}</p>
                            </div>
                            <div className="text-center hidden sm:block">
                              <p className="text-xs text-gray-400">Docs</p>
                              <p className="text-sm font-bold text-teal-600">{studentDocs.length}</p>
                            </div>
                            <p className="text-xs text-gray-400">{formatDate(s.created_at)}</p>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                            <div className="grid sm:grid-cols-2 gap-4 mt-4">
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Profile Details</p>
                                <div className="space-y-1 text-xs text-gray-600">
                                  <p><span className="font-medium">Education:</span> {s.education_level || '—'}</p>
                                  <p><span className="font-medium">Preferred Country:</span> {s.preferred_country || '—'}</p>
                                  <p><span className="font-medium">Preferred Course:</span> {s.preferred_course || '—'}</p>
                                </div>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-gray-500 mb-2">Applications ({studentApps.length})</p>
                                {studentApps.length === 0 ? <p className="text-xs text-gray-400">No applications</p> : (
                                  <div className="space-y-1">
                                    {studentApps.map((a) => (
                                      <div key={a.id} className="flex items-center gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STAGE_COLORS[a.status] || 'bg-gray-100 text-gray-600'}`}>{STAGE_LABELS[a.status]?.slice(0, 20) || a.status}</span>
                                        <span className="text-xs text-gray-500 truncate">{a.university_name || 'TBD'}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <div className="sm:col-span-3">
                                <p className="text-xs font-semibold text-gray-500 mb-2">Documents ({studentDocs.length})</p>
                                {studentDocs.length === 0 ? <p className="text-xs text-gray-400">No documents uploaded yet</p> : (
                                  <div className="grid sm:grid-cols-2 gap-2">
                                    {studentDocs.map((d) => (
                                      <div key={d.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
                                        <div className="flex-1 min-w-0">
                                          <p className="text-xs font-semibold text-gray-800 truncate">{d.document_name}</p>
                                          <p className="text-xs text-gray-500">{d.document_type} · {formatDate(d.created_at)}</p>
                                        </div>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${DOC_STATUS_COLORS[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                                        {getDocumentUrl(d.id) ? (
                                          <a href={getDocumentUrl(d.id)} target="_blank" rel="noopener noreferrer"
                                            className="flex-shrink-0 text-xs bg-indigo-600 text-white px-2 py-1 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                            View
                                          </a>
                                        ) : (
                                          <span className="flex-shrink-0 text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-lg font-semibold">Loading…</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button onClick={() => { setMsgRecipient(s.id); setActiveTab('messages'); }}
                                className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                                Send Message
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── APPLICATIONS TAB ── */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search applications..." value={appSearch} onChange={(e) => setAppSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400" />
              </div>
              <select value={appStatusFilter} onChange={(e) => setAppStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400">
                <option value="all">All Stages</option>
                {APPLICATION_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
              </select>
              <span className="text-sm text-gray-500 self-center">{filteredApps.length} applications</span>
            </div>

            <div className="space-y-3">
              {filteredApps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">No applications found</div>
              ) : (
                filteredApps.map((app) => {
                  const isExpanded = expandedAppId === app.id;
                  const stageColor = STAGE_COLORS[app.status] || 'bg-gray-100 text-gray-600';
                  return (
                    <div key={app.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      <div className="p-4 flex items-start gap-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpandedAppId(isExpanded ? null : app.id)}>
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                          {(app.user_profiles?.full_name || 'S').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm">{app.user_profiles?.full_name || 'Unknown Student'}</p>
                          <p className="text-xs text-gray-500">{app.user_profiles?.email}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{app.university_name || 'University TBD'} · {app.program_name || 'Program TBD'} · {app.country_name || ''}</p>
                          <p className="text-xs text-gray-400">Intake: {app.intake_name || '—'} · Applied: {formatDate(app.created_at)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${stageColor}`}>{STAGE_LABELS[app.status]}</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}><path d="m6 9 6 6 6-6"/></svg>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                          {/* Stage Update */}
                          <div>
                            <label className={labelClass}>Update Application Stage</label>
                            <div className="flex gap-2">
                              <select
                                value={app.status}
                                onChange={(e) => updateAppStatus(app.id, e.target.value)}
                                disabled={updatingAppId === app.id}
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 disabled:opacity-60"
                              >
                                {APPLICATION_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                              </select>
                              {updatingAppId === app.id && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600 self-center" />}
                            </div>
                          </div>

                          {/* Attached Documents */}
                          <div>
                            <p className={labelClass}>Student Documents</p>
                            {documents.filter((d) => d.user_id === app.user_id).length === 0 ? (
                              <p className="text-xs text-gray-400">No documents uploaded yet</p>
                            ) : (
                              <div className="space-y-1">
                                {documents.filter((d) => d.user_id === app.user_id).map((d) => (
                                  <div key={d.id} className="flex items-center gap-2 text-xs">
                                    <span className={`px-1.5 py-0.5 rounded-full font-semibold ${DOC_STATUS_COLORS[d.status] || 'bg-gray-100 text-gray-600'}`}>{d.status}</span>
                                    <span className="text-gray-700">{d.document_type}</span>
                                    <a href={getDocumentUrl(d.id)} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline ml-auto">View</a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Admin Notes */}
                          <div>
                            <label className={labelClass}>Admin Notes</label>
                            <textarea
                              value={appNoteEdits[app.id] ?? (app.admin_notes || '')}
                              onChange={(e) => setAppNoteEdits((p) => ({ ...p, [app.id]: e.target.value }))}
                              rows={2}
                              placeholder="Add internal notes..."
                              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 resize-none"
                            />
                            <button onClick={() => saveAppNote(app.id)} disabled={savingNoteId === app.id}
                              className="mt-1 text-xs bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60">
                              {savingNoteId === app.id ? 'Saving...' : 'Save Note'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ── DOCUMENTS TAB ── */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <input type="text" placeholder="Search documents..." value={docSearch} onChange={(e) => setDocSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400" />
              </div>
              <select value={docStatusFilter} onChange={(e) => setDocStatusFilter(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400">
                <option value="all">All Statuses</option>
                {DOC_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}</option>)}
              </select>
              <span className="text-sm text-gray-500 self-center">{filteredDocs.length} documents</span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {filteredDocs.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No documents found</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredDocs.map((doc) => (
                    <div key={doc.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">{doc.user_profiles?.full_name || 'Unknown'}</p>
                              <p className="text-xs text-gray-500">{doc.user_profiles?.email}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{doc.document_type} · {doc.document_name}</p>
                              <p className="text-xs text-gray-400">{formatDate(doc.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DOC_STATUS_COLORS[doc.status] || 'bg-gray-100 text-gray-600'}`}>{doc.status.replace('_', ' ')}</span>
                              <a href={getDocumentUrl(doc.id)} target="_blank" rel="noopener noreferrer"
                                className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg font-semibold hover:bg-indigo-100 transition-colors">
                                View
                              </a>
                            </div>
                          </div>

                          {/* Status Controls */}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {DOC_STATUS_OPTIONS.map((s) => (
                              <button key={s} onClick={() => updateDocStatus(doc.id, s)} disabled={updatingDocId === doc.id || doc.status === s}
                                className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors disabled:opacity-50 ${doc.status === s ? `${DOC_STATUS_COLORS[s]} ring-1 ring-current` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                {s === 'verified' ? '✓ Verify' : s === 'rejected' ? '✗ Reject' : s === 're_upload' ? '↩ Re-upload' : s === 'pending' ? '⏳ Pending' : '📤 Uploaded'}
                              </button>
                            ))}
                          </div>

                          {/* Admin Comment */}
                          <div className="mt-3 flex gap-2">
                            <input type="text"
                              value={docCommentEdits[doc.id] ?? (doc.admin_comment || '')}
                              onChange={(e) => setDocCommentEdits((p) => ({ ...p, [doc.id]: e.target.value }))}
                              placeholder="Add comment for student..."
                              className="flex-1 px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400"
                            />
                            <button onClick={() => saveDocComment(doc.id)} disabled={savingCommentId === doc.id}
                              className="text-xs bg-gray-700 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 whitespace-nowrap">
                              {savingCommentId === doc.id ? '...' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── OPPORTUNITIES TAB ── */}
        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-full sm:w-auto sm:inline-flex">
              {(['countries', 'universities', 'programs', 'intakes'] as const).map((t) => (
                <button key={t} onClick={() => { setOppTab(t); setOppError(''); setShowCountryForm(false); setShowUniversityForm(false); setShowProgramForm(false); setShowIntakeForm(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${oppTab === t ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t}
                </button>
              ))}
            </div>

            {oppError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{oppError}</div>}

            {/* Countries */}
            {oppTab === 'countries' && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => { setEditingCountry(null); setCountryForm({ name: '', flag_emoji: '', description: '', is_active: true, display_order: countries.length }); setShowCountryForm(true); }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    + Add Country
                  </button>
                </div>
                {showCountryForm && (
                  <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm">{editingCountry ? 'Edit Country' : 'Add Country'}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>Country Name *</label><input type="text" value={countryForm.name} onChange={(e) => setCountryForm({ ...countryForm, name: e.target.value })} className={inputClass} /></div>
                      <div><label className={labelClass}>Flag Emoji</label><input type="text" value={countryForm.flag_emoji} onChange={(e) => setCountryForm({ ...countryForm, flag_emoji: e.target.value })} placeholder="🇬🇧" className={inputClass} /></div>
                      <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea value={countryForm.description} onChange={(e) => setCountryForm({ ...countryForm, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                      <div><label className={labelClass}>Display Order</label><input type="number" value={countryForm.display_order} onChange={(e) => setCountryForm({ ...countryForm, display_order: parseInt(e.target.value) || 0 })} className={inputClass} /></div>
                      <div className="flex items-center gap-2 pt-4"><input type="checkbox" id="country-active" checked={countryForm.is_active} onChange={(e) => setCountryForm({ ...countryForm, is_active: e.target.checked })} className="rounded" /><label htmlFor="country-active" className="text-sm text-gray-700">Active (visible to students)</label></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveCountry} disabled={oppSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{oppSaving ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => { setShowCountryForm(false); setEditingCountry(null); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {countries.map((c) => (
                    <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-2xl mb-1">{c.flag_emoji || '🌍'}</p>
                          <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                          {c.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>}
                          <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold mt-2 inline-block ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.is_active ? 'Active' : 'Inactive'}</span>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingCountry(c); setCountryForm({ name: c.name, flag_emoji: c.flag_emoji || '', description: c.description || '', is_active: c.is_active, display_order: c.display_order }); setShowCountryForm(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors text-xs">✏️</button>
                          <button onClick={async () => { if (confirm('Delete this country?')) { await supabase.from('study_countries').delete().eq('id', c.id); setCountries((p) => p.filter((x) => x.id !== c.id)); } }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs">🗑️</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Universities */}
            {oppTab === 'universities' && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => { setEditingUniversity(null); setUniversityForm({ country_id: '', name: '', description: '', location: '', ranking: '', is_partner: false, is_active: true, display_order: universities.length }); setShowUniversityForm(true); }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    + Add University
                  </button>
                </div>
                {showUniversityForm && (
                  <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm">{editingUniversity ? 'Edit University' : 'Add University'}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div><label className={labelClass}>University Name *</label><input type="text" value={universityForm.name} onChange={(e) => setUniversityForm({ ...universityForm, name: e.target.value })} className={inputClass} /></div>
                      <div>
                        <label className={labelClass}>Country</label>
                        <select value={universityForm.country_id} onChange={(e) => setUniversityForm({ ...universityForm, country_id: e.target.value })} className={inputClass}>
                          <option value="">Select country</option>
                          {countries.map((c) => <option key={c.id} value={c.id}>{c.flag_emoji} {c.name}</option>)}
                        </select>
                      </div>
                      <div><label className={labelClass}>Location / City</label><input type="text" value={universityForm.location} onChange={(e) => setUniversityForm({ ...universityForm, location: e.target.value })} className={inputClass} /></div>
                      <div><label className={labelClass}>Ranking</label><input type="text" value={universityForm.ranking} onChange={(e) => setUniversityForm({ ...universityForm, ranking: e.target.value })} placeholder="e.g. Top 100 QS" className={inputClass} /></div>
                      <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea value={universityForm.description} onChange={(e) => setUniversityForm({ ...universityForm, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={universityForm.is_partner} onChange={(e) => setUniversityForm({ ...universityForm, is_partner: e.target.checked })} className="rounded" /> Partner University</label>
                        <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={universityForm.is_active} onChange={(e) => setUniversityForm({ ...universityForm, is_active: e.target.checked })} className="rounded" /> Active</label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveUniversity} disabled={oppSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{oppSaving ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => { setShowUniversityForm(false); setEditingUniversity(null); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {universities.map((u) => {
                    const countryName = countries.find((c) => c.id === u.country_id)?.name;
                    return (
                      <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                            {u.is_partner && <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">Partner</span>}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{u.is_active ? 'Active' : 'Inactive'}</span>
                          </div>
                          <p className="text-xs text-gray-500">{u.location}{countryName ? `, ${countryName}` : ''}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingUniversity(u); setUniversityForm({ country_id: u.country_id || '', name: u.name, description: u.description || '', location: u.location || '', ranking: u.ranking || '', is_partner: u.is_partner, is_active: u.is_active, display_order: u.display_order }); setShowUniversityForm(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors text-xs">✏️</button>
                          <button onClick={async () => { if (confirm('Delete this university?')) { await supabase.from('universities').delete().eq('id', u.id); setUniversities((p) => p.filter((x) => x.id !== u.id)); } }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Programs */}
            {oppTab === 'programs' && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => { setEditingProgram(null); setProgramForm({ university_id: '', name: '', degree_level: '', duration: '', tuition_fee: '', entry_requirements: '', description: '', is_active: true }); setShowProgramForm(true); }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    + Add Program
                  </button>
                </div>
                {showProgramForm && (
                  <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm">{editingProgram ? 'Edit Program' : 'Add Program'}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>University *</label>
                        <select value={programForm.university_id} onChange={(e) => setProgramForm({ ...programForm, university_id: e.target.value })} className={inputClass}>
                          <option value="">Select university</option>
                          {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                      <div><label className={labelClass}>Program Name *</label><input type="text" value={programForm.name} onChange={(e) => setProgramForm({ ...programForm, name: e.target.value })} className={inputClass} /></div>
                      <div>
                        <label className={labelClass}>Degree Level *</label>
                        <select value={programForm.degree_level} onChange={(e) => setProgramForm({ ...programForm, degree_level: e.target.value })} className={inputClass}>
                          <option value="">Select</option>
                          {["Bachelor\'s", "Master\'s", 'PhD', 'Diploma', 'Certificate', 'Foundation'].map((d) => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div><label className={labelClass}>Duration</label><input type="text" value={programForm.duration} onChange={(e) => setProgramForm({ ...programForm, duration: e.target.value })} placeholder="e.g. 3 years" className={inputClass} /></div>
                      <div><label className={labelClass}>Tuition Fee</label><input type="text" value={programForm.tuition_fee} onChange={(e) => setProgramForm({ ...programForm, tuition_fee: e.target.value })} placeholder="e.g. £15,000/year" className={inputClass} /></div>
                      <div className="sm:col-span-2"><label className={labelClass}>Entry Requirements</label><textarea value={programForm.entry_requirements} onChange={(e) => setProgramForm({ ...programForm, entry_requirements: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                      <div className="flex items-center gap-2"><input type="checkbox" id="prog-active" checked={programForm.is_active} onChange={(e) => setProgramForm({ ...programForm, is_active: e.target.checked })} className="rounded" /><label htmlFor="prog-active" className="text-sm text-gray-700">Active</label></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveProgram} disabled={oppSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{oppSaving ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => { setShowProgramForm(false); setEditingProgram(null); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {programs.map((p) => {
                    const uniName = universities.find((u) => u.id === p.university_id)?.name;
                    return (
                      <div key={p.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                            <span className="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full font-semibold">{p.degree_level}</span>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active ? 'Active' : 'Inactive'}</span>
                          </div>
                          <p className="text-xs text-gray-500">{uniName}{p.duration ? ` · ${p.duration}` : ''}{p.tuition_fee ? ` · ${p.tuition_fee}` : ''}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingProgram(p); setProgramForm({ university_id: p.university_id, name: p.name, degree_level: p.degree_level, duration: p.duration || '', tuition_fee: p.tuition_fee || '', entry_requirements: p.entry_requirements || '', description: p.description || '', is_active: p.is_active }); setShowProgramForm(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors text-xs">✏️</button>
                          <button onClick={async () => { if (confirm('Delete this program?')) { await supabase.from('programs').delete().eq('id', p.id); setPrograms((prev) => prev.filter((x) => x.id !== p.id)); } }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Intakes */}
            {oppTab === 'intakes' && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <button onClick={() => { setEditingIntake(null); setIntakeForm({ university_id: '', program_id: '', intake_name: '', start_date: '', application_deadline: '', is_open: true }); setShowIntakeForm(true); }}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
                    + Add Intake
                  </button>
                </div>
                {showIntakeForm && (
                  <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-3">
                    <h3 className="font-bold text-gray-900 text-sm">{editingIntake ? 'Edit Intake' : 'Add Intake'}</h3>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>University *</label>
                        <select value={intakeForm.university_id} onChange={(e) => setIntakeForm({ ...intakeForm, university_id: e.target.value })} className={inputClass}>
                          <option value="">Select university</option>
                          {universities.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Program (Optional)</label>
                        <select value={intakeForm.program_id} onChange={(e) => setIntakeForm({ ...intakeForm, program_id: e.target.value })} className={inputClass}>
                          <option value="">All programs</option>
                          {programs.filter((p) => !intakeForm.university_id || p.university_id === intakeForm.university_id).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div><label className={labelClass}>Intake Name *</label><input type="text" value={intakeForm.intake_name} onChange={(e) => setIntakeForm({ ...intakeForm, intake_name: e.target.value })} placeholder="e.g. September 2026" className={inputClass} /></div>
                      <div><label className={labelClass}>Start Date</label><input type="date" value={intakeForm.start_date} onChange={(e) => setIntakeForm({ ...intakeForm, start_date: e.target.value })} className={inputClass} /></div>
                      <div><label className={labelClass}>Application Deadline</label><input type="date" value={intakeForm.application_deadline} onChange={(e) => setIntakeForm({ ...intakeForm, application_deadline: e.target.value })} className={inputClass} /></div>
                      <div className="flex items-center gap-2 pt-4"><input type="checkbox" id="intake-open" checked={intakeForm.is_open} onChange={(e) => setIntakeForm({ ...intakeForm, is_open: e.target.checked })} className="rounded" /><label htmlFor="intake-open" className="text-sm text-gray-700">Open for Applications</label></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveIntake} disabled={oppSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{oppSaving ? 'Saving...' : 'Save'}</button>
                      <button onClick={() => { setShowIntakeForm(false); setEditingIntake(null); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  {intakes.map((i) => {
                    const uniName = universities.find((u) => u.id === i.university_id)?.name;
                    const progName = programs.find((p) => p.id === i.program_id)?.name;
                    return (
                      <div key={i.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{i.intake_name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${i.is_open ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{i.is_open ? 'Open' : 'Closed'}</span>
                          </div>
                          <p className="text-xs text-gray-500">{uniName}{progName ? ` · ${progName}` : ''}</p>
                          {i.application_deadline && <p className="text-xs text-amber-600">Deadline: {formatDate(i.application_deadline)}</p>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingIntake(i); setIntakeForm({ university_id: i.university_id, program_id: i.program_id || '', intake_name: i.intake_name, start_date: i.start_date || '', application_deadline: i.application_deadline || '', is_open: i.is_open }); setShowIntakeForm(true); }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors text-xs">✏️</button>
                          <button onClick={async () => { if (confirm('Delete this intake?')) { await supabase.from('intakes').delete().eq('id', i.id); setIntakes((p) => p.filter((x) => x.id !== i.id)); } }}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs">🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <BookingsPanel supabase={supabase} adminId={user?.id} onPendingChange={setPendingBookings} />
        )}

        {/* INQUIRIES TAB */}
        {activeTab === 'inquiries' && <InquiriesPanel supabase={supabase} onNewChange={setNewInquiries} />}

        {/* ── MESSAGES TAB ── */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Compose */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-bold text-gray-900 mb-4 text-sm">Compose Message</h3>
              {msgSuccess && <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">Message sent successfully!</div>}
              <form onSubmit={sendMessage} className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                    <input type="checkbox" checked={msgIsAnnouncement} onChange={(e) => { setMsgIsAnnouncement(e.target.checked); if (e.target.checked) setMsgRecipient(''); }} className="rounded" />
                    Send as Announcement to All Students
                  </label>
                </div>
                {!msgIsAnnouncement && (
                  <div>
                    <label className={labelClass}>Recipient Student</label>
                    <select value={msgRecipient} onChange={(e) => setMsgRecipient(e.target.value)} className={inputClass} required={!msgIsAnnouncement}>
                      <option value="">Select a student</option>
                      {students.map((s) => <option key={s.id} value={s.id}>{s.full_name} ({s.email})</option>)}
                    </select>
                  </div>
                )}
                <div>
                  <label className={labelClass}>Subject</label>
                  <input type="text" value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} placeholder="Message subject" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Message *</label>
                  <textarea required value={msgBody} onChange={(e) => setMsgBody(e.target.value)} rows={4} placeholder="Type your message..." className={`${inputClass} resize-none`} />
                </div>
                <button type="submit" disabled={sendingMsg || !msgBody.trim()}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-60">
                  {sendingMsg ? 'Sending...' : msgIsAnnouncement ? '📢 Send Announcement' : '✉️ Send Message'}
                </button>
              </form>
            </div>

            {/* Message History */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm">Message History ({messages.length})</h3>
              </div>
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No messages yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {messages.map((msg) => (
                    <div key={msg.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {msg.is_announcement && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">Announcement</span>}
                            <p className="text-sm font-semibold text-gray-900 truncate">{msg.subject || 'No subject'}</p>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{msg.body}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            From: {msg.sender_profile?.full_name || 'Unknown'} →
                            {msg.is_announcement ? ' All Students' : ` ${msg.recipient_profile?.full_name || msg.recipient_profile?.email || 'Unknown'}`}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 flex-shrink-0">{formatDate(msg.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CONTENT TAB ── */}
        {activeTab === 'content' && (
          <ContentManagementTab
            supabase={supabase}
            testimonials={testimonials}
            setTestimonials={setTestimonials}
            contentItems={contentItems}
            setContentItems={setContentItems}
            labelClass={labelClass}
            inputClass={inputClass}
          />
        )}
      </div>
    </div>
  );
}

// ── Content Management Tab Component ─────────────────────────────────────────
type ContentSubTab = 'testimonials' | 'videos' | 'flyers' | 'blog' | 'events' | 'other';

interface ContentManagementTabProps {
  supabase: ReturnType<typeof createClient>;
  testimonials: Testimonial[];
  setTestimonials: React.Dispatch<React.SetStateAction<Testimonial[]>>;
  contentItems: ContentItem[];
  setContentItems: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  labelClass: string;
  inputClass: string;
}

function ContentManagementTab({ supabase, testimonials, setTestimonials, contentItems, setContentItems, labelClass, inputClass }: ContentManagementTabProps) {
  const [contentSubTab, setContentSubTab] = useState<ContentSubTab>('testimonials');

  // Testimonial form state
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({ student_name: '', university: '', destination: '', video_url: '', thumbnail_url: '', quote: '', is_published: false, display_order: 0 });
  const [testimonialSaving, setTestimonialSaving] = useState(false);
  const [testimonialError, setTestimonialError] = useState('');

  // Content item form state
  const [showContentForm, setShowContentForm] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [contentForm, setContentForm] = useState({ title: '', description: '', content_type: 'announcement', image_url: '', link_url: '', is_published: false, display_order: 0, expires_at: '' });
  const [contentSaving, setContentSaving] = useState(false);
  const [contentError, setContentError] = useState('');

  // File upload state
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const videoInputRef = useRef<HTMLInputElement>(null);
  const flyerInputRef = useRef<HTMLInputElement>(null);

  const saveTestimonial = async () => {
    if (!testimonialForm.student_name.trim()) { setTestimonialError('Student name is required'); return; }
    setTestimonialSaving(true); setTestimonialError('');
    try {
      const payload = { ...testimonialForm, video_url: testimonialForm.video_url || null, thumbnail_url: testimonialForm.thumbnail_url || null, quote: testimonialForm.quote || null };
      if (editingTestimonial) {
        await supabase.from('testimonials').update(payload).eq('id', editingTestimonial.id);
        setTestimonials((p) => p.map((t) => t.id === editingTestimonial.id ? { ...t, ...payload } : t));
      } else {
        const { data } = await supabase.from('testimonials').insert(payload).select().single();
        if (data) setTestimonials((p) => [...p, data]);
      }
      setShowTestimonialForm(false); setEditingTestimonial(null);
    } catch (err: unknown) { setTestimonialError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setTestimonialSaving(false); }
  };

  const saveContent = async () => {
    if (!contentForm.title.trim()) { setContentError('Title is required'); return; }
    setContentSaving(true); setContentError('');
    try {
      const payload = { ...contentForm, description: contentForm.description || null, image_url: contentForm.image_url || null, link_url: contentForm.link_url || null, expires_at: contentForm.expires_at ? new Date(contentForm.expires_at).toISOString() : null };
      if (editingContent) {
        await supabase.from('content_items').update(payload).eq('id', editingContent.id);
        setContentItems((p) => p.map((c) => c.id === editingContent.id ? { ...c, ...payload } : c));
      } else {
        const { data } = await supabase.from('content_items').insert(payload).select().single();
        if (data) setContentItems((p) => [...p, data]);
      }
      setShowContentForm(false); setEditingContent(null);
    } catch (err: unknown) { setContentError(err instanceof Error ? err.message : 'Failed to save'); }
    finally { setContentSaving(false); }
  };

  const handleFileUpload = async (file: File, type: 'video' | 'flyer') => {
    setUploadingFile(true); setUploadError(''); setUploadSuccess('');
    try {
      const fileName = `${type}s/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const bucket = type === 'video' ? 'testimonial-media' : 'content-media';
      const { error: uploadErr } = await supabase.storage.from(bucket).upload(fileName, file, { upsert: false });
      if (uploadErr) throw uploadErr;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
      const publicUrl = urlData?.publicUrl || '';

      // Save as content item
      const contentType = type === 'video' ? 'video' : 'flyer';
      const title = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      const { data } = await supabase.from('content_items').insert({
        title,
        content_type: contentType,
        image_url: type === 'flyer' ? publicUrl : null,
        link_url: type === 'video' ? publicUrl : null,
        is_published: false,
        display_order: contentItems.length,
      }).select().single();
      if (data) setContentItems((p) => [...p, data]);
      setUploadSuccess(`${type === 'video' ? 'Video' : 'Flyer'} uploaded successfully! You can now edit its details and publish it.`);
      setTimeout(() => setUploadSuccess(''), 5000);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploadingFile(false);
      if (videoInputRef.current) videoInputRef.current.value = '';
      if (flyerInputRef.current) flyerInputRef.current.value = '';
    }
  };

  const subTabs: { key: ContentSubTab; label: string; icon: string }[] = [
    { key: 'testimonials', label: 'Testimonials', icon: '⭐' },
    { key: 'videos', label: 'Videos', icon: '🎥' },
    { key: 'flyers', label: 'Flyers', icon: '📋' },
    { key: 'blog', label: 'Blog Posts', icon: '✍️' },
    { key: 'events', label: 'Events', icon: '📅' },
    { key: 'other', label: 'Other', icon: '📌' },
  ];

  const contentTypeMap: Record<ContentSubTab, string[]> = {
    testimonials: [],
    videos: ['video'],
    flyers: ['flyer'],
    blog: ['blog'],
    events: ['event'],
    other: ['announcement', 'scholarship', 'promo', 'news', 'faq'],
  };

  const filteredContentItems = contentSubTab === 'testimonials'
    ? []
    : contentItems.filter((c) => contentTypeMap[contentSubTab].includes(c.content_type));

  const getContentTypeForSubTab = (sub: ContentSubTab): string => {
    const map: Record<ContentSubTab, string> = {
      testimonials: 'announcement',
      videos: 'video',
      flyers: 'flyer',
      blog: 'blog',
      events: 'event',
      other: 'announcement',
    };
    return map[sub];
  };

  return (
    <div className="space-y-4">
      {/* Content Sub-Tab Header */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold text-gray-900">Website Content Management</h2>
            <p className="text-xs text-gray-500 mt-0.5">Upload and manage all content that appears on the public website</p>
          </div>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {subTabs.map((st) => (
            <button key={st.key} onClick={() => { setContentSubTab(st.key); setShowContentForm(false); setShowTestimonialForm(false); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${contentSubTab === st.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
              <span>{st.icon}</span>
              <span>{st.label}</span>
              {st.key !== 'testimonials' && contentTypeMap[st.key].length > 0 && (
                <span className="ml-0.5 text-xs bg-gray-200 text-gray-600 px-1 rounded-full">
                  {contentItems.filter((c) => contentTypeMap[st.key].includes(c.content_type)).length}
                </span>
              )}
              {st.key === 'testimonials' && (
                <span className="ml-0.5 text-xs bg-gray-200 text-gray-600 px-1 rounded-full">{testimonials.length}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upload errors/success */}
      {uploadError && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{uploadError}</div>}
      {uploadSuccess && <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">✓ {uploadSuccess}</div>}

      {/* ── TESTIMONIALS SUB-TAB ── */}
      {contentSubTab === 'testimonials' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Student Testimonials ({testimonials.length})</h3>
            <button onClick={() => { setEditingTestimonial(null); setTestimonialForm({ student_name: '', university: '', destination: '', video_url: '', thumbnail_url: '', quote: '', is_published: false, display_order: testimonials.length }); setTestimonialError(''); setShowTestimonialForm(true); }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
              + Add Testimonial
            </button>
          </div>
          {showTestimonialForm && (
            <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              {testimonialError && <p className="text-red-600 text-xs">{testimonialError}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className={labelClass}>Student Name *</label><input type="text" value={testimonialForm.student_name} onChange={(e) => setTestimonialForm({ ...testimonialForm, student_name: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>University</label><input type="text" value={testimonialForm.university} onChange={(e) => setTestimonialForm({ ...testimonialForm, university: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Destination Country</label><input type="text" value={testimonialForm.destination} onChange={(e) => setTestimonialForm({ ...testimonialForm, destination: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Video URL (YouTube/Vimeo)</label><input type="url" value={testimonialForm.video_url} onChange={(e) => setTestimonialForm({ ...testimonialForm, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." className={inputClass} /></div>
                <div><label className={labelClass}>Thumbnail Image URL</label><input type="url" value={testimonialForm.thumbnail_url} onChange={(e) => setTestimonialForm({ ...testimonialForm, thumbnail_url: e.target.value })} placeholder="https://..." className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Quote / Review</label><textarea value={testimonialForm.quote} onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} rows={3} placeholder="Student's testimonial text..." className={`${inputClass} resize-none`} /></div>
                <div className="flex items-center gap-2"><input type="checkbox" id="test-pub" checked={testimonialForm.is_published} onChange={(e) => setTestimonialForm({ ...testimonialForm, is_published: e.target.checked })} className="rounded" /><label htmlFor="test-pub" className="text-sm text-gray-700">Publish on website</label></div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveTestimonial} disabled={testimonialSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{testimonialSaving ? 'Saving...' : 'Save Testimonial'}</button>
                <button onClick={() => { setShowTestimonialForm(false); setEditingTestimonial(null); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
              </div>
            </div>
          )}
          {testimonials.length === 0 && !showTestimonialForm && (
            <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <p className="text-3xl mb-2">⭐</p>
              <p className="font-semibold text-gray-700 text-sm">No testimonials yet</p>
              <p className="text-xs text-gray-400 mt-1">Add student testimonials with video links and quotes</p>
            </div>
          )}
          <div className="space-y-2">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{t.student_name}</p>
                  <p className="text-xs text-gray-500">{t.university}{t.destination ? ` · ${t.destination}` : ''}</p>
                  {t.video_url && <p className="text-xs text-indigo-500 mt-0.5 truncate">🎥 {t.video_url}</p>}
                  {t.quote && <p className="text-xs text-gray-600 mt-1 line-clamp-1 italic">"{t.quote}"</p>}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={async () => { await supabase.from('testimonials').update({ is_published: !t.is_published }).eq('id', t.id); setTestimonials((p) => p.map((x) => x.id === t.id ? { ...x, is_published: !x.is_published } : x)); }}
                    className={`text-xs px-2 py-1 rounded-lg font-semibold transition-colors ${t.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                    {t.is_published ? '✓ Published' : 'Draft'}
                  </button>
                  <button onClick={() => { setEditingTestimonial(t); setTestimonialForm({ student_name: t.student_name, university: t.university, destination: t.destination, video_url: t.video_url || '', thumbnail_url: t.thumbnail_url || '', quote: t.quote || '', is_published: t.is_published, display_order: t.display_order }); setTestimonialError(''); setShowTestimonialForm(true); }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors text-xs">✏️</button>
                  <button onClick={async () => { if (confirm('Delete this testimonial?')) { await supabase.from('testimonials').delete().eq('id', t.id); setTestimonials((p) => p.filter((x) => x.id !== t.id)); } }}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── VIDEOS SUB-TAB ── */}
      {contentSubTab === 'videos' && (
        <div className="space-y-4">
          {/* Upload Card */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-200 p-6 text-center">
            <div className="text-4xl mb-3">🎥</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Upload Testimonial Videos</h3>
            <p className="text-xs text-gray-500 mb-4">Upload MP4, MOV, or AVI video files directly, or add a YouTube/Vimeo link below</p>
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden" id="video-upload"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'video'); }} />
            <label htmlFor="video-upload"
              className={`inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-indigo-700 transition-colors ${uploadingFile ? 'opacity-60 pointer-events-none' : ''}`}>
              {uploadingFile ? '⏳ Uploading...' : '⬆️ Upload Video File'}
            </label>
          </div>

          {/* Add via URL */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Add Video via URL (YouTube / Vimeo)</h3>
            {showContentForm && contentForm.content_type === 'video' ? (
              <div className="space-y-3">
                {contentError && <p className="text-red-600 text-xs">{contentError}</p>}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className={labelClass}>Title *</label><input type="text" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} className={inputClass} /></div>
                  <div><label className={labelClass}>Video URL *</label><input type="url" value={contentForm.link_url} onChange={(e) => setContentForm({ ...contentForm, link_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." className={inputClass} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                  <div><label className={labelClass}>Thumbnail URL</label><input type="url" value={contentForm.image_url} onChange={(e) => setContentForm({ ...contentForm, image_url: e.target.value })} className={inputClass} /></div>
                  <div className="flex items-center gap-2 pt-4"><input type="checkbox" id="vid-pub" checked={contentForm.is_published} onChange={(e) => setContentForm({ ...contentForm, is_published: e.target.checked })} className="rounded" /><label htmlFor="vid-pub" className="text-sm text-gray-700">Publish on website</label></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveContent} disabled={contentSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{contentSaving ? 'Saving...' : 'Save Video'}</button>
                  <button onClick={() => setShowContentForm(false)} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setEditingContent(null); setContentForm({ title: '', description: '', content_type: 'video', image_url: '', link_url: '', is_published: false, display_order: contentItems.length, expires_at: '' }); setContentError(''); setShowContentForm(true); }}
                className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-500 px-4 py-2.5 rounded-xl font-semibold text-sm hover:border-indigo-400 hover:text-indigo-600 transition-colors w-full justify-center">
                + Add YouTube / Vimeo Link
              </button>
            )}
          </div>

          {/* Video List */}
          <ContentItemList items={filteredContentItems} supabase={supabase} setContentItems={setContentItems} onEdit={(c) => { setEditingContent(c); setContentForm({ title: c.title, description: c.description || '', content_type: c.content_type, image_url: c.image_url || '', link_url: c.link_url || '', is_published: c.is_published, display_order: c.display_order, expires_at: c.expires_at ? c.expires_at.split('T')[0] : '' }); setContentError(''); setShowContentForm(true); }} emptyIcon="🎥" emptyText="No videos uploaded yet" />
        </div>
      )}

      {/* ── FLYERS SUB-TAB ── */}
      {contentSubTab === 'flyers' && (
        <div className="space-y-4">
          {/* Upload Card */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-purple-200 p-6 text-center">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Upload Event Flyers & Promotional Materials</h3>
            <p className="text-xs text-gray-500 mb-4">Upload JPG, PNG, PDF, or other image files for events, promotions, and announcements</p>
            <input ref={flyerInputRef} type="file" accept="image/*,.pdf" className="hidden" id="flyer-upload"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'flyer'); }} />
            <label htmlFor="flyer-upload"
              className={`inline-flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm cursor-pointer hover:bg-purple-700 transition-colors ${uploadingFile ? 'opacity-60 pointer-events-none' : ''}`}>
              {uploadingFile ? '⏳ Uploading...' : '⬆️ Upload Flyer / Image'}
            </label>
          </div>

          {/* Add via URL */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Add Flyer via URL</h3>
            {showContentForm && contentForm.content_type === 'flyer' ? (
              <div className="space-y-3">
                {contentError && <p className="text-red-600 text-xs">{contentError}</p>}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><label className={labelClass}>Title *</label><input type="text" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} className={inputClass} /></div>
                  <div><label className={labelClass}>Image / Flyer URL *</label><input type="url" value={contentForm.image_url} onChange={(e) => setContentForm({ ...contentForm, image_url: e.target.value })} placeholder="https://..." className={inputClass} /></div>
                  <div className="sm:col-span-2"><label className={labelClass}>Description</label><textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                  <div><label className={labelClass}>Link URL (optional)</label><input type="url" value={contentForm.link_url} onChange={(e) => setContentForm({ ...contentForm, link_url: e.target.value })} className={inputClass} /></div>
                  <div><label className={labelClass}>Expiry Date</label><input type="date" value={contentForm.expires_at} onChange={(e) => setContentForm({ ...contentForm, expires_at: e.target.value })} className={inputClass} /></div>
                  <div className="flex items-center gap-2 pt-4"><input type="checkbox" id="fly-pub" checked={contentForm.is_published} onChange={(e) => setContentForm({ ...contentForm, is_published: e.target.checked })} className="rounded" /><label htmlFor="fly-pub" className="text-sm text-gray-700">Publish on website</label></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveContent} disabled={contentSaving} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors disabled:opacity-60">{contentSaving ? 'Saving...' : 'Save Flyer'}</button>
                  <button onClick={() => setShowContentForm(false)} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setEditingContent(null); setContentForm({ title: '', description: '', content_type: 'flyer', image_url: '', link_url: '', is_published: false, display_order: contentItems.length, expires_at: '' }); setContentError(''); setShowContentForm(true); }}
                className="flex items-center gap-2 border-2 border-dashed border-gray-300 text-gray-500 px-4 py-2.5 rounded-xl font-semibold text-sm hover:border-purple-400 hover:text-purple-600 transition-colors w-full justify-center">
                + Add Flyer via URL
              </button>
            )}
          </div>

          <ContentItemList items={filteredContentItems} supabase={supabase} setContentItems={setContentItems} onEdit={(c) => { setEditingContent(c); setContentForm({ title: c.title, description: c.description || '', content_type: c.content_type, image_url: c.image_url || '', link_url: c.link_url || '', is_published: c.is_published, display_order: c.display_order, expires_at: c.expires_at ? c.expires_at.split('T')[0] : '' }); setContentError(''); setShowContentForm(true); }} emptyIcon="📋" emptyText="No flyers uploaded yet" />
        </div>
      )}

      {/* ── BLOG / EVENTS / OTHER SUB-TABS ── */}
      {(contentSubTab === 'blog' || contentSubTab === 'events' || contentSubTab === 'other') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">
              {contentSubTab === 'blog' ? 'Blog Posts' : contentSubTab === 'events' ? 'Events' : 'Other Content'} ({filteredContentItems.length})
            </h3>
            <button onClick={() => { setEditingContent(null); setContentForm({ title: '', description: '', content_type: getContentTypeForSubTab(contentSubTab), image_url: '', link_url: '', is_published: false, display_order: contentItems.length, expires_at: '' }); setContentError(''); setShowContentForm(true); }}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition-colors">
              + Add {contentSubTab === 'blog' ? 'Blog Post' : contentSubTab === 'events' ? 'Event' : 'Content'}
            </button>
          </div>
          {showContentForm && (
            <div className="bg-white rounded-2xl border border-indigo-200 p-5 space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">{editingContent ? 'Edit' : 'Add'} {contentSubTab === 'blog' ? 'Blog Post' : contentSubTab === 'events' ? 'Event' : 'Content'}</h3>
              {contentError && <p className="text-red-600 text-xs">{contentError}</p>}
              <div className="grid sm:grid-cols-2 gap-3">
                <div><label className={labelClass}>Title *</label><input type="text" value={contentForm.title} onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })} className={inputClass} /></div>
                {contentSubTab === 'other' && (
                  <div>
                    <label className={labelClass}>Content Type</label>
                    <select value={contentForm.content_type} onChange={(e) => setContentForm({ ...contentForm, content_type: e.target.value })} className={inputClass}>
                      {['announcement', 'scholarship', 'promo', 'news', 'faq'].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                )}
                <div className="sm:col-span-2"><label className={labelClass}>Description / Content</label><textarea value={contentForm.description} onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })} rows={4} placeholder={contentSubTab === 'blog' ? 'Write your blog post content...' : contentSubTab === 'events' ? 'Event details, location, time...' : 'Content description...'} className={`${inputClass} resize-none`} /></div>
                <div><label className={labelClass}>Image URL</label><input type="url" value={contentForm.image_url} onChange={(e) => setContentForm({ ...contentForm, image_url: e.target.value })} className={inputClass} /></div>
                <div><label className={labelClass}>Link URL</label><input type="url" value={contentForm.link_url} onChange={(e) => setContentForm({ ...contentForm, link_url: e.target.value })} className={inputClass} /></div>
                {(contentSubTab === 'events' || contentSubTab === 'other') && (
                  <div><label className={labelClass}>Expiry / Event Date</label><input type="date" value={contentForm.expires_at} onChange={(e) => setContentForm({ ...contentForm, expires_at: e.target.value })} className={inputClass} /></div>
                )}
                <div className="flex items-center gap-2 pt-4"><input type="checkbox" id="gen-pub" checked={contentForm.is_published} onChange={(e) => setContentForm({ ...contentForm, is_published: e.target.checked })} className="rounded" /><label htmlFor="gen-pub" className="text-sm text-gray-700">Publish on website</label></div>
              </div>
              <div className="flex gap-2">
                <button onClick={saveContent} disabled={contentSaving} className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60">{contentSaving ? 'Saving...' : 'Save'}</button>
                <button onClick={() => { setShowContentForm(false); setEditingContent(null); }} className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-gray-300 transition-colors">Cancel</button>
              </div>
            </div>
          )}
          <ContentItemList items={filteredContentItems} supabase={supabase} setContentItems={setContentItems} onEdit={(c) => { setEditingContent(c); setContentForm({ title: c.title, description: c.description || '', content_type: c.content_type, image_url: c.image_url || '', link_url: c.link_url || '', is_published: c.is_published, display_order: c.display_order, expires_at: c.expires_at ? c.expires_at.split('T')[0] : '' }); setContentError(''); setShowContentForm(true); }} emptyIcon={contentSubTab === 'blog' ? '✍️' : contentSubTab === 'events' ? '📅' : '📌'} emptyText={`No ${contentSubTab === 'blog' ? 'blog posts' : contentSubTab === 'events' ? 'events' : 'content'} yet`} />
        </div>
      )}
    </div>
  );
}

// ── Reusable Content Item List ────────────────────────────────────────────────
interface ContentItemListProps {
  items: ContentItem[];
  supabase: ReturnType<typeof createClient>;
  setContentItems: React.Dispatch<React.SetStateAction<ContentItem[]>>;
  onEdit: (item: ContentItem) => void;
  emptyIcon: string;
  emptyText: string;
}

function ContentItemList({ items, supabase, setContentItems, onEdit, emptyIcon, emptyText }: ContentItemListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center">
        <p className="text-3xl mb-2">{emptyIcon}</p>
        <p className="font-semibold text-gray-700 text-sm">{emptyText}</p>
        <p className="text-xs text-gray-400 mt-1">Use the options above to add content</p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {items.map((c) => (
        <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4">
          {c.image_url && (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={c.image_url} alt={c.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900 text-sm">{c.title}</p>
              <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full font-semibold capitalize">{c.content_type}</span>
            </div>
            {c.description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{c.description}</p>}
            {c.link_url && <p className="text-xs text-indigo-500 mt-0.5 truncate">🔗 {c.link_url}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={async () => { await supabase.from('content_items').update({ is_published: !c.is_published }).eq('id', c.id); setContentItems((p) => p.map((x) => x.id === c.id ? { ...x, is_published: !x.is_published } : x)); }}
              className={`text-xs px-2 py-1 rounded-lg font-semibold transition-colors ${c.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {c.is_published ? '✓ Published' : 'Draft'}
            </button>
            <button onClick={() => onEdit(c)} className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors text-xs">✏️</button>
            <button onClick={async () => { if (confirm('Delete this content?')) { await supabase.from('content_items').delete().eq('id', c.id); setContentItems((p) => p.filter((x) => x.id !== c.id)); } }}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors text-xs">🗑️</button>
          </div>
        </div>
      ))}
    </div>
  );
}
