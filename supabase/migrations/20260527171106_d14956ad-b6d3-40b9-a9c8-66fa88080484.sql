
DROP POLICY IF EXISTS "Admin can upload to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete portfolio files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates to portfolio" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes from portfolio" ON storage.objects;

CREATE POLICY "Admin can upload to portfolio" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "Admin can update portfolio files" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'portfolio' AND public.is_admin()) WITH CHECK (bucket_id = 'portfolio' AND public.is_admin());
CREATE POLICY "Admin can delete portfolio files" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'portfolio' AND public.is_admin());
