import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Search, Code, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesPreviewSection = () => {
  const { t, isRTL } = useLanguage();

  const previewServices = [
    {
      icon: Search,
      titleKey: 'services.digital-marketing.title',
      descKey: 'services.digital-marketing.desc',
      gradient: 'from-primary to-secondary'
    },
    {
      icon: Code,
      titleKey: 'services.web-dev.title',
      descKey: 'services.web-dev.desc',
      gradient: 'from-secondary to-accent'
    },
    {
      icon: Palette,
      titleKey: 'services.graphic-design.title',
      descKey: 'services.graphic-design.desc',
      gradient: 'from-accent to-primary'
    }
  ];

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

        {/* Services Preview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {previewServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card
                key={index}
                className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105 stagger-animation"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                    {t(service.titleKey)}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {t(service.descKey)}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/services">
            <Button 
              size="xl" 
              className="group bg-primary text-white border-2 border-primary hover:bg-primary-hover hover:text-white transition-all duration-300 transform hover:scale-105 shadow-glow font-semibold"
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