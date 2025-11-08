-- Add auto_blog_enabled setting to site_settings if not exists
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES ('auto_blog_enabled', 'false')
ON CONFLICT (setting_key) DO NOTHING;