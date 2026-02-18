import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail } from 'lucide-react';
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
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-background pt-16">
      {/* Trust Badge */}
      <div className="mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm text-muted-foreground">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          {isRTL ? 'موثوق من أكبر الشركات' : 'Trusted by Leading Brands'}
        </div>
      </div>

      {/* Main Headline */}
      <div className="text-center max-w-4xl mx-auto px-4 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight">
          {isRTL ? (
            <>
              نصنع حلولاً رقمية
              <br />
              <span
                className={`text-primary inline-block transition-all duration-300 ${
                  isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
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
                className={`text-primary inline-block transition-all duration-300 ${
                  isAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {rotatingWords[currentWordIndex]}
              </span>
            </>
          )}
        </h1>
      </div>

      {/* Subtitle */}
      <p className="mt-6 text-lg md:text-xl text-muted-foreground text-center max-w-2xl mx-auto px-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {isRTL
          ? 'شريكك المتكامل لنمو مشروعك من الفكرة للإطلاق والنجاح'
          : 'Your integrated partner for business growth from idea to launch and success'}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-8 md:gap-12 mt-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground counter-animation" data-target="500">0+</div>
          <div className="text-sm text-muted-foreground mt-1">{isRTL ? 'عميل راضٍ' : 'Happy Clients'}</div>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground counter-animation" data-target="1000">0+</div>
          <div className="text-sm text-muted-foreground mt-1">{isRTL ? 'مشروع مكتمل' : 'Projects Done'}</div>
        </div>
        <div className="w-px h-12 bg-border" />
        <div className="text-center">
          <div className="text-2xl md:text-3xl font-bold text-foreground counter-animation" data-target="5">0+</div>
          <div className="text-sm text-muted-foreground mt-1">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <Link
          to={consultationButton.url}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors duration-200 text-sm font-medium"
        >
          <Mail className="h-4 w-4" />
          {isRTL ? consultationButton.text_ar : consultationButton.text_en}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
