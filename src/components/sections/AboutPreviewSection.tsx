import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';

const AboutPreviewSection = () => {
  const { isRTL } = useLanguage();
  useCounterAnimation();
  const sectionRef = useScrollAnimation();
  const gridRef = useStaggerAnimation();

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle decorative element */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div ref={sectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8 scroll-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase">
              {isRTL ? 'من نحن' : 'ABOUT US'}
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
              {isRTL ? 'فريق يهتم فعلاً بنجاحك' : 'A team that genuinely cares'}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRTL 
                ? 'نحن فريق من المبدعين والمطورين المتخصصين في تقديم حلول رقمية مبتكرة. نؤمن بقوة التكنولوجيا في تحويل الأفكار إلى واقع رقمي مذهل.'
                : 'We are a team of creators and developers specialized in delivering innovative digital solutions. We believe in the power of technology to transform ideas into stunning digital reality.'
              }
            </p>
            <Link 
              to="/about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-semibold group"
            >
              {isRTL ? 'اقرأ المزيد عنا' : 'Learn more about us'}
              <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
          </div>

          {/* Bento Grid */}
          <div ref={gridRef} className="grid grid-cols-2 gap-4 stagger-container">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/10">
              <div className="text-3xl font-bold font-heading text-foreground mb-1 counter-animation" data-target="99">0%</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'رضا العملاء' : 'Client Satisfaction'}</div>
            </div>
            <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-2xl p-6 border border-secondary/10">
              <div className="text-3xl font-bold font-heading text-foreground mb-1 counter-animation" data-target="500">0+</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'مشروع ناجح' : 'Successful Projects'}</div>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 rounded-2xl p-6 border border-accent/10">
              <div className="text-3xl font-bold font-heading text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'الدعم الفني' : 'Technical Support'}</div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-2xl p-6 border border-primary/10">
              <div className="text-3xl font-bold font-heading text-foreground mb-1 counter-animation" data-target="5">0+</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
