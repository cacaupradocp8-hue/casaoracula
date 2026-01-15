
-- Create storage bucket for content images (courses, portals, etc)
INSERT INTO storage.buckets (id, name, public)
VALUES ('content-images', 'content-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload content images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'content-images');

-- Allow public read access
CREATE POLICY "Public can view content images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'content-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update content images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'content-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete content images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'content-images');
