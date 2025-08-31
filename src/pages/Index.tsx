import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutPreviewSection from '@/components/sections/AboutPreviewSection';
import ServicesPreviewSection from '@/components/sections/ServicesPreviewSection';
import PortfolioPreviewSection from '@/components/sections/PortfolioPreviewSection';
import BlogPreviewSection from '@/components/sections/BlogPreviewSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <AboutPreviewSection />
        <ServicesPreviewSection />
        <PortfolioPreviewSection />
        <BlogPreviewSection />
        <div className="py-20 bg-muted/30 text-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
              تواصل معنا
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              نحن هنا لمساعدتك في تحقيق أهدافك الرقمية
            </p>
            <Link to="/contact">
              <Button
                size="xl"
                className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 transform hover:scale-105 shadow-glow font-semibold px-8 py-4"
              >
                تواصل معنا الآن
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
