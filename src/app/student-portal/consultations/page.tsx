'use client';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';

interface TimeSlot {
  start_time: string;
  end_time: string;
  available: boolean;
}

interface Consultation {
  id: string;
  consultation_date: string;
  start_time: string;
  end_time: string;
  advisor_name: string;
  consultation_type: string;
  notes: string;
  status: string;
  created_at: string;
}

const CONSULTATION_TYPES = [
  'General Consultation',
  'University Selection',
  'Visa Application Guidance',
  'Scholarship Advice',
  'Application Review',
  'Pre-Departure Briefing',
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: 'Pending', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  confirmed: { label: 'Confirmed', color: 'text-green-700', bg: 'bg-green-50 border-green-200', dot: 'bg-green-500' },
  completed: { label: 'Completed', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', dot: 'bg-indigo-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-700', bg: 'bg-red-50 border-red-200', dot: 'bg-red-400' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function ConsultationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [consultationType, setConsultationType] = useState(CONSULTATION_TYPES[0]);
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [myBookings, setMyBookings] = useState<Consultation[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'book' | 'my-bookings'>('book');

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/student-portal/login');
    }
  }, [user, loading, router]);

  const fetchMyBookings = useCallback(async () => {
    if (!user) return;
    setBookingsLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user.id)
        .order('consultation_date', { ascending: true })
        .order('start_time', { ascending: true });
      if (!error) setMyBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchMyBookings();
  }, [user, fetchMyBookings]);

  const fetchTimeSlots = useCallback(async (dateStr: string) => {
    setSlotsLoading(true);
    setSelectedSlot(null);
    try {
      const supabase = createClient();
      const date = new Date(dateStr + 'T00:00:00');
      const dayOfWeek = date.getDay();

      const [availRes, bookedRes] = await Promise.all([
        supabase
          .from('advisor_availability')
          .select('start_time, end_time')
          .eq('day_of_week', dayOfWeek)
          .eq('is_active', true)
          .order('start_time'),
        supabase
          .from('consultations')
          .select('start_time, end_time')
          .eq('consultation_date', dateStr)
          .neq('status', 'cancelled'),
      ]);

      const bookedTimes = new Set((bookedRes.data || []).map((b) => b.start_time));
      const slots: TimeSlot[] = (availRes.data || []).map((slot) => ({
        start_time: slot.start_time,
        end_time: slot.end_time,
        available: !bookedTimes.has(slot.start_time),
      }));
      setTimeSlots(slots);
    } catch (err) {
      console.error('Error fetching time slots:', err);
      setTimeSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlot(null);
    setBookingSuccess(false);
    setBookingError('');
    fetchTimeSlots(dateStr);
  };

  const handleBooking = async () => {
    if (!user || !selectedDate || !selectedSlot) return;
    setBookingLoading(true);
    setBookingError('');
    try {
      const supabase = createClient();
      const { error } = await supabase.from('consultations').insert({
        user_id: user.id,
        consultation_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        advisor_name: 'The Psyche Consult Ghana Ltd Advisor',
        consultation_type: consultationType,
        notes: notes.trim() || null,
        status: 'pending',
      });
      if (error) throw error;
      setBookingSuccess(true);
      setSelectedSlot(null);
      setNotes('');
      fetchMyBookings();
      fetchTimeSlots(selectedDate);
    } catch (err: any) {
      setBookingError(err?.message || 'Failed to book consultation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    try {
      const supabase = createClient();
      await supabase.from('consultations').update({ status: 'cancelled' }).eq('id', id);
      fetchMyBookings();
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  // Calendar helpers
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const isDateDisabled = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    const dayOfWeek = d.getDay();
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return dayOfWeek === 0 || dateStr < todayStr; // Disable Sundays and past dates
  };

  const getDateStr = (day: number) =>
    `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                  <path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 hidden sm:block">The Psyche Consult Ghana Ltd</span>
            </Link>
            <span className="text-gray-300 hidden sm:block">|</span>
            <span className="text-indigo-600 font-semibold hidden sm:block">Book Consultation</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/student-portal/dashboard" className="text-sm text-gray-500 hover:text-indigo-600 font-medium transition-colors hidden sm:block">
              ← Dashboard
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {initials}
              </div>
              <span className="text-gray-700 font-medium hidden sm:block text-sm">{displayName}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule a Consultation</h1>
          <p className="text-gray-500">Book a one-on-one session with our expert advisors. Choose a date and time that works for you.</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-8 w-fit">
          <button
            onClick={() => setActiveView('book')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeView === 'book' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Book New Session
          </button>
          <button
            onClick={() => setActiveView('my-bookings')}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${activeView === 'my-bookings' ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Bookings
            {myBookings.filter(b => b.status !== 'cancelled').length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeView === 'my-bookings' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                {myBookings.filter(b => b.status !== 'cancelled').length}
              </span>
            )}
          </button>
        </div>

        {activeView === 'book' && (
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={prevMonth}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      onClick={nextMonth}
                      className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-indigo-100 hover:text-indigo-600 flex items-center justify-center transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_NAMES.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const dateStr = getDateStr(day);
                    const disabled = isDateDisabled(day);
                    const isSelected = selectedDate === dateStr;
                    const isToday = dateStr === todayStr;
                    return (
                      <button
                        key={day}
                        disabled={disabled}
                        onClick={() => handleDateSelect(dateStr)}
                        className={`
                          aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center
                          ${disabled ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer'}
                          ${isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' : ''}
                          ${isToday && !isSelected ? 'ring-2 ring-indigo-300 text-indigo-700 font-bold' : ''}
                          ${!disabled && !isSelected ? 'text-gray-700' : ''}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full ring-2 ring-indigo-300" />
                    Today
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-indigo-600" />
                    Selected
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-gray-200" />
                    Unavailable
                  </div>
                </div>
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Available Times — {formatDate(selectedDate)}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">All times are in Ghana Standard Time (GMT+0)</p>

                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600" />
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                          <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-medium text-sm">No slots available on this day</p>
                      <p className="text-gray-400 text-xs mt-1">Please select a weekday (Mon–Sat)</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.start_time}
                          disabled={!slot.available}
                          onClick={() => setSelectedSlot(slot)}
                          className={`
                            py-2.5 px-3 rounded-xl text-sm font-semibold border transition-all
                            ${!slot.available ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed line-through' : ''}
                            ${slot.available && selectedSlot?.start_time !== slot.start_time ? 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50' : ''}
                            ${selectedSlot?.start_time === slot.start_time ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : ''}
                          `}
                        >
                          {formatTime(slot.start_time)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Booking Details</h3>

                {bookingSuccess && (
                  <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-green-800 text-sm">Booking Confirmed!</p>
                      <p className="text-green-700 text-xs mt-0.5">Your consultation has been scheduled. We will confirm shortly.</p>
                    </div>
                  </div>
                )}

                {bookingError && (
                  <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                    {bookingError}
                  </div>
                )}

                {/* Summary */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedDate ? formatDate(selectedDate) : 'Not selected'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Time</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {selectedSlot ? `${formatTime(selectedSlot.start_time)} – ${formatTime(selectedSlot.end_time)}` : 'Not selected'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 1 0-16 0" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Advisor</p>
                      <p className="text-sm font-semibold text-gray-900">The Psyche Consult Ghana Ltd Advisor</p>
                    </div>
                  </div>
                </div>

                {/* Consultation Type */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Type</label>
                  <select
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 bg-white"
                  >
                    {CONSULTATION_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific topics or questions you want to discuss..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 resize-none"
                  />
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedSlot || bookingLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {bookingLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /><path d="m9 16 2 2 4-4" />
                      </svg>
                      Confirm Booking
                    </>
                  )}
                </button>

                {(!selectedDate || !selectedSlot) && (
                  <p className="text-center text-xs text-gray-400 mt-3">
                    {!selectedDate ? 'Select a date to continue' : 'Select a time slot to continue'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === 'my-bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Consultations</h2>
                <p className="text-sm text-gray-500 mt-0.5">Track and manage your scheduled sessions</p>
              </div>
            </div>

            {bookingsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : myBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                </div>
                <p className="text-gray-600 font-semibold">No consultations booked yet</p>
                <p className="text-sm text-gray-400 mt-1">Schedule your first session with an advisor</p>
                <button
                  onClick={() => setActiveView('book')}
                  className="mt-4 inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Book a Session
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((booking) => {
                  const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
                  const isPast = booking.consultation_date < todayStr;
                  return (
                    <div key={booking.id} className={`p-5 rounded-2xl border transition-all ${isPast ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-sm'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.color}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cfg.label}
                            </span>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">{booking.consultation_type}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-700 flex-wrap">
                            <span className="flex items-center gap-1.5 font-semibold">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
                              </svg>
                              {formatDate(booking.consultation_date)}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                              </svg>
                              {formatTime(booking.start_time)} – {formatTime(booking.end_time)}
                            </span>
                          </div>
                          {booking.notes && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{booking.notes}</p>
                          )}
                        </div>
                        {booking.status === 'pending' && !isPast && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-xs text-red-500 hover:text-red-700 font-medium border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
