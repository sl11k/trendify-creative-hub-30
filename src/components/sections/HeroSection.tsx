import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';
import { supabase } from '@/integrations/supabase/client';

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

  const stats = [
    { value: '10M+', label: isRTL ? 'مشاهدة' : 'Views' },
    { value: '50+', label: isRTL ? 'صناعة' : 'Industries' },
    { value: '500+', label: isRTL ? 'مشروع' : 'Projects' },
    { value: '1000+', label: isRTL ? 'منشور' : 'Posts' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-50" />
      
      {/* Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top center glow */}
        <div 
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[120px]"
        />
        
        {/* Floating orbs */}
        <div 
          className="floating-orb absolute top-1/4 left-[10%] w-32 h-32 bg-primary/30"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="floating-orb absolute top-1/3 right-[15%] w-40 h-40 bg-primary/20"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="floating-orb absolute bottom-1/4 left-[20%] w-24 h-24 bg-primary/25"
          style={{ animationDelay: '4s' }}
        />
        <div 
          className="floating-orb absolute bottom-1/3 right-[10%] w-36 h-36 bg-primary/15"
          style={{ animationDelay: '6s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">
              {isRTL ? 'نحول أفكارك إلى واقع رقمي' : 'Transforming Ideas into Digital Reality'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-responsive-xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">{isRTL ? 'إذا كنت' : 'IF YOU ARE'}</span>
            <br />
            <span className="text-primary text-glow">{isRTL ? 'رائد أعمال' : 'Executive'}</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-responsive-md text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" 
            style={{ animationDelay: '0.2s' }}
          >
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div 
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up ${isRTL ? 'sm:flex-row-reverse' : ''}`} 
            style={{ animationDelay: '0.3s' }}
          >
            <Link to={consultationButton.url}>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary-hover btn-glow font-semibold px-8 py-6 text-lg group"
              >
                {isRTL ? consultationButton.text_ar : consultationButton.text_en}
                <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
              </Button>
            </Link>
            
            <Link to="/services">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/50 font-semibold px-8 py-6 text-lg group"
              >
                <Play className={`mr-2 h-5 w-5 text-primary ${isRTL ? 'mr-0 ml-2' : ''}`} />
                {t('hero.cta.secondary')}
              </Button>
            </Link>
          </div>

          {/* Stats Section */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up" 
            style={{ animationDelay: '0.4s' }}
          >
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-2xl card-glow stagger-animation"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-primary text-glow-sm mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;