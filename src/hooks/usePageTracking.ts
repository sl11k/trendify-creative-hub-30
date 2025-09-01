import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface PageView {
  page_path: string;
  referrer?: string;
  user_agent?: string;
  visitor_ip?: string;
  device_type?: string;
  browser?: string;
  country?: string;
  city?: string;
}

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Get device info
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?=.*\bMobile\b)/i.test(userAgent);
        
        let deviceType = 'desktop';
        if (isMobile && !isTablet) deviceType = 'mobile';
        if (isTablet) deviceType = 'tablet';

        // Get browser info
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        // Try to get location data (simplified - in production you'd use a proper IP geolocation service)
        let country, city;
        try {
          const response = await fetch('https://ipapi.co/json/');
          const data = await response.json();
          country = data.country_name;
          city = data.city;
        } catch (error) {
          console.log('Could not get location data:', error);
        }

        const pageView: PageView = {
          page_path: location.pathname,
          referrer: document.referrer || undefined,
          user_agent: userAgent,
          device_type: deviceType,
          browser: browser,
          country: country,
          city: city
        };

        // Insert page view
        await supabase.from('page_views').insert([pageView]);

        // Update daily stats
        const today = new Date().toISOString().split('T')[0];
        
        // Check if we have stats for today
        const { data: existingStats } = await supabase
          .from('daily_stats')
          .select('*')
          .eq('date', today)
          .single();

        if (existingStats) {
          // Update existing stats
          await supabase
            .from('daily_stats')
            .update({
              total_views: existingStats.total_views + 1,
              updated_at: new Date().toISOString()
            })
            .eq('date', today);
        } else {
          // Create new daily stats
          await supabase
            .from('daily_stats')
            .insert([{
              date: today,
              total_views: 1,
              unique_visitors: 1,
              bounce_rate: 0,
              avg_session_duration: 0
            }]);
        }

      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    // Track page view after a small delay to ensure everything is loaded
    const timer = setTimeout(trackPageView, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);
};