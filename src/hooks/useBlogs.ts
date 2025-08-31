import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Blog = Tables<'blogs'>;

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المقالات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return { blogs, loading, error, refetch: fetchBlogs };
};