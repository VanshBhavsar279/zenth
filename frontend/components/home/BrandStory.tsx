'use client';

import Image from 'next/image';
import { SectionReveal } from '@/components/ui/SectionReveal';

export function BrandStory() {
  return (
    <section id="brand-story" className="border-t border-white/10 bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
        <SectionReveal className="relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
          <Image
            src="https://images.unsplash.com/photo-1523398002812-207fdedb0e77?auto=format&fit=crop&w=900&q=80"
            alt="ZENTH"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 50vw, 100vw"
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
