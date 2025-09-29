-- Create partners table for success partners section
CREATE TABLE public.partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website_url TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

-- Create policies for partners
CREATE POLICY "Public can view active partners" 
ON public.partners 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admin can manage partners" 
ON public.partners 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create tools table for tools page
CREATE TABLE public.tools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_ar TEXT NOT NULL,
  description_en TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_name TEXT,
  category_ar TEXT,
  category_en TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

-- Create policies for tools
CREATE POLICY "Public can view active tools" 
ON public.tools 
FOR SELECT 
USING (active = true);

CREATE POLICY "Admin can manage tools" 
ON public.tools 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Add triggers for timestamp updates
CREATE TRIGGER update_partners_updated_at
BEFORE UPDATE ON public.partners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
BEFORE UPDATE ON public.tools
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();