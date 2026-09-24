-- Migration: Fix admin visibility of student-uploaded documents
-- Timestamp: 20260923120000
--
-- ROOT CAUSE:
-- The admin dashboard's client-side "am I an admin" check (src/app/admin/page.tsx)
-- looks at auth user_metadata / app_metadata / a hardcoded email list. But
-- is_admin_user() — the function every RLS policy actually calls — was redefined
-- in 20260731090000_full_portal_rebuild.sql to check ONLY public.user_profiles.role.
-- If an admin account's role lives in one place but not the other (e.g. someone
-- was promoted to admin by editing auth metadata directly, or user_profiles.role
-- never got backfilled), the admin UI loads fine but Postgres RLS silently
-- filters out every row — no error, just empty lists. That is why documents
-- (and their category/type) appeared invisible to admins even though students
-- could upload them successfully.
--
-- FIX:
-- 1. Make is_admin_user() check BOTH sources (union), so a mismatch between the
--    two can never again hide data from an admin.
-- 2. Backfill user_profiles.role = 'admin' for any account whose auth metadata
--    already says admin, so the two sources agree going forward.
-- 3. Add a trigger that keeps user_profiles.role in sync automatically whenever
--    auth metadata role changes in the future (e.g. promoting someone to admin
--    from the Supabase dashboard).
-- 4. Defensive hardening: ensure document_type/document_name can never be blank
--    so the "category" always renders, and add an explicit admin SELECT policy
--    on student_documents (belt-and-suspenders alongside the existing ALL policy).

-- ── 1. Robust is_admin_user(): true if EITHER source says admin ───────────────
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
  OR EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
$$;

-- ── 2. Backfill: sync user_profiles.role for any already-drifted admin ────────
UPDATE public.user_profiles up
SET role = 'admin'::public.user_role
FROM auth.users au
WHERE up.id = au.id
  AND up.role::text != 'admin'
  AND (
    au.raw_user_meta_data->>'role' = 'admin'
    OR au.raw_app_meta_data->>'role' = 'admin'
    OR au.email = 'admin@psycheconsult.com'
  );

-- ── 3. Keep it in sync automatically from now on ───────────────────────────────
CREATE OR REPLACE FUNCTION public.sync_admin_role_from_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF (
    NEW.raw_user_meta_data->>'role' = 'admin'
    OR NEW.raw_app_meta_data->>'role' = 'admin'
    OR NEW.email = 'admin@psycheconsult.com'
  ) THEN
    UPDATE public.user_profiles
    SET role = 'admin'::public.user_role
    WHERE id = NEW.id AND role::text != 'admin';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_role_synced ON auth.users;
CREATE TRIGGER on_auth_user_role_synced
  AFTER UPDATE OF raw_user_meta_data, raw_app_meta_data, email ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_admin_role_from_auth();

-- ── 4a. Explicit admin SELECT policy on student_documents (belt-and-suspenders) ─
DROP POLICY IF EXISTS "admin_select_all_student_documents" ON public.student_documents;
CREATE POLICY "admin_select_all_student_documents"
ON public.student_documents
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.is_admin_user());

-- ── 4b. Never allow a blank category/name to reach the admin UI ───────────────
ALTER TABLE public.student_documents
  ALTER COLUMN document_type SET DEFAULT 'Other Supporting Documents',
  ALTER COLUMN document_name SET DEFAULT 'Untitled document';

UPDATE public.student_documents
SET document_type = 'Other Supporting Documents'
WHERE document_type IS NULL OR btrim(document_type) = '';

UPDATE public.student_documents
SET document_name = 'Untitled document'
WHERE document_name IS NULL OR btrim(document_name) = '';

-- ── 5. Make sure admins can also see the storage bucket listing (defensive) ───
DROP POLICY IF EXISTS "admin_read_all_student_document_files" ON storage.objects;
CREATE POLICY "admin_read_all_student_document_files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (
    (storage.foldername(name))[1] = auth.uid()::text
    OR public.is_admin_user()
  )
);
