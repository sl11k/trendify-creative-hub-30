import { X, ExternalLink, Github } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from './badge';
import { Button } from './button';
import { ImagePopup } from './image-popup';

interface ProjectDetailsPopupProps {
  project: {
    id: string;
    title_ar: string;
    title_en: string;
    description_ar?: string;
    description_en?: string;
    image_url?: string;
    logo_url?: string;
    project_url?: string;
    github_url?: string;
    category?: string;
    technologies?: string[];
    files?: any[];
    project_type?: string;
  };
  onClose: () => void;
}

export const ProjectDetailsPopup = ({ project, onClose }: ProjectDetailsPopupProps) => {
  const { isRTL } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const allImages = [
    ...(project.image_url ? [project.image_url] : []),
    ...(project.files?.map((f: any) => f.url || f) || [])
  ].filter(Boolean);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto p-4"
        onClick={onClose}
      >
        <div 
          className="relative w-full max-w-4xl bg-background rounded-lg shadow-2xl my-8"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start gap-4 mb-4">
                {project.logo_url && (
                  <img
                    src={project.logo_url}
                    alt="Logo"
                    className="w-16 h-16 object-contain rounded-lg border border-border"
                    loading="lazy"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                    {isRTL ? project.title_ar : project.title_en}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {project.category && (
                      <Badge variant="default">
                        {project.category}
                      </Badge>
                    )}
                    {project.project_type && (
                      <Badge variant="outline">
                        {isRTL 
                          ? project.project_type === 'branding' ? 'هوية بصرية'
                          : project.project_type === 'content' ? 'محتوى'
                          : project.project_type === 'photography' ? 'تصوير'
                          : project.project_type === 'design' ? 'تصميم'
                          : 'موقع'
                          : project.project_type
                        }
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {(project.description_ar || project.description_en) && (
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {isRTL ? project.description_ar : project.description_en}
                </p>
              )}
            </div>

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  {isRTL ? 'التقنيات المستخدمة' : 'Technologies Used'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Images Gallery */}
            {allImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  {isRTL ? 'معرض الصور' : 'Image Gallery'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {allImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group border border-border hover:border-primary transition-all"
                      onClick={() => setSelectedImage({
                        url: imageUrl,
                        alt: `${isRTL ? project.title_ar : project.title_en} - ${index + 1}`
                      })}
                    >
                      <img
                        src={imageUrl}
                        alt={`Image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/90 p-2 rounded-full">
                            <ExternalLink className="h-5 w-5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {project.project_url && (
                <Button
                  asChild
                  className="gap-2"
                >
                  <a
                    href={project.project_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {isRTL ? 'زيارة المشروع' : 'Visit Project'}
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button
                  asChild
                  variant="outline"
                  className="gap-2"
                >
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4" />
                    {isRTL ? 'GitHub' : 'GitHub'}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedImage && (
        <ImagePopup
          imageUrl={selectedImage.url}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
};
