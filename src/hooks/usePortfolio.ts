import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Portfolio {
  id: string;
  title_ar: string;
  title_en: string;
  description_ar?: string;
  description_en?: string;
  image_url?: string;
  project_url?: string;
  category?: string;
  technologies?: string[];
  published: boolean;
  project_type?: string;
  github_url?: string;
  logo_url?: string;
  files?: any;
  created_at: string;
  updated_at: string;
}

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('portfolio')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching portfolio:', error);
        throw error;
      }
      
      console.log('Portfolio data from DB:', data);
      setPortfolio((data as any) || []);
    } catch (err) {
      console.error('Fetch portfolio error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المشاريع');
      setPortfolio([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return { portfolio, loading, error, refetch: fetchPortfolio };
};