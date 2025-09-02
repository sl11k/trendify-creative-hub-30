-- Create policies for analytics_codes without IF NOT EXISTS
DROP POLICY IF EXISTS "Public can view active analytics codes" ON public.analytics_codes;
DROP POLICY IF EXISTS "Enable all operations for admin on analytics_codes" ON public.analytics_codes;

CREATE POLICY "Public can view active analytics codes"
ON public.analytics_codes
FOR SELECT
USING (active = true);

CREATE POLICY "Enable all operations for admin on analytics_codes"
ON public.analytics_codes
FOR ALL
USING (true)
WITH CHECK (true);

-- Fix admin_users policies
DROP POLICY IF EXISTS "Admin users can view themselves" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can update themselves" ON public.admin_users;

CREATE POLICY "Admin users can view themselves"
ON public.admin_users
FOR SELECT
USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update themselves"
ON public.admin_users
FOR UPDATE
USING (auth.uid()::text = id::text);