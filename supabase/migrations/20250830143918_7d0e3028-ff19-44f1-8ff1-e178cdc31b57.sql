-- Create admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for admin users
CREATE POLICY "Admin users can view themselves" ON public.admin_users
FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update themselves" ON public.admin_users  
FOR UPDATE USING (auth.uid()::text = id::text);

-- Create blogs table
CREATE TABLE public.blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  content_ar TEXT NOT NULL,
  content_en TEXT NOT NULL,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Public can view published blogs" ON public.blogs
FOR SELECT USING (published = true);

-- Admin can manage all blogs
CREATE POLICY "Admins can manage blogs" ON public.blogs
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'm7md4r3al@gmail.com'));

-- Create portfolio table
CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  image_url TEXT,
  project_url TEXT,
  category TEXT,
  technologies TEXT[],
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;

-- Public can read published portfolio items
CREATE POLICY "Public can view published portfolio" ON public.portfolio
FOR SELECT USING (published = true);

-- Admin can manage all portfolio
CREATE POLICY "Admins can manage portfolio" ON public.portfolio
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'm7md4r3al@gmail.com'));

-- Create analytics codes table
CREATE TABLE public.analytics_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  code TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.analytics_codes ENABLE ROW LEVEL SECURITY;

-- Public can read active analytics codes
CREATE POLICY "Public can view active analytics codes" ON public.analytics_codes
FOR SELECT USING (active = true);

-- Admin can manage all analytics codes
CREATE POLICY "Admins can manage analytics codes" ON public.analytics_codes
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'm7md4r3al@gmail.com'));

-- Create social links table
CREATE TABLE public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  url TEXT,
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Public can read active social links
CREATE POLICY "Public can view active social links" ON public.social_links
FOR SELECT USING (active = true AND url IS NOT NULL AND url != '');

-- Admin can manage all social links
CREATE POLICY "Admins can manage social links" ON public.social_links
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'm7md4r3al@gmail.com'));

-- Create services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  icon_name TEXT,
  gradient_from TEXT,
  gradient_to TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Public can read active services
CREATE POLICY "Public can view active services" ON public.services
FOR SELECT USING (active = true);

-- Admin can manage all services
CREATE POLICY "Admins can manage services" ON public.services
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'm7md4r3al@gmail.com'));

-- Create site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public can read site settings
CREATE POLICY "Public can view site settings" ON public.site_settings
FOR SELECT USING (true);

-- Admin can manage all site settings
CREATE POLICY "Admins can manage site settings" ON public.site_settings
FOR ALL USING (EXISTS (SELECT 1 FROM public.admin_users WHERE email = 'm7md4r3al@gmail.com'));

-- Insert default admin user
INSERT INTO public.admin_users (email, password_hash, role) 
VALUES ('m7md4r3al@gmail.com', crypt('Nsm123123_', gen_salt('bf')), 'super_admin');

-- Insert default social platforms
INSERT INTO public.social_links (platform, active) VALUES
('facebook', false),
('instagram', false),
('linkedin', false),
('tiktok', false),
('whatsapp', false),
('twitter', false),
('youtube', false);

-- Insert default analytics platforms
INSERT INTO public.analytics_codes (platform, code, active) VALUES
('google_analytics', '', false),
('google_tag_manager', '', false),
('meta_pixel', '', false),
('tiktok_pixel', '', false),
('snapchat_pixel', '', false);

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('cta_button_url', '/contact'),
('cta_button_text_ar', 'احصل على استشارة مجانية'),
('cta_button_text_en', 'Get Free Consultation');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blogs_updated_at BEFORE UPDATE ON public.blogs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_portfolio_updated_at BEFORE UPDATE ON public.portfolio
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analytics_codes_updated_at BEFORE UPDATE ON public.analytics_codes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON public.social_links
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();