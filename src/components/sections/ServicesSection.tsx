import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();
  const { services, loading, error } = useServices();

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Icons.Zap;
    
    // Convert icon name to PascalCase if needed
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    
    // Get the icon from lucide-react
    const IconComponent = (Icons as any)[iconKey] || (Icons as any)[iconName] || Icons.Zap;
    
    return IconComponent;
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">{isRTL ? 'جاري التحميل...' : 'Loading...'}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon_name);
            
            return (
              <Card
                key={service.id}
                className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div 
                    className="w-16 h-16 rounded-2xl p-4 mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      background: service.gradient_from && service.gradient_to 
                        ? `linear-gradient(135deg, ${service.gradient_from}, ${service.gradient_to})`
                        : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'
                    }}
                  >
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                    {isRTL ? service.title_ar : service.title_en}
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-muted-foreground mb-4 leading-relaxed">
                    {isRTL ? service.description_ar : service.description_en}
                  </CardDescription>
                  
                  <Badge variant="secondary" className="mt-4">
                    {isRTL ? 'خدمة مميزة' : 'Premium Service'}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-hero rounded-2xl p-8 md:p-12 text-white shadow-hero">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'مستعد لبدء مشروعك القادم؟' : 'Ready to Start Your Next Project?'}
            </h3>
            <p className="text-lg mb-6 text-white/90">
              {isRTL ? 'دعنا نساعدك في تحقيق أهدافك الرقمية بحلول مبتكرة ومخصصة' : 'Let us help you achieve your digital goals with innovative and customized solutions'}
            </p>
            <Link to="/contact">
              <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                {isRTL ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;