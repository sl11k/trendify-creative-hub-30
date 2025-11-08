import React, { useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServicesSection from '@/components/sections/ServicesSection';
import ServicesHeroSection from '@/components/sections/ServicesHeroSection';
import ServicesContentSection from '@/components/sections/ServicesContentSection';
import { AdvancedSeoHead } from '@/components/AdvancedSeoHead';
import { StructuredData } from '@/components/StructuredData';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { WebsiteDesignRenderer } from '@/components/WebsiteDesignRenderer';
import { useUpdateSeo } from '@/hooks/useUpdateSeo';

const Services = () => {
  usePageTracking();
  const { updateServicesPageSeo } = useUpdateSeo();

  useEffect(() => {
    updateServicesPageSeo();
  }, []);

  return (
    <WebsiteDesignRenderer pageSlug="services">
      <div className="min-h-screen bg-background">
        <AdvancedSeoHead lang="ar" />
        <StructuredData type="organization" />
        <StructuredData type="website" />
        <StructuredData type="service" />
        <StructuredData type="faq" />
        <StructuredData 
          type="breadcrumb" 
          data={{
            items: [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://trendify.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://trendify.com/services"
              }
            ]
          }}
        />
        <Analytics />
        <Header />
        <main>
          <ServicesHeroSection />
          <ServicesContentSection />
          <ServicesSection />
        </main>
        <Footer />
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Services;