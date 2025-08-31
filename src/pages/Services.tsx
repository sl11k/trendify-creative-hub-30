import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ServicesSection from '@/components/sections/ServicesSection';

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <ServicesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Services;