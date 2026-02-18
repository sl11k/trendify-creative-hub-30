import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import * as Icons from 'lucide-react';

const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Icons.Star;
  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  const IconComponent = (Icons as any)[iconKey] || (Icons as any)[iconName] || Icons.Star;
  return IconComponent;
};

const ServicesPreviewSection = () => {
  const { t, isRTL } = useLanguage();
  const { services, loading, error } = useServices();
  const previewServices = services.slice(0, 4);

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'خدماتنا' : 'OUR EXPERTISE'}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {isRTL ? 'خدمات نقدمها لك' : 'Services We Offer'}
          </h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Bento Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {previewServices.map((service, index) => {
              const IconComponent = getIconComponent(service.icon_name);
              return (
                <Card
                  key={service.id}
                  className="group border border-border/50 bg-background hover:border-primary/30 transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-8">
                    <div 
                      className="w-12 h-12 mb-6 rounded-xl flex items-center justify-center"
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
        )}

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {isRTL ? 'استكشف جميع خدماتنا' : 'Explore all services'}
            <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreviewSection;
