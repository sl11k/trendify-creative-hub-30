import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users, Target, Zap, Rocket, TrendingUp, Lightbulb, Shield, Code, Sparkles } from 'lucide-react';

const AboutSection = () => {
  const { t, isRTL } = useLanguage();

  const usps = [
    {
      icon: Code,
      title: isRTL ? 'نهج تقني حديث' : 'Modern Tech Approach',
      description: isRTL ? 'نعتمد على أحدث التقنيات وأدوات الذكاء الاصطناعي.' : 'We rely on the latest technologies and AI tools.'
    },
    {
      icon: Sparkles,
      title: isRTL ? 'تركيز على تجربة المستخدم' : 'User Experience Focus',
      description: isRTL ? 'نصمّم تجارب حديثة وسهلة الاستخدام.' : 'We design modern, easy-to-use experiences.'
    },
    {
      icon: Zap,
      title: isRTL ? 'سرعة ومرونة في التنفيذ' : 'Speed & Flexibility',
      description: isRTL ? 'نعمل بأسلوب Agile يضمن سرعة التطوير والتحسين المستمر.' : 'Agile delivery with continuous improvement.'
    },
    {
      icon: Rocket,
      title: isRTL ? 'نفكر بعقلية المنتج' : 'Product-First Mindset',
      description: isRTL ? 'لا نقدّم مجرد تنفيذ، بل نبني حلولًا قابلة للنمو.' : 'Not just delivery — we build solutions built to grow.'
    },
    {
      icon: TrendingUp,
      title: isRTL ? 'حلول قابلة للتوسع' : 'Scalable Solutions',
      description: isRTL ? 'نطوّر أنظمة تدعم النمو المستقبلي.' : 'Systems engineered to support future growth.'
    },
    {
      icon: Shield,
      title: isRTL ? 'الأمان بالتصميم' : 'Security by Design',
      description: isRTL ? 'الاعتمادية والاستقرار في كل ما نبنيه.' : 'Reliability and stability baked into every build.'
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
                {isRTL ? 'شريكك التقني لبناء حلول رقمية تدوم' : 'Your Tech Partner for Long-Lasting Digital Solutions'}
              </h2>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
              {isRTL
                ? 'تأسست Trendify عام 2023 كشركة متخصصة في تطوير الحلول الرقمية والمنتجات الذكية، مع تركيز على هندسة البرمجيات وبناء الأنظمة الرقمية الحديثة.'
                : 'Founded in 2023, Trendify specializes in developing digital solutions and smart products with a strong focus on software engineering and modern digital systems.'
              }
            </p>

            <p className="text-lg text-muted-foreground leading-relaxed mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
              {isRTL
                ? 'نساعد الشركات ورواد الأعمال على تحويل الأفكار إلى منتجات وتجارب رقمية قابلة للنمو، من خلال الجمع بين التقنية، التصميم، والذكاء الاصطناعي. تشمل خبراتنا تطوير الأنظمة المؤسسية، منصات SaaS، التطبيقات المخصصة، وأدوات الأتمتة والحلول الذكية التي تدعم الكفاءة التشغيلية وتجربة المستخدم.'
                : 'We help companies and entrepreneurs turn ideas into scalable digital products by combining technology, design, and AI. Our expertise spans enterprise systems, SaaS platforms, custom applications, automation tools, and smart solutions that support operational efficiency and user experience.'
              }
            </p>

            <div className="bg-gradient-subtle p-6 rounded-2xl border border-border/50">
              <div className="flex items-start gap-4">
                <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-muted-foreground leading-relaxed font-semibold" dir={isRTL ? 'rtl' : 'ltr'}>
                  {isRTL
                    ? 'نحن لا ننفذ مشاريع مؤقتة — بل نبني أنظمة طويلة الأمد.'
                    : 'We don\'t deliver short-term projects — we build long-lasting systems.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* USPs Section */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient-secondary mb-12">
            {isRTL ? 'لماذا Trendify؟' : 'Why Trendify?'}
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
                  ? 'أن نصبح شريكًا تقنيًا رائدًا في بناء الحلول الرقمية والمنتجات الذكية في المنطقة.'
                  : 'To become a leading tech partner in building digital solutions and smart products across the region.'
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
                  ? 'تمكين الشركات ورواد الأعمال من بناء حلول ومنتجات رقمية ذكية تساعدهم على النمو، تحسين الكفاءة، وتقديم تجارب أفضل.'
                  : 'Empower companies and entrepreneurs to build smart digital solutions and products that drive growth, improve efficiency, and deliver better experiences.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-hero border border-border">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gradient-primary mb-12">
            {isRTL ? 'مؤشراتنا التقنية' : 'Our Tech Numbers'}
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center animate-fade-in">
              <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3">+70</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'عميل' : 'Clients'}</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-secondary mb-3">+100</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'منصة مطوّرة' : 'Platforms Built'}</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-primary mb-3">+50</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'نظام تقني واسع النطاق' : 'Enterprise Systems'}</div>
            </div>
            <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl md:text-5xl font-bold text-gradient-secondary mb-3">100%</div>
              <div className="text-muted-foreground font-medium">{isRTL ? 'تطوير مخصّص' : 'Custom Development'}</div>
            </div>
          </div>

          {/* Values */}
          <div className="mt-12 pt-12 border-t border-border">
            <div className="bg-gradient-subtle p-8 rounded-2xl border border-border/50">
              <h3 className="text-xl md:text-2xl font-bold text-center text-foreground mb-4">
                {isRTL ? 'قيمنا' : 'Our Values'}
              </h3>
              <p className="text-center text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto" dir={isRTL ? 'rtl' : 'ltr'}>
                {isRTL
                  ? 'الدقة والجودة، قابلية التوسع، الأمان بالتصميم، الاعتمادية والاستقرار، الابتكار العملي، التركيز على العميل، السرعة والمرونة.'
                  : 'Precision and quality, scalability, security by design, reliability and stability, practical innovation, customer focus, speed and flexibility.'
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
