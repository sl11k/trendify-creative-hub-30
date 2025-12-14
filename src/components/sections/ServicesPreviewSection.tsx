import React from 'react';
import { Button } from '@/components/ui/button';
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
  const previewServices = services.slice(0, 3);

  return (
    <section id="services" className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">{isRTL ? 'خدماتنا' : 'Our '}</span>
            <span className="text-primary text-glow">{isRTL ? '' : 'Services'}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'نقدم مجموعة واسعة من الخدمات الرقمية المتطورة' : 'We offer a wide range of advanced digital services'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="mr-2 text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Services Preview Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {previewServices.map((service, index) => {
              const IconComponent = getIconComponent(service.icon_name);
              return (
                <div
                  key={service.id}
                  className="group card-glow rounded-2xl p-8 transition-all duration-500 hover:scale-[1.02] stagger-animation"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="mb-6">
                    <div 
                      className="w-16 h-16 rounded-xl flex items-center justify-center border border-primary/30 bg-primary/10 group-hover:bg-primary/20 transition-all duration-300"
                    >
                      <IconComponent className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                    {isRTL ? service.title_ar : service.title_en}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {isRTL ? service.description_ar : service.description_en}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/services">
            <Button 
              size="lg" 
              className="bg-primary text-primary-foreground hover:bg-primary-hover btn-glow font-semibold px-8 py-6 text-lg group"
            >
              {isRTL ? 'استكشف جميع خدماتنا' : 'Explore All Services'}
              <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreviewSection;