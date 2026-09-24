-- Migration: booking_requests — appointments made from the PUBLIC /booking page
-- Timestamp: 20260924090000
--
-- Why: the public booking form previously never sent anything anywhere (it only
-- flipped a "Booking Confirmed" screen). Visitors are usually NOT logged in, so
-- they cannot write to public.consultations (user_id NOT NULL + own-row RLS).
-- This table accepts anonymous inserts and is readable/manageable by admins only
-- (plus the student's own rows if they were logged in when they booked).

CREATE TABLE IF NOT EXISTS public.booking_requests (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  full_name      TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email          TEXT NOT NULL CHECK (char_length(email) BETWEEN 5 AND 200),
  phone          TEXT NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  service        TEXT NOT NULL CHECK (char_length(service) <= 120),
  counselor      TEXT CHECK (counselor IS NULL OR char_length(counselor) <= 120),
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL CHECK (char_length(preferred_time) <= 20),
  additional_info TEXT CHECK (additional_info IS NULL OR char_length(additional_info) <= 2000),
  status         TEXT NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  meeting_link   TEXT,
  admin_notes    TEXT,
  created_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_booking_requests_status  ON public.booking_requests(status);
CREATE INDEX IF NOT EXISTS idx_booking_requests_created ON public.booking_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_booking_requests_user    ON public.booking_requests(user_id);

ALTER TABLE public.booking_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (guest or logged in) can submit a request, but only as a fresh 'pending' row
-- and only attached to themselves (or to nobody).
DROP POLICY IF EXISTS "public_can_insert_booking_requests" ON public.booking_requests;
CREATE POLICY "public_can_insert_booking_requests"
ON public.booking_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND meeting_link IS NULL
  AND admin_notes IS NULL
  AND (user_id IS NULL OR user_id = auth.uid())
);

-- Admins: full control
DROP POLICY IF EXISTS "admin_manage_booking_requests" ON public.booking_requests;
CREATE POLICY "admin_manage_booking_requests"
ON public.booking_requests
FOR ALL
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- Students can see requests they made while logged in
DROP POLICY IF EXISTS "students_read_own_booking_requests" ON public.booking_requests;
CREATE POLICY "students_read_own_booking_requests"
ON public.booking_requests
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

DROP TRIGGER IF EXISTS update_booking_requests_updated_at ON public.booking_requests;
CREATE TRIGGER update_booking_requests_updated_at
  BEFORE UPDATE ON public.booking_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
