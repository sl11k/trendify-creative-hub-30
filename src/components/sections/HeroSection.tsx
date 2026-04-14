import React, { useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import logoImg from '@/assets/logo.png';

const VIDEO_URL = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4';

const BRAND_LOGOS = ['Vortex', 'Nimbus', 'Prysma', 'Cirrus', 'Kynder', 'Halcyn'];

const HeroSection = () => {
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
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Background Video */}
      <video
        ref={videoRef}
        src={VIDEO_URL}
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0 }}
      />

      {/* Blurred overlay shape */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: 984, height: 527, opacity: 0.9, background: 'hsl(260 10% 5%)', filter: 'blur(82px)' }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="w-full py-5 px-8 flex items-center justify-between">
          <img src={logoImg} alt="Logo" className="h-8 w-auto" />
          <div className="hidden md:flex items-center gap-1">
            {[
              { label: 'Features', chevron: true },
              { label: 'Solutions', chevron: false },
              { label: 'Plans', chevron: false },
              { label: 'Learning', chevron: true },
            ].map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-1 px-3 py-2 text-sm text-foreground/90 hover:text-foreground transition-colors rounded-md"
              >
                {item.label}
                {item.chevron && <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="rounded-full px-4 py-2 border-foreground/20 text-foreground hover:bg-foreground/10"
          >
            Sign Up
          </Button>
        </nav>

        {/* Gradient divider */}
        <div className="mt-[3px] h-px w-full bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />

        {/* Hero Content */}
        <div className="flex-1 flex items-center justify-center overflow-visible">
          <div className="text-center">
            <h1
              className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[220px] font-normal leading-[1.02] tracking-[-0.024em]"
              style={{ fontFamily: "'General Sans', sans-serif" }}
            >
              <span className="text-foreground">Power </span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)',
                }}
              >
                AI
              </span>
            </h1>

            <p className="text-hero-sub text-lg leading-8 max-w-md mx-auto mt-[9px] opacity-80">
              The most powerful AI ever deployed
              <br />
              in talent acquisition
            </p>

            <Button
              variant="outline"
              className="mt-[25px] rounded-full px-[29px] py-[24px] border-foreground/20 text-foreground hover:bg-foreground/10 text-base"
            >
              Schedule a Consult
            </Button>
          </div>
        </div>

        {/* Logo Marquee */}
        <div className="pb-10 px-8">
          <div className="max-w-5xl mx-auto flex items-center gap-12">
            <p className="text-foreground/50 text-sm shrink-0 leading-5">
              Relied on by brands
              <br />
              across the globe
            </p>
            <div className="flex-1 overflow-hidden">
              <div className="flex gap-16 animate-marquee" style={{ width: 'max-content' }}>
                {[...BRAND_LOGOS, ...BRAND_LOGOS].map((name, i) => (
                  <div key={`${name}-${i}`} className="flex items-center gap-2.5 shrink-0">
                    <div className="liquid-glass w-[24px] h-[24px] rounded-lg flex items-center justify-center text-xs font-semibold text-foreground">
                      {name[0]}
                    </div>
                    <span className="text-base font-semibold text-foreground whitespace-nowrap">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
