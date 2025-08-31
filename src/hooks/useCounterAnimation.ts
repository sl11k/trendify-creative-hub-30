import { useEffect, useRef } from 'react';

export const useCounterAnimation = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const animateCounter = (element: HTMLElement) => {
      const target = parseInt(element.getAttribute('data-target') || '0');
      const increment = target / 60; // 60 frames for 1 second animation
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          element.textContent = Math.ceil(current).toString() + (target >= 100 ? '+' : '');
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toString() + (target >= 100 ? '+' : '');
        }
      };

      updateCounter();
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          if (element.classList.contains('counter-animation')) {
            element.classList.add('animate');
            animateCounter(element);
            observerRef.current?.unobserve(element);
          }
          
          if (element.classList.contains('stagger-animation')) {
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }, parseInt(element.getAttribute('data-delay') || '0'));
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    });

    // Observe counter elements
    const counterElements = document.querySelectorAll('.counter-animation');
    const staggerElements = document.querySelectorAll('.stagger-animation');
    
    counterElements.forEach(el => observerRef.current?.observe(el));
    staggerElements.forEach(el => observerRef.current?.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return observerRef;
};