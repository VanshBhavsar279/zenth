'use client';

import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1800&q=80',
  'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=1800&q=80',
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
            key={HERO_IMAGES[activeImageIndex]}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_IMAGES[activeImageIndex]}
              alt="ZENTH oversized t-shirts"
              fill
              priority
              className="object-cover opacity-55"
              sizes="100vw"
              unoptimized
            />
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
