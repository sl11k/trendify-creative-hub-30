import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users, Target, Zap, Rocket, TrendingUp, Lightbulb, Shield, Code, Sparkles } from 'lucide-react';

const AboutSection = () => {
  const { t, isRTL } = useLanguage();

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
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Heading */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'من نحن' : 'About Us'}
          </h1>
          <div className="w-24 h-1 bg-gradient-primary mx-auto mb-8 rounded-full"></div>
        </div>

        {/* Hero Description */}
        <div className="max-w-4xl mx-auto mb-20 animate-fade-in">
          <div className="bg-card rounded-3xl p-8 md:p-12 shadow-hero border border-border">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                {isRTL ? 'شريك نموك الرقمي' : 'Your Digital Growth Partner'}
              </h2>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
              {isRTL 
                ? 'نحن في Trendify شريك نمو متكامل للمشاريع والشركات الناشئة. نعمل معك منذ لحظة ولادة الفكرة حتى إطلاق المشروع وتحقيق الإيرادات والنمو المستدام.'
                : 'At Trendify, we\'re your complete growth partner for startups and emerging ventures. We work with you from idea conception through launch to revenue generation and sustainable growth.'
              }
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
              {isRTL 
                ? 'نقدّم منظومة دعم شاملة تجمع بين الاستراتيجية، البرمجة، التصميم، التسويق، إدارة المحتوى، التحليل، والتشغيل — بمرونة تتناسب مع احتياجات الشركات الناشئة وميزانياتها.'
                : 'Our full-spectrum ecosystem covers strategy, design, development, marketing, content management, analytics, and operations — all crafted to fit the needs and budgets of startups.'
              }
            </p>

            <div className="bg-gradient-subtle p-6 rounded-2xl border border-border/50">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                  {isRTL 
                    ? 'من خلال أدواتنا الذكية، نتيح لك تنفيذ فكرتك بسرعة وسهولة دون الحاجة إلى فرق تقنية كبيرة أو تكاليف مرتفعة. أدواتنا تساعدك على بناء منصتك، إدارة عملياتك، وتحسين أدائك بخطوات بسيطة وفعّالة.'
                    : 'Through our smart tools, you can bring your vision to life quickly and easily — without the need for large technical teams or high costs. Our tools help you build your platform, manage operations, and improve performance with simple and effective steps.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* USPs Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient-secondary mb-12">
            {isRTL ? 'ما يميزنا' : 'What Makes Us Different'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((usp, index) => {
              const IconComponent = usp.icon;
              return (
                <div 
                  key={index} 
                  className="bg-card rounded-2xl p-6 shadow-elegant border border-border hover:shadow-glow transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-14 h-14 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow mb-4">
                    <IconComponent className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="font-bold text-lg text-foreground mb-3" dir={isRTL ? 'rtl' : 'ltr'}>{usp.title}</h3>
                  <p className="text-muted-foreground" dir={isRTL ? 'rtl' : 'ltr'}>{usp.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vision & Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Vision */}
          <div className="bg-gradient-primary rounded-3xl p-8 md:p-10 text-white shadow-hero relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL ? 'رؤيتنا' : 'Our Vision'}
              </h3>
              <p className="text-white/90 text-lg leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL 
                  ? 'تمكين المشاريع الناشئة من النمو من خلال حلول تقنية وتسويقية ذكية تقلل التكاليف وتسرّع الوصول إلى السوق.'
                  : 'Empower startups to grow through smart, efficient, and scalable marketing and technology solutions.'
                }
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="bg-gradient-secondary rounded-3xl p-8 md:p-10 text-white shadow-hero relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL ? 'مهمتنا' : 'Our Mission'}
              </h3>
              <p className="text-white/90 text-lg leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL 
                  ? 'أن نصبح الشريك المفضل لرواد الأعمال في المنطقة عبر أدوات ذكية وخدمات شاملة تجعل بناء وتشغيل المشروع عملية سهلة ومجدية.'
                  : 'To become the go-to partner for entrepreneurs in the region through intelligent tools and full-service solutions that make launching and managing projects simple and rewarding.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-hero border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient-primary mb-12">
            {isRTL ? 'أرقامنا تتحدث' : 'Our Numbers Speak'}
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3">500+</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'مشروع ناجح' : 'Successful Projects'}</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-secondary mb-3">98%</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'رضا العملاء' : 'Client Satisfaction'}</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3">24/7</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'دعم فني' : 'Technical Support'}</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-secondary mb-3">5+</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="mt-12 pt-12 border-t border-border">
            <div className="bg-gradient-subtle p-8 rounded-2xl border border-border/50">
              <h3 className="text-xl md:text-2xl font-bold text-center text-foreground mb-4">
                {isRTL ? 'القيمة المضافة' : 'Value Proposition'}
              </h3>
              <p className="text-center text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL 
                  ? 'Trendify تجمع بين التقنية والتسويق في منظومة واحدة تدعم النمو المستدام للمشاريع. نؤمن أن كل فكرة تستحق أن تنمو، ولذلك نصنع حلولًا مرنة، عملية، وسريعة تحقق نتائج حقيقية وتفتح الطريق نحو مستقبلٍ مزدهرٍ لمشاريعك.'
                  : 'Trendify merges technology and marketing into one cohesive growth platform for sustainable success. We believe every idea deserves the chance to grow — through flexible, intelligent, and results-driven solutions that turn vision into measurable success.'
                }
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;