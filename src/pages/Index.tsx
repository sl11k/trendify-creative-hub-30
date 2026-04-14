import React, { lazy, Suspense } from "react";
import Header from "@/components/layout/Header";
import HeroSection from "@/components/sections/HeroSection";
import SeoHead from "@/components/SeoHead";
import Analytics from "@/components/Analytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import { WebsiteDesignRenderer } from "@/components/WebsiteDesignRenderer";
import Footer from "@/components/layout/Footer";

// Lazy load below-the-fold sections
const AboutPreviewSection = lazy(() => import("@/components/sections/AboutPreviewSection"));
const ServicesPreviewSection = lazy(() => import("@/components/sections/ServicesPreviewSection"));
const PortfolioPreviewSection = lazy(() => import("@/components/sections/PortfolioPreviewSection"));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const ToolsPreviewSection = lazy(() => import("@/components/sections/ToolsPreviewSection"));
const BlogPreviewSection = lazy(() => import("@/components/sections/BlogPreviewSection"));
const ContactSection = lazy(() => import("@/components/sections/ContactSection"));

const SectionLoader = () => (
  <div className="py-16 flex items-center justify-center">
    <div className="animate-pulse text-primary text-lg">جاري التحميل...</div>
  </div>
);

const Index = () => {
  usePageTracking();

  return (
    <WebsiteDesignRenderer pageSlug="home">
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main>
          <HeroSection />
          <Suspense fallback={<SectionLoader />}>
            <PortfolioPreviewSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <PartnersSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <ToolsPreviewSection />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <BlogPreviewSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Index;
