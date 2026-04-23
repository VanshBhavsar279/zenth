'use client';

import Link from 'next/link';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { useContactInfo } from '@/lib/hooks/useContactInfo';

export function InstagramBanner() {
  const { data } = useContactInfo();
  const handle = data?.instagramHandle?.replace(/^@/, '') || 'zenth';
  const cards = [
    { title: 'NIGHT DROP', bg: 'from-zinc-800 via-zinc-900 to-black' },
    { title: 'CITY FIT', bg: 'from-neutral-700 via-zinc-900 to-black' },
    { title: 'MONO TEE', bg: 'from-zinc-900 via-black to-zinc-800' },
    { title: 'BOLD LINES', bg: 'from-black via-zinc-900 to-zinc-700' },
    { title: 'OFF DUTY', bg: 'from-zinc-800 via-black to-zinc-900' },
    { title: 'STUDIO', bg: 'from-zinc-900 via-zinc-800 to-black' },
  ];

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
          {cards.map((card) => (
            <div
              key={card.title}
              className={`group relative aspect-square overflow-hidden bg-gradient-to-br ${card.bg} ring-1 ring-white/10`}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(232,255,0,0.24),transparent_55%)] opacity-40 transition group-hover:opacity-70" />
              <div className="absolute bottom-2 left-2 right-2">
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/75">
                  {card.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
