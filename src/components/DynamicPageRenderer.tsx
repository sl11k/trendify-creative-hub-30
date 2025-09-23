import { useEffect, useState } from 'react';
import { useWebsiteDesign } from '@/hooks/useWebsiteDesign';
import { Skeleton } from '@/components/ui/skeleton';

interface DragItem {
  id: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section';
  content: string;
  styles: Record<string, string>;
}

interface DynamicPageRendererProps {
  pageSlug: string;
  children?: React.ReactNode;
}

export const DynamicPageRenderer = ({ pageSlug, children }: DynamicPageRendererProps) => {
  const { design, layoutData, isLoading, error } = useWebsiteDesign(pageSlug);
  const [customStyles, setCustomStyles] = useState<HTMLStyleElement | null>(null);

  useEffect(() => {
    // Apply custom CSS
    if (design?.custom_css) {
      const styleElement = document.createElement('style');
      styleElement.textContent = design.custom_css;
      document.head.appendChild(styleElement);
      setCustomStyles(styleElement);

      return () => {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      };
    }
  }, [design?.custom_css]);

  useEffect(() => {
    // Apply custom JavaScript
    if (design?.custom_js) {
      try {
        eval(design.custom_js);
      } catch (error) {
        console.error('Error executing custom JavaScript:', error);
      }
    }
  }, [design?.custom_js]);

  const renderDragItem = (item: DragItem) => {
    const style = Object.entries(item.styles).reduce((acc, [key, value]) => {
      acc[key as any] = value;
      return acc;
    }, {} as React.CSSProperties);

    switch (item.type) {
      case 'text':
        return (
          <div key={item.id} style={style} className="dynamic-text">
            {item.content}
          </div>
        );
      
      case 'image':
        return (
          <img 
            key={item.id}
            src={item.content} 
            alt="Dynamic content"
            style={style}
            className="dynamic-image"
          />
        );
      
      case 'button':
        return (
          <button 
            key={item.id}
            style={style}
            className="dynamic-button"
          >
            {item.content}
          </button>
        );
      
      case 'card':
        return (
          <div 
            key={item.id}
            style={style}
            className="dynamic-card"
          >
            {item.content}
          </div>
        );
      
      case 'section':
        return (
          <section 
            key={item.id}
            style={style}
            className="dynamic-section"
          >
            {item.content}
          </section>
        );
      
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }

  if (error) {
    console.error('Design loading error:', error);
  }

  // If no custom design found, render default children
  if (!design || !layoutData) {
    return <>{children}</>;
  }

  // Render custom design
  return (
    <div className="dynamic-page-content">
      {layoutData.items?.map(renderDragItem)}
      {/* Render children after custom content if they exist */}
      {children}
    </div>
  );
};