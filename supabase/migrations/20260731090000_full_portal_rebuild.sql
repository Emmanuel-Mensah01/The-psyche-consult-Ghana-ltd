-- ============================================================
-- FULL PORTAL REBUILD MIGRATION
-- Adds: study_countries, universities, programs, intakes,
--       student_applications (13-stage), messages, notifications,
--       enhanced user_profiles columns
-- ============================================================

-- ── 1. Extend user_profiles with missing registration fields ──────────────────
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS country_applying_from TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_contact_relation TEXT,
  ADD COLUMN IF NOT EXISTS school_attended TEXT,
  ADD COLUMN IF NOT EXISTS graduation_year TEXT,
  ADD COLUMN IF NOT EXISTS preferred_university TEXT,
  ADD COLUMN IF NOT EXISTS preferred_degree TEXT,
  ADD COLUMN IF NOT EXISTS preferred_intake TEXT,
  ADD COLUMN IF NOT EXISTS profile_completed_at TIMESTAMPTZ;

-- ── 2. Study Countries ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.study_countries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT,
  flag_emoji TEXT,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 3. Universities ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_id UUID REFERENCES public.study_countries(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  location TEXT,
  ranking TEXT,
  is_partner BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 4. Programs / Courses ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_level TEXT NOT NULL,
  duration TEXT,
  tuition_fee TEXT,
  entry_requirements TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 5. Intakes ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID REFERENCES public.universities(id) ON DELETE CASCADE,
  program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
  intake_name TEXT NOT NULL,
  start_date DATE,
  application_deadline DATE,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 6. Student Applications ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  country_id UUID REFERENCES public.study_countries(id) ON DELETE SET NULL,
  university_id UUID REFERENCES public.universities(id) ON DELETE SET NULL,
  program_id UUID REFERENCES public.programs(id) ON DELETE SET NULL,
  intake_id UUID REFERENCES public.intakes(id) ON DELETE SET NULL,
  country_name TEXT,
  university_name TEXT,
  program_name TEXT,
  intake_name TEXT,
  degree_level TEXT,
  status TEXT NOT NULL DEFAULT 'application_received',
  admin_notes TEXT,
  student_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 7. Application Progress History ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.application_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES public.student_applications(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  notes TEXT,
  changed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 8. Messages ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  subject TEXT,
  body TEXT NOT NULL,
  is_announcement BOOLEAN DEFAULT false,
  attachment_url TEXT,
  attachment_name TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 9. Notifications ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ── 10. Document Comments (admin review) ─────────────────────────────────────
ALTER TABLE public.student_documents
  ADD COLUMN IF NOT EXISTS admin_comment TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- ── 11. Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_study_countries_active ON public.study_countries(is_active);
CREATE INDEX IF NOT EXISTS idx_universities_country ON public.universities(country_id);
CREATE INDEX IF NOT EXISTS idx_universities_active ON public.universities(is_active);
CREATE INDEX IF NOT EXISTS idx_programs_university ON public.programs(university_id);
CREATE INDEX IF NOT EXISTS idx_intakes_university ON public.intakes(university_id);
CREATE INDEX IF NOT EXISTS idx_intakes_program ON public.intakes(program_id);
CREATE INDEX IF NOT EXISTS idx_student_applications_user ON public.student_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_student_applications_status ON public.student_applications(status);
CREATE INDEX IF NOT EXISTS idx_application_progress_app ON public.application_progress(application_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, is_read);

-- ── 12. Helper Functions ──────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role::text = 'admin'
  )
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ── 13. Enable RLS ────────────────────────────────────────────────────────────
ALTER TABLE public.study_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ── 14. RLS Policies ─────────────────────────────────────────────────────────

-- study_countries: public read, admin write
DROP POLICY IF EXISTS "public_read_study_countries" ON public.study_countries;
CREATE POLICY "public_read_study_countries" ON public.study_countries
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_study_countries" ON public.study_countries;
CREATE POLICY "admin_manage_study_countries" ON public.study_countries
  FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- universities: public read, admin write
DROP POLICY IF EXISTS "public_read_universities" ON public.universities;
CREATE POLICY "public_read_universities" ON public.universities
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_universities" ON public.universities;
CREATE POLICY "admin_manage_universities" ON public.universities
  FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- programs: public read, admin write
DROP POLICY IF EXISTS "public_read_programs" ON public.programs;
CREATE POLICY "public_read_programs" ON public.programs
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_programs" ON public.programs;
CREATE POLICY "admin_manage_programs" ON public.programs
  FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- intakes: public read, admin write
DROP POLICY IF EXISTS "public_read_intakes" ON public.intakes;
CREATE POLICY "public_read_intakes" ON public.intakes
  FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_intakes" ON public.intakes;
CREATE POLICY "admin_manage_intakes" ON public.intakes
  FOR ALL TO authenticated USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- student_applications: student sees own, admin sees all
DROP POLICY IF EXISTS "students_manage_own_applications" ON public.student_applications;
CREATE POLICY "students_manage_own_applications" ON public.student_applications
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_user())
  WITH CHECK (user_id = auth.uid() OR public.is_admin_user());

