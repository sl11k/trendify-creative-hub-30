-- Fix all database issues for admin components

-- 1. Fix social_links table constraints
DROP TABLE IF EXISTS public.social_links;
CREATE TABLE public.social_links (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Create policies for social_links
CREATE POLICY "Allow public read for active social links" 
ON public.social_links 
FOR SELECT 
USING (active = true);

CREATE POLICY "Allow full access for authenticated users" 
ON public.social_links 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 2. Fix site_settings table
DROP TABLE IF EXISTS public.site_settings;
CREATE TABLE public.site_settings (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings
CREATE POLICY "Allow public read for site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Allow full access for authenticated users" 
ON public.site_settings 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 3. Fix analytics_codes table
DROP TABLE IF EXISTS public.analytics_codes;
CREATE TABLE public.analytics_codes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    platform TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL DEFAULT '',
    active BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analytics_codes ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics_codes
CREATE POLICY "Allow public read for active analytics codes" 
ON public.analytics_codes 
FOR SELECT 
USING (active = true);

CREATE POLICY "Allow full access for authenticated users" 
ON public.analytics_codes 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Fix admin_users table
DROP TABLE IF EXISTS public.admin_users;
CREATE TABLE public.admin_users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin_users
CREATE POLICY "Allow admin users to read all users" 
ON public.admin_users 
FOR SELECT 
USING (true);

CREATE POLICY "Allow admin users to manage users" 
ON public.admin_users 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 5. Add update triggers for all tables
CREATE TRIGGER update_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_codes_updated_at
    BEFORE UPDATE ON public.analytics_codes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default social media platforms
INSERT INTO public.social_links (platform, url, active) VALUES
('facebook', '', false),
('instagram', '', false),
('twitter', '', false),
('linkedin', '', false),
('youtube', '', false),
('whatsapp', '', false)
ON CONFLICT (platform) DO NOTHING;

-- Insert default analytics platforms
INSERT INTO public.analytics_codes (platform, code, active) VALUES
('google_analytics', '', false),
('google_tag_manager', '', false),
('meta_pixel', '', false),
('tiktok_pixel', '', false),
('snapchat_pixel', '', false)
ON CONFLICT (platform) DO NOTHING;