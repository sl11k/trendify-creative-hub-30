import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Award, Users, Target, Zap } from 'lucide-react';

const AboutSection = () => {
  const { t, isRTL } = useLanguage();

  const features = [
    {
      icon: Award,
      title: isRTL ? 'الخبرة والاحترافية' : 'Expertise & Professionalism',
      description: isRTL ? 'فريق من الخبراء المتخصصين في جميع جوانب التسويق الرقمي' : 'A team of experts specialized in all aspects of digital marketing'
    },
    {
      icon: Users,
      title: isRTL ? 'فريق إبداعي متميز' : 'Creative Excellence Team',
      description: isRTL ? 'مصممون ومطورون موهوبون يحولون الأفكار إلى واقع مبهر' : 'Talented designers and developers who turn ideas into stunning reality'
    },
    {
      icon: Target,
      title: isRTL ? 'استراتيجيات مخصصة' : 'Customized Strategies',
      description: isRTL ? 'حلول مصممة خصيصاً لتناسب احتياجات كل عميل' : 'Solutions designed specifically to meet each client\'s needs'
    },
    {
      icon: Zap,
      title: isRTL ? 'نتائج سريعة وملموسة' : 'Fast & Measurable Results',
      description: isRTL ? 'نركز على تحقيق نتائج قابلة للقياس في أسرع وقت' : 'We focus on achieving measurable results in the shortest time'
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className={`${isRTL ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
                {t('about.title')}
              </h2>
              
              <h3 className="text-xl md:text-2xl text-secondary font-semibold mb-6">
                {t('about.subtitle')}
              </h3>
              
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {t('about.description')}
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`${isRTL ? 'lg:order-1' : 'lg:order-2'}`}>
            <div className="relative">
              {/* Background Gradient */}
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl transform rotate-3 opacity-20"></div>
              
              {/* Main Content */}
              <div className="relative bg-card rounded-3xl p-8 shadow-hero border border-border">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-primary mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'مشروع ناجح' : 'Successful Projects'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-secondary mb-2">98%</div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'رضا العملاء' : 'Client Satisfaction'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'دعم فني' : 'Technical Support'}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gradient-secondary mb-2">5+</div>
                    <div className="text-sm text-muted-foreground">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="text-center p-6 bg-muted/30 rounded-2xl">
                  <h4 className="font-bold text-foreground mb-3">
                    {isRTL ? 'رسالتنا' : 'Our Mission'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isRTL 
                      ? 'نسعى لتمكين الشركات من النجاح في العالم الرقمي من خلال الحلول المبتكرة والخدمات المتميزة'
                      : 'We strive to empower businesses to succeed in the digital world through innovative solutions and exceptional services'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;