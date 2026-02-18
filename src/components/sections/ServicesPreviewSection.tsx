import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import * as Icons from 'lucide-react';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

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
  const headerRef = useScrollAnimation();
  const gridRef = useStaggerAnimation();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 via-muted/30 to-background" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16 scroll-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
            {isRTL ? 'خدماتنا' : 'OUR EXPERTISE'}
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {isRTL ? 'خدمات نقدمها لك' : 'Services We Offer'}
          </h2>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        {/* Bento Grid */}
        {!loading && !error && (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12 stagger-container">
            {previewServices.map((service, index) => {
              const IconComponent = getIconComponent(service.icon_name);
              return (
                <Card
                  key={service.id}
                  className="group border border-border/50 bg-background/80 backdrop-blur-sm hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-8">
                    <div 
                      className="w-14 h-14 mb-6 rounded-2xl flex items-center justify-center shadow-lg"
                      style={{
                        background: service.gradient_from && service.gradient_to
                          ? `linear-gradient(135deg, ${service.gradient_from}, ${service.gradient_to})`
                          : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'
                      }}
                    >
                      <IconComponent className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-foreground mb-3">
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
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-semibold group"
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
