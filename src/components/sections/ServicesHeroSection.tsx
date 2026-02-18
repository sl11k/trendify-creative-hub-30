import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ServicesHeroSection = () => {
  const { isRTL } = useLanguage();

  return (
    <section className="py-24 md:py-32 bg-background pt-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {isRTL ? 'نمكّن الأعمال الذكية نحو التحول الرقمي' : 'Empowering Smart & Digitally Transformed Businesses'}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight mb-6">
            {isRTL ? (
              <>
                حلول الأعمال بالذكاء الاصطناعي{' '}
                <span className="text-primary">والتحول الرقمي</span>
              </>
            ) : (
              <>
                AI-Powered Business Solutions{' '}
                <span className="text-primary">& Digital Transformation</span>
              </>
            )}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {isRTL 
              ? 'ترينديفاي ليست وكالة رقمية تقليدية — بل منظومة نمو ذكية متكاملة'
              : "Trendify isn't a typical digital agency — it's an intelligent growth ecosystem"}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors text-sm font-medium"
            >
              {isRTL ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}
              <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
            >
              {isRTL ? 'شاهد أعمالنا' : 'View Our Work'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHeroSection;
