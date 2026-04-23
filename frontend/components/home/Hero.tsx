'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export function Hero() {
  const scrollStory = () => {
    document.getElementById('brand-story')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <video
          className="h-full w-full object-cover opacity-50"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=1600&q=80"
        >
          <source
            src="https://storage.coverr.co/videos/coverr-skateboarding-in-the-street-5931/1080p.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
        <div className="grain-overlay" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.5em] text-secondary">ZENTH / 2026</p>
        <h1 className="glitch-text font-display text-5xl uppercase leading-none text-accent sm:text-7xl md:text-8xl">
          DEFINE THE STREET
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-sans text-sm text-muted md:text-base">
          New Collection. Limited Drops. Zero Compromise.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/products" data-magnetic>
            <Button variant="primary">SHOP NOW</Button>
          </Link>
          <Button variant="outline" type="button" onClick={scrollStory}>
            OUR STORY
          </Button>
        </div>
      </div>
    </section>
  );
}
