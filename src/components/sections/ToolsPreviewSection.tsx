import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, Wrench } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTools } from '@/hooks/useTools';
import * as LucideIcons from 'lucide-react';

// Helper function to get icon component by name
const getIconComponent = (iconName: string | null) => {
  if (!iconName) return Wrench;
  const IconComponent = (LucideIcons as any)[iconName];
  return IconComponent || Wrench;
};

const ToolsPreviewSection = () => {
  const { isRTL, t } = useLanguage();
  const { tools, loading, error } = useTools();

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل الأدوات...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Show only first 3 tools for preview
  const previewTools = tools.slice(0, 3);

  if (previewTools.length === 0) {
    return null; // Don't show section if no tools
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient-primary mb-6">
            {isRTL ? 'أدواتنا المفيدة' : 'Our Useful Tools'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            {isRTL 
              ? 'مجموعة من الأدوات المتخصصة التي نوفرها لمساعدتك في تحقيق أهدافك الرقمية'
              : 'A collection of specialized tools we provide to help you achieve your digital goals'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {previewTools.map((tool, index) => {
            const IconComponent = getIconComponent(tool.icon_name);
            const gradients = [
              'from-blue-500 to-purple-600',
              'from-green-500 to-teal-600',
              'from-orange-500 to-red-600'
            ];
            
            return (
              <Card 
                key={tool.id} 
                className="group hover:shadow-glow transition-all duration-300 transform hover:scale-105 animate-fade-in border-0 bg-card/50 backdrop-blur-sm"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${gradients[index % gradients.length]} p-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                    {isRTL ? tool.name_ar : tool.name_en}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {isRTL ? tool.description_ar : tool.description_en}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      {isRTL ? tool.category_ar || 'أداة' : tool.category_en || 'Tool'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(tool.url, '_blank')}
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  >
                    {isRTL ? 'استخدم الأداة' : 'Use Tool'}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA to view all tools */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <Link to="/tools">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 transform hover:scale-105 shadow-glow font-semibold px-8 py-4"
            >
              {isRTL ? 'استكشف جميع أدواتنا' : 'Explore All Our Tools'}
              <ArrowRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'mr-2 rotate-180' : 'ml-2'}`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToolsPreviewSection;