-- Migration: Hotfix — is_admin_user() broke student document access
-- Timestamp: 20260923130000
--
-- The previous migration (20260923120000) made is_admin_user() query
-- `auth.users` directly. That table is NOT readable by the `authenticated`
-- role in this project, even from inside a SECURITY DEFINER function, so
-- every single check against student_documents (including a student
-- reading/uploading their OWN documents) started failing with
-- "permission denied for table users".
--
-- Fix: get the same admin signal from auth.jwt() instead — that reads the
-- claims already inside the user's own access token, which every
-- authenticated user is always allowed to read. No table access needed.

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role::text = 'admin'
  )
  OR COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR (auth.jwt() ->> 'email') = 'admin@psycheconsult.com',
    false
  )
$$;
