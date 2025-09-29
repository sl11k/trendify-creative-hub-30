import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';

const PartnersSection = () => {
  const { language } = useLanguage();
  const { partners, loading } = usePartners();

  // Don't render if no partners or loading
  if (loading || !partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {language === 'ar' ? 'شركاء نجاحنا' : 'Our Success Partners'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {language === 'ar' 
              ? 'نفتخر بشراكتنا مع أفضل الشركات والمؤسسات في المجال' 
              : 'We are proud of our partnerships with the best companies and institutions in the field'
            }
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8 items-center">
          {partners.map((partner) => (
            <div 
              key={partner.id}
              className="group relative bg-card rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              {partner.website_url ? (
                <a 
                  href={partner.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={partner.logo_url}
                    alt={language === 'ar' ? partner.name_ar : partner.name_en}
                    className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo_url}
                  alt={language === 'ar' ? partner.name_ar : partner.name_en}
                  className="w-full h-16 object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                  loading="lazy"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;