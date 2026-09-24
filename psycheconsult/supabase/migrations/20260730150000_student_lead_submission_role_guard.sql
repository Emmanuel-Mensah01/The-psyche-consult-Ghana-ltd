-- Migration: Student lead submission with user_id + role-based portal separation
-- Timestamp: 20260730150000

-- 1. Add user_id column to leads table so student-submitted leads are linked to the student
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL;

-- 2. Add index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);

-- 3. Add source column to distinguish student-portal leads from homepage leads
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'homepage';

-- 4. Update RLS: students can only read their own leads (by email OR user_id)
-- Admin can read all leads (already handled by admin_read_all_leads policy from prior migration)

-- Allow students to insert leads with their user_id
DROP POLICY IF EXISTS "students_insert_own_leads" ON public.leads;
CREATE POLICY "students_insert_own_leads"
ON public.leads
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow students to read their own leads
DROP POLICY IF EXISTS "students_read_own_leads" ON public.leads;
CREATE POLICY "students_read_own_leads"
ON public.leads
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR email = (SELECT email FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- 5. Create a helper function to check if the current user is an admin
-- Used by the student portal login to block admin users
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid()
    AND up.role::text = 'admin'
)
$$;
