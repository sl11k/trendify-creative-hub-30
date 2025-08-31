import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Target, Users, Award } from 'lucide-react';
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

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
              {isRTL ? 'من نحن' : 'About Us'}
            </h2>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              {isRTL 
                ? 'نحن فريق من المبدعين والمطورين المتخصصين في تقديم حلول رقمية مبتكرة. نؤمن بقوة التكنولوجيا في تحويل الأفكار إلى واقع رقمي مذهل يحقق أهداف عملائنا.'
                : 'We are a team of creators and developers specialized in delivering innovative digital solutions. We believe in the power of technology to transform ideas into stunning digital reality that achieves our clients\' goals.'
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
                <Target className="h-8 w-8 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">{isRTL ? 'رؤيتنا' : 'Our Vision'}</h4>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                <Users className="h-8 w-8 text-secondary mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">{isRTL ? 'فريقنا' : 'Our Team'}</h4>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/5 hover:bg-accent/10 transition-colors">
                <Award className="h-8 w-8 text-accent mx-auto mb-2" />
                <h4 className="font-semibold text-foreground">{isRTL ? 'إنجازاتنا' : 'Our Awards'}</h4>
              </div>
            </div>

            <Link to="/about">
              <Button 
                size="lg" 
                className="group bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105"
              >
                {isRTL ? 'اقرأ المزيد عنا' : 'Learn More About Us'}
                <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
              </Button>
            </Link>
          </div>

          {/* Visual Side */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative z-10 bg-gradient-hero rounded-2xl p-8 text-white shadow-hero">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 counter-animation" data-target="99">0%</div>
                  <div className="text-sm text-white/80">{isRTL ? 'رضا العملاء' : 'Client Satisfaction'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 counter-animation" data-target="500">0+</div>
                  <div className="text-sm text-white/80">{isRTL ? 'مشروع ناجح' : 'Successful Projects'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">24/7</div>
                  <div className="text-sm text-white/80">{isRTL ? 'الدعم الفني' : 'Technical Support'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2 counter-animation" data-target="5">0+</div>
                  <div className="text-sm text-white/80">{isRTL ? 'سنوات خبرة' : 'Years Experience'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreviewSection;