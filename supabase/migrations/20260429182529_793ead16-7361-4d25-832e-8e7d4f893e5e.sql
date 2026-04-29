-- Create the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('clube-assets', 'clube-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public to view images
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'clube-assets');

-- Policy to allow authenticated users to upload (Admin usually)
CREATE POLICY "Allow Upload" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'clube-assets' AND auth.role() = 'authenticated');

-- Policy to allow authenticated users to update/delete
CREATE POLICY "Allow Update" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'clube-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Allow Delete" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'clube-assets' AND auth.role() = 'authenticated');
