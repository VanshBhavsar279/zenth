'use client';

import Link from 'next/link';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { useContactInfo } from '@/lib/hooks/useContactInfo';

export function InstagramBanner() {
  const { data } = useContactInfo();
  const handle = data?.instagramHandle?.replace(/^@/, '') || 'zenth';

  return (
    <section className="border-t border-white/10 bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-muted">SOCIAL</p>
          <h2 className="mt-4 font-display text-5xl uppercase text-accent md:text-7xl">
            FOLLOW THE MOVEMENT
          </h2>
          <Link
            href={`https://instagram.com/${handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block font-mono text-sm uppercase tracking-widest text-secondary hover:underline"
          >
            @{handle}
          </Link>
        </SectionReveal>

        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-white/5 to-white/10 ring-1 ring-white/10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
