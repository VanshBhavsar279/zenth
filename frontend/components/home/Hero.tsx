'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

type HeroImageSet = {
  mobile: string;
  tablet: string;
  desktop: string;
};

const buildResponsiveUrls = (baseUrl: string): HeroImageSet => ({
  mobile: `${baseUrl}?auto=format&fit=crop&w=900&q=75`,
  tablet: `${baseUrl}?auto=format&fit=crop&w=1400&q=80`,
  desktop: `${baseUrl}?auto=format&fit=crop&w=2200&q=85`,
});

const HERO_IMAGES = [
  buildResponsiveUrls('https://images.unsplash.com/photo-1576566588028-4147f3842f27'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1618354691373-d851c5c3a990'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1527719327859-c6ce80353573'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1709940936001-49ac064254fc'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1713974464381-9b954c5acfbf'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1708201596932-595638a910ee'),
  buildResponsiveUrls('https://images.unsplash.com/photo-1661110546798-74f41273fbc7'),
];

export function Hero() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const lastScrollY = useRef(0);
  const lastSwitchY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      const scrolledDown = currentY > lastScrollY.current;
      const thresholdReached = Math.abs(currentY - lastSwitchY.current) > 140;

      if (scrolledDown && thresholdReached) {
        setActiveImageIndex((prev) => {
          if (HERO_IMAGES.length <= 1) return prev;
          let next = prev;
          while (next === prev) {
            next = Math.floor(Math.random() * HERO_IMAGES.length);
          }
          return next;
        });
        lastSwitchY.current = currentY;
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollStory = () => {
    document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={HERO_IMAGES[activeImageIndex].desktop}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <picture>
              <source media="(min-width: 1280px)" srcSet={HERO_IMAGES[activeImageIndex].desktop} />
              <source media="(min-width: 768px)" srcSet={HERO_IMAGES[activeImageIndex].tablet} />
              <img
                src={HERO_IMAGES[activeImageIndex].mobile}
                alt="ZENTH oversized t-shirts"
                className="h-full w-full object-cover object-center opacity-55"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <picture className="pointer-events-none absolute inset-0 hidden md:block">
              <source media="(min-width: 1280px)" srcSet={HERO_IMAGES[activeImageIndex].desktop} />
              <source media="(min-width: 768px)" srcSet={HERO_IMAGES[activeImageIndex].tablet} />
              <img
                src={HERO_IMAGES[activeImageIndex].mobile}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain object-center opacity-45"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
        <div className="grain-overlay" />
      </div>

      <motion.div
        className="relative z-10 mx-auto max-w-5xl px-4 text-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
        }}
      >
        <motion.p
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="font-mono text-xs uppercase tracking-[0.5em] text-secondary"
        >
          ZENTH / 2026
        </motion.p>
        <motion.h1
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          className="glitch-text font-display text-5xl uppercase leading-none text-accent sm:text-7xl md:text-8xl"
        >
          DEFINE THE STREET
        </motion.h1>
        <motion.p
          variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
          className="mx-auto mt-6 max-w-xl font-sans text-sm text-muted md:text-base"
        >
          New Collection. Limited Drops. Zero Compromise.
        </motion.p>
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
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
