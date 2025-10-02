// iOS 26 Safari Critical Fix - Load before React
// This fixes the VisualViewport API bug in iOS 26

(function() {
  'use strict';
  
  // Detect iOS 26
  var isIOS26 = /iPhone|iPad|iPod/.test(navigator.userAgent) && 
                /Version\/26/.test(navigator.userAgent);
  
  if (isIOS26 || true) { // Apply to all iOS for safety
    console.log('Applying iOS 26 Safari fixes...');
    
    // Fix 1: Prevent VisualViewport from breaking layout
    if (window.visualViewport) {
      // Store original methods
      var originalAddEventListener = window.visualViewport.addEventListener;
      var originalRemoveEventListener = window.visualViewport.removeEventListener;
      
      // Override addEventListener to block problematic events
      window.visualViewport.addEventListener = function(type) {
        if (type === 'resize' || type === 'scroll') {
          console.log('iOS 26: Blocked visualViewport.' + type);
          return;
        }
        return originalAddEventListener.apply(this, arguments);
      };
      
      // Override removeEventListener
      window.visualViewport.removeEventListener = function(type) {
        if (type === 'resize' || type === 'scroll') {
          return;
        }
        return originalRemoveEventListener.apply(this, arguments);
      };
    }
    
    // Fix 2: Prevent body scroll issues
    document.addEventListener('DOMContentLoaded', function() {
      var html = document.documentElement;
      var body = document.body;
      
      html.style.position = 'fixed';
      html.style.width = '100%';
      html.style.height = '100%';
      html.style.overflow = 'hidden';
      
      body.style.position = 'relative';
      body.style.width = '100%';
      body.style.height = '100%';
      body.style.overflow = 'auto';
      body.style.webkitOverflowScrolling = 'touch';
    });
    
    // Fix 3: Force layout recalculation after load
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
        document.body.style.display = 'none';
        document.body.offsetHeight; // Force reflow
        document.body.style.display = '';
      }, 100);
    });
  }
})();
