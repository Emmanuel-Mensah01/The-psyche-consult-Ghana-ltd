'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Flag from '@/components/Flag';

export interface SearchOption {
  value: string;
  label: string;
  sub?: string;
  flag?: string | null;
}

/** A dropdown with a small search box — replaces long <select> lists. */
export default function SearchSelect({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Type to search…',
  disabled = false,
  className = '',
}: {
  options: SearchOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return options;
    return options.filter((o) => o.label.toLowerCase().includes(s) || (o.sub || '').toLowerCase().includes(s));
  }, [options, q]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`${className} flex items-center justify-between gap-2 text-left bg-white disabled:bg-gray-50 disabled:text-gray-400`}
      >
        <span className={`flex items-center gap-2 min-w-0 ${selected ? 'text-gray-900' : 'text-gray-400'}`}>
          {selected?.flag ? <Flag emoji={selected.flag} width={20} /> : null}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <span className="text-gray-400 text-xs flex-shrink-0">▾</span>
      </button>

      {open && (
        <div className="absolute z-40 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setOpen(false);
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (filtered[0]) pick(filtered[0].value);
                }
              }}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1" role="listbox">
            {value && (
              <li>
                <button type="button" onClick={() => pick('')} className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50">
                  ✕ Clear selection
                </button>
              </li>
            )}
            {filtered.length === 0 ? (
              <li className="px-3 py-3 text-sm text-gray-400">No matches for “{q}”</li>
            ) : (
              filtered.map((o) => (
                <li key={o.value}>
                  <button
                    type="button"
                    onClick={() => pick(o.value)}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-indigo-50 ${
                      o.value === value ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-800'
                    }`}
                  >
                    {o.flag ? <Flag emoji={o.flag} width={20} /> : null}
                    <span className="min-w-0">
                      <span className="block truncate">{o.label}</span>
                      {o.sub && <span className="block text-xs text-gray-400 truncate">{o.sub}</span>}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
