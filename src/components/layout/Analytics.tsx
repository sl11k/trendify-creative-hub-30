import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    gtag?: any;
    dataLayer?: any[];
    fbq?: any;
    ttq?: any;
    snaptr?: any;
  }
}

const Analytics = () => {
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
          if (analytics.code && analytics.code.trim()) {
            console.log(`Injecting ${analytics.platform} analytics code:`, analytics.code);
            injectAnalyticsCode(analytics.platform, analytics.code);
          }
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
    }
  };

  const injectGoogleAnalytics = (trackingId: string) => {
    // Create script for Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer!.push(args);
    }
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', trackingId);
  };

  const injectGoogleTagManager = (containerId: string) => {
    // GTM script injection
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    });

    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    script.async = true;
    document.head.appendChild(script);

    // GTM noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${containerId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(noscript, document.body.firstChild);
  };

  const injectMetaPixel = (pixelId: string) => {
    // Meta Pixel (Facebook) script injection
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

    // Add noscript fallback
    const noscript = document.createElement('noscript');
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`;
    document.body.appendChild(noscript);
  };

  const injectTikTokPixel = (pixelId: string) => {
    // TikTok Pixel script injection
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
    // Snapchat Pixel script injection
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

  return null; // This component doesn't render anything
};

export default Analytics;