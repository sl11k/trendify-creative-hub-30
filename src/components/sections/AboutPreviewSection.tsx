import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Target, Users, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCounterAnimation } from '@/hooks/useCounterAnimation';

const AboutPreviewSection = () => {
  const { t, isRTL } = useLanguage();
  useCounterAnimation();

  useEffect(() => {
    const staggerElements = document.querySelectorAll('.stagger-animation');
    staggerElements.forEach((element, index) => {
      element.setAttribute('data-delay', (index * 100).toString());
    });
  }, []);

  const features = [
    { icon: Target, label: isRTL ? 'رؤيتنا' : 'Our Vision' },
    { icon: Users, label: isRTL ? 'فريقنا' : 'Our Team' },
    { icon: Award, label: isRTL ? 'إنجازاتنا' : 'Our Awards' },
  ];

  const stats = [
    { value: '99', suffix: '%', label: isRTL ? 'رضا العملاء' : 'Client Satisfaction' },
    { value: '500', suffix: '+', label: isRTL ? 'مشروع ناجح' : 'Successful Projects' },
    { value: '24/7', suffix: '', label: isRTL ? 'الدعم الفني' : 'Technical Support' },
    { value: '5', suffix: '+', label: isRTL ? 'سنوات خبرة' : 'Years Experience' },
  ];

  return (
    <section id="about" className="py-24 bg-card relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px] -translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                <span className="text-foreground">{isRTL ? 'من ' : 'About '}</span>
                <span className="text-primary text-glow">{isRTL ? 'نحن' : 'Us'}</span>
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {isRTL 
                  ? 'نحن فريق من المبدعين والمطورين المتخصصين في تقديم حلول رقمية مبتكرة. نؤمن بقوة التكنولوجيا في تحويل الأفكار إلى واقع رقمي مذهل يحقق أهداف عملائنا.'
                  : 'We are a team of creators and developers specialized in delivering innovative digital solutions. We believe in the power of technology to transform ideas into stunning digital reality that achieves our clients\' goals.'
                }
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 rounded-xl card-glow group cursor-pointer"
                >
                  <feature.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-foreground text-sm">{feature.label}</h4>
                </div>
              ))}
            </div>

            <Link to="/about">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary-hover btn-glow font-semibold px-8 py-6 text-lg group"
              >
                {isRTL ? 'اقرأ المزيد عنا' : 'Learn More About Us'}
                <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
              </Button>
            </Link>
          </div>

          {/* Stats Side */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="card-glow rounded-2xl p-8 text-center stagger-animation"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <div className="text-4xl md:text-5xl font-bold text-primary text-glow-sm mb-2">
                    {stat.value === '24/7' ? stat.value : (
                      <span className="counter-animation" data-target={stat.value}>0</span>
                    )}
                    {stat.suffix}
                  </div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;