import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const PortfolioPreviewSection = () => {
  const { isRTL } = useLanguage();
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
    {
      id: '1',
      title_ar: 'متجر إلكتروني متقدم',
      title_en: 'Advanced E-commerce Platform',
      description_ar: 'منصة تجارة إلكترونية شاملة مع نظام دفع آمن',
      description_en: 'Complete e-commerce platform with secure payment',
      image_url: null,
      project_url: '#',
      category: isRTL ? 'تطوير الويب' : 'Web Development'
    },
    {
      id: '2',
      title_ar: 'هوية بصرية للشركات',
      title_en: 'Corporate Brand Identity',
      description_ar: 'تصميم هوية بصرية متكاملة للعلامات التجارية',
      description_en: 'Complete visual identity design for brands',
      image_url: null,
      project_url: '#',
      category: isRTL ? 'التصميم' : 'Design'
    }
  ];

  const displayProjects = portfolio.length > 0 ? portfolio : fallbackProjects;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'أعمالنا' : 'SUCCESS STORIES'}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {isRTL ? 'بعض دراسات الحالة' : 'A Few Case Studies'}
          </h2>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {displayProjects.map((project) => {
            const firstImage = project.files && Array.isArray(project.files) && project.files.length > 0 
              ? (typeof project.files[0] === 'string' ? project.files[0] : project.files[0]?.url)
              : project.image_url;

            return (
              <Card
                key={project.id}
                className="group cursor-pointer border border-border/50 bg-background hover:border-primary/30 transition-all duration-300 overflow-hidden"
                onClick={() => {
                  if (project.project_type === 'website' && project.project_url) {
                    window.open(ensureProtocol(project.project_url), '_blank');
                  } else {
                    window.location.href = '/portfolio';
                  }
                }}
              >
                <div className="relative overflow-hidden aspect-video">
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={isRTL ? project.title_ar : project.title_en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-4xl font-bold text-muted-foreground/20">
                        {isRTL ? 'مشروع' : 'PROJECT'}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors duration-300 flex items-center justify-center">
                    <ExternalLink className="h-6 w-6 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                
                <CardContent className="p-6">
                  {project.category && (
                    <span className="text-xs font-semibold text-primary mb-2 block">
                      {project.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {isRTL ? project.title_ar : project.title_en}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {isRTL ? (project.description_ar || project.title_ar) : (project.description_en || project.title_en)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link 
            to="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {isRTL ? 'شاهد جميع أعمالنا' : 'View all our work'}
            <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreviewSection;
