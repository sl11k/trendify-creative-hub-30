import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();
  const { services, loading, error } = useServices();

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return Icons.Zap;
    const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    return (Icons as any)[iconKey] || (Icons as any)[iconName] || Icons.Zap;
  };

  if (loading) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'خدماتنا' : 'ALL SERVICES'}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {t('services.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const IconComponent = getIconComponent(service.icon_name);
            return (
              <Card
                key={service.id}
                className="group border border-border/50 bg-background hover:border-primary/30 transition-all duration-300"
              >
                <CardContent className="p-8">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{
                      background: service.gradient_from && service.gradient_to 
                        ? `linear-gradient(135deg, ${service.gradient_from}, ${service.gradient_to})`
                        : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'
                    }}
                  >
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {isRTL ? service.title_ar : service.title_en}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {isRTL ? service.description_ar : service.description_en}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <div className="max-w-2xl mx-auto p-12 rounded-2xl bg-foreground text-background">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {isRTL ? 'مستعد لبدء مشروعك؟' : 'Ready to Start?'}
            </h3>
            <p className="text-background/60 mb-8">
              {isRTL ? 'دعنا نساعدك في تحقيق أهدافك الرقمية' : 'Let us help you achieve your digital goals'}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-background text-foreground hover:bg-background/90 transition-colors text-sm font-medium"
            >
              {isRTL ? 'احصل على استشارة مجانية' : 'Get Free Consultation'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
