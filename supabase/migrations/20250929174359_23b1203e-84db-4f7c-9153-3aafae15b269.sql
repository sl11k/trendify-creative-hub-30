-- Create storage policies for portfolio bucket

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio');

-- Allow public to view files (since bucket is public)
CREATE POLICY "Allow public to view files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'portfolio');

-- Allow authenticated users to update their files
CREATE POLICY "Allow authenticated users to update files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio');

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated users to delete files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio');