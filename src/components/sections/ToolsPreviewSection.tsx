import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const ToolsPreviewSection = () => {
  const { isRTL } = useLanguage();
  const [tools, setTools] = useState<Array<{
    id: string;
    name_ar: string;
    name_en: string;
    description_ar: string;
    description_en: string;
    url: string;
    category_ar?: string;
    category_en?: string;
  }>>([]);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const { data } = await (supabase as any)
        .from('tools')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })
        .limit(3);
      
      if (data) {
        setTools(data);
      }
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  // لا تعرض القسم إذا لم يكن هناك أدوات
  if (tools.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'أدواتنا المميزة' : 'Our Premium Tools'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {isRTL ? 'مجموعة من الأدوات المميزة لمساعدتك' : 'A collection of premium tools to help you'}
          </p>
        </div>

        {/* Tools Grid - 2 columns on mobile, 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {tools.map((tool, index) => (
            <Card
              key={tool.id}
              className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {isRTL ? tool.name_ar : tool.name_en}
                </CardTitle>
                {(tool.category_ar || tool.category_en) && (
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full w-fit">
                    {isRTL ? tool.category_ar : tool.category_en}
                  </span>
                )}
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
                  {isRTL ? tool.description_ar : tool.description_en}
                </CardDescription>
                
                <Button
                  asChild
                  size="sm"
                  className="w-full gap-2 bg-gradient-primary hover:bg-gradient-secondary transition-all"
                >
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {isRTL ? 'تجربة الأداة' : 'Try Tool'}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link to="/tools">
            <Button 
              size="xl" 
              className="group bg-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              {isRTL ? 'شاهد جميع الأدوات' : 'View All Tools'}
              <ArrowRight className={`ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 ml-0 mr-2 group-hover:-translate-x-1' : ''}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToolsPreviewSection;
