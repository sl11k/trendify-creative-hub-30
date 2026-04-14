import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Helper function to ensure URL has protocol
  const ensureProtocol = (url: string | undefined): string | undefined => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
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

  // Filter out empty categories
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
    <WebsiteDesignRenderer pageSlug="portfolio">
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
                  {isRTL ? 'معرض أعمالنا' : 'Our Portfolio'}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {isRTL ? 'استعرض مجموعة من أفضل مشاريعنا والحلول الرقمية المبتكرة التي قدمناها لعملائنا' : 'Explore our finest projects and innovative digital solutions delivered to our clients'}
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

              {/* Portfolio Grid */}
              {filteredPortfolio.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-xl text-muted-foreground">
                    {isRTL ? 'لا توجد مشاريع في هذا القسم' : 'No projects in this category'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredPortfolio.map((project, index) => (
                  <Card
                    key={project.id}
                    className="group border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative overflow-hidden h-64">
                      {(() => {
                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
                        const firstFileImage = project.files && Array.isArray(project.files) && project.files.length > 0 
                          ? project.files
                              .map((f: any) => typeof f === 'string' ? f : f?.url)
                              .find((url: string) => url && imageExtensions.some(ext => url.toLowerCase().endsWith(ext)))
                          : null;
                        
                        const displayImage = firstFileImage || project.image_url;
                        
                        return displayImage ? (
                          <img
                            src={displayImage}
                            alt={isRTL ? project.title_ar : project.title_en}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement?.querySelector('.fallback-bg')?.classList.remove('hidden');
                            }}
                            onClick={() => {
                              if (project.project_type === 'website' && project.project_url) {
                                window.open(ensureProtocol(project.project_url), '_blank');
                              } else {
                                setSelectedProject(project);
                              }
                            }}
                          />
                        ) : null;
                      })()}
                      <div className={`w-full h-full bg-gradient-hero flex items-center justify-center fallback-bg ${
                        (() => {
                          const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
                          const firstFileImage = project.files && Array.isArray(project.files) && project.files.length > 0 
                            ? project.files
                                .map((f: any) => typeof f === 'string' ? f : f?.url)
                                .find((url: string) => url && imageExtensions.some(ext => url.toLowerCase().endsWith(ext)))
                            : null;
                          return (firstFileImage || project.image_url) ? 'hidden' : '';
                        })()
                      }`}>
                        <div className="text-foreground/20 text-6xl font-bold">
                          {isRTL ? 'مشروع' : 'PROJECT'}
                        </div>
                      </div>
                      <div 
                        className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-80 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          if (project.project_type === 'website' && project.project_url) {
                            window.open(ensureProtocol(project.project_url), '_blank');
                          } else {
                            setSelectedProject(project);
                          }
                        }}
                      >
                        <div className="flex space-x-4">
                          {project.project_url && (
                            <a
                              href={ensureProtocol(project.project_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white text-primary p-2 rounded-full hover:scale-110 transition-transform"
                            >
                              <ExternalLink className="h-5 w-5" />
                            </a>
                          )}
                          {project.github_url && (
                            <a
                              href={ensureProtocol(project.github_url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-white text-primary p-2 rounded-full hover:scale-110 transition-transform"
                            >
                              <Github className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      </div>
                      {project.logo_url && (
                        <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
                          <img 
                            src={project.logo_url}
                            alt="Logo"
                            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg bg-white"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'}`}>
                        <span className="bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                          {project.category || (isRTL ? 'مشروع' : 'Project')}
                        </span>
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
              )}
            </div>
          </section>
        </main>
        <Footer />
        
        {selectedImage && (
          <ImagePopup
            imageUrl={selectedImage.url}
            alt={selectedImage.alt}
            onClose={() => setSelectedImage(null)}
          />
        )}

        {selectedProject && (
          <ProjectDetailsPopup
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </WebsiteDesignRenderer>
  );
};

export default Portfolio;