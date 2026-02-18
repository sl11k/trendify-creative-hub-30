import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Sparkles, Target, TrendingUp, Users } from 'lucide-react';

const ServicesContentSection = () => {
  const { isRTL } = useLanguage();

  const benefits = [
    {
      icon: Sparkles,
      titleEn: 'AI Integrated into Every Process',
      titleAr: 'الذكاء الاصطناعي في كل عملية',
      descEn: 'Smart automation and intelligent insights embedded throughout your business operations',
      descAr: 'أتمتة ذكية ورؤى ذكية مدمجة في جميع عمليات أعمالك'
    },
    {
      icon: Target,
      titleEn: 'Ideas to Scalable Solutions',
      titleAr: 'من الأفكار إلى حلول قابلة للتوسع',
      descEn: 'Transform concepts into AI-powered systems ready for rapid growth',
      descAr: 'تحويل المفاهيم إلى أنظمة مدعومة بالذكاء الاصطناعي جاهزة للنمو السريع'
    },
    {
      icon: TrendingUp,
      titleEn: 'Boost Operational Efficiency',
      titleAr: 'تعزيز الكفاءة التشغيلية',
      descEn: 'Cut costs and optimize performance through data-driven automation',
      descAr: 'خفض التكاليف وتحسين الأداء من خلال الأتمتة المدفوعة بالبيانات'
    },
    {
      icon: Users,
      titleEn: 'Startup Digital Support',
      titleAr: 'دعم رقمي للشركات الناشئة',
      descEn: 'Comprehensive growth strategies designed specifically for emerging businesses',
      descAr: 'استراتيجيات نمو شاملة مصممة خصيصاً للشركات الناشئة'
    }
  ];

  const outcomes = [
    { en: 'Sustainable business growth', ar: 'نمو مستدام للأعمال' },
    { en: 'Automated and data-driven marketing', ar: 'تسويق آلي ومدفوع بالبيانات' },
    { en: 'Seamless project management', ar: 'إدارة مشاريع سلسة' },
    { en: 'Exceptional digital experiences', ar: 'تجارب رقمية استثنائية' },
    { en: 'Faster digital transformation readiness', ar: 'جاهزية أسرع للتحول الرقمي' }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* What Makes Us Different */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'ما يميزنا' : 'WHAT SETS US APART'}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-6">
            {isRTL ? 'ما الذي يميز ترينديفاي؟' : 'What Makes Trendify Different?'}
          </h2>
          <p className="text-lg text-muted-foreground">
            {isRTL 
              ? 'نحن لسنا مجرد وكالة رقمية — بل شريك نمو ذكي'
              : "We're not just a digital agency — we're an intelligent growth partner"}
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-24">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="border border-border/50 bg-background hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {isRTL ? benefit.titleAr : benefit.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {isRTL ? benefit.descAr : benefit.descEn}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Expected Outcomes */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
              {isRTL ? 'النتائج' : 'OUTCOMES'}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {isRTL ? 'النتائج المتوقعة' : 'Expected Outcomes'}
            </h2>
          </div>

          <div className="space-y-4">
            {outcomes.map((outcome, index) => (
              <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <p className="text-foreground font-medium text-sm">
                  {isRTL ? outcome.ar : outcome.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesContentSection;
