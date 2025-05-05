// Optimization plugin for performance

export default defineNuxtPlugin((nuxtApp) => {
  // Add event listener for page load to defer non-critical operations
  window.addEventListener('load', () => {
    // Defer non-critical operations after page load
    setTimeout(() => {
      // Preconnect to external domains that will be used
      const domains = ['fonts.googleapis.com', 'fonts.gstatic.com'];
      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = `https://${domain}`;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Add support for native lazy-loading of images
      document.querySelectorAll('img:not([loading])').forEach(img => {
        if (!img.hasAttribute('loading') && img.offsetTop > window.innerHeight) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }, 1000);
  });

  // Detect low-end devices and reduce animations
  const isLowEndDevice = () => {
    const memory = navigator.deviceMemory || 4; // Default to 4GB if not available
    const cpuCores = navigator.hardwareConcurrency || 4; // Default to 4 cores if not available
    return memory <= 4 || cpuCores <= 2;
  };

  // Provide a utility for components to check if they should use reduced animations
  nuxtApp.provide('isLowEndDevice', isLowEndDevice);

  // Add intersection observer for lazy-loading content
  const setupIntersectionObserver = () => {
    if ('IntersectionObserver' in window) {
      const lazyLoadObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Handle lazy-loaded images
            if (element.tagName === 'IMG' && element.dataset.src) {
              element.src = element.dataset.src;
              delete element.dataset.src;
            }
            
            // Handle lazy-loaded background images
            if (element.dataset.background) {
              element.style.backgroundImage = `url(${element.dataset.background})`;
              delete element.dataset.background;
            }
            
            // Remove from observation once loaded
            lazyLoadObserver.unobserve(element);
          }
        });
      });
      
      // Observe all elements with the data-src or data-background attribute
      document.querySelectorAll('[data-src], [data-background]').forEach(element => {
        lazyLoadObserver.observe(element);
      });
    }
  };
  
  // Set up lazy loading after page is interactive
  if (document.readyState === 'complete') {
    setupIntersectionObserver();
  } else {
    window.addEventListener('DOMContentLoaded', setupIntersectionObserver);
  }
});