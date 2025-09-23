import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface WebsiteDesign {
  id: string;
  page_slug: string;
  layout_json: string;
  custom_css: string;
  custom_js: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DragItem {
  id: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section';
  content: string;
  styles: Record<string, string>;
}

interface LayoutData {
  items: DragItem[];
  css: string;
  js: string;
}

export const useWebsiteDesign = (pageSlug: string) => {
  const [design, setDesign] = useState<WebsiteDesign | null>(null);
  const [layoutData, setLayoutData] = useState<LayoutData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDesign();
  }, [pageSlug]);

  const loadDesign = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('website_design')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_active', true)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          // No design found for this page
          setDesign(null);
          setLayoutData(null);
        } else {
          throw supabaseError;
        }
      } else {
        setDesign(data);
        try {
          const parsedLayout = JSON.parse(data.layout_json);
          setLayoutData(parsedLayout);
        } catch (parseError) {
          console.error('Error parsing layout JSON:', parseError);
          setLayoutData(null);
        }
      }
    } catch (error) {
      console.error('Error loading website design:', error);
      setError('فشل في تحميل تصميم الصفحة');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    design,
    layoutData,
    isLoading,
    error,
    refetch: loadDesign
  };
};