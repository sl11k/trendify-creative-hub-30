import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';

const Portfolio = () => {
  usePageTracking(); // Track page views
  const { t, isRTL } = useLanguage();
  const { portfolio, loading, error } = usePortfolio();

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
    <div className="min-h-screen bg-background">
      <SeoHead lang="ar" />
      <Analytics />
      <Header />
      <main className="pt-16">
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gradient-primary mb-6">
                {isRTL ? 'معرض أعمالنا' : 'Our Portfolio'}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                {isRTL ? 'استعرض مجموعة من أفضل مشاريعنا والحلول الرقمية المبتكرة التي قدمناها لعملائنا' : 'Explore our finest projects and innovative digital solutions delivered to our clients'}
              </p>
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((project, index) => (
                <Card
                  key={project.id}
                  className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={project.image_url || '/placeholder.svg'}
                      alt={isRTL ? project.title_ar : project.title_en}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-4">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-primary p-2 rounded-full hover:scale-110 transition-transform"
                          >
                            <ExternalLink className="h-5 w-5" />
                          </a>
                        )}
                        <button className="bg-white text-primary p-2 rounded-full hover:scale-110 transition-transform">
                          <Github className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        {project.category || (isRTL ? 'مشروع' : 'Project')}
                      </span>
                    </div>
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                      {isRTL ? project.title_ar : project.title_en}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-muted-foreground mb-4">
                      {isRTL ? project.description_ar : project.description_en}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies?.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;