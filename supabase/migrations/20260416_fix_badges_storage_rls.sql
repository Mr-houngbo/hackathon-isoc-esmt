-- Fix RLS policies for badges storage bucket
-- This allows authenticated users to upload, read, and delete files in the badges bucket

-- Enable RLS on the bucket (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for the badges bucket if they exist
DROP POLICY IF EXISTS "Allow authenticated uploads to badges" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads from badges" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from badges" ON storage.objects;

-- Policy: Allow authenticated users to upload files to badges bucket
CREATE POLICY "Allow authenticated uploads to badges"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'badges');

-- Policy: Allow authenticated users to read files from badges bucket
CREATE POLICY "Allow authenticated reads from badges"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'badges');

-- Policy: Allow authenticated users to update files in badges bucket
CREATE POLICY "Allow authenticated updates to badges"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'badges')
WITH CHECK (bucket_id = 'badges');

-- Policy: Allow authenticated users to delete files from badges bucket
CREATE POLICY "Allow authenticated deletes from badges"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'badges');

-- Alternative: If you want to allow anon (public) access for reading only
-- CREATE POLICY "Allow public reads from badges"
-- ON storage.objects
-- FOR SELECT
-- TO anon
-- USING (bucket_id = 'badges');
