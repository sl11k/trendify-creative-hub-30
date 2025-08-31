import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();
  const [services, setServices] = useState<Array<{
    id: string;
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    icon_name?: string;
    gradient_from?: string;
    gradient_to?: string;
    sort_order: number;
  }>>([]);
  const [consultationButton, setConsultationButton] = useState({
    text_ar: 'احصل على عرض سعر مجاني',
    text_en: 'Get Free Quote',
    url: '/contact'
  });

  useEffect(() => {
    loadServices();
    loadConsultationButton();
  }, []);

  const loadServices = async () => {
    try {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

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
          text_ar: settings.consultation_button_text_ar || 'احصل على عرض سعر مجاني',
          text_en: settings.consultation_button_text_en || 'Get Free Quote',
          url: settings.consultation_button_url || '/contact'
        });
      }
    } catch (error) {
      console.error('Error loading consultation button:', error);
    }
  };

  const getIconComponent = (iconName: string): LucideIcon | null => {
    if (!iconName) return null;
    return (Icons as any)[iconName] || null;
  };

  return (
    <section id="services" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {t('services.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {t('services.subtitle')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon_name || 'Code');
            const gradientClass = service.gradient_from && service.gradient_to 
              ? `from-[${service.gradient_from}] to-[${service.gradient_to}]`
              : 'from-primary to-secondary';
            
            return (
              <Card
                key={service.id}
                className="service-card group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden advanced-hover"
              >
                <CardHeader className="text-center pb-4">
                  {/* Icon with Gradient Background */}
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {isRTL ? service.title_ar : service.title_en}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {isRTL ? (service.description_ar || service.title_ar) : (service.description_en || service.title_en)}
                  </CardDescription>
                  
                  {/* Learn More Link */}
                  <div className="flex items-center justify-center text-primary font-medium group-hover:text-secondary transition-colors duration-300">
                    <span className="ml-1">{isRTL ? 'اقرأ المزيد' : 'Learn More'}</span>
                    <ArrowRight className={`h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 ${isRTL ? 'rotate-180 ml-0 mr-1' : 'ml-1'}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="dynamic-gradient rounded-2xl p-8 md:p-12 text-white shadow-hero advanced-hover">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'مستعد لبدء مشروعك القادم؟' : 'Ready to Start Your Next Project?'}
            </h3>
            <p className="text-lg mb-6 text-white/90">
              {isRTL ? 'دعنا نساعدك في تحقيق أهدافك الرقمية بحلول مبتكرة ومخصصة' : 'Let us help you achieve your digital goals with innovative and customized solutions'}
            </p>
            <Link to={consultationButton.url}>
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg loading-pulse">
                {isRTL ? consultationButton.text_ar : consultationButton.text_en}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;