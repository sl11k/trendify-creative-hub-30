import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';

const AboutPreviewSection = () => {
  const { isRTL } = useLanguage();
  useCounterAnimation();

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
              {isRTL ? 'من نحن' : 'ABOUT US'}
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight tracking-tight">
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
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
            >
              {isRTL ? 'اقرأ المزيد عنا' : 'Learn more about us'}
              <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-foreground mb-1 counter-animation" data-target="99">0%</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'رضا العملاء' : 'Client Satisfaction'}</div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-foreground mb-1 counter-animation" data-target="500">0+</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'مشروع ناجح' : 'Successful Projects'}</div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-foreground mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'الدعم الفني' : 'Technical Support'}</div>
            </div>
            <div className="bg-muted/50 rounded-2xl p-6 border border-border/50">
              <div className="text-3xl font-bold text-foreground mb-1 counter-animation" data-target="5">0+</div>
              <div className="text-sm text-muted-foreground">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;
