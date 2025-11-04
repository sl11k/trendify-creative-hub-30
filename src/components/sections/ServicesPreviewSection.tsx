import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useServices } from '@/hooks/useServices';
import * as Icons from 'lucide-react';

// Icon mapping function
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Icons.Star;
  
  // Convert icon name to PascalCase if needed
  const iconKey = iconName.charAt(0).toUpperCase() + iconName.slice(1);
  
  // Get the icon from lucide-react
  const IconComponent = (Icons as any)[iconKey] || (Icons as any)[iconName] || Icons.Star;
  
  return IconComponent;
};

const ServicesPreviewSection = () => {
  const { t, isRTL } = useLanguage();
  const { services, loading, error } = useServices();

  // Get first 3 services for preview
  const previewServices = services.slice(0, 3);

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {t('services.title')}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'نقدم مجموعة واسعة من الخدمات الرقمية المتطورة' : 'We offer a wide range of advanced digital services'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="mr-2 text-muted-foreground">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Services Preview Grid - 3 columns on mobile, 3 columns on desktop */}
        {!loading && !error && (
          <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-8 mb-12">
            {previewServices.map((service, index) => {
              const IconComponent = getIconComponent(service.icon_name);
              return (
                <Card
                  key={service.id}
                  className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105 stagger-animation"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader className="text-center pb-4">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300"
                      style={{
                        background: service.gradient_from && service.gradient_to
                          ? `linear-gradient(135deg, ${service.gradient_from}, ${service.gradient_to})`
                          : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))'
                      }}
                    >
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                      {isRTL ? service.title_ar : service.title_en}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {isRTL ? service.description_ar : service.description_en}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/services">
            <Button 
              size="xl" 
              className="group bg-gradient-primary text-primary-foreground border-0 hover:shadow-glow transition-all duration-300 transform hover:scale-105 font-semibold px-8 py-4"
            >
              {isRTL ? 'استكشف جميع خدماتنا' : 'Explore All Our Services'}
              <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreviewSection;
