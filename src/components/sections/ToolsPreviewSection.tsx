import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
      if (data) setTools(data);
    } catch (error) {
      console.error('Error loading tools:', error);
    }
  };

  if (tools.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
            {isRTL ? 'أدواتنا' : 'OUR TOOLS'}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
            {isRTL ? 'أدوات مميزة لمساعدتك' : 'Premium Tools to Help You'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {tools.map((tool) => (
            <Card
              key={tool.id}
              className="group border border-border/50 bg-background hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="p-8">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {isRTL ? tool.name_ar : tool.name_en}
                </h3>
                {(tool.category_ar || tool.category_en) && (
                  <span className="text-xs font-medium text-primary mb-3 block">
                    {isRTL ? tool.category_ar : tool.category_en}
                  </span>
                )}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                  {isRTL ? tool.description_ar : tool.description_en}
                </p>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
                >
                  <ExternalLink className="h-4 w-4" />
                  {isRTL ? 'تجربة الأداة' : 'Try Tool'}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
          >
            {isRTL ? 'شاهد جميع الأدوات' : 'View all tools'}
            <ArrowRight className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToolsPreviewSection;
