-- Migration: Consultations / Bookings table for student-advisor scheduling
-- Timestamp: 20260727210000

-- 1. Create advisor_availability table (weekly recurring slots)
CREATE TABLE IF NOT EXISTS public.advisor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_name TEXT NOT NULL DEFAULT 'The Psyche Consult Ghana Ltd Advisor',
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sun, 1=Mon...
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create consultations table
CREATE TABLE IF NOT EXISTS public.consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  consultation_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  advisor_name TEXT NOT NULL DEFAULT 'The Psyche Consult Ghana Ltd Advisor',
  consultation_type TEXT NOT NULL DEFAULT 'General Consultation',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  meeting_link TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON public.consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON public.consultations(consultation_date);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON public.consultations(status);
CREATE INDEX IF NOT EXISTS idx_advisor_availability_day ON public.advisor_availability(day_of_week);

-- 4. Enable RLS
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisor_availability ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for consultations
DROP POLICY IF EXISTS "users_manage_own_consultations" ON public.consultations;
CREATE POLICY "users_manage_own_consultations"
ON public.consultations
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 6. RLS Policies for advisor_availability (public read)
DROP POLICY IF EXISTS "public_read_advisor_availability" ON public.advisor_availability;
CREATE POLICY "public_read_advisor_availability"
ON public.advisor_availability
FOR SELECT
TO authenticated
USING (true);

-- 7. Trigger for updated_at on consultations
DROP TRIGGER IF EXISTS update_consultations_updated_at ON public.consultations;
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON public.consultations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Seed advisor availability (Mon–Sat, 9am–5pm in 1-hour slots)
INSERT INTO public.advisor_availability (day_of_week, start_time, end_time, advisor_name)
VALUES
  (1, '09:00', '10:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (1, '10:00', '11:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (1, '11:00', '12:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (1, '14:00', '15:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (1, '15:00', '16:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (2, '09:00', '10:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (2, '10:00', '11:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (2, '11:00', '12:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (2, '14:00', '15:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (2, '15:00', '16:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (3, '09:00', '10:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (3, '10:00', '11:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (3, '11:00', '12:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (3, '14:00', '15:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (3, '15:00', '16:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (4, '09:00', '10:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (4, '10:00', '11:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (4, '11:00', '12:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (4, '14:00', '15:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (4, '15:00', '16:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (5, '09:00', '10:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (5, '10:00', '11:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (5, '11:00', '12:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (5, '14:00', '15:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (5, '15:00', '16:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (6, '09:00', '10:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (6, '10:00', '11:00', 'The Psyche Consult Ghana Ltd Advisor'),
  (6, '11:00', '12:00', 'The Psyche Consult Ghana Ltd Advisor')
ON CONFLICT (id) DO NOTHING;
