import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type Blog = Tables<'blogs'>;

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    console.log('Fetching blogs - START');
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      console.log('Blogs fetch result:', { data, error: fetchError });

      if (fetchError) {
        console.error('Error fetching blogs:', fetchError);
        throw fetchError;
      }
      
      setBlogs(data || []);
      console.log('Blogs loaded successfully:', data?.length || 0);
    } catch (err) {
      console.error('Fetch blogs error:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المقالات');
      setBlogs([]);
    } finally {
      setLoading(false);
      console.log('Fetching blogs - END');
    }
  };

  useEffect(() => {
    console.log('useBlogs hook mounted');
    fetchBlogs();
  }, []);

  return { blogs, loading, error, refetch: fetchBlogs };
};