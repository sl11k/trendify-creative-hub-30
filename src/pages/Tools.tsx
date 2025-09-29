import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTools } from '@/hooks/useTools';
import * as Icons from 'lucide-react';

const Tools = () => {
  usePageTracking();
  const { language } = useLanguage();
  const { tools, loading, error } = useTools();

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <ExternalLink className="w-6 h-6" />;
    
    try {
      const IconComponent = (Icons as any)[iconName];
      if (IconComponent && typeof IconComponent === 'function') {
        return React.createElement(IconComponent, { className: "w-6 h-6" });
      }
      return <ExternalLink className="w-6 h-6" />;
    } catch {
      return <ExternalLink className="w-6 h-6" />;
    }
  };

  // Handle error state
  if (error) {
    console.error('Tools loading error:', error);
  }

  const groupedTools = (tools || []).reduce((acc, tool) => {
    const category = language === 'ar' ? (tool.category_ar || 'أدوات عامة') : (tool.category_en || 'General Tools');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  return (
    <div className="min-h-screen bg-background">
      <SeoHead lang={language} />
      <Analytics />
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-primary text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {language === 'ar' ? 'أدواتنا' : 'Our Tools'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
              {language === 'ar' 
                ? 'مجموعة من الأدوات المجانية والمفيدة لتساعدك في تطوير عملك وتحسين أدائك'
                : 'A collection of free and useful tools to help you develop your business and improve your performance'
              }
            </p>
          </div>
        </section>

        {/* Tools Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  {language === 'ar' ? 'جاري تحميل الأدوات...' : 'Loading tools...'}
                </p>
              </div>
            ) : !tools || tools.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-2xl font-bold text-muted-foreground mb-4">
                  {language === 'ar' ? 'لا توجد أدوات متاحة حالياً' : 'No tools available at the moment'}
                </h3>
                <p className="text-muted-foreground">
                  {language === 'ar' ? 'سيتم إضافة أدوات جديدة قريباً' : 'New tools will be added soon'}
                </p>
              </div>
            ) : (
              Object.entries(groupedTools).map(([category, categoryTools]) => (
                <div key={category} className="mb-16">
                  <h2 className="text-3xl font-bold text-center mb-12 text-gradient-primary">
                    {category}
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categoryTools.map((tool) => (
                      <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              {renderIcon(tool.icon_name)}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2">
                                {language === 'ar' ? tool.name_ar : tool.name_en}
                              </h3>
                              <p className="text-muted-foreground leading-relaxed">
                                {language === 'ar' ? tool.description_ar : tool.description_en}
                              </p>
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                            variant="outline"
                            onClick={() => window.open(tool.url, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {language === 'ar' ? 'استخدم الأداة' : 'Use Tool'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Tools;