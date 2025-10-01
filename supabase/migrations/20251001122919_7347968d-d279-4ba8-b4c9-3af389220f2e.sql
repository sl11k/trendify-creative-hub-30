-- Drop existing overly permissive RLS policies
DROP POLICY IF EXISTS "Allow admin users to read all users" ON public.admin_users;
DROP POLICY IF EXISTS "Allow admin users to manage users" ON public.admin_users;
DROP POLICY IF EXISTS "Admin can view page views" ON public.page_views;
DROP POLICY IF EXISTS "Public can insert page views" ON public.page_views;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the authenticated user's email exists in admin_users and is active
  RETURN EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    AND active = true
  );
END;
$$;

-- Secure admin_users table - only admins can access
CREATE POLICY "Admins can view admin users"
ON public.admin_users
FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage admin users"
ON public.admin_users
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Secure page_views table - only admins can read, anyone can insert for tracking
CREATE POLICY "Anyone can insert page views"
ON public.page_views
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view page views"
ON public.page_views
FOR SELECT
TO authenticated
USING (public.is_admin());

-- Drop the password_hash column as we'll use Supabase Auth instead
ALTER TABLE public.admin_users DROP COLUMN IF EXISTS password_hash;