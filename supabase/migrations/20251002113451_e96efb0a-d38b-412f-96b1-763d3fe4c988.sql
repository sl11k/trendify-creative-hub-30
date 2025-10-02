-- جدول الشركاء (partners table already exists)
-- جدول الأدوات (tools table already exists)

-- تحديث جدول portfolio لدعم رفع الملفات
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS project_type TEXT DEFAULT 'website',
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

COMMENT ON COLUMN portfolio.project_type IS 'نوع المشروع: website, branding, content, photography, design';
COMMENT ON COLUMN portfolio.files IS 'مصفوفة JSON للملفات المرفوعة (صور، فيديوهات، PDFs)';
COMMENT ON COLUMN portfolio.github_url IS 'رابط GitHub للمشروع (اختياري)';
COMMENT ON COLUMN portfolio.logo_url IS 'رابط شعار المشروع (اختياري)';