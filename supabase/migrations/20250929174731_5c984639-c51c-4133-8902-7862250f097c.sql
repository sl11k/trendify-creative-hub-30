-- Update storage policies to allow public uploads (since no auth is implemented)

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete files" ON storage.objects;

-- Allow anyone to upload files to portfolio bucket
CREATE POLICY "Allow public uploads to portfolio"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'portfolio');

-- Allow anyone to update files in portfolio bucket
CREATE POLICY "Allow public updates to portfolio"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'portfolio');

-- Allow anyone to delete files in portfolio bucket
CREATE POLICY "Allow public deletes from portfolio"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'portfolio');