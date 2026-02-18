import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';

const PartnersSection = () => {
  const { isRTL } = useLanguage();
  const { partners, loading } = usePartners();

  if (loading || partners.length === 0) {
    return null;
  }

  // Duplicate for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30 border-y border-border/30">
      <div className="container mx-auto px-4 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mx-auto block text-center w-fit">
          {isRTL ? 'موثوق من الأفضل' : 'TRUSTED BY THE BEST'}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <div className="flex animate-marquee items-center gap-16">
          {duplicatedPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 flex items-center justify-center px-4"
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
                    alt={isRTL ? partner.name_ar : partner.name_en}
                    className="h-10 md:h-12 w-auto object-contain opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 hover:scale-110"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo_url}
                  alt={isRTL ? partner.name_ar : partner.name_en}
                  className="h-10 md:h-12 w-auto object-contain opacity-40 hover:opacity-100 transition-all duration-300 grayscale hover:grayscale-0 hover:scale-110"
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
