import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Tool {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  url: string;
  icon_name?: string;
  category_ar?: string;
  category_en?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const useTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTools = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('tools')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setTools(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الأدوات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTools();
  }, []);

  return { tools, loading, error, refetch: fetchTools };
};
