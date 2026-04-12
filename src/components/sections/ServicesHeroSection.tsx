import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';

const ServicesHeroSection = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative py-20 md:py-28 bg-gradient-hero overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float-delayed"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white mb-6 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isRTL ? 'نمكّن الأعمال الذكية نحو التحول الرقمي' : 'Empowering Smart & Digitally Transformed Businesses'}
            </span>
          </div>

          {/* Main Heading - H1 for SEO */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in-up">
            {isRTL ? (
              <>
                حلول الأعمال بالذكاء الاصطناعي{' '}
                <span className="text-gradient-accent">والتحول الرقمي</span>
              </>
            ) : (
              <>
                AI-Powered Business Solutions{' '}
                <span className="text-gradient-accent">& Digital Transformation</span>
              </>
            )}
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {isRTL 
              ? 'ترينديفاي ليست وكالة رقمية تقليدية — بل منظومة نمو ذكية متكاملة. نربط التحليلات والتصميم والتسويق والإدارة عبر أدوات مدعومة بالذكاء الاصطناعي لتحويل رقمي بسيط وسريع وقابل للتوسع.'
              : "Trendify isn't a typical digital agency — it's an intelligent growth ecosystem. We connect analytics, design, marketing, and management through AI-driven tools, making digital transformation simple, fast, and scalable."}
          </p>

          {/* Key Benefits Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isRTL ? 'نمو مستدام' : 'Sustainable Growth'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isRTL ? 'أتمتة ذكية' : 'Smart Automation'}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isRTL ? 'قرارات مدفوعة بالبيانات' : 'Data-Driven Decisions'}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                {isRTL ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}
                <ArrowRight className={`w-5 h-5 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} />
              </Button>
            </Link>
            <Link to="/portfolio">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105">
                {isRTL ? 'شاهد أعمالنا' : 'View Our Work'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHeroSection;
