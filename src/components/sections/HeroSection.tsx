import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { supabase } from '@/integrations/supabase/client';
import LogoMarquee from '@/components/sections/LogoMarquee';

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  const [consultationButton, setConsultationButton] = useState({
    text_ar: 'احصل على استشارة مجانية',
    text_en: 'Get Free Consultation',
    url: '/contact'
  });

  useCounterAnimation();

  useEffect(() => {
    const staggerElements = document.querySelectorAll('.stagger-animation');
    staggerElements.forEach((element, index) => {
      element.setAttribute('data-delay', (index * 150).toString());
    });
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
    <section id="home" className="relative min-h-screen flex flex-col overflow-visible">
      {/* Blurred overlay shape */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[984px] h-[527px] opacity-90 bg-gray-950 blur-[82px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Hero content - centered */}
      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Title */}
            <h1
              className="font-bold text-foreground mb-6 animate-fade-in-up"
              style={{
                fontFamily: "'General Sans', sans-serif",
                fontSize: 'clamp(3rem, 12vw, 220px)',
                lineHeight: 1.02,
                letterSpacing: '-0.024em',
                fontWeight: 400,
              }}
            >
              {t('hero.title')}
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg leading-8 max-w-md mx-auto mt-[9px] opacity-80 animate-fade-in-up"
              style={{ color: 'hsl(var(--hero-sub))', animationDelay: '0.2s' }}
            >
              {t('hero.subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up mt-[25px] ${isRTL ? 'sm:flex-row-reverse' : ''}`} style={{ animationDelay: '0.4s' }}>
              <Link to={consultationButton.url}>
                <Button
                  variant="heroSecondary"
                  className="px-[29px] py-[24px] text-lg font-semibold"
                >
                  {isRTL ? consultationButton.text_ar : consultationButton.text_en}
                  <ArrowRight className={`ml-2 h-5 w-5 ${isRTL ? 'rotate-180 ml-0 mr-2' : ''}`} />
                </Button>
              </Link>

              <Link to="/services">
                <Button
                  variant="glass"
                  size="lg"
                  className="font-semibold px-8 py-4 text-lg"
                >
                  <Play className={`mr-2 h-5 w-5 ${isRTL ? 'mr-0 ml-2' : ''}`} />
                  {t('hero.cta.secondary')}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center stagger-animation">
                <div className="text-3xl font-bold text-foreground mb-2 counter-animation" data-target="500">0+</div>
                <div style={{ color: 'hsl(var(--hero-sub))' }}>{isRTL ? 'عميل راضٍ' : 'Happy Clients'}</div>
              </div>
              <div className="text-center stagger-animation">
                <div className="text-3xl font-bold text-foreground mb-2 counter-animation" data-target="1000">0+</div>
                <div style={{ color: 'hsl(var(--hero-sub))' }}>{isRTL ? 'مشروع مكتمل' : 'Projects Completed'}</div>
              </div>
              <div className="text-center stagger-animation">
                <div className="text-3xl font-bold text-foreground mb-2 counter-animation" data-target="5">0+</div>
                <div style={{ color: 'hsl(var(--hero-sub))' }}>{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo Marquee at bottom */}
      <div className="relative z-10 pb-10">
        <LogoMarquee />
      </div>
    </section>
  );
};

export default HeroSection;