-- application_progress: student reads own, admin manages all
DROP POLICY IF EXISTS "students_read_own_progress" ON public.application_progress;
CREATE POLICY "students_read_own_progress" ON public.application_progress
  FOR SELECT TO authenticated
  USING (
    public.is_admin_user() OR
    EXISTS (
      SELECT 1 FROM public.student_applications sa
      WHERE sa.id = application_id AND sa.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "admin_manage_progress" ON public.application_progress;
CREATE POLICY "admin_manage_progress" ON public.application_progress
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user());

DROP POLICY IF EXISTS "admin_update_progress" ON public.application_progress;
CREATE POLICY "admin_update_progress" ON public.application_progress
  FOR UPDATE TO authenticated
  USING (public.is_admin_user())
  WITH CHECK (public.is_admin_user());

-- messages: sender or recipient can read; admin can read all
DROP POLICY IF EXISTS "messages_read_policy" ON public.messages;
CREATE POLICY "messages_read_policy" ON public.messages
  FOR SELECT TO authenticated
  USING (
    sender_id = auth.uid() OR
    recipient_id = auth.uid() OR
    is_announcement = true OR
    public.is_admin_user()
  );

DROP POLICY IF EXISTS "messages_insert_policy" ON public.messages;
CREATE POLICY "messages_insert_policy" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "messages_update_policy" ON public.messages;
CREATE POLICY "messages_update_policy" ON public.messages
  FOR UPDATE TO authenticated
  USING (recipient_id = auth.uid() OR public.is_admin_user())
  WITH CHECK (recipient_id = auth.uid() OR public.is_admin_user());

-- notifications: user sees own
DROP POLICY IF EXISTS "users_own_notifications" ON public.notifications;
CREATE POLICY "users_own_notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_user())
  WITH CHECK (user_id = auth.uid() OR public.is_admin_user());

-- student_documents: existing policies stay, add admin full access
DROP POLICY IF EXISTS "admin_manage_all_documents" ON public.student_documents;
CREATE POLICY "admin_manage_all_documents" ON public.student_documents
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_admin_user())
  WITH CHECK (user_id = auth.uid() OR public.is_admin_user());

-- user_profiles: admin can read all students
DROP POLICY IF EXISTS "admin_read_all_profiles" ON public.user_profiles;
CREATE POLICY "admin_read_all_profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin_user());

DROP POLICY IF EXISTS "admin_update_all_profiles" ON public.user_profiles;
CREATE POLICY "admin_update_all_profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin_user())
  WITH CHECK (id = auth.uid() OR public.is_admin_user());

-- ── 15. Triggers ─────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS update_study_countries_updated_at ON public.study_countries;
CREATE TRIGGER update_study_countries_updated_at
  BEFORE UPDATE ON public.study_countries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_universities_updated_at ON public.universities;
CREATE TRIGGER update_universities_updated_at
  BEFORE UPDATE ON public.universities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_programs_updated_at ON public.programs;
CREATE TRIGGER update_programs_updated_at
  BEFORE UPDATE ON public.programs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_student_applications_updated_at ON public.student_applications;
CREATE TRIGGER update_student_applications_updated_at
  BEFORE UPDATE ON public.student_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
