import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useTools } from '@/hooks/useTools';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { WebsiteDesignRenderer } from '@/components/WebsiteDesignRenderer';

const Tools = () => {
  usePageTracking();
  const { t, isRTL } = useLanguage();
  const { tools, loading, error } = useTools();
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const allCategories = Array.from(
    new Set(tools.map(tool => isRTL ? tool.category_ar : tool.category_en).filter(Boolean))
  ).sort();

  const categories = [
    { value: 'all', label_ar: 'جميع الأدوات', label_en: 'All Tools' },
    ...allCategories.map(cat => ({ value: cat, label_ar: cat, label_en: cat }))
  ];

  const filteredTools = selectedCategory === 'all' 
    ? tools 
    : tools.filter(tool => {
        const toolCategory = isRTL ? tool.category_ar : tool.category_en;
        return toolCategory === selectedCategory;
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-destructive text-sm">{error}</p>
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
          <section className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Page Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-4">
                  {isRTL ? 'أدواتنا' : 'OUR TOOLS'}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                  {isRTL ? 'أدوات مميزة' : 'Premium Tools'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {isRTL ? 'مجموعة من الأدوات المميزة لمساعدة المتاجر والتجار' : 'A collection of premium tools to help stores and merchants'}
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      selectedCategory === category.value
                        ? 'bg-foreground text-background'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {isRTL ? category.label_ar : category.label_en}
                  </button>
                ))}
              </div>

              {/* Tools Grid */}
              {filteredTools.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">
                    {isRTL ? 'لا توجد أدوات في هذا القسم' : 'No tools in this category'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTools.map((tool) => (
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
                        <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                          {isRTL ? tool.description_ar : tool.description_en}
                        </p>
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {isRTL ? 'تجربة الأداة' : 'Try Tool'}
                        </a>
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
