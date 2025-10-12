import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Service = Tables<'services'>;

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        throw error;
      }
      
      setServices(data || []);
    } catch (err) {
      console.error('Fetch services error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل الخدمات');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, error, refetch: fetchServices };
};