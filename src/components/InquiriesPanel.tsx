'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

interface Row {
  key: string;
  table: 'leads' | 'contacts';
  id: string;
  name: string;
  email: string;
  phone: string;
  kind: string;
  subject: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
}

const STATUS_LABEL: Record<InquiryStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In progress',
  closed: 'Closed',
};
const STATUS_STYLE: Record<InquiryStatus, string> = {
  new: 'bg-yellow-50 text-yellow-700',
  contacted: 'bg-blue-50 text-blue-700',
  in_progress: 'bg-purple-50 text-purple-700',
  closed: 'bg-gray-100 text-gray-500',
};

const fmt = (d: string) =>
  new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// Ghana-friendly WhatsApp link: 0244… -> 233244…
function waLink(phone: string) {
  let d = (phone || '').replace(/[^\d]/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  else if (d.startsWith('0')) d = '233' + d.slice(1);
  return d ? `https://wa.me/${d}` : '';
}

export default function InquiriesPanel({
  supabase,
  onNewChange,
}: {
  supabase: SupabaseClient;
  onNewChange?: (n: number) => void;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | InquiryStatus>('new');
  const [busy, setBusy] = useState<string | null>(null);

  const sbRef = useRef(supabase);
  const cbRef = useRef(onNewChange);
  sbRef.current = supabase;
  cbRef.current = onNewChange;

  const load = useCallback(async () => {
    const sb = sbRef.current;
    setLoading(true);
    setError(null);
    const [l, c] = await Promise.all([
      sb.from('leads').select('*').order('created_at', { ascending: false }),
      sb.from('contacts').select('*').order('created_at', { ascending: false }),
    ]);
    if (l.error || c.error) {
      console.error('Inquiries load error:', l.error?.message, c.error?.message);
      setError('Could not load some inquiries. Make sure the latest Supabase migration has been applied and you are logged in as admin.');
    }
    const out: Row[] = [];
    (l.data || []).forEach((r: any) =>
      out.push({
        key: `l-${r.id}`,
        table: 'leads',
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        kind: r.source === 'homepage' || !r.source ? 'Free consultation sign-up' : `Lead (${r.source})`,
        subject: null,
        message: null,
        status: r.status || 'new',
        created_at: r.created_at,
      })
    );
    (c.data || []).forEach((r: any) =>
      out.push({
        key: `c-${r.id}`,
        table: 'contacts',
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        kind: `Contact form · ${r.service || 'General Inquiry'}`,
        subject: r.subject,
        message: r.message,
        status: r.status || 'new',
        created_at: r.created_at,
      })
    );
    out.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    setRows(out);
    cbRef.current?.(out.filter((r) => r.status === 'new').length);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (r: Row, status: InquiryStatus) => {
    setBusy(r.key);
    const { error: e } = await supabase.from(r.table).update({ status }).eq('id', r.id);
    if (e) {
      alert(e.message || 'Could not update');
    } else {
      setRows((p) => {
        const next = p.map((x) => (x.key === r.key ? { ...x, status } : x));
        cbRef.current?.(next.filter((x) => x.status === 'new').length);
        return next;
      });
    }
    setBusy(null);
  };

  const remove = async (r: Row) => {
    if (!window.confirm(`Delete this inquiry from ${r.name}? This cannot be undone.`)) return;
    setBusy(r.key);
    const { error: e } = await supabase.from(r.table).delete().eq('id', r.id);
    if (e) alert(e.message || 'Could not delete');
    else
      setRows((p) => {
        const next = p.filter((x) => x.key !== r.key);
        cbRef.current?.(next.filter((x) => x.status === 'new').length);
        return next;
      });
    setBusy(null);
  };

  const shown = rows.filter((r) => filter === 'all' || r.status === filter);
  const count = (s: string) => rows.filter((r) => r.status === s).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {(['new', 'contacted', 'in_progress', 'closed', 'all'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                filter === f ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? `All (${rows.length})` : `${STATUS_LABEL[f]} (${count(f)})`}
            </button>
          ))}
        </div>
        <button onClick={load} className="text-xs font-semibold text-indigo-600 hover:underline">
          Refresh
        </button>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {loading ? (
        <div className="text-center text-gray-400 py-12 text-sm">Loading inquiries…</div>
      ) : shown.length === 0 ? (
        <div className="text-center text-gray-400 py-12 text-sm bg-white rounded-2xl border border-gray-100">
          No {filter === 'all' ? '' : STATUS_LABEL[filter].toLowerCase()} inquiries.
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((r) => {
            const wa = waLink(r.phone);
            return (
              <div key={r.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-gray-900">{r.name}</h4>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_STYLE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 font-medium">{r.kind}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 break-words">
                      <a href={`tel:${r.phone}`} className="hover:underline mr-3">📞 {r.phone}</a>
                      {wa && (
                        <a href={wa} target="_blank" rel="noreferrer" className="hover:underline mr-3 text-green-600">
                          💬 WhatsApp
                        </a>
                      )}
                      <a href={`mailto:${r.email}`} className="hover:underline">✉️ {r.email}</a>
                    </p>
                    {r.subject && <p className="text-sm font-semibold text-gray-800 mt-2">{r.subject}</p>}
                    {r.message && <p className="text-sm text-gray-600 mt-1 bg-gray-50 rounded-lg p-3 whitespace-pre-wrap">{r.message}</p>}
                    <p className="text-[11px] text-gray-400 mt-2">Received {fmt(r.created_at)}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {r.status === 'new' && (
                      <button disabled={busy === r.key} onClick={() => setStatus(r, 'contacted')} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50">
                        Mark contacted
                      </button>
                    )}
                    {(r.status === 'new' || r.status === 'contacted') && (
                      <button disabled={busy === r.key} onClick={() => setStatus(r, 'in_progress')} className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 disabled:opacity-50">
                        In progress
                      </button>
                    )}
                    {r.status !== 'closed' ? (
                      <button disabled={busy === r.key} onClick={() => setStatus(r, 'closed')} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 disabled:opacity-50">
                        Close
                      </button>
                    ) : (
                      <button disabled={busy === r.key} onClick={() => setStatus(r, 'new')} className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 disabled:opacity-50">
                        Reopen
                      </button>
                    )}
                    <button disabled={busy === r.key} onClick={() => remove(r)} className="px-3 py-1.5 rounded-lg text-red-600 text-xs font-semibold hover:bg-red-50 disabled:opacity-50">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
