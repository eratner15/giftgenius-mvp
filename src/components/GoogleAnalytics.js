import React, { useEffect } from 'react';

// Set your real GA4 Measurement ID here (create at analytics.google.com)
const DEFAULT_GA4_ID = 'G-XXXXXXXXXX'; // TODO: Replace with real GA4 ID

const GoogleAnalytics = ({ trackingId = DEFAULT_GA4_ID }) => {
  useEffect(() => {
    // Skip loading if placeholder ID
    if (!trackingId || trackingId.includes('XXXXXXXX')) {
      console.log('GA4: Skipping — set a real tracking ID in GoogleAnalytics.js');
      // Still set up gtag stub so other code doesn't error
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      setupEnhancedTracking();
      return;
    }

    // Load Google Analytics
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script1);

    // Initialize Google Analytics
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${trackingId}', {
        page_title: document.title,
        page_location: window.location.href
      });

      // Enhanced ecommerce setup
      gtag('config', '${trackingId}', {
        custom_map: {
          'custom_parameter_1': 'lead_score',
          'custom_parameter_2': 'conversion_probability'
        }
      });

      // Set up affiliate link tracking
      window.gtag = gtag;
    `;
    document.head.appendChild(script2);

    // Track initial page view with enhanced data
    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      user_agent: navigator.userAgent,
      screen_resolution: window.screen.width + 'x' + window.screen.height
    });

    // Set up enhanced tracking
    setupEnhancedTracking();

    return () => {
      // Cleanup if needed
    };
  }, [trackingId]);

  const setupEnhancedTracking = () => {
    // Track scroll depth
    let maxScroll = 0;
    const handleScroll = () => {
      const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      if (scrollPercent > maxScroll && [25, 50, 75, 90].includes(scrollPercent)) {
        maxScroll = scrollPercent;
        window.gtag('event', 'scroll', {
          event_category: 'engagement',
          event_label: `${scrollPercent}%`,
          value: scrollPercent
        });
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Track time on page milestones
    const timeTrackingIntervals = [30, 60, 180, 300]; // seconds
    timeTrackingIntervals.forEach(seconds => {
      setTimeout(() => {
        window.gtag('event', 'timing_complete', {
          event_category: 'engagement',
          event_label: `${seconds}s on page`,
          value: seconds
        });
      }, seconds * 1000);
    });

    // Track link clicks
    document.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && link.href) {
        const isExternal = !link.href.startsWith(window.location.origin);
        const isAffiliate = link.dataset.affiliateLink || link.href.includes('amazon.com') || link.href.includes('tag=');

        if (isAffiliate) {
          window.gtag('event', 'click', {
            event_category: 'affiliate',
            event_label: link.href,
            transport_type: 'beacon'
          });
        } else if (isExternal) {
          window.gtag('event', 'click', {
            event_category: 'outbound',
            event_label: link.href,
            transport_type: 'beacon'
          });
        }
      }
    });

    // Track form interactions
    document.addEventListener('submit', (event) => {
      const form = event.target;
      if (form.tagName === 'FORM') {
        window.gtag('event', 'form_submit', {
          event_category: 'engagement',
          event_label: form.className || 'form',
          form_id: form.id || 'unknown'
        });
      }
    });

    // Track video/media interactions
    document.addEventListener('play', (event) => {
      if (event.target.tagName === 'VIDEO') {
        window.gtag('event', 'video_start', {
          event_category: 'engagement',
          event_label: event.target.src || 'video'
        });
      }
    }, true);

    // Track search functionality
    window.trackSearch = (query, results) => {
      window.gtag('event', 'search', {
        event_category: 'site_search',
        search_term: query,
        search_results: results
      });
    };

    // Track gift interactions
    window.trackGiftInteraction = (action, giftId, giftData = {}) => {
      window.gtag('event', action, {
        event_category: 'gift_interaction',
        item_id: giftId,
        item_name: giftData.title || 'unknown',
        item_category: giftData.category || 'gifts',
        price: giftData.price || 0,
        value: giftData.price || 0
      });
    };
  };

  return null; // This component doesn't render anything
};

// Facebook Pixel Integration
export const FacebookPixel = ({ pixelId = '123456789' }) => {
  useEffect(() => {
    // Skip loading if placeholder ID
    if (!pixelId || pixelId === '123456789') {
      console.log('Facebook Pixel: Skipping — set a real pixel ID');
      return;
    }

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

    // Set up custom events
    window.fbq = window.fbq || function() {
      (window.fbq.q = window.fbq.q || []).push(arguments);
    };

    return () => {
      // Cleanup if needed
    };
  }, [pixelId]);

  return null;
};

// Pinterest Tag
export const PinterestTag = ({ tagId = '123456789' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      !function(e){if(!window.pintrk){window.pintrk = function () {
      window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var
      n=window.pintrk;n.queue=[],n.version="3.0";var
      t=document.createElement("script");t.async=!0,t.src=e;var
      r=document.getElementsByTagName("script")[0];
      r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");
      pintrk('load', '${tagId}', {em: '<user_email_hashed>'});
      pintrk('page');
    `;
    document.head.appendChild(script);
  }, [tagId]);

  return null;
};

// Hotjar Integration
export const Hotjar = ({ hjid = '123456', hjsv = '6' }) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.innerHTML = `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:${hjid},hjsv:${hjsv}};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `;
    document.head.appendChild(script);
  }, [hjid, hjsv]);

  return null;
};

// All-in-one Analytics Component
const AnalyticsProvider = ({
  googleAnalyticsId,
  facebookPixelId,
  pinterestTagId,
  hotjarId
}) => {
  return (
    <>
      {googleAnalyticsId && <GoogleAnalytics trackingId={googleAnalyticsId} />}
      {facebookPixelId && <FacebookPixel pixelId={facebookPixelId} />}
      {pinterestTagId && <PinterestTag tagId={pinterestTagId} />}
      {hotjarId && <Hotjar hjid={hotjarId} />}
    </>
  );
};

export default AnalyticsProvider;