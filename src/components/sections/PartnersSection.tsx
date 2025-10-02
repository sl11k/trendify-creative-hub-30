import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';

const PartnersSection = () => {
  const { isRTL } = useLanguage();
  const { partners, loading } = usePartners();

  console.log('Partners data:', partners, 'Loading:', loading);

  // لا تعرض القسم إذا لم يكن هناك شركاء نشطين
  if (loading || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'شركاء نجاحنا' : 'Our Success Partners'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'نفخر بشراكتنا مع أفضل الشركات والمؤسسات' : 'We are proud to partner with the best companies and institutions'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <div
              key={partner.id}
              className="group flex items-center justify-center p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {partner.website_url ? (
                <a
                  href={partner.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={partner.logo_url}
                    alt={isRTL ? partner.name_ar : partner.name_en}
                    className="max-w-full max-h-24 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                  />
                </a>
              ) : (
                <img
                  src={partner.logo_url}
                  alt={isRTL ? partner.name_ar : partner.name_en}
                  className="max-w-full max-h-24 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
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
