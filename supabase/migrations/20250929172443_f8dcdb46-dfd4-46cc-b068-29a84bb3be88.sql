-- Create storage bucket for portfolio files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio',
  'portfolio',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'video/mp4', 'video/webm']
);

-- Create storage policies for portfolio bucket
CREATE POLICY "Public can view portfolio files"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Admin can upload portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Admin can update portfolio files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

CREATE POLICY "Admin can delete portfolio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');

-- Modify portfolio table to support multiple files and make project_url optional
ALTER TABLE portfolio 
ADD COLUMN IF NOT EXISTS project_type text DEFAULT 'website',
ADD COLUMN IF NOT EXISTS files jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS github_url text;

-- Update existing records to have files array with current image_url
UPDATE portfolio 
SET files = jsonb_build_array(
  jsonb_build_object(
    'type', 'image',
    'url', image_url,
    'name', 'Main Image'
  )
)
WHERE image_url IS NOT NULL AND image_url != '';

COMMENT ON COLUMN portfolio.project_type IS 'Type of project: website, branding, photography, content, graphic_design, etc.';
COMMENT ON COLUMN portfolio.files IS 'Array of uploaded files with type, url, and name';
COMMENT ON COLUMN portfolio.github_url IS 'GitHub repository URL if applicable';