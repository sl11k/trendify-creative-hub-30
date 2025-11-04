import React, { useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SeoHead from "@/components/SeoHead";
import Analytics from "@/components/Analytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import { supabase } from "@/integrations/supabase/client";
import { WebsiteDesignRenderer } from "@/components/WebsiteDesignRenderer";
import commercialRegisterQR from "@/assets/commercial-register-qr.png";

// Lazy load heavy sections
const AboutPreviewSection = lazy(() => import("@/components/sections/AboutPreviewSection"));
const ServicesPreviewSection = lazy(() => import("@/components/sections/ServicesPreviewSection"));
const PortfolioPreviewSection = lazy(() => import("@/components/sections/PortfolioPreviewSection"));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const ToolsPreviewSection = lazy(() => import("@/components/sections/ToolsPreviewSection"));
const BlogPreviewSection = lazy(() => import("@/components/sections/BlogPreviewSection"));

const Index = () => {
  usePageTracking(); // Track page views
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

  const handleConsultationClick = () => {
    if (consultationButton.url.startsWith("http")) {
      window.open(consultationButton.url, "_blank");
    } else {
      window.location.href = consultationButton.url;
    }
  };

  return (
    <WebsiteDesignRenderer pageSlug="home">
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
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
          
          {/* Commercial Register QR Code Section */}
          <div className="py-12 bg-background text-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-2xl font-bold text-foreground mb-6">السجل التجاري</h3>
              <div className="flex justify-center">
                <img 
                  src={commercialRegisterQR} 
                  alt="رمز QR للسجل التجاري" 
                  className="w-64 h-64 object-contain"
                />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Index;
