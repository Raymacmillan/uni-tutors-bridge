-- 1. Allow authenticated users to upload files to the 'transcripts' bucket
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'transcripts');

-- 2. Allow authenticated users to update their own files (if needed)
CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'transcripts');

-- 3. Allow public to read (so you can view the transcript via URL)
CREATE POLICY "Allow public read" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'transcripts');