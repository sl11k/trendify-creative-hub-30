import { useEffect, useState } from 'react';
import { useWebsiteDesign } from '@/hooks/useWebsiteDesign';

interface DragItem {
  id: string;
  type: 'text' | 'image' | 'button' | 'card' | 'section';
  content: string;
  styles: Record<string, string>;
}

interface WebsiteDesignRendererProps {
  pageSlug: string;
  children?: React.ReactNode;
}

export const WebsiteDesignRenderer = ({ pageSlug, children }: WebsiteDesignRendererProps) => {
  const { design, layoutData, isLoading, error } = useWebsiteDesign(pageSlug);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !design) return;

    // Apply custom CSS
    let styleElement: HTMLStyleElement | null = null;
    if (design.custom_css) {
      styleElement = document.createElement('style');
      styleElement.textContent = design.custom_css;
      styleElement.setAttribute('data-custom-css', pageSlug);
      document.head.appendChild(styleElement);
    }

    // Apply custom JavaScript
    if (design.custom_js) {
      try {
        const script = document.createElement('script');
        script.textContent = `(function() { ${design.custom_js} })()`;
        script.setAttribute('data-custom-js', pageSlug);
        document.body.appendChild(script);
        
        return () => {
          if (styleElement?.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
          }
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        };
      } catch (error) {
        console.error('Error executing custom JavaScript:', error);
      }
    }

    return () => {
      if (styleElement?.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [design, pageSlug, isClient]);

  const renderDragItem = (item: DragItem) => {
    const style = Object.entries(item.styles).reduce((acc, [key, value]) => {
      // Convert CSS properties to camelCase for React
      const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
      acc[camelKey as any] = value;
      return acc;
    }, {} as React.CSSProperties);

    const commonProps = {
      key: item.id,
      style,
      className: `dynamic-${item.type}`,
      'data-item-id': item.id
    };

    switch (item.type) {
      case 'text':
        return (
          <div {...commonProps}>
            {item.content}
          </div>
        );
      
      case 'image':
        return (
          <img 
            {...commonProps}
            src={item.content} 
            alt="Dynamic content"
          />
        );
      
      case 'button':
        return (
          <button {...commonProps}>
            {item.content}
          </button>
        );
      
      case 'card':
        return (
          <div {...commonProps}>
            {item.content}
          </div>
        );
      
      case 'section':
        return (
          <section {...commonProps}>
            {item.content}
          </section>
        );
      
      default:
        return null;
    }
  };

  // If no custom design found or design is not active, render default children
  if (isLoading || error || !design || !design.is_active || !layoutData) {
    return <>{children}</>;
  }

  // If custom design has items, render them instead of children
  if (layoutData.items && layoutData.items.length > 0) {
    return (
      <div className="dynamic-page-content" data-page-slug={pageSlug}>
        {layoutData.items.map(renderDragItem)}
      </div>
    );
  }

  // Fallback to children if no items
  return <>{children}</>;
};