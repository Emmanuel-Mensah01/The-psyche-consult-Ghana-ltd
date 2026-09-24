-- Migration: Student profile extended fields, documents, application details
-- Timestamp: 20260727200000

-- 1. Add extended profile columns to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS passport_number TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS preferred_country TEXT,
ADD COLUMN IF NOT EXISTS preferred_course TEXT,
ADD COLUMN IF NOT EXISTS intake_year TEXT,
ADD COLUMN IF NOT EXISTS education_level TEXT,
ADD COLUMN IF NOT EXISTS institution_name TEXT,
ADD COLUMN IF NOT EXISTS gpa TEXT;

-- 2. Create storage bucket for student documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-documents',
  'student-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create student_documents table
CREATE TABLE IF NOT EXISTS public.student_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  status TEXT DEFAULT 'uploaded',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_student_documents_user_id ON public.student_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_created_at ON public.student_documents(created_at DESC);

-- 5. Enable RLS
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for student_documents
DROP POLICY IF EXISTS "users_manage_own_student_documents" ON public.student_documents;
CREATE POLICY "users_manage_own_student_documents"
ON public.student_documents
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- 7. Storage RLS policies
DROP POLICY IF EXISTS "students_upload_own_documents" ON storage.objects;
CREATE POLICY "students_upload_own_documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "students_read_own_documents" ON storage.objects;
CREATE POLICY "students_read_own_documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

DROP POLICY IF EXISTS "students_delete_own_documents" ON storage.objects;
CREATE POLICY "students_delete_own_documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- 8. Trigger for updated_at on student_documents
DROP TRIGGER IF EXISTS update_student_documents_updated_at ON public.student_documents;
CREATE TRIGGER update_student_documents_updated_at
  BEFORE UPDATE ON public.student_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
