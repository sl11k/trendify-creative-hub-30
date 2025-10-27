import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { WebsiteDesignRenderer } from '@/components/WebsiteDesignRenderer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Tools = () => {
  usePageTracking();
  const { t, isRTL } = useLanguage();
  const { tools, loading, error } = useTools();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  // Get all unique categories
  const allCategories = Array.from(
    new Set(
      tools.map(tool => isRTL ? tool.category_ar : tool.category_en).filter(Boolean)
    )
  ).sort();

  const categories = [
    { value: 'all', label_ar: 'جميع الأدوات', label_en: 'All Tools' },
    ...allCategories.map(cat => ({
      value: cat,
      label_ar: cat,
      label_en: cat
    }))
  ];

  // Filter tools based on selected category
  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => {
        const toolCategory = isRTL ? tool.category_ar : tool.category_en;
        return toolCategory === selectedCategory;
      });

  // Group filtered tools by category
  const groupedTools = filteredTools.reduce((acc, tool) => {
    const category = isRTL ? (tool.category_ar || 'أخرى') : (tool.category_en || 'Other');
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(tool);
    return acc;
  }, {} as Record<string, typeof tools>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="mr-2">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="text-center">
              <p className="text-destructive">{error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <WebsiteDesignRenderer pageSlug="tools">
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Page Header */}
              <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary mb-6">
                  {isRTL ? 'أدواتنا المميزة' : 'Our Premium Tools'}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {isRTL ? 'مجموعة من الأدوات المميزة لمساعدة المتاجر والتجار على تطوير أعمالهم' : 'A collection of premium tools to help stores and merchants grow their business'}
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-300 ${
                      selectedCategory === category.value
                        ? 'bg-primary text-primary-foreground shadow-glow scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
                    }`}
                  >
                    {isRTL ? category.label_ar : category.label_en}
                  </button>
                ))}
              </div>

              {/* Tools Grid */}
              {filteredTools.length === 0 ? (
                <div className="text-center py-20">
                  <ExternalLink className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    {isRTL ? 'لا توجد أدوات في هذا القسم' : 'No tools in this category'}
                  </h3>
                  <p className="text-muted-foreground">
                    {isRTL ? 'تحقق مرة أخرى قريباً' : 'Check back soon'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredTools.map((tool, index) => (
                    <Card
                      key={tool.id}
                      className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          {(tool.category_ar || tool.category_en) && (
                            <Badge variant="outline" className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                              {isRTL ? tool.category_ar : tool.category_en}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                          {isRTL ? tool.name_ar : tool.name_en}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent>
                        <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                          {isRTL ? tool.description_ar : tool.description_en}
                        </CardDescription>
                        
                        <Button
                          asChild
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
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Tools;
