import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{ page: string; views: number }>;
  recentViews: Array<{
    page_path: string;
    visitor_ip: string;
    country: string;
    city: string;
    device_type: string;
    browser: string;
    created_at: string;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    visitors: number;
  }>;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    recentViews: [],
    dailyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get total page views
      const { count: totalViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      // Get unique visitors (distinct IPs)
      const { data: uniqueData } = await supabase
        .from('page_views')
        .select('visitor_ip');
      
      const uniqueVisitors = new Set(uniqueData?.map(v => v.visitor_ip)).size;

      // Get recent views
      const { data: recentViews } = await supabase
        .from('page_views')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      // Get top pages
      const { data: pageViewsData } = await supabase
        .from('page_views')
        .select('page_path');

      const pageCounts = pageViewsData?.reduce((acc, view) => {
        acc[view.page_path] = (acc[view.page_path] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topPages = Object.entries(pageCounts)
        .map(([page, views]) => ({ page, views }))
        .sort((a, b) => b.views - a.views)
        .slice(0, 10);

      // Get daily stats
      const { data: dailyStatsData } = await supabase
        .from('daily_stats')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      setAnalytics({
        totalViews: totalViews || 0,
        uniqueVisitors,
        bounceRate: 0, // Calculate based on your needs
        avgSessionDuration: 0, // Calculate based on your needs
        topPages,
        recentViews: recentViews || [],
        dailyStats: dailyStatsData?.map(stat => ({
          date: stat.date,
          views: stat.total_views,
          visitors: stat.unique_visitors
        })) || []
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل التحليلات');
    } finally {
      setLoading(false);
    }
  };

  const trackPageView = async (pageData: {
    page_path: string;
    visitor_ip?: string;
    user_agent?: string;
    referrer?: string;
    country?: string;
    city?: string;
    device_type?: string;
    browser?: string;
  }) => {
    try {
      await supabase.from('page_views').insert([pageData]);
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return { analytics, loading, error, refetch: fetchAnalytics, trackPageView };
};