import { useEffect } from 'react';

const AssetPreloader = () => {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=500&h=200&fit=crop',
      'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=500&h=200&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&h=200&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=200&fit=crop'
    ];

    // Preload images with high priority
    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
      // Set high priority for critical images
      if ('fetchPriority' in img) {
        img.fetchPriority = 'high';
      }
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://images.unsplash.com',
      'https://api.unsplash.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ];

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch next page assets (when user is likely to navigate)
    const prefetchAssets = () => {
      // Only prefetch when user has been active for a while
      setTimeout(() => {
        const prefetchImages = [
          'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&h=200&fit=crop',
          'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=500&h=200&fit=crop'
        ];

        prefetchImages.forEach(src => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = src;
          document.head.appendChild(link);
        });
      }, 3000); // Wait 3 seconds before prefetching
    };

    // Start prefetching if user shows intent to stay
    let userEngaged = false;
    const engagementEvents = ['scroll', 'click', 'mousemove', 'keydown'];

    const handleEngagement = () => {
      if (!userEngaged) {
        userEngaged = true;
        prefetchAssets();

        // Remove listeners after first engagement
        engagementEvents.forEach(event => {
          document.removeEventListener(event, handleEngagement, { passive: true });
        });
      }
    };

    engagementEvents.forEach(event => {
      document.addEventListener(event, handleEngagement, { passive: true });
    });

    // Cleanup
    return () => {
      engagementEvents.forEach(event => {
        document.removeEventListener(event, handleEngagement, { passive: true });
      });
    };
  }, []);

  // This component doesn't render anything
  return null;
};

export default AssetPreloader;