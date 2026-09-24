'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Row {
  key: string;
  source: 'website' | 'portal';
  id: string;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  service: string;
  counselor: string | null;
  date: string;
  time: string;
  note: string | null;
  status: string;
  meeting_link: string | null;
  created_at: string;
}

const STATUS_STYLE: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  confirmed: 'bg-green-50 text-green-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const fmtTime = (t: string) => (t && /^\d{2}:\d{2}/.test(t) ? t.slice(0, 5) : t);

export default function BookingsPanel({
  supabase,
  adminId,
  onPendingChange,
}: {
  supabase: SupabaseClient;
  adminId?: string;
  onPendingChange?: (n: number) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | BookingStatus>('pending');
  const [busyKey, setBusyKey] = useState<string | null>(null);

  // Keep latest props in refs so the loader stays stable and never re-fires on parent re-render
  const sbRef = useRef(supabase);
  const cbRef = useRef(onPendingChange);
  sbRef.current = supabase;
  cbRef.current = onPendingChange;

  const load = useCallback(async () => {
    const supabase = sbRef.current;
    setLoading(true);
    setError(null);
    const [web, portal] = await Promise.all([
      supabase.from('booking_requests').select('*').order('created_at', { ascending: false }),
      supabase
        .from('consultations')
        .select('*, user_profiles(full_name, email, phone)')
        .order('created_at', { ascending: false }),
    ]);

    if (web.error || portal.error) {
      console.error('Bookings load error:', web.error?.message, portal.error?.message);
      setError(
        'Could not load some bookings. Make sure the latest Supabase migration (booking_requests) has been applied.'
      );
    }

    const out: Row[] = [];
    (web.data || []).forEach((b: any) =>
      out.push({
        key: `w-${b.id}`,
        source: 'website',
        id: b.id,
        user_id: b.user_id,
        name: b.full_name,
        email: b.email,
        phone: b.phone,
        service: b.service,
        counselor: b.counselor,
        date: b.preferred_date,
        time: b.preferred_time,
        note: b.additional_info,
        status: b.status,
        meeting_link: b.meeting_link,
        created_at: b.created_at,
      })
    );
    (portal.data || []).forEach((c: any) =>
      out.push({
        key: `p-${c.id}`,
        source: 'portal',
        id: c.id,
        user_id: c.user_id,
        name: c.user_profiles?.full_name || 'Student',
        email: c.user_profiles?.email || null,
        phone: c.user_profiles?.phone || null,
        service: c.consultation_type,
        counselor: c.advisor_name,
        date: c.consultation_date,
        time: `${fmtTime(c.start_time)} - ${fmtTime(c.end_time)}`,
        note: c.notes,
        status: c.status,
        meeting_link: c.meeting_link,
        created_at: c.created_at,
      })
    );
    out.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    setRows(out);
    cbRef.current?.(out.filter((r) => r.status === 'pending').length);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (r: Row, status: BookingStatus) => {
    setBusyKey(r.key);
    try {
      let meeting_link = r.meeting_link;
      if (status === 'confirmed' && !meeting_link) {
        const link = window.prompt('Meeting link or location for this appointment (optional):', '');
        meeting_link = link && link.trim() ? link.trim() : null;
      }
      const table = r.source === 'website' ? 'booking_requests' : 'consultations';
      const { error: upErr } = await supabase
        .from(table)
        .update({ status, meeting_link })
        .eq('id', r.id);
      if (upErr) throw upErr;

      // Tell the student inside their portal (only possible when they have an account)
      if (r.user_id && (status === 'confirmed' || status === 'cancelled')) {
        await supabase.from('notifications').insert({
          user_id: r.user_id,
          title: status === 'confirmed' ? 'Consultation Confirmed' : 'Consultation Cancelled',
          body:
            status === 'confirmed'
              ? `Your ${r.service} on ${fmtDate(r.date)} (${r.time}) is confirmed.${meeting_link ? ` Details: ${meeting_link}` : ''}`
              : `Your ${r.service} on ${fmtDate(r.date)} was cancelled. Please rebook a new time.`,
          type: 'consultation',
        });
      }
      setRows((p) => {
        const next = p.map((x) => (x.key === r.key ? { ...x, status, meeting_link } : x));
        onPendingChange?.(next.filter((x) => x.status === 'pending').length);
        return next;
      });
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Could not update booking');
    } finally {
      setBusyKey(null);
    }
  };

  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  const counts = (s: string) => rows.filter((r) => r.status === s).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {(['pending', 'confirmed', 'completed', 'cancelled', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap ${
                filter === f ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f} {f === 'all' ? `(${rows.length})` : `(${counts(f)})`}
            </button>
          ))}
        </div>
        <button onClick={load} className="text-xs font-semibold text-indigo-600 hover:underline">
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm">Loading bookings…</div>
      ) : shown.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-sm bg-white rounded-2xl border border-gray-100">
          No {filter === 'all' ? '' : filter} bookings yet.
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => (
            <div key={r.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-gray-900">{r.name}</h4>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                        STATUS_STYLE[r.status] || STATUS_STYLE.pending
                      }`}
                    >
                      {r.status}
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">
                      {r.source === 'website' ? 'Website form' : 'Student portal'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {r.service}
                    {r.counselor ? ` · ${r.counselor}` : ''}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    📅 {fmtDate(r.date)} · {r.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 break-words">
                    {r.phone && (
                      <a href={`tel:${r.phone}`} className="hover:underline mr-3">
                        📞 {r.phone}
                      </a>
                    )}
                    {r.email && (
                      <a href={`mailto:${r.email}`} className="hover:underline">
                        ✉️ {r.email}
                      </a>
                    )}
                  </p>
                  {r.note && <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-2">{r.note}</p>}
                  {r.meeting_link && <p className="text-xs text-green-700 mt-2 break-all">🔗 {r.meeting_link}</p>}
                  <p className="text-[11px] text-gray-400 mt-2">Received {fmtDate(r.created_at)}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {r.status === 'pending' && (
                    <button
                      disabled={busyKey === r.key}
                      onClick={() => setStatus(r, 'confirmed')}
                      className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 disabled:opacity-50"
                    >
                      Confirm
                    </button>
                  )}
                  {r.status === 'confirmed' && (
                    <button
                      disabled={busyKey === r.key}
                      onClick={() => setStatus(r, 'completed')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50"
                    >
                      Mark done
                    </button>
                  )}
                  {(r.status === 'pending' || r.status === 'confirmed') && (
                    <button
                      disabled={busyKey === r.key}
                      onClick={() => setStatus(r, 'cancelled')}
                      className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
