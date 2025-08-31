-- إضافة إعدادات SEO للصفحات
CREATE TABLE public.page_seo (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_slug TEXT NOT NULL UNIQUE,
    title_ar TEXT,
    title_en TEXT,
    description_ar TEXT,
    description_en TEXT,
    keywords_ar TEXT[],
    keywords_en TEXT[],
    og_image_url TEXT,
    canonical_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة SEO للمدونات
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS keywords_ar TEXT[];
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS keywords_en TEXT[];
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS meta_description_ar TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS meta_description_en TEXT;
ALTER TABLE public.blogs ADD COLUMN IF NOT EXISTS canonical_url TEXT;

-- إضافة جدول تتبع الزيارات
CREATE TABLE public.page_views (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- إضافة جدول إحصائيات يومية
CREATE TABLE public.daily_stats (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL UNIQUE,
    total_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    bounce_rate DECIMAL(5,2) DEFAULT 0,
    avg_session_duration INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تحديث إعدادات الموقع لتتضمن المزيد من الخيارات
INSERT INTO public.site_settings (setting_key, setting_value) VALUES 
('consultation_button_text_ar', 'احصل على استشارة مجانية'),
('consultation_button_text_en', 'Get Free Consultation'),
('consultation_button_url', '/contact'),
('site_title_ar', 'Trendify - وكالة التسويق الرقمي'),
('site_title_en', 'Trendify - Digital Marketing Agency'),
('meta_description_ar', 'وكالة تسويق رقمي متخصصة في تطوير المواقع والتصميم والتسويق الإلكتروني'),
('meta_description_en', 'Digital marketing agency specialized in web development, design, and digital marketing'),
('contact_email', 'hello@trendify.agency'),
('contact_phone', '+966 50 123 4567'),
('contact_address_ar', 'الرياض، المملكة العربية السعودية'),
('contact_address_en', 'Riyadh, Saudi Arabia')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- إضافة بيانات SEO للصفحات الرئيسية
INSERT INTO public.page_seo (page_slug, title_ar, title_en, description_ar, description_en, keywords_ar, keywords_en) VALUES 
('home', 'Trendify - وكالة التسويق الرقمي الرائدة', 'Trendify - Leading Digital Marketing Agency', 'وكالة تسويق رقمي متخصصة في تطوير المواقع والتصميم والتسويق الإلكتروني', 'Digital marketing agency specialized in web development, design, and digital marketing', ARRAY['تسويق رقمي', 'تطوير المواقع', 'تصميم', 'السعودية'], ARRAY['digital marketing', 'web development', 'design', 'saudi arabia']),
('about', 'من نحن - Trendify', 'About Us - Trendify', 'تعرف على فريق Trendify وخبراتنا في مجال التسويق الرقمي', 'Learn about Trendify team and our expertise in digital marketing', ARRAY['من نحن', 'فريق العمل', 'خبرة'], ARRAY['about us', 'team', 'experience']),
('services', 'خدماتنا - Trendify', 'Our Services - Trendify', 'خدمات التسويق الرقمي وتطوير المواقع والتصميم', 'Digital marketing services, web development and design', ARRAY['خدمات', 'تسويق', 'تطوير', 'تصميم'], ARRAY['services', 'marketing', 'development', 'design']),
('portfolio', 'معرض أعمالنا - Trendify', 'Our Portfolio - Trendify', 'اطلع على أحدث مشاريعنا وأعمالنا المميزة', 'Check out our latest projects and featured work', ARRAY['معرض أعمال', 'مشاريع', 'أعمال'], ARRAY['portfolio', 'projects', 'work']),
('blog', 'المدونة - Trendify', 'Blog - Trendify', 'أحدث المقالات والنصائح في عالم التسويق الرقمي', 'Latest articles and tips in digital marketing world', ARRAY['مدونة', 'مقالات', 'نصائح'], ARRAY['blog', 'articles', 'tips']),
('contact', 'تواصل معنا - Trendify', 'Contact Us - Trendify', 'تواصل مع فريق Trendify للحصول على استشارة مجانية', 'Contact Trendify team for a free consultation', ARRAY['تواصل', 'استشارة', 'اتصال'], ARRAY['contact', 'consultation', 'get in touch']);

-- إنشاء سياسات الأمان لـ RLS
ALTER TABLE public.page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_stats ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان للـ SEO
CREATE POLICY "Public can view page SEO" ON public.page_seo FOR SELECT USING (true);
CREATE POLICY "Admin can manage page SEO" ON public.page_seo FOR ALL USING (true);

-- سياسات الأمان للإحصائيات
CREATE POLICY "Public can insert page views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin can view page views" ON public.page_views FOR SELECT USING (true);

CREATE POLICY "Admin can manage daily stats" ON public.daily_stats FOR ALL USING (true);
CREATE POLICY "Public can view daily stats" ON public.daily_stats FOR SELECT USING (true);

-- إضافة trigger للتحديث التلقائي
CREATE TRIGGER update_page_seo_updated_at
    BEFORE UPDATE ON public.page_seo
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_stats_updated_at
    BEFORE UPDATE ON public.daily_stats
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();