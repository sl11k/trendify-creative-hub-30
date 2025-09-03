import React, { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Global type declarations for analytics tracking functions
declare global {
  interface Window {
    gtag?: any;
    fbq?: any;
    ttq?: any;
    snaptr?: any;
    dataLayer?: any[];
  }
}

interface AnalyticsProps {
  pageSlug?: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ pageSlug = 'home' }) => {
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const { data: analyticsCodes } = await supabase
        .from('analytics_codes')
        .select('*')
        .eq('active', true);

      if (analyticsCodes) {
        analyticsCodes.forEach((analytics) => {
          injectAnalyticsCode(analytics.platform, analytics.code);
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const injectAnalyticsCode = (platform: string, code: string) => {
    switch (platform) {
      case 'google_analytics':
        injectGoogleAnalytics(code);
        break;
      case 'google_tag_manager':
        injectGoogleTagManager(code);
        break;
      case 'meta_pixel':
        injectMetaPixel(code);
        break;
      case 'tiktok_pixel':
        injectTikTokPixel(code);
        break;
      case 'snapchat_pixel':
        injectSnapchatPixel(code);
        break;
      default:
        console.warn(`Unknown analytics platform: ${platform}`);
    }
  };

  const injectGoogleAnalytics = (trackingId: string) => {
    // Inject Google Analytics gtag script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize gtag
    const initScript = document.createElement('script');
    initScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}');
    `;
    document.head.appendChild(initScript);
  };

  const injectGoogleTagManager = (containerId: string) => {
    // Inject GTM script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${containerId}');
    `;
    document.head.appendChild(script);

    // Inject GTM noscript
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.appendChild(noscript);
  };

  const injectMetaPixel = (pixelId: string) => {
    // Inject Facebook Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);

    // Inject noscript
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>
    `;
    document.body.appendChild(noscript);
  };

  const injectTikTokPixel = (pixelId: string) => {
    // Inject TikTok Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `;
    document.head.appendChild(script);
  };

  const injectSnapchatPixel = (pixelId: string) => {
    // Inject Snapchat Pixel script
    const script = document.createElement('script');
    script.innerHTML = `
      (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
      {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
      a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
      r.src=n;var u=t.getElementsByTagName(s)[0];
      u.parentNode.insertBefore(r,u);})(window,document,
      'https://sc-static.net/scevent.min.js');
      snaptr('init', '${pixelId}', {
        'user_email': '__INSERT_USER_EMAIL__'
      });
      snaptr('track', 'PAGE_VIEW');
    `;
    document.head.appendChild(script);
  };
  
  return null; // This component only handles side effects
};

export default Analytics;