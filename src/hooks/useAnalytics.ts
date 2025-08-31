import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAnalytics = () => {
  useEffect(() => {
    const trackPageView = async () => {
      try {
        // Get visitor information
        const visitorInfo = {
          page_path: window.location.pathname,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent || null,
          visitor_ip: null // Will be set by server
        };

        // Insert page view
        await supabase
          .from('page_views')
          .insert(visitorInfo);

        // Update daily stats
        const today = new Date().toISOString().split('T')[0];
        
        // Get current stats for today
        const { data: todayStats } = await supabase
          .from('daily_stats')
          .select('*')
          .eq('date', today)
          .single();

        if (todayStats) {
          // Update existing stats
          await supabase
            .from('daily_stats')
            .update({
              total_views: todayStats.total_views + 1
            })
            .eq('date', today);
        } else {
          // Create new stats for today
          await supabase
            .from('daily_stats')
            .insert({
              date: today,
              total_views: 1,
              unique_visitors: 1
            });
        }
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, []);
};

export const usePageSEO = (pageSlug: string) => {
  useEffect(() => {
    const loadSEO = async () => {
      try {
        const { data: seoData } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_slug', pageSlug)
          .single();

        if (seoData) {
          // Update document title
          const isRTL = document.documentElement.dir === 'rtl';
          document.title = isRTL ? seoData.title_ar : seoData.title_en;

          // Update meta description
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', isRTL ? seoData.description_ar : seoData.description_en);
          }

          // Update keywords
          const keywords = isRTL ? seoData.keywords_ar : seoData.keywords_en;
          if (keywords && keywords.length > 0) {
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
              metaKeywords = document.createElement('meta');
              metaKeywords.setAttribute('name', 'keywords');
              document.head.appendChild(metaKeywords);
            }
            metaKeywords.setAttribute('content', keywords.join(', '));
          }

          // Update canonical URL
          if (seoData.canonical_url) {
            let canonical = document.querySelector('link[rel="canonical"]');
            if (!canonical) {
              canonical = document.createElement('link');
              canonical.setAttribute('rel', 'canonical');
              document.head.appendChild(canonical);
            }
            canonical.setAttribute('href', seoData.canonical_url);
          }
        }
      } catch (error) {
        console.error('SEO loading error:', error);
      }
    };

    loadSEO();
  }, [pageSlug]);
};