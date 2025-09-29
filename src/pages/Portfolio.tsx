import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, Github, Loader2, Globe, Palette, Camera, 
  FileText, Brush, Smartphone, Film, Link as LinkIcon, Image as ImageIcon
} from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import SeoHead from '@/components/SeoHead';
import Analytics from '@/components/Analytics';
import { usePageTracking } from '@/hooks/usePageTracking';
import { WebsiteDesignRenderer } from '@/components/WebsiteDesignRenderer';

interface PortfolioFile {
  type: 'image' | 'video' | 'pdf' | 'link';
  url: string;
  name: string;
}

const Portfolio = () => {
  usePageTracking(); // Track page views
  const { t, isRTL } = useLanguage();
  const { portfolio, loading, error } = usePortfolio();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null);

  // Check URL for project parameter
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId && portfolio.length > 0) {
      const project = portfolio.find(p => p.id === projectId);
      if (project) {
        setSelectedProject(project);
        // Remove the parameter from URL
        window.history.replaceState({}, '', '/portfolio');
      }
    }
  }, [portfolio]);

  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return Globe;
      case 'branding': return Palette;
      case 'photography': return Camera;
      case 'content': return FileText;
      case 'graphic_design': return Brush;
      case 'mobile_app': return Smartphone;
      case 'video': return Film;
      default: return Globe;
    }
  };

  const getProjectTypeName = (type: string) => {
    const types: Record<string, { ar: string; en: string }> = {
      website: { ar: 'موقع إلكتروني', en: 'Website' },
      branding: { ar: 'هوية بصرية', en: 'Branding' },
      photography: { ar: 'تصوير', en: 'Photography' },
      content: { ar: 'كتابة محتوى', en: 'Content Writing' },
      graphic_design: { ar: 'تصميم جرافيك', en: 'Graphic Design' },
      mobile_app: { ar: 'تطبيق موبايل', en: 'Mobile App' },
      video: { ar: 'فيديو', en: 'Video' },
      other: { ar: 'أخرى', en: 'Other' }
    };
    const typeInfo = types[type] || types.other;
    return isRTL ? typeInfo.ar : typeInfo.en;
  };

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
                {portfolio.map((project, index) => {
                  const TypeIcon = getProjectTypeIcon(project.project_type || 'website');
                  const projectFiles = (project.files as any as PortfolioFile[]) || [];
                  const mainImage = projectFiles.find(f => f.type === 'image')?.url || project.image_url || '/placeholder.svg';
                  
                  return (
                <Card
                  key={project.id}
                  className="group cursor-pointer border-0 shadow-card hover:shadow-glow bg-card-gradient overflow-hidden transition-all duration-300 hover:scale-105"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => {
                    if (project.project_type === 'website' && project.project_url && project.project_url !== '#') {
                      window.open(project.project_url, '_blank');
                    } else {
                      setSelectedProject(project);
                    }
                  }}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={mainImage}
                      alt={isRTL ? project.title_ar : project.title_en}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    {/* Project Logo */}
                    {project.logo_url && (
                      <div className="absolute top-2 left-2">
                        <img 
                          src={project.logo_url} 
                          alt="Logo"
                          className="h-10 w-10 object-contain bg-white/90 rounded-full p-1"
                        />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="gap-1">
                        <TypeIcon className="h-3 w-3" />
                        {getProjectTypeName(project.project_type || 'website')}
                      </Badge>
                    </div>
                    {projectFiles.length > 1 && (
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="secondary">
                          {projectFiles.length} {isRTL ? 'ملف' : 'files'}
                        </Badge>
                      </div>
                    )}
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
                        <CardDescription className="text-muted-foreground mb-4 line-clamp-2">
                          {isRTL ? project.description_ar : project.description_en}
                        </CardDescription>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {project.technologies.length > 3 && (
                              <span className="text-xs text-muted-foreground">
                                +{project.technologies.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">
                  {isRTL ? selectedProject.title_ar : selectedProject.title_en}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Project Type and Category */}
                <div className="flex gap-2 flex-wrap">
                  {React.createElement(getProjectTypeIcon(selectedProject.project_type || 'website'), { 
                    className: "h-5 w-5 inline" 
                  })}
                  <Badge variant="secondary">
                    {getProjectTypeName(selectedProject.project_type || 'website')}
                  </Badge>
                  {selectedProject.category && (
                    <Badge variant="outline">{selectedProject.category}</Badge>
                  )}
                </div>

                {/* Description */}
                {/* Project Logo */}
                {selectedProject.logo_url && (
                  <div className="flex justify-center">
                    <img 
                      src={selectedProject.logo_url} 
                      alt="Project Logo"
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                )}

                <div>
                  <h3 className="font-semibold mb-2">{isRTL ? 'الوصف' : 'Description'}</h3>
                  <p className="text-muted-foreground">
                    {isRTL ? selectedProject.description_ar : selectedProject.description_en}
                  </p>
                </div>

                {/* Files Gallery */}
                {selectedProject.files && (selectedProject.files as any as PortfolioFile[]).length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">{isRTL ? 'الملفات والمرفقات' : 'Files and Attachments'}</h3>
                    <div className="space-y-4">
                      {(selectedProject.files as any as PortfolioFile[]).map((file, index) => (
                        <div key={index} className="space-y-2">
                          {file.type === 'image' && (
                            <div className="space-y-2">
                              <div 
                                className="relative cursor-pointer group overflow-hidden rounded-lg border bg-muted/10"
                                onClick={() => setImageModalUrl(file.url)}
                              >
                                <img 
                                  src={file.url} 
                                  alt={file.name}
                                  className="w-full h-auto object-contain max-h-[70vh] transition-transform duration-300 group-hover:scale-105"
                                  style={{ aspectRatio: 'auto' }}
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                    {isRTL ? 'اضغط للعرض بالحجم الكامل' : 'Click to view full size'}
                                  </div>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground text-center font-medium">{file.name}</p>
                            </div>
                          )}
                          {file.type === 'video' && (
                            <div className="space-y-2">
                              <video 
                                src={file.url} 
                                controls
                                className="w-full h-auto max-h-[70vh] rounded-lg object-contain"
                              />
                              <p className="text-sm text-muted-foreground text-center font-medium">{file.name}</p>
                            </div>
                          )}
                          {file.type === 'pdf' && (
                            <div className="space-y-2">
                              <div className="border rounded-lg overflow-hidden bg-white">
                                <iframe
                                  src={`${file.url}#view=FitH`}
                                  className="w-full h-[80vh]"
                                  title={file.name}
                                  frameBorder="0"
                                />
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground font-medium">{file.name}</p>
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                                >
                                  <FileText className="h-4 w-4" />
                                  {isRTL ? 'فتح في صفحة جديدة' : 'Open in new tab'}
                                </a>
                              </div>
                            </div>
                          )}
                          {file.type === 'link' && (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-4 border rounded-lg hover:bg-muted transition-colors"
                            >
                              <LinkIcon className="h-4 w-4" />
                              <div className="flex-1">
                                <p className="font-medium">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{file.url}</p>
                              </div>
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technologies */}
                {selectedProject.technologies && selectedProject.technologies.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">{isRTL ? 'التقنيات المستخدمة' : 'Technologies Used'}</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech: string, index: number) => (
                        <Badge key={index} variant="outline">{tech}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-3">
                  {selectedProject.project_url && (
                    <Button asChild variant="default">
                      <a href={selectedProject.project_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {isRTL ? 'زيارة المشروع' : 'Visit Project'}
                      </a>
                    </Button>
                  )}
                  {selectedProject.github_url && (
                    <Button asChild variant="outline">
                      <a href={selectedProject.github_url} target="_blank" rel="noopener noreferrer" className="gap-2">
                        <Github className="h-4 w-4" />
                        {isRTL ? 'مشاهدة الكود' : 'View Code'}
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={!!imageModalUrl} onOpenChange={() => setImageModalUrl(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 border-0 bg-transparent shadow-none">
          <div className="relative flex items-center justify-center min-h-[95vh]">
            <img 
              src={imageModalUrl || ''}
              alt="Full size image"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 rounded-full"
              onClick={() => setImageModalUrl(null)}
            >
              ×
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </WebsiteDesignRenderer>
  );
};

export default Portfolio;