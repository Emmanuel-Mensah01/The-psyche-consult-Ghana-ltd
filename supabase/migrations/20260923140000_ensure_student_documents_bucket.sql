-- Migration: Ensure student-documents storage bucket exists
-- Timestamp: 20260923140000
--
-- The student-documents bucket was missing from the remote project (uploads
-- were failing with "Bucket not found" / 404), even though the RLS policies
-- for it were already in place. This just (re)creates the bucket itself.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'student-documents',
  'student-documents',
  false,
  10485760,
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;
