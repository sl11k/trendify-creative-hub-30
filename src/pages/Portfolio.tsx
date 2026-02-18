import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Github, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { WebsiteDesignRenderer } from '@/components/WebsiteDesignRenderer';
import { ImagePopup } from '@/components/ui/image-popup';
import { ProjectDetailsPopup } from '@/components/ui/project-details-popup';

const Portfolio = () => {
  usePageTracking();
  const { t, isRTL } = useLanguage();
  const { portfolio, loading, error } = usePortfolio();
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const ensureProtocol = (url: string | undefined): string | undefined => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `https://${url}`;
  };

  const allCategories = [
    { value: 'all', label_ar: 'جميع الأعمال', label_en: 'All Works' },
    { value: 'المواقع الإلكترونية', label_ar: 'المواقع الإلكترونية', label_en: 'Websites' },
    { value: 'المتاجر الإلكترونية', label_ar: 'المتاجر الإلكترونية', label_en: 'E-Stores' },
    { value: 'الحلول التقنية', label_ar: 'الحلول التقنية', label_en: 'Tech Solutions' },
    { value: 'التصميم', label_ar: 'التصميم', label_en: 'Design' },
    { value: 'التصوير', label_ar: 'التصوير', label_en: 'Photography' },
    { value: 'الهوية البصرية', label_ar: 'الهوية البصرية', label_en: 'Branding' },
    { value: 'المحتوى', label_ar: 'المحتوى', label_en: 'Content' },
  ];

  const categories = allCategories.filter(category => {
    if (category.value === 'all') return true;
    return portfolio.some(project => project.category === category.value);
  });

  const filteredPortfolio = selectedCategory === 'all' 
    ? portfolio 
    : portfolio.filter(project => project.category === selectedCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <SeoHead lang="ar" />
        <Analytics />
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 py-20">
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
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
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <WebsiteDesignRenderer pageSlug="portfolio">
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
                  {isRTL ? 'أعمالنا' : 'OUR WORK'}
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-6">
                  {isRTL ? 'معرض أعمالنا' : 'Our Portfolio'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {isRTL ? 'استعرض مجموعة من أفضل مشاريعنا والحلول الرقمية المبتكرة' : 'Explore our finest projects and innovative digital solutions'}
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

              {/* Portfolio Grid */}
              {filteredPortfolio.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">
                    {isRTL ? 'لا توجد مشاريع في هذا القسم' : 'No projects in this category'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPortfolio.map((project) => {
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
                            setSelectedProject(project);
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
                          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/60 transition-colors duration-300 flex items-center justify-center gap-3">
                            {project.project_url && (
                              <a
                                href={ensureProtocol(project.project_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background text-foreground p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            {project.github_url && (
                              <a
                                href={ensureProtocol(project.github_url)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="bg-background text-foreground p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                          {project.logo_url && (
                            <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                              <img 
                                src={project.logo_url}
                                alt="Logo"
                                className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-sm bg-background"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                        
                        <CardContent className="p-6">
                          {project.category && (
                            <span className="text-xs font-semibold text-primary mb-2 block">
                              {project.category}
                            </span>
                          )}
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                            {isRTL ? project.title_ar : project.title_en}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {isRTL ? project.description_ar : project.description_en}
                          </p>
                          {project.technologies && project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((tag, tagIndex) => (
                                <span key={tagIndex} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
        
        {selectedImage && (
          <ImagePopup imageUrl={selectedImage.url} alt={selectedImage.alt} onClose={() => setSelectedImage(null)} />
        )}
        {selectedProject && (
          <ProjectDetailsPopup project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Portfolio;
