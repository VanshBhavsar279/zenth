'use client';

import { useEffect, useMemo, useState } from 'react';
import { SectionReveal } from '@/components/ui/SectionReveal';

const EXCLUDED_IMAGE_IDS = new Set([
  // Hero images
  '1521572163474-6864f9cf17ab',
  '1576566588028-4147f3842f27',
  '1618354691373-d851c5c3a990',
  '1583743814966-8936f5b7be1a',
  '1527719327859-c6ce80353573',
  '1709940936001-49ac064254fc',
  '1713974464381-9b954c5acfbf',
  '1708201596932-595638a910ee',
  '1661110546798-74f41273fbc7',
  // Collection images
  'premium_photo-1747645829954-9ec54a9a245d',
  '1627679482560-9258e05a4226',
  '1622132261637-a3688da471fd',
  // Existing brand story images
  '1523398002812-207fdedb0e77',
  '1512436991641-6745cdb1723f',
]);

const FALLBACK_POOL = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1464863979621-258859e62245?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1200&q=80',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractUnsplashId(url: string): string | null {
  const match = url.match(/photo-([a-zA-Z0-9-]+)/);
  return match?.[1] || null;
}

export function BrandStory() {
  const fallbackImage = useMemo(() => randomFrom(FALLBACK_POOL), []);
  const [imgSrc, setImgSrc] = useState(fallbackImage);

  useEffect(() => {
    const accessKey = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY?.trim();
    if (!accessKey) return;

    const controller = new AbortController();

    const loadRandomUnsplash = async () => {
      try {
        const params = new URLSearchParams({
          query: 'oversized t-shirt streetwear fashion',
          orientation: 'portrait',
          per_page: '30',
          page: String(Math.floor(Math.random() * 5) + 1),
          client_id: accessKey,
        });

        const res = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) return;

        const data: {
          results?: Array<{ urls?: { regular?: string; full?: string }; id?: string }>;
        } = await res.json();

        const filtered = (data.results || [])
          .map((item) => ({
            id: item.id || extractUnsplashId(item.urls?.regular || item.urls?.full || ''),
            url: item.urls?.regular || item.urls?.full || '',
          }))
          .filter((item) => item.url && item.id && !EXCLUDED_IMAGE_IDS.has(item.id));

        if (filtered.length > 0) {
          setImgSrc(randomFrom(filtered).url);
        }
      } catch {
        /* keep fallback image */
      }
    };

    loadRandomUnsplash();
    return () => controller.abort();
  }, []);

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
            onError={() => setImgSrc(fallbackImage)}
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
