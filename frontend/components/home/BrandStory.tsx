'use client';

import { useState } from 'react';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function BrandStory() {
  const [imgSrc, setImgSrc] = useState(
    'https://images.unsplash.com/photo-1523398002812-207fdedb0e77?auto=format&fit=crop&w=1200&q=80'
  );

  return (
    <section id="brand-story" className="border-t border-white/10 bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <SectionReveal className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
          {/* Using native img with fallback avoids image optimizer edge cases on mobile browsers */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imgSrc}
            alt="ZENTH"
            className="h-full w-full object-cover"
            onError={() =>
              setImgSrc(
                'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80'
              )
            }
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/60 to-transparent" />
        </SectionReveal>
        <SectionReveal>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-secondary">THE BRAND</p>
          <h2 className="mt-4 font-display text-4xl uppercase leading-[0.95] text-accent md:text-6xl">
            BORN ON THE STREETS. BUILT FOR THE BOLD.
          </h2>
          <p className="mt-8 max-w-lg font-sans text-sm leading-relaxed text-muted md:text-base">
            ZENTH is a uniform for those who move different—sharp silhouettes, premium fabrics,
            and energy pulled straight from the pavement. Every piece is designed to read loud in
            low light and hold up when the night runs long.
          </p>
        </SectionReveal>
      </div>
    </section>
  );
}
