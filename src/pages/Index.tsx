import React, { lazy, Suspense } from "react";
import HeroSection from "@/components/sections/HeroSection";
import SeoHead from "@/components/SeoHead";
import Analytics from "@/components/Analytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import { WebsiteDesignRenderer } from "@/components/WebsiteDesignRenderer";

const Index = () => {
  usePageTracking();

  return (
    <WebsiteDesignRenderer pageSlug="home">
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <main>
          <HeroSection />
        </main>
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Index;
