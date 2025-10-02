import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  }>>([]);

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
        .limit(2);
      
      if (data) {
        setPortfolio(data);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
    }
  };

  // Fallback projects when no portfolio items are available
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
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'معرض أعمالنا' : 'Our Portfolio'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'اطلع على بعض من أفضل مشاريعنا المميزة' : 'Check out some of our finest featured projects'}
          </p>
        </div>

        {/* Featured Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {displayProjects.map((project, index) => (
            <Card
              key={project.id}
              className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105 stagger-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => {
                if (project.project_type === 'website' && project.project_url) {
                  window.open(project.project_url, '_blank');
                } else {
                  window.location.href = '/portfolio';
                }
              }}
            >
              <div className="relative overflow-hidden">
                {project.image_url ? (
                  <img 
                    src={project.image_url}
                    alt={isRTL ? project.title_ar : project.title_en}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-hero flex items-center justify-center">
                    <div className="text-white text-6xl font-bold opacity-20">
                      {isRTL ? 'مشروع' : 'PROJECT'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-primary p-3 rounded-full hover:scale-110 transition-transform">
                    <ExternalLink className="h-6 w-6" />
                  </button>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {project.category || (isRTL ? 'مشروع' : 'Project')}
                  </span>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {isRTL ? project.title_ar : project.title_en}
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {isRTL ? (project.description_ar || project.title_ar) : (project.description_en || project.title_en)}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/portfolio">
            <Button 
              size="xl" 
              className="group bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              {isRTL ? 'شاهد جميع أعمالنا' : 'View All Our Work'}
              <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreviewSection;