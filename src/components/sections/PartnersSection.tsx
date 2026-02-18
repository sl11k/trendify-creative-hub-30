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
    <section className="py-16 bg-background border-y border-border/50">
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
          {isRTL ? 'موثوق من الأفضل' : 'TRUSTED BY THE BEST'}
        </p>
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee items-center gap-12">
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
                    className="h-8 md:h-10 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                    loading="lazy"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo_url}
                  alt={isRTL ? partner.name_ar : partner.name_en}
                  className="h-8 md:h-10 w-auto object-contain opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
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
