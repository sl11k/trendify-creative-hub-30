-- إضافة TikTok للسوشيال ميديا
INSERT INTO social_links (platform, url, active) 
VALUES ('tiktok', '', false)
ON CONFLICT (platform) DO NOTHING;

-- إنشاء جدول إعدادات زر الواتساب العائم
CREATE TABLE IF NOT EXISTS whatsapp_button (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL DEFAULT '+966501234567',
  active BOOLEAN NOT NULL DEFAULT false,
  position TEXT NOT NULL DEFAULT 'bottom-right',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- تفعيل RLS على الجدول الجديد
ALTER TABLE whatsapp_button ENABLE ROW LEVEL SECURITY;

-- إنشاء السياسات
CREATE POLICY "Public can view active whatsapp button" ON whatsapp_button
FOR SELECT USING (active = true);

CREATE POLICY "Admin can manage whatsapp button" ON whatsapp_button
FOR ALL USING (true) WITH CHECK (true);

-- إدراج القيمة الافتراضية
INSERT INTO whatsapp_button (phone, active, position)
VALUES ('+966501234567', false, 'bottom-right')
ON CONFLICT (id) DO NOTHING;

-- إنشاء trigger للتحديث التلقائي لـ updated_at
CREATE TRIGGER update_whatsapp_button_updated_at
BEFORE UPDATE ON whatsapp_button
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();