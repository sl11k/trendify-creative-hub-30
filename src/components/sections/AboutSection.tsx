import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users, Target, Zap, Rocket, TrendingUp, Code, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation, useStaggerAnimation } from '@/hooks/useScrollAnimation';

const AboutSection = () => {
  const { t, isRTL } = useLanguage();
  const headerRef = useScrollAnimation();
  const descRef = useScrollAnimation();
  const uspsHeaderRef = useScrollAnimation();
  const uspsGridRef = useStaggerAnimation();
  const visionRef = useStaggerAnimation();
  const statsRef = useScrollAnimation();

  const usps = [
    {
      icon: Rocket,
      title: isRTL ? 'شريك نمو متكامل' : 'End-to-End Growth Partner',
      description: isRTL ? 'ندعمك من الفكرة حتى تحقيق الإيرادات والنمو المستدام' : 'From idea to revenue and sustainable growth'
    },
    {
      icon: Code,
      title: isRTL ? 'أدوات ذكية' : 'Smart Tools',
      description: isRTL ? 'أدواتنا الذكية تسرّع التنفيذ وتقلل التكلفة' : 'Our smart tools accelerate execution and reduce costs'
    },
    {
      icon: Shield,
      title: isRTL ? 'حلول مرنة' : 'Flexible Solutions',
      description: isRTL ? 'تناسب ميزانيات الشركات الناشئة' : 'Designed for startup budgets'
    },
    {
      icon: TrendingUp,
      title: isRTL ? 'منظومة متكاملة' : 'Integrated System',
      description: isRTL ? 'تجمع بين التقنية والتسويق والتشغيل' : 'Combining tech, marketing, and operations'
    },
    {
      icon: Users,
      title: isRTL ? 'فريق موحد' : 'Unified Team',
      description: isRTL ? 'يجمع الخبرة الإبداعية والتقنية' : 'Creative and technical expertise'
    },
    {
      icon: Zap,
      title: isRTL ? 'سرعة في الإنجاز' : 'Fast Delivery',
      description: isRTL ? 'تركيز على النتائج الملموسة' : 'Results-oriented with measurable impact'
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div ref={headerRef} className="text-center mb-20 pt-8 scroll-hidden">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'من نحن' : 'ABOUT US'}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
            {isRTL ? 'شريك نموك الرقمي' : 'Your Digital Growth Partner'}
          </h1>
        </div>

        {/* Hero Description */}
        <div ref={descRef} className="max-w-3xl mx-auto mb-24 text-center scroll-hidden">
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {isRTL 
              ? 'نحن في Trendify شريك نمو متكامل للمشاريع والشركات الناشئة. نعمل معك منذ لحظة ولادة الفكرة حتى إطلاق المشروع وتحقيق الإيرادات والنمو المستدام.'
              : "At Trendify, we're your complete growth partner for startups and emerging ventures. We work with you from idea conception through launch to revenue generation and sustainable growth."
            }
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {isRTL 
              ? 'نقدّم منظومة دعم شاملة تجمع بين الاستراتيجية، البرمجة، التصميم، التسويق، إدارة المحتوى، التحليل، والتشغيل.'
              : "Our full-spectrum ecosystem covers strategy, design, development, marketing, content management, analytics, and operations."
            }
          </p>
        </div>

        {/* USPs Grid */}
        <div className="mb-24">
          <div ref={uspsHeaderRef} className="text-center mb-12 scroll-hidden">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              {isRTL ? 'ما يميزنا' : 'WHAT SETS US APART'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {isRTL ? 'ما يميزنا' : 'What Makes Us Different'}
            </h2>
          </div>
          
          <div ref={uspsGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-container">
            {usps.map((usp, index) => {
              const IconComponent = usp.icon;
              return (
                <Card key={index} className="border border-border/50 bg-background hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-8">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{usp.title}</h3>
                    <p className="text-sm text-muted-foreground">{usp.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Vision & Mission */}
        <div ref={visionRef} className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-24 stagger-container">
          <div className="bg-foreground rounded-2xl p-10 text-background">
            <div className="w-10 h-10 bg-background/10 rounded-xl flex items-center justify-center mb-6">
              <Target className="h-5 w-5 text-background" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {isRTL ? 'رؤيتنا' : 'Our Vision'}
            </h3>
            <p className="text-background/70 leading-relaxed">
              {isRTL 
                ? 'تمكين المشاريع الناشئة من النمو من خلال حلول تقنية وتسويقية ذكية تقلل التكاليف وتسرّع الوصول إلى السوق.'
                : 'Empower startups to grow through smart, efficient, and scalable marketing and technology solutions.'
              }
            </p>
          </div>

          <div className="bg-primary rounded-2xl p-10 text-primary-foreground">
            <div className="w-10 h-10 bg-primary-foreground/10 rounded-xl flex items-center justify-center mb-6">
              <Award className="h-5 w-5 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4">
              {isRTL ? 'مهمتنا' : 'Our Mission'}
            </h3>
            <p className="text-primary-foreground/70 leading-relaxed">
              {isRTL 
                ? 'أن نصبح الشريك المفضل لرواد الأعمال في المنطقة عبر أدوات ذكية وخدمات شاملة.'
                : 'To become the go-to partner for entrepreneurs in the region through intelligent tools and full-service solutions.'
              }
            </p>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="border border-border/50 rounded-2xl p-12 scroll-hidden">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              {isRTL ? 'الأرقام' : 'BY THE NUMBERS'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {isRTL ? 'أرقامنا تتحدث' : 'Our Numbers Speak'}
            </h2>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: '500+', label: isRTL ? 'مشروع ناجح' : 'Successful Projects' },
              { value: '98%', label: isRTL ? 'رضا العملاء' : 'Client Satisfaction' },
              { value: '24/7', label: isRTL ? 'دعم فني' : 'Technical Support' },
              { value: '5+', label: isRTL ? 'سنوات خبرة' : 'Years Experience' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
