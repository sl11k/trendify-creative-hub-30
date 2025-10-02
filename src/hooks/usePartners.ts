import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Partner {
  id: string;
  name_ar: string;
  name_en: string;
  logo_url: string;
  website_url?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const usePartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('partners')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setPartners(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الشركاء');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return { partners, loading, error, refetch: fetchPartners };
};
