-- Add missing columns to blogs table for SEO keywords
ALTER TABLE public.blogs 
ADD COLUMN IF NOT EXISTS keywords_ar text[],
ADD COLUMN IF NOT EXISTS keywords_en text[];

-- Create analytics_codes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.analytics_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform text NOT NULL,
  code text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on analytics_codes
ALTER TABLE public.analytics_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_codes
CREATE POLICY IF NOT EXISTS "Public can view active analytics codes"
ON public.analytics_codes
FOR SELECT
USING (active = true);

CREATE POLICY IF NOT EXISTS "Enable all operations for admin on analytics_codes"
ON public.analytics_codes
FOR ALL
USING (true)
WITH CHECK (true);

-- Create admin_users table for user management if it doesn't exist
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role text DEFAULT 'admin',
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY IF NOT EXISTS "Admin users can view themselves"
ON public.admin_users
FOR SELECT
USING (auth.uid()::text = id::text);

CREATE POLICY IF NOT EXISTS "Admin users can update themselves"
ON public.admin_users
FOR UPDATE
USING (auth.uid()::text = id::text);

-- Add site maintenance mode setting
INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('maintenance_mode', 'false')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('maintenance_message_ar', 'الموقع مغلق مؤقتاً للصيانة')
ON CONFLICT (setting_key) DO NOTHING;

INSERT INTO public.site_settings (setting_key, setting_value) 
VALUES ('maintenance_message_en', 'Site temporarily closed for maintenance')
ON CONFLICT (setting_key) DO NOTHING;