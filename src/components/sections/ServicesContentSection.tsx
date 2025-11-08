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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* What Makes Us Different */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'ما الذي يميز ترينديفاي؟' : 'What Makes Trendify Different?'}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {isRTL 
              ? 'نحن لسنا مجرد وكالة رقمية — بل شريك نمو ذكي. نجمع بين الذكاء الاصطناعي والإبداع والأتمتة لتقديم أنظمة ذكية تعزز اتخاذ القرار وتحسن الأداء وتسرّع التقدم الرقمي.'
              : "We're not just a digital agency — we're an intelligent growth partner. We combine AI, creativity, and automation to deliver smart systems that enhance decision-making, optimize performance, and accelerate digital progress."}
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card 
                key={index}
                className="border-0 shadow-card hover:shadow-glow bg-card-gradient transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary p-3 flex-shrink-0">
                      <Icon className="w-full h-full text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {isRTL ? benefit.titleAr : benefit.titleEn}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">
              {isRTL ? 'النتائج المتوقعة للعملاء' : 'Expected Outcomes for Clients'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {isRTL 
                ? 'تحقيق نتائج قابلة للقياس من خلال استراتيجيات مدعومة بالذكاء الاصطناعي'
                : 'Achieve measurable results through AI-powered strategies'}
            </p>
          </div>

          <Card className="border-0 shadow-card bg-card-gradient">
            <CardContent className="p-8">
              <div className="grid sm:grid-cols-2 gap-4">
                {outcomes.map((outcome, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-3 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-foreground font-medium">
                      {isRTL ? outcome.ar : outcome.en}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Target Audience */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {isRTL ? 'من نخدم؟' : 'Who We Serve'}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { en: 'Startups & Entrepreneurs', ar: 'الشركات الناشئة ورواد الأعمال' },
              { en: 'SMEs in Digital Transformation', ar: 'المؤسسات الصغيرة في التحول الرقمي' },
              { en: 'E-commerce Businesses', ar: 'أعمال التجارة الإلكترونية' },
              { en: 'Tech-Driven Companies', ar: 'الشركات التقنية' },
              { en: 'Organizations Seeking AI Optimization', ar: 'المؤسسات الساعية لتحسين الذكاء الاصطناعي' }
            ].map((audience, index) => (
              <div 
                key={index}
                className="px-6 py-3 bg-gradient-primary text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {isRTL ? audience.ar : audience.en}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesContentSection;
