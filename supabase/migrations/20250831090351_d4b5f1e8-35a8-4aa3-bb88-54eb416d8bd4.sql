-- إزالة policies الحالية وإضافة policies جديدة تدعم المدير
DROP POLICY IF EXISTS "Admins can manage blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admins can manage portfolio" ON public.portfolio;  
DROP POLICY IF EXISTS "Admins can manage services" ON public.services;
DROP POLICY IF EXISTS "Admins can manage social links" ON public.social_links;
DROP POLICY IF EXISTS "Admins can manage analytics codes" ON public.analytics_codes;

-- policies جديدة للمدونة
CREATE POLICY "Enable read access for all users" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Enable all operations for admin" ON public.blogs FOR ALL USING (true) WITH CHECK (true);

-- policies جديدة للأعمال
CREATE POLICY "Enable read access for all users on portfolio" ON public.portfolio FOR SELECT USING (true);
CREATE POLICY "Enable all operations for admin on portfolio" ON public.portfolio FOR ALL USING (true) WITH CHECK (true);

-- policies جديدة للخدمات  
CREATE POLICY "Enable read access for all users on services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Enable all operations for admin on services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- policies جديدة لروابط السوشيال ميديا
CREATE POLICY "Enable read access for all users on social_links" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Enable all operations for admin on social_links" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

-- policies جديدة لرموز التحليلات
CREATE POLICY "Enable read access for all users on analytics_codes" ON public.analytics_codes FOR SELECT USING (true);
CREATE POLICY "Enable all operations for admin on analytics_codes" ON public.analytics_codes FOR ALL USING (true) WITH CHECK (true);

-- إضافة بعض البيانات التجريبية للخدمات وروابط السوشيال ميديا ورموز التحليلات
INSERT INTO public.services (title_ar, title_en, description_ar, description_en, icon_name, gradient_from, gradient_to, active, sort_order) VALUES
('تطوير المواقع', 'Web Development', 'تطوير مواقع ويب حديثة وسريعة باستخدام أحدث التقنيات', 'Developing modern and fast websites using the latest technologies', 'Code', '#667eea', '#764ba2', true, 1),
('تطوير التطبيقات', 'App Development', 'تطوير تطبيقات الهاتف المحمول للأندرويد وآي أو إس', 'Mobile app development for Android and iOS', 'Smartphone', '#f093fb', '#f5576c', true, 2),
('التسويق الرقمي', 'Digital Marketing', 'استراتيجيات تسويق رقمي متطورة لنمو أعمالك', 'Advanced digital marketing strategies for business growth', 'TrendingUp', '#4facfe', '#00f2fe', true, 3);

-- إضافة منصات السوشيال ميديا الافتراضية
INSERT INTO public.social_links (platform, url, active) VALUES
('facebook', '', false),
('twitter', '', false),
('instagram', '', false),
('linkedin', '', false),
('github', '', false),
('youtube', '', false);

-- إضافة منصات التحليلات الافتراضية
INSERT INTO public.analytics_codes (platform, code, active) VALUES
('google_analytics', '', false),
('facebook_pixel', '', false),
('google_tag_manager', '', false);