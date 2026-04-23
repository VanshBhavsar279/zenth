'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function ImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchStart = useRef<number | null>(null);

  const safeImages = images.length ? images : ['https://placehold.co/800x1000/111111/E8FF00/png?text=ZENTH'];
  const main = safeImages[idx] ?? safeImages[0];

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const end = e.changedTouches[0]?.clientX;
    if (touchStart.current == null || end == null) return;
    const delta = end - touchStart.current;
    if (Math.abs(delta) > 48) {
      if (delta < 0) setIdx((i) => Math.min(safeImages.length - 1, i + 1));
      else setIdx((i) => Math.max(0, i - 1));
    }
    touchStart.current = null;
  };

  const cycle = useCallback(
    (dir: 1 | -1) => {
      setIdx((i) => {
        const n = i + dir;
        if (n < 0) return safeImages.length - 1;
        if (n >= safeImages.length) return 0;
        return n;
      });
    },
    [safeImages.length]
  );

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-surface ring-1 ring-white/10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={main}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative h-full w-full"
          >
            <motion.div
              className="relative h-full w-full cursor-zoom-in"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.45 }}
              onClick={() => setLightbox(true)}
            >
              <Image
                src={main}
                alt={productName}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
                priority
                unoptimized
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous"
              className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 font-mono text-xs text-accent md:block"
              onClick={() => cycle(-1)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next"
              className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 font-mono text-xs text-accent md:block"
              onClick={() => cycle(1)}
            >
              ›
            </button>
          </>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {safeImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setIdx(i)}
              className={cn(
                'relative h-20 w-16 flex-shrink-0 overflow-hidden ring-2 transition',
                i === idx ? 'ring-secondary' : 'ring-transparent hover:ring-white/20'
              )}
            >
              <Image src={src} alt="" fill className="object-cover" sizes="64px" unoptimized />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-black/95 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <span className="relative block h-[85vh] w-full max-w-5xl">
              <Image src={main} alt={productName} fill className="object-contain" unoptimized />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
