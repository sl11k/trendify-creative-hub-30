import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
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

interface AdvancedSeoHeadProps {
  lang?: string;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
  articleData?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
}

export const AdvancedSeoHead: React.FC<AdvancedSeoHeadProps> = ({ 
  lang = 'ar',
  customTitle,
  customDescription,
  customImage,
  articleData
}) => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SeoData | null>(null);

  useEffect(() => {
    const loadSeoData = async () => {
      try {
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
          case '/tools':
            pageSlug = 'tools';
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

  const isArabic = lang === 'ar';
  const title = customTitle || (isArabic ? seoData?.title_ar : seoData?.title_en) || 'Trendify - AI Business Solutions';
  const description = customDescription || (isArabic ? seoData?.description_ar : seoData?.description_en) || 'AI-Powered Digital Transformation';
  const keywords = isArabic ? seoData?.keywords_ar : seoData?.keywords_en;
  const canonicalUrl = seoData?.canonical_url || `https://trendify.com${location.pathname}`;
  const ogImage = customImage || seoData?.og_image_url || 'https://trendify.com/og-image.jpg';

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <html lang={lang} dir={isArabic ? 'rtl' : 'ltr'} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Alternate Language URLs */}
      <link rel="alternate" hrefLang="ar" href={`${canonicalUrl}?lang=ar`} />
      <link rel="alternate" hrefLang="en" href={`${canonicalUrl}?lang=en`} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={articleData ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Trendify" />
      <meta property="og:locale" content={isArabic ? 'ar_SA' : 'en_US'} />
      <meta property="og:locale:alternate" content={isArabic ? 'en_US' : 'ar_SA'} />

      {/* Article specific tags */}
      {articleData && (
        <>
          <meta property="article:published_time" content={articleData.publishedTime} />
          <meta property="article:modified_time" content={articleData.modifiedTime} />
          <meta property="article:author" content={articleData.author || 'Trendify Team'} />
          {articleData.section && <meta property="article:section" content={articleData.section} />}
          {articleData.tags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@trendify" />
      <meta name="twitter:site" content="@trendify" />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="author" content="Trendify" />
      <meta name="publisher" content="Trendify" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="general" />
      <meta name="distribution" content="global" />
      
      {/* Geo Tags */}
      <meta name="geo.region" content="SA" />
      <meta name="geo.placename" content="Saudi Arabia" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Trendify" />
      
      {/* Theme Color */}
      <meta name="theme-color" content="#6366f1" />
      <meta name="msapplication-TileColor" content="#6366f1" />
      
      {/* Verification Tags - Add your actual verification codes */}
      {/* <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" /> */}
      {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}
      
      {/* DNS Prefetch for Performance */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    </Helmet>
  );
};

export default AdvancedSeoHead;
