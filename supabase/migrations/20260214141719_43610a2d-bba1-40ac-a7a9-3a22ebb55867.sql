-- Fix content-images bucket: restrict write operations to admin only
-- (matching the pattern already used by oracle-images and audios buckets)

DROP POLICY "Authenticated users can upload content images" ON storage.objects;
DROP POLICY "Authenticated users can update content images" ON storage.objects;
DROP POLICY "Authenticated users can delete content images" ON storage.objects;

CREATE POLICY "Admins can upload content images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'content-images'
  AND get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Admins can update content images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'content-images'
  AND get_user_portal(auth.uid()) = 'admin'
);

CREATE POLICY "Admins can delete content images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'content-images'
  AND get_user_portal(auth.uid()) = 'admin'
);