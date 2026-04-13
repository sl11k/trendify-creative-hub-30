import React, { useEffect, useState, useRef, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SeoHead from "@/components/SeoHead";
import Analytics from "@/components/Analytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteDesignRenderer } from "@/components/WebsiteDesignRenderer";

const AboutPreviewSection = lazy(() => import("@/components/sections/AboutPreviewSection"));
const ServicesPreviewSection = lazy(() => import("@/components/sections/ServicesPreviewSection"));
const PortfolioPreviewSection = lazy(() => import("@/components/sections/PortfolioPreviewSection"));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const ToolsPreviewSection = lazy(() => import("@/components/sections/ToolsPreviewSection"));
const BlogPreviewSection = lazy(() => import("@/components/sections/BlogPreviewSection"));

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4";

const Index = () => {
  usePageTracking();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [consultationButton, setConsultationButton] = useState({
    text_ar: "احصل على استشارة",
    text_en: "Get Free Consultation",
    url: "https://api.whatsapp.com/send/?phone=966596607086",
  });

  useEffect(() => {
    const loadConsultationSettings = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("*")
          .in("setting_key", ["consultation_button_text_ar", "consultation_button_text_en", "consultation_button_url"]);

        if (data) {
          const settings = data.reduce(
            (acc, item) => {
              acc[item.setting_key] = item.setting_value;
              return acc;
            },
            {} as Record<string, string>,
          );

          setConsultationButton({
            text_ar: settings.consultation_button_text_ar || "احصل على استشارة مجانية",
            text_en: settings.consultation_button_text_en || "Get Free Consultation",
            url: settings.consultation_button_url || "/contact",
          });
        }
      } catch (error) {
        console.error("Error loading consultation settings:", error);
      }
    };

    loadConsultationSettings();
  }, []);

  // Video fade loop logic
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const FADE_DURATION = 0.5;

    const handlePlay = () => {
      video.style.opacity = '0';
      const startTime = performance.now();
      const fadeIn = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        const progress = Math.min(elapsed / FADE_DURATION, 1);
        video.style.opacity = String(progress);
        if (progress < 1) {
          rafId = requestAnimationFrame(fadeIn);
        }
      };
      rafId = requestAnimationFrame(fadeIn);
    };

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const timeLeft = video.duration - video.currentTime;
      if (timeLeft <= FADE_DURATION && timeLeft > 0) {
        video.style.opacity = String(timeLeft / FADE_DURATION);
      }
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    video.play().catch(() => {});

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleConsultationClick = () => {
    if (consultationButton.url.startsWith("http")) {
      window.open(consultationButton.url, "_blank");
    } else {
      window.location.href = consultationButton.url;
    }
  };

  return (
    <WebsiteDesignRenderer pageSlug="home">
      <div className="min-h-screen bg-background overflow-hidden relative">
        {/* Background Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0 }}
          muted
          playsInline
          preload="auto"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>

        <SeoHead lang="ar" />
        <Analytics />

        <div className="relative z-10">
          <Header />
          <main>
            <HeroSection />
            <Suspense fallback={<div className="h-screen" />}>
              <AboutPreviewSection />
              <ServicesPreviewSection />
              <PortfolioPreviewSection />
              <PartnersSection />
              <ToolsPreviewSection />
              <BlogPreviewSection />
            </Suspense>
            <div className="py-20 bg-muted/30 text-center">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">تواصل معنا</h2>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                  نحن هنا لمساعدتك في تحقيق أهدافك الرقمية
                </p>
                <Button
                  size="xl"
                  onClick={handleConsultationClick}
                  className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 transform hover:scale-105 shadow-glow font-semibold px-8 py-4"
                >
                  {consultationButton.text_ar}
                </Button>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Index;
