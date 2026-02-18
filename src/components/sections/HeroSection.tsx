import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { supabase } from '@/integrations/supabase/client';

const rotatingWordsAr = ['مبتكرة', 'احترافية', 'مميزة', 'إبداعية'];
const rotatingWordsEn = ['innovative', 'professional', 'unique', 'creative'];

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [consultationButton, setConsultationButton] = useState({
    text_ar: 'احصل على استشارة مجانية',
    text_en: 'Get Free Consultation',
    url: '/contact'
  });
  
  useCounterAnimation();

  const rotatingWords = isRTL ? rotatingWordsAr : rotatingWordsEn;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
        setIsAnimating(false);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, [rotatingWords.length]);

  useEffect(() => {
    loadConsultationButton();
  }, []);

  const loadConsultationButton = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('*')
        .in('setting_key', ['consultation_button_text_ar', 'consultation_button_text_en', 'consultation_button_url']);
      
      if (data) {
        const settings = data.reduce((acc, item) => {
          acc[item.setting_key] = item.setting_value;
          return acc;
        }, {} as Record<string, string>);

        setConsultationButton({
          text_ar: settings.consultation_button_text_ar || 'احصل على استشارة مجانية',
          text_en: settings.consultation_button_text_en || 'Get Free Consultation',
          url: settings.consultation_button_url || '/contact'
        });
      }
    } catch (error) {
      console.error('Error loading consultation button:', error);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      {/* Decorative Blobs */}
      <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary/15 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px]" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Trust Badge */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-primary/20 bg-primary/5 text-sm font-medium text-primary backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            {isRTL ? 'موثوق من أكبر الشركات' : 'Trusted by Leading Brands'}
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-5xl mx-auto px-4 animate-fade-in-up">
          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-foreground leading-[1.1] tracking-tight">
            {isRTL ? (
              <>
                نصنع حلولاً رقمية
                <br />
                <span
                  className={`inline-block transition-all duration-300 text-gradient-primary ${
                    isAnimating ? 'opacity-0 translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100'
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </>
            ) : (
              <>
                We create digital solutions
                <br />
                that are{' '}
                <span
                  className={`inline-block transition-all duration-300 text-gradient-primary ${
                    isAnimating ? 'opacity-0 translate-y-3 scale-95' : 'opacity-100 translate-y-0 scale-100'
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </>
            )}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="mt-8 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto px-4 animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
          {isRTL
            ? 'شريكك المتكامل لنمو مشروعك من الفكرة للإطلاق والنجاح'
            : 'Your integrated partner for business growth from idea to launch and success'}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-8 md:gap-14 mt-14 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {[
            { target: '500', label: isRTL ? 'عميل راضٍ' : 'Happy Clients' },
            { target: '1000', label: isRTL ? 'مشروع مكتمل' : 'Projects Done' },
            { target: '5', label: isRTL ? 'سنوات خبرة' : 'Years Experience' },
          ].map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="w-px h-14 bg-gradient-to-b from-transparent via-border to-transparent" />}
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold font-heading text-foreground counter-animation" data-target={stat.target}>0+</div>
                <div className="text-sm text-muted-foreground mt-1.5">{stat.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-14 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <Link
            to={consultationButton.url}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300 text-sm font-semibold hover:scale-105"
          >
            {isRTL ? consultationButton.text_ar : consultationButton.text_en}
            <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
