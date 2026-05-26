import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';

const HeroSection = () => {
  const { t, isRTL } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  const fadeLoop = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    const FADE_DURATION = 0.5;

    const tick = () => {
      if (!video || video.paused) return;
      const t = video.currentTime;
      const dur = video.duration;

      if (Number.isNaN(dur)) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      if (t < FADE_DURATION) {
        video.style.opacity = String(Math.min(t / FADE_DURATION, 1));
      } else if (t > dur - FADE_DURATION) {
        video.style.opacity = String(Math.max((dur - t) / FADE_DURATION, 0));
      } else {
        video.style.opacity = '1';
      }

      rafId = requestAnimationFrame(tick);
    };

    const handleEnded = () => {
      video.style.opacity = '0';
      setTimeout(() => {
        video.currentTime = 0;
        video.play();
      }, 100);
    };

    video.addEventListener('ended', handleEnded);
    video.style.opacity = '0';
    video.play().catch(() => {});
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    const cleanup = fadeLoop();
    return cleanup;
  }, [fadeLoop]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background pt-16">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        loop
        preload="auto"
        // @ts-ignore — fetchpriority is valid HTML, not yet typed in React
        fetchpriority="high"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover md:object-cover object-[center_center] scale-[1.0] md:scale-100"
        style={{ opacity: 0 }}
      />

      {/* Blurred overlay shape */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[320px] h-[400px] md:w-[984px] md:h-[527px]"
        style={{ opacity: 0.85, background: 'hsl(260 10% 5%)', filter: 'blur(60px)' }}
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1
          className="text-responsive-xl font-bold leading-tight tracking-tight animate-fade-in-up text-gradient-primary"
          style={{ fontFamily: "'General Sans', sans-serif" }}
        >
          Trendify
        </h1>

        <p className="text-foreground text-responsive-lg mb-8 leading-relaxed animate-fade-in-up mt-4" style={{ animationDelay: '0.2s' }}>
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link to="/contact">
            <Button
              variant="hero"
              size="xl"
              className="rounded-full"
            >
              {t('hero.cta.primary')}
            </Button>
          </Link>
          <Link to="/portfolio">
            <Button
              variant="outline"
              size="xl"
              className="rounded-full border-foreground/20 text-foreground hover:bg-foreground/10"
            >
              {t('hero.cta.secondary')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
