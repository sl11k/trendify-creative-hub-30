import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroBackground from '@/assets/hero-background.jpg';
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
    // Stagger animation for statistics
    const staggerElements = document.querySelectorAll('.stagger-animation');
    staggerElements.forEach((element, index) => {
      element.setAttribute('data-delay', (index * 150).toString());
    });

    // Load consultation button settings
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0 parallax-bg"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-secondary/70 to-accent/80"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        <div className="animate-float absolute top-20 left-10 w-20 h-20 bg-primary-glow/20 rounded-full blur-xl"></div>
        <div className="animate-float absolute top-40 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" style={{animationDelay: '2s'}}></div>
        <div className="animate-float absolute bottom-20 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-lg" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 className="text-responsive-xl font-bold text-white mb-6 animate-fade-in-up">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-responsive-lg text-white/90 mb-8 leading-relaxed animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t('hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up ${isRTL ? 'sm:flex-row-reverse' : ''}`} style={{animationDelay: '0.4s'}}>
            <Link to={consultationButton.url}>
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 transition-all duration-300 transform hover:scale-105 hero-shadow font-semibold px-8 py-4 text-lg loading-pulse"
              >
                {isRTL ? consultationButton.text_ar : consultationButton.text_en}
                <ArrowRight className={`ml-2 h-5 w-5 ${isRTL ? 'rotate-180 ml-0 mr-2' : ''}`} />
              </Button>
            </Link>
            
            <Link to="/services">
              <Button
                size="lg"
                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-4 text-lg"
              >
                <Play className={`mr-2 h-5 w-5 ${isRTL ? 'mr-0 ml-2' : ''}`} />
                {t('hero.cta.secondary')}
              </Button>
            </Link>
          </div>

          {/* Stats or Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="text-center stagger-animation">
              <div className="text-3xl font-bold text-white mb-2 counter-animation" data-target="500">0+</div>
              <div className="text-white/80">{isRTL ? 'عميل راضٍ' : 'Happy Clients'}</div>
            </div>
            <div className="text-center stagger-animation">
              <div className="text-3xl font-bold text-white mb-2 counter-animation" data-target="1000">0+</div>
              <div className="text-white/80">{isRTL ? 'مشروع مكتمل' : 'Projects Completed'}</div>
            </div>
            <div className="text-center stagger-animation">
              <div className="text-3xl font-bold text-white mb-2 counter-animation" data-target="5">0+</div>
              <div className="text-white/80">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;