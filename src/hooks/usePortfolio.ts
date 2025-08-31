import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Portfolio = Tables<'portfolio'>;

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPortfolio(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return { portfolio, loading, error, refetch: fetchPortfolio };
};