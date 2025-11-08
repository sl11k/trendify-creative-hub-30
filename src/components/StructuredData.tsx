import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'organization' | 'website' | 'service' | 'article' | 'breadcrumb' | 'faq';
  data?: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Trendify",
          "alternateName": "ترينديفاي",
          "url": "https://trendify.com",
          "logo": "https://trendify.com/logo.png",
          "description": "Trendify - AI-Powered Business Solutions & Digital Transformation Partner in Saudi Arabia",
          "foundingDate": "2024",
          "founders": [{
            "@type": "Person",
            "name": "Trendify Team"
          }],
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "SA",
            "addressRegion": "Saudi Arabia"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "availableLanguage": ["Arabic", "English"]
          },
          "sameAs": [
            "https://twitter.com/trendify",
            "https://linkedin.com/company/trendify",
            "https://instagram.com/trendify"
          ],
          "areaServed": {
            "@type": "Country",
            "name": "Saudi Arabia"
          },
          "knowsAbout": [
            "Artificial Intelligence",
            "Digital Transformation",
            "Business Solutions",
            "Web Development",
            "Mobile Apps",
            "AI Marketing",
            "Data Analytics"
          ]
        };

      case 'website':
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Trendify",
          "alternateName": "ترينديفاي",
          "url": "https://trendify.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://trendify.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Trendify",
            "logo": {
              "@type": "ImageObject",
              "url": "https://trendify.com/logo.png"
            }
          },
          "inLanguage": ["ar", "en"]
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "AI-Powered Business Solutions & Digital Transformation",
          "provider": {
            "@type": "Organization",
            "name": "Trendify",
            "url": "https://trendify.com"
          },
          "areaServed": {
            "@type": "Country",
            "name": "Saudi Arabia"
          },
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Digital Services",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "AI-Powered Business Solutions",
                  "description": "Smart business solutions powered by artificial intelligence"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Digital Transformation Services",
                  "description": "Complete digital transformation consulting and implementation"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "AI Analytics & Insights",
                  "description": "Predictive data analytics and business intelligence"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Smart Website & App Development",
                  "description": "AI-powered website and mobile application development"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "AI Marketing Automation",
                  "description": "Automated marketing tools powered by AI"
                }
              }
            ]
          },
          "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock"
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data?.items || []
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "What is Trendify?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trendify is an AI-powered digital transformation partner in Saudi Arabia, offering smart business solutions, website development, predictive analytics, and automated marketing tools."
              }
            },
            {
              "@type": "Question",
              "name": "What services does Trendify offer?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trendify offers AI-powered business solutions, smart website and app development, predictive data analytics, professional UX/UI design, automated marketing tools, startup growth strategies, and full digital transformation consulting."
              }
            },
            {
              "@type": "Question",
              "name": "Does Trendify work with startups?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, Trendify specializes in helping startups and SMEs with digital transformation, offering scalable AI-powered solutions designed specifically for emerging businesses."
              }
            },
            {
              "@type": "Question",
              "name": "What makes Trendify different from other digital agencies?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Trendify is not a typical digital agency — it's an intelligent growth ecosystem that integrates AI into every business process, connecting analytics, design, marketing, and management for simple, fast, and scalable digital transformation."
              }
            }
          ]
        };

      case 'article':
        return data;

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;
