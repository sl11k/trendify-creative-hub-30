import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useBlogAnalytics = (blogId: string) => {
  useEffect(() => {
    if (!blogId) return;

    let sessionStart = Date.now();
    let maxScroll = 0;
    let visitorId = localStorage.getItem("visitor_id");

    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("visitor_id", visitorId);
    }

    // Track page view
    const trackPageView = async () => {
      // Check if analytics record exists
      const { data: existing } = await supabase
        .from("blog_analytics")
        .select("*")
        .eq("blog_id", blogId)
        .single();

      if (existing) {
        // Update existing record
        await supabase
          .from("blog_analytics")
          .update({
            views: existing.views + 1,
            unique_visitors: existing.unique_visitors + 1,
          })
          .eq("blog_id", blogId);
      } else {
        // Create new record
        await supabase
          .from("blog_analytics")
          .insert({
            blog_id: blogId,
            views: 1,
            unique_visitors: 1,
          });
      }

      // Track engagement event
      await supabase
        .from("blog_engagement")
        .insert({
          blog_id: blogId,
          visitor_id: visitorId,
          event_type: "page_view",
          event_data: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
          },
        });
    };

    // Track scroll depth
    const trackScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercent = ((scrollTop + windowHeight) / documentHeight) * 100;
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }
    };

    // Track time on page and scroll depth on exit
    const trackExit = async () => {
      const timeOnPage = Math.round((Date.now() - sessionStart) / 1000);

      await supabase
        .from("blog_engagement")
        .insert({
          blog_id: blogId,
          visitor_id: visitorId,
          event_type: "exit",
          event_data: {
            time_on_page: timeOnPage,
            scroll_depth: Math.round(maxScroll),
            timestamp: new Date().toISOString(),
          },
        });

      // Update analytics
      const { data: existing } = await supabase
        .from("blog_analytics")
        .select("*")
        .eq("blog_id", blogId)
        .single();

      if (existing) {
        const totalSessions = existing.views;
        const newAvgTime = Math.round(
          (existing.avg_time_on_page * (totalSessions - 1) + timeOnPage) / totalSessions
        );
        const newAvgScroll = 
          (existing.scroll_depth * (totalSessions - 1) + maxScroll) / totalSessions;

        await supabase
          .from("blog_analytics")
          .update({
            avg_time_on_page: newAvgTime,
            scroll_depth: newAvgScroll,
          })
          .eq("blog_id", blogId);
      }
    };

    trackPageView();
    window.addEventListener("scroll", trackScroll);
    window.addEventListener("beforeunload", trackExit);

    return () => {
      window.removeEventListener("scroll", trackScroll);
      window.removeEventListener("beforeunload", trackExit);
      trackExit();
    };
  }, [blogId]);
};

export const trackSocialShare = async (blogId: string, platform: string) => {
  const { data: existing } = await supabase
    .from("blog_analytics")
    .select("social_shares")
    .eq("blog_id", blogId)
    .single();

  if (existing) {
    await supabase
      .from("blog_analytics")
      .update({
        social_shares: existing.social_shares + 1,
      })
      .eq("blog_id", blogId);
  }

  await supabase
    .from("blog_engagement")
    .insert({
      blog_id: blogId,
      visitor_id: localStorage.getItem("visitor_id") || "unknown",
      event_type: "social_share",
      event_data: {
        platform,
        timestamp: new Date().toISOString(),
      },
    });
};