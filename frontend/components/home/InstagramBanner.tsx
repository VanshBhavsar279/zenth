'use client';

import Link from 'next/link';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { Button } from '@/components/ui/Button';
import { useContactStore } from '@/lib/store';

export function InstagramBanner() {
  const contact = useContactStore((s) => s.contact);
  const handle = contact?.instagramHandle?.trim().replace(/^@/, '') || '';

  return (
    <section className="border-t border-white/10 bg-surface px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-muted">SOCIAL</p>
          <h2 className="mt-4 font-display text-5xl uppercase text-accent md:text-7xl">
            FOLLOW THE MOVEMENT
          </h2>
          {handle ? (
            <Link
              href={`https://instagram.com/${handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-mono text-sm uppercase tracking-widest text-secondary hover:underline"
            >
              @{handle}
            </Link>
          ) : null}
        </SectionReveal>

        <SectionReveal className="mt-12">
          <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-primary/40 p-8 text-center backdrop-blur">
            <p className="font-sans text-sm text-muted md:text-base">
              Get styling inspo, behind-the-scenes, and first access to drops.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/products" data-magnetic>
                <Button variant="primary">SHOP THE DROP</Button>
              </Link>
              {handle ? (
                <Link
                  href={`https://instagram.com/${handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-magnetic
                >
                  <Button variant="outline">FOLLOW @{handle}</Button>
                </Link>
              ) : null}
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
