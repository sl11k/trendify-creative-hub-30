import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SeoData {
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  keywords_ar?: string[];
  keywords_en?: string[];
  canonical_url?: string;
  og_image_url?: string;
}

interface SeoHeadProps {
  lang?: string;
}

const SeoHead: React.FC<SeoHeadProps> = ({ lang = 'ar' }) => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SeoData | null>(null);

  useEffect(() => {
    const loadSeoData = async () => {
      try {
        // Map route paths to page slugs
        let pageSlug = 'home';
        switch (location.pathname) {
          case '/':
            pageSlug = 'home';
            break;
          case '/about':
            pageSlug = 'about';
            break;
          case '/services':
            pageSlug = 'services';
            break;
          case '/portfolio':
            pageSlug = 'portfolio';
            break;
          case '/blog':
            pageSlug = 'blog';
            break;
          case '/contact':
            pageSlug = 'contact';
            break;
          default:
            pageSlug = 'home';
        }

        const { data } = await supabase
          .from('page_seo')
          .select('*')
          .eq('page_slug', pageSlug)
          .single();

        if (data) {
          setSeoData(data);
        }
      } catch (error) {
        console.error('Error loading SEO data:', error);
      }
    };

    loadSeoData();
  }, [location.pathname]);

  useEffect(() => {
    if (!seoData) return;

    const isArabic = lang === 'ar';
    
    // Update title
    const title = isArabic ? seoData.title_ar : seoData.title_en;
    if (title) {
      document.title = title;
    }

    // Update meta description
    const description = isArabic ? seoData.description_ar : seoData.description_en;
    let descriptionMeta = document.querySelector('meta[name="description"]');
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.setAttribute('name', 'description');
      document.head.appendChild(descriptionMeta);
    }
    if (description) {
      descriptionMeta.setAttribute('content', description);
    }

    // Update keywords
    const keywords = isArabic ? seoData.keywords_ar : seoData.keywords_en;
    let keywordsMeta = document.querySelector('meta[name="keywords"]');
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsMeta);
    }
    if (keywords && keywords.length > 0) {
      keywordsMeta.setAttribute('content', keywords.join(', '));
    }

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    const canonicalUrl = seoData.canonical_url || window.location.href;
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let ogTag = document.querySelector(`meta[property="${property}"]`);
      if (!ogTag) {
        ogTag = document.createElement('meta');
        ogTag.setAttribute('property', property);
        document.head.appendChild(ogTag);
      }
      ogTag.setAttribute('content', content);
    };

    if (title) updateOgTag('og:title', title);
    if (description) updateOgTag('og:description', description);
    updateOgTag('og:url', canonicalUrl);
    updateOgTag('og:type', 'website');
    if (seoData.og_image_url) updateOgTag('og:image', seoData.og_image_url);

    // Update Twitter Card tags
    const updateTwitterTag = (name: string, content: string) => {
      let twitterTag = document.querySelector(`meta[name="${name}"]`);
      if (!twitterTag) {
        twitterTag = document.createElement('meta');
        twitterTag.setAttribute('name', name);
        document.head.appendChild(twitterTag);
      }
      twitterTag.setAttribute('content', content);
    };

    updateTwitterTag('twitter:card', 'summary_large_image');
    if (title) updateTwitterTag('twitter:title', title);
    if (description) updateTwitterTag('twitter:description', description);
    if (seoData.og_image_url) updateTwitterTag('twitter:image', seoData.og_image_url);

  }, [seoData, lang]);

  return null; // This component only handles side effects
};

export default SeoHead;