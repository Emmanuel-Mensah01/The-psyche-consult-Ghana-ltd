-- Migration: Remove mock/seed data and add admin RLS policies for full data access
-- Timestamp: 20260730140000

-- 1. Delete mock seed data from leads (inserted in 20260727190000)
DELETE FROM public.leads
WHERE email IN (
  'kwame.asante@gmail.com',
  'abena.mensah@yahoo.com',
  'kofi.boateng@outlook.com',
  'ama.owusu@gmail.com'
);

-- 2. Delete mock seed data from contacts (inserted in 20260727190000)
DELETE FROM public.contacts
WHERE email IN (
  'yaw.darko@gmail.com',
  'efua.asare@gmail.com',
  'nana.adjei@hotmail.com'
);

-- 3. Add admin full-access policy for consultations
-- (existing policy only allows users to see their own consultations)
DROP POLICY IF EXISTS "admin_read_all_consultations" ON public.consultations;
CREATE POLICY "admin_read_all_consultations"
ON public.consultations
FOR SELECT
TO authenticated
USING (public.is_admin_user());

DROP POLICY IF EXISTS "admin_update_all_consultations" ON public.consultations;
CREATE POLICY "admin_update_all_consultations"
ON public.consultations
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 4. Add admin full-access policy for student_documents
DROP POLICY IF EXISTS "admin_read_all_student_documents" ON public.student_documents;
CREATE POLICY "admin_read_all_student_documents"
ON public.student_documents
FOR SELECT
TO authenticated
USING (public.is_admin_user());

DROP POLICY IF EXISTS "admin_update_all_student_documents" ON public.student_documents;
CREATE POLICY "admin_update_all_student_documents"
ON public.student_documents
FOR UPDATE
TO authenticated
USING (public.is_admin_user())
WITH CHECK (public.is_admin_user());

-- 5. Add admin full-access policy for user_profiles (read all students)
-- First drop the existing all-in-one policy and replace with split policies
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;

-- Users can read their own profile OR admin can read all
DROP POLICY IF EXISTS "users_select_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_select_own_user_profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (id = auth.uid() OR public.is_admin_user());

-- Users can insert their own profile
DROP POLICY IF EXISTS "users_insert_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_insert_own_user_profiles"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Users can update their own profile
DROP POLICY IF EXISTS "users_update_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_update_own_user_profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid() OR public.is_admin_user())
WITH CHECK (id = auth.uid() OR public.is_admin_user());

-- Users can delete their own profile
DROP POLICY IF EXISTS "users_delete_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_delete_own_user_profiles"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (id = auth.uid());

-- 6. Add admin update policy for leads (already has insert/select, add update)
DROP POLICY IF EXISTS "admin_can_delete_leads" ON public.leads;
CREATE POLICY "admin_can_delete_leads"
ON public.leads
FOR DELETE
TO authenticated
USING (public.is_admin_user());

-- 7. Add admin update policy for contacts
DROP POLICY IF EXISTS "admin_can_delete_contacts" ON public.contacts;
CREATE POLICY "admin_can_delete_contacts"
ON public.contacts
FOR DELETE
TO authenticated
USING (public.is_admin_user());
