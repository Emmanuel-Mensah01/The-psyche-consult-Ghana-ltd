-- Migration: Allow admin to read all files in student-documents storage bucket
-- Timestamp: 20260731114427

-- Admin can read (SELECT) any file in the student-documents bucket
DROP POLICY IF EXISTS "admin_read_all_student_document_files" ON storage.objects;
CREATE POLICY "admin_read_all_student_document_files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'student-documents'
  AND public.is_admin_user()
);
