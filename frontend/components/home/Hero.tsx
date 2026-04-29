'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { getHeroImages } from '@/lib/api';
import { useContactStore } from '@/lib/store';

type HeroImageSet = {
  mobile: string;
  tablet: string;
  desktop: string;
};

const buildResponsiveUrls = (baseUrl: string): HeroImageSet => {
  const separator = baseUrl.includes('?') ? '&' : '?';
  return {
    mobile: `${baseUrl}${separator}auto=format&fit=crop&w=900&q=75`,
    tablet: `${baseUrl}${separator}auto=format&fit=crop&w=1400&q=80`,
    desktop: `${baseUrl}${separator}auto=format&fit=crop&w=2200&q=85`,
  };
};

function AnimatedWords({ text, className }: { text: string; className?: string }) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  return (
    <span className={className}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.06 * i + 0.08, duration: 0.55, ease: [0.2, 0.9, 0.2, 1] }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDesktopView, setIsDesktopView] = useState(false);
  const [remoteMobile, setRemoteMobile] = useState<HeroImageSet[] | null>(null);
  const [remoteDesktop, setRemoteDesktop] = useState<HeroImageSet[] | null>(null);
  const brandName = useContactStore((s) => s.contact?.brandName?.trim() || 'ZENTH');
  const heroKicker = useContactStore((s) => s.contact?.heroKicker?.trim() || '');
  const heroHeadline = useContactStore((s) => s.contact?.heroHeadline?.trim() || 'DEFINE THE STREET');
  const heroTagline = useContactStore((s) => s.contact?.heroTagline?.trim() || '');
  const lastScrollY = useRef(0);
  const lastSwitchY = useRef(0);
  const failedKeys = useRef<Set<string>>(new Set());
  const heroImages = isDesktopView ? remoteDesktop : remoteMobile;

  const pickRandomIndex = (len: number, exclude?: number) => {
    if (len <= 1) return 0;
    let next = exclude ?? -1;
    while (next === exclude) next = Math.floor(Math.random() * len);
    return next;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const updateView = () => setIsDesktopView(mediaQuery.matches);
    updateView();
    mediaQuery.addEventListener('change', updateView);

    return () => mediaQuery.removeEventListener('change', updateView);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getHeroImages();
        if (cancelled) return;
        const mobile = (res.heroImagesMobile || []).filter(Boolean).map(buildResponsiveUrls);
        const desktop = (res.heroImagesDesktop || []).filter(Boolean).map(buildResponsiveUrls);
        setRemoteMobile(mobile.length ? mobile : null);
        setRemoteDesktop(desktop.length ? desktop : null);
      } catch {
        // If API fails, keep empty background.
        setRemoteMobile(null);
        setRemoteDesktop(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // When the image pool changes (remote fetch or breakpoint switch),
    // pick a random starting image instead of always showing index 0.
    const len = heroImages?.length ?? 0;
    if (len <= 0) return;
    failedKeys.current.clear();
    setActiveImageIndex((prev) => pickRandomIndex(len, prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroImages?.length, isDesktopView]);

  useEffect(() => {
    const list = heroImages ?? [];
    const onScroll = () => {
      const currentY = window.scrollY;
      const scrolledDown = currentY > lastScrollY.current;
      const thresholdReached = Math.abs(currentY - lastSwitchY.current) > 140;

      if (scrolledDown && thresholdReached) {
        setActiveImageIndex((prev) => {
          if (list.length <= 1) return prev;
          let next = prev;
          while (next === prev) {
            next = Math.floor(Math.random() * list.length);
          }
          return next;
        });
        lastSwitchY.current = currentY;
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heroImages]);

  const scrollStory = () => {
    document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          {heroImages?.length ? (
            <motion.div
              key={heroImages[activeImageIndex]?.desktop || activeImageIndex}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <picture>
                <source media="(min-width: 1280px)" srcSet={heroImages[activeImageIndex].desktop} />
                <source media="(min-width: 768px)" srcSet={heroImages[activeImageIndex].tablet} />
                <img
                  src={heroImages[activeImageIndex].mobile}
                  alt={`${brandName} oversized t-shirts`}
                  className="h-full w-full object-cover object-center opacity-55"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  onError={() => {
                    const list = heroImages ?? [];
                    const key =
                      list[activeImageIndex]?.desktop || list[activeImageIndex]?.mobile || String(activeImageIndex);
                    failedKeys.current.add(key);
                    if (list.length <= 1) return;

                    const candidates: number[] = [];
                    for (let i = 0; i < list.length; i++) {
                      const k = list[i]?.desktop || list[i]?.mobile || String(i);
                      if (!failedKeys.current.has(k)) candidates.push(i);
                    }
                    if (candidates.length === 0) return;
                    const next = candidates[Math.floor(Math.random() * candidates.length)];
                    setActiveImageIndex(next);
                  }}
                />
              </picture>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
        <div className="grain-overlay" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-4 text-center"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
        <motion.p
          className="font-mono text-xs uppercase tracking-[0.5em] text-secondary"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.45, ease: 'easeOut' }}
        >
          {heroKicker || `${brandName} ${new Date().getFullYear()}`}
        </motion.p>

        <motion.h1 className="mt-4 font-display text-5xl uppercase leading-none text-accent sm:text-7xl md:text-8xl">
          <AnimatedWords text={heroHeadline} className="glitch-text" />
        </motion.h1>

        {heroTagline ? (
          <motion.p
            className="mx-auto mt-6 max-w-xl font-sans text-sm text-muted md:text-base"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.45, ease: 'easeOut' }}
          >
            {heroTagline}
          </motion.p>
        ) : null}
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26, duration: 0.45, ease: 'easeOut' }}
        >
          <Link href="/products" data-magnetic>
            <Button variant="primary">SHOP NOW</Button>
          </Link>
          <Button variant="outline" type="button" onClick={scrollStory}>
            OUR STORY
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
