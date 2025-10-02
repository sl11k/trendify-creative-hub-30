-- Create website design table for storing custom layouts
CREATE TABLE public.website_design (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL UNIQUE,
  layout_json TEXT NOT NULL DEFAULT '{}',
  custom_css TEXT DEFAULT '',
  custom_js TEXT DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_design ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active designs" 
ON public.website_design 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admin can manage designs" 
ON public.website_design 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_website_design_updated_at
BEFORE UPDATE ON public.website_design
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();