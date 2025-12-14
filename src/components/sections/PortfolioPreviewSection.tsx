import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const PortfolioPreviewSection = () => {
  const { t, isRTL } = useLanguage();
  const [portfolio, setPortfolio] = useState<Array<{
    id: string;
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    image_url?: string;
    project_url?: string;
    project_type?: string;
    category?: string;
    logo_url?: string;
    files?: any;
  }>>([]);

  const ensureProtocol = (url: string | undefined): string | undefined => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      if (data) setPortfolio(data);
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  const fallbackProjects = [
    { id: '1', title_ar: 'متجر إلكتروني متقدم', title_en: 'Advanced E-commerce', description_ar: 'منصة تجارة إلكترونية شاملة', description_en: 'Complete e-commerce platform', category: isRTL ? 'تطوير الويب' : 'Web Development' },
    { id: '2', title_ar: 'هوية بصرية للشركات', title_en: 'Corporate Brand Identity', description_ar: 'تصميم هوية بصرية متكاملة', description_en: 'Complete visual identity design', category: isRTL ? 'التصميم' : 'Design' },
  ];

  const displayProjects = portfolio.length > 0 ? portfolio : fallbackProjects;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-20" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">{isRTL ? 'أعمالنا' : 'Our '}</span>
            <span className="text-primary text-glow">{isRTL ? '' : 'Work'}</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'اطلع على بعض من أفضل مشاريعنا المميزة' : 'Check out some of our finest featured projects'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {displayProjects.slice(0, 3).map((project, index) => {
            const firstImage = project.files && Array.isArray(project.files) && project.files.length > 0 
              ? (typeof project.files[0] === 'string' ? project.files[0] : project.files[0]?.url)
              : project.image_url;
            
            return (
              <div
                key={project.id}
                className="group card-glow rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] stagger-animation cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => project.project_url ? window.open(ensureProtocol(project.project_url), '_blank') : null}
              >
                <div className="relative h-48 overflow-hidden">
                  {firstImage ? (
                    <img src={firstImage} alt={isRTL ? project.title_ar : project.title_en} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/20">{(isRTL ? project.title_ar : project.title_en).charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border border-primary bg-primary/10 flex items-center justify-center">
                      <ExternalLink className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <span className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full`}>
                    {project.category || (isRTL ? 'مشروع' : 'Project')}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {isRTL ? project.title_ar : project.title_en}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {isRTL ? project.description_ar : project.description_en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/portfolio">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary-hover btn-glow font-semibold px-8 py-6 text-lg group">
              {isRTL ? 'شاهد جميع أعمالنا' : 'View All Work'}
              <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreviewSection;