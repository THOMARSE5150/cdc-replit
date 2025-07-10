import { useEffect } from 'react';

/**
 * Preload critical resources for better Core Web Vitals
 */
export default function PreloadCriticalResources() {
  useEffect(() => {
    // Preload critical fonts if any
    const preloadFont = (href: string, type = 'font/woff2') => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = type;
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };

    // Preload hero image for better LCP
    const preloadImage = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };

    // Preload the hero image for faster LCP
    try {
      import('../../assets/images/hero_image_canva_optimized.webp').then((module) => {
        preloadImage(module.default);
      });
    } catch (error) {
      // Fallback to PNG if WebP fails
      try {
        import('../../assets/images/hero_image_canva_optimized.png').then((module) => {
          preloadImage(module.default);
        });
      } catch (pngError) {
        console.warn('Could not preload hero image');
      }
    }

  }, []);

  return null; // This component doesn't render anything
}