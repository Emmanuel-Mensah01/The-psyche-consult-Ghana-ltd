-- Storage buckets for testimonial media and content images
-- Note: Storage bucket creation is handled via Supabase dashboard or API
-- This migration sets up the RLS policies for the storage buckets

-- Create storage buckets (idempotent via INSERT ... ON CONFLICT)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('testimonial-media', 'testimonial-media', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp', 'image/gif']::TEXT[]),
  ('content-media', 'content-media', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']::TEXT[])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for testimonial-media bucket
DROP POLICY IF EXISTS "public_read_testimonial_media" ON storage.objects;
CREATE POLICY "public_read_testimonial_media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'testimonial-media');

DROP POLICY IF EXISTS "admin_upload_testimonial_media" ON storage.objects;
CREATE POLICY "admin_upload_testimonial_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'testimonial-media'
  AND EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);

DROP POLICY IF EXISTS "admin_update_testimonial_media" ON storage.objects;
CREATE POLICY "admin_update_testimonial_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'testimonial-media'
  AND EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);

DROP POLICY IF EXISTS "admin_delete_testimonial_media" ON storage.objects;
CREATE POLICY "admin_delete_testimonial_media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'testimonial-media'
  AND EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);

-- Storage RLS policies for content-media bucket
DROP POLICY IF EXISTS "public_read_content_media" ON storage.objects;
CREATE POLICY "public_read_content_media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-media');

DROP POLICY IF EXISTS "admin_upload_content_media" ON storage.objects;
CREATE POLICY "admin_upload_content_media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'content-media'
  AND EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);

DROP POLICY IF EXISTS "admin_update_content_media" ON storage.objects;
CREATE POLICY "admin_update_content_media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'content-media'
  AND EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);

DROP POLICY IF EXISTS "admin_delete_content_media" ON storage.objects;
CREATE POLICY "admin_delete_content_media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'content-media'
  AND EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid()
    AND (
      au.raw_user_meta_data->>'role' = 'admin'
      OR au.raw_app_meta_data->>'role' = 'admin'
      OR au.email = 'admin@psycheconsult.com'
    )
  )
);
