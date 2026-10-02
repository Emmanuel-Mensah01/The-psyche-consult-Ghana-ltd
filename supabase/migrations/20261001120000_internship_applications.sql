-- Internship applications from the public /careers page (students only).
CREATE TABLE IF NOT EXISTS public.internship_applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  email         TEXT NOT NULL CHECK (char_length(email) BETWEEN 5 AND 200),
  phone         TEXT NOT NULL CHECK (char_length(phone) BETWEEN 5 AND 40),
  institution   TEXT NOT NULL CHECK (char_length(institution) <= 160),
  programme     TEXT NOT NULL CHECK (char_length(programme) <= 160),
  year_of_study TEXT NOT NULL CHECK (char_length(year_of_study) <= 60),
  area          TEXT NOT NULL CHECK (char_length(area) <= 80),
  office        TEXT NOT NULL CHECK (char_length(office) <= 40),
  availability  TEXT NOT NULL CHECK (char_length(availability) <= 200),
  cv_link       TEXT CHECK (cv_link IS NULL OR char_length(cv_link) <= 300),
  message       TEXT CHECK (message IS NULL OR char_length(message) <= 2000),
  status        TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','interview','accepted','declined')),
  admin_notes   TEXT,
  created_at    TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.internship_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_can_apply_internship" ON public.internship_applications;
CREATE POLICY "public_can_apply_internship" ON public.internship_applications
  FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'new' AND admin_notes IS NULL);

DROP POLICY IF EXISTS "admin_manage_internship_applications" ON public.internship_applications;
CREATE POLICY "admin_manage_internship_applications" ON public.internship_applications
  FOR ALL TO authenticated
  USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());
