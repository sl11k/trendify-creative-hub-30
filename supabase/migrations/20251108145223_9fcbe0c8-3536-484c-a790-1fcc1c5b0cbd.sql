-- Create table for blog analytics
CREATE TABLE IF NOT EXISTS public.blog_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  avg_time_on_page INTEGER NOT NULL DEFAULT 0,
  bounce_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  scroll_depth NUMERIC(5,2) NOT NULL DEFAULT 0,
  social_shares INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for backlinks tracking
CREATE TABLE IF NOT EXISTS public.blog_backlinks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_domain TEXT NOT NULL,
  anchor_text TEXT,
  discovered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_checked TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  domain_authority INTEGER,
  link_type TEXT DEFAULT 'dofollow',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for blog engagement events
CREATE TABLE IF NOT EXISTS public.blog_engagement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES public.blogs(id) ON DELETE CASCADE,
  visitor_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_backlinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_engagement ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_analytics
CREATE POLICY "Public can view blog analytics"
  ON public.blog_analytics FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage blog analytics"
  ON public.blog_analytics FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for blog_backlinks
CREATE POLICY "Public can view active backlinks"
  ON public.blog_backlinks FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admin can manage backlinks"
  ON public.blog_backlinks FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policies for blog_engagement
CREATE POLICY "Anyone can insert engagement events"
  ON public.blog_engagement FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admin can view engagement events"
  ON public.blog_engagement FOR SELECT
  USING (is_admin());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_id ON public.blog_analytics(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_backlinks_blog_id ON public.blog_backlinks(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_backlinks_domain ON public.blog_backlinks(source_domain);
CREATE INDEX IF NOT EXISTS idx_blog_engagement_blog_id ON public.blog_engagement(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_engagement_created_at ON public.blog_engagement(created_at);

-- Create trigger for updated_at
CREATE TRIGGER update_blog_analytics_updated_at
  BEFORE UPDATE ON public.blog_analytics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();