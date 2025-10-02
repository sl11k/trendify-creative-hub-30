import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServicesSection from '@/components/sections/ServicesSection';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { WebsiteDesignRenderer } from '@/components/WebsiteDesignRenderer';

const Services = () => {
  usePageTracking(); // Track page views

  return (
    <WebsiteDesignRenderer pageSlug="services">
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <ServicesSection />
        </main>
        <Footer />
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Services;