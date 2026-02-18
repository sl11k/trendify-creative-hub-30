import React, { lazy, Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import SeoHead from "@/components/SeoHead";
import Analytics from "@/components/Analytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import { WebsiteDesignRenderer } from "@/components/WebsiteDesignRenderer";

const AboutPreviewSection = lazy(() => import("@/components/sections/AboutPreviewSection"));
const ServicesPreviewSection = lazy(() => import("@/components/sections/ServicesPreviewSection"));
const PortfolioPreviewSection = lazy(() => import("@/components/sections/PortfolioPreviewSection"));
const PartnersSection = lazy(() => import("@/components/sections/PartnersSection"));
const ToolsPreviewSection = lazy(() => import("@/components/sections/ToolsPreviewSection"));
const BlogPreviewSection = lazy(() => import("@/components/sections/BlogPreviewSection"));

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
          <Suspense fallback={<div className="h-40" />}>
            <PartnersSection />
            <AboutPreviewSection />
            <ServicesPreviewSection />
            <PortfolioPreviewSection />
            <ToolsPreviewSection />
            <BlogPreviewSection />
          </Suspense>
        </main>
        <Footer />
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Index;
