import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const brands = [
  { name: 'Vortex', letter: 'V' },
  { name: 'Nimbus', letter: 'N' },
  { name: 'Prysma', letter: 'P' },
  { name: 'Cirrus', letter: 'C' },
  { name: 'Kynder', letter: 'K' },
  { name: 'Halcyn', letter: 'H' },
];

const LogoMarquee = () => {
  const { isRTL } = useLanguage();
  const duplicatedBrands = [...brands, ...brands];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-12">
        {/* Static text */}
        <div className="flex-shrink-0 text-foreground/50 text-sm leading-5 max-w-[120px]">
          {isRTL ? 'موثوق من علامات تجارية حول العالم' : 'Relied on by brands across the globe'}
        </div>

        {/* Marquee */}
        <div className="flex-1 overflow-hidden">
          <div className="flex animate-marquee gap-16 w-max">
            {duplicatedBrands.map((brand, i) => (
              <div key={i} className="flex items-center gap-3 flex-shrink-0">
                <div className="liquid-glass w-[24px] h-[24px] rounded-lg flex items-center justify-center text-foreground text-xs font-bold">
                  {brand.letter}
                </div>
                <span className="text-base font-semibold text-foreground whitespace-nowrap">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoMarquee;
