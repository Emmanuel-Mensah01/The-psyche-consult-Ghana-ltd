'use client';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

// ── Types ──────────────────────────────────────────────────────────────────────
export interface DocumentEntry {
  id: string;
  document_name: string;
  document_type: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: string;
  admin_comment: string | null;
  created_at: string;
}

export interface DocumentStats {
  total: number;
  uploaded: number;
  pending: number;
  verified: number;
  needsAttention: number; // rejected + re_upload
}

interface DocumentsPanelProps {
  /** Called whenever the document list changes, so a parent page (dashboard/profile) can show a badge/count without a second fetch. */
  onStatsChange?: (stats: DocumentStats) => void;
  /** Show a compact heading (used when the panel is embedded inside another tabbed page). */
  title?: string;
  subtitle?: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
export const DOCUMENT_TYPES = [
  'Passport', 'CV / Resume', 'Academic Transcript', 'Degree Certificate',
  'High School Certificate', 'English Test Result (IELTS/TOEFL)',
  'Passport Photo', 'Personal Statement', 'Recommendation Letter',
  'Financial Documents', 'Other Supporting Documents',
];

const docStatusConfig: Record<string, { label: string; color: string; bg: string }> = {
  uploaded:  { label: 'Uploaded — awaiting review', color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200' },
  pending:   { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  verified:  { label: 'Verified',       color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  rejected:  { label: 'Rejected',       color: 'text-red-700',   bg: 'bg-red-50 border-red-200' },
  re_upload: { label: 'Re-upload Required', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatFileSize(b: number) {
  if (!b) return '—';
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(1)} MB`;
}

function computeStats(documents: DocumentEntry[]): DocumentStats {
  return {
    total: documents.length,
    uploaded: documents.filter((d) => d.status === 'uploaded').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    verified: documents.filter((d) => d.status === 'verified').length,
    needsAttention: documents.filter((d) => d.status === 'rejected' || d.status === 're_upload').length,
  };
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function DocumentsPanel({ onStatsChange, title = 'My Documents', subtitle }: DocumentsPanelProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [documents, setDocuments] = useState<DocumentEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(DOCUMENT_TYPES[0]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!user) return;
    const supabase = createClient();
    const { data, error } = await supabase
      .from('student_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (!error) setDocuments(data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  useEffect(() => {
    if (onStatsChange) onStatsChange(computeStats(documents));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents]);

  const doUpload = async (file: File) => {
    if (!user) return;
    setUploading(true); setUploadError(null); setUploadSuccess(false);
    try {
      const supabase = createClient();
      if (file.size > 10 * 1024 * 1024) throw new Error('File is too large. Maximum size is 10MB.');
      const ext = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}_${selectedDocType.replace(/\s+/g, '_')}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('student-documents').upload(filePath, file, { upsert: false });
      if (uploadErr) throw uploadErr;
      const { error: dbErr } = await supabase.from('student_documents').insert({
        user_id: user.id,
        document_name: file.name,
        document_type: selectedDocType,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        status: 'uploaded',
      });
      if (dbErr) throw dbErr;
      // Notify admins isn't required client-side (RLS-protected); just refresh the list.
      await fetchDocuments();
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await doUpload(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await doUpload(file);
  };

  const handleDeleteDocument = async (doc: DocumentEntry) => {
    if (!user) return;
    if (!confirm(`Delete "${doc.document_name}"? This cannot be undone.`)) return;
    setDeletingId(doc.id);
    try {
      const supabase = createClient();
      await supabase.storage.from('student-documents').remove([doc.file_path]);
      const { error } = await supabase.from('student_documents').delete().eq('id', doc.id);
      if (error) throw error;
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    } catch (err) { console.error(err); }
    finally { setDeletingId(null); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-colors text-gray-900 text-sm";
  const stats = computeStats(documents);

  return (
    <div className="space-y-4">
      {/* Upload Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {stats.total > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {stats.needsAttention > 0 && (
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 whitespace-nowrap">
                  {stats.needsAttention} need{stats.needsAttention === 1 ? 's' : ''} attention
                </span>
              )}
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 whitespace-nowrap">
                {stats.verified} verified
              </span>
            </div>
          )}
        </div>

        {uploadError && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{uploadError}</div>}
        {uploadSuccess && <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">✓ Document uploaded successfully. Our team will review it shortly.</div>}

        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Document Category</label>
            <select value={selectedDocType} onChange={(e) => setSelectedDocType(e.target.value)} className={inputClass}>
              {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Drag & drop zone — makes upload unmistakably visible */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 text-indigo-600">
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              <p className="text-sm font-semibold">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              </div>
              <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
              <p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, DOCX — Max 10MB</p>
              <span className="mt-1 inline-flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold text-xs">
                + Upload {selectedDocType}
              </span>
            </div>
          )}
        </div>
        <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={handleFileUpload} className="hidden" />
      </div>

      {/* Document List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Uploaded Documents ({documents.length})</h3>
        </div>
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading documents…</div>
        ) : documents.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 opacity-40"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <p className="text-sm">No documents uploaded yet</p>
            <p className="text-xs text-gray-400 mt-1">Use the box above to add your first document</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {documents.map((doc) => {
              const cfg = docStatusConfig[doc.status] || docStatusConfig['uploaded'];
              return (
                <div key={doc.id} className="p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{doc.document_name}</p>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium text-indigo-600">{doc.document_type}</span> · {formatFileSize(doc.file_size)} · {formatDate(doc.created_at)}
                    </p>
                    {doc.admin_comment && (
                      <div className="mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-700">
                        <span className="font-semibold">Admin note:</span> {doc.admin_comment}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    <button onClick={() => handleDeleteDocument(doc)} disabled={deletingId === doc.id}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0">
                      {deletingId === doc.id ? (
                        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
