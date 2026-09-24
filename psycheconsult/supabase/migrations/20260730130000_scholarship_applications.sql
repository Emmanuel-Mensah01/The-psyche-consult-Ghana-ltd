-- Scholarship Applications Table
CREATE TABLE IF NOT EXISTS public.scholarship_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program_choice TEXT NOT NULL,
  country_preference TEXT NOT NULL,
  academic_background TEXT,
  personal_statement TEXT NOT NULL,
  why_scholarship TEXT NOT NULL,
  future_goals TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scholarship_applications_email ON public.scholarship_applications(email);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_status ON public.scholarship_applications(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_applications_created_at ON public.scholarship_applications(created_at);

ALTER TABLE public.scholarship_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an application (public insert)
DROP POLICY IF EXISTS "public_can_submit_scholarship_applications" ON public.scholarship_applications;
CREATE POLICY "public_can_submit_scholarship_applications"
ON public.scholarship_applications
FOR INSERT
TO public
WITH CHECK (true);

-- Only authenticated admins can read/update/delete
DROP POLICY IF EXISTS "admin_full_access_scholarship_applications" ON public.scholarship_applications;
CREATE POLICY "admin_full_access_scholarship_applications"
ON public.scholarship_applications
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_scholarship_application_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS scholarship_applications_updated_at ON public.scholarship_applications;
CREATE TRIGGER scholarship_applications_updated_at
  BEFORE UPDATE ON public.scholarship_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_scholarship_application_updated_at();
