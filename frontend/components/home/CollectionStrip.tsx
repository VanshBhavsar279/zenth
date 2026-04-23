'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import type { ProductCategory } from '@/lib/types';

const categories: { name: ProductCategory; image: string }[] = [
  {
    name: 'Polo',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Printed',
    image:
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1000&q=80',
  },
  {
    name: 'Coloured',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80',
  },
];

export function CollectionStrip() {
  return (
    <section className="bg-primary px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">CATEGORIES</p>
        <h2 className="mt-2 font-display text-5xl uppercase text-accent md:text-6xl">COLLECTIONS</h2>
        <div className="hide-scrollbar mt-10 flex gap-4 overflow-x-auto pb-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href={`/products?category=${encodeURIComponent(c.name)}`}
              className="group relative block min-w-[260px] flex-shrink-0 overflow-hidden md:min-w-[300px]"
            >
              <motion.div
                className="relative aspect-[3/4] overflow-hidden"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              >
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="300px"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-6">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-display text-3xl uppercase text-accent">{c.name}</span>
                    <span className="font-mono text-secondary opacity-0 transition group-hover:opacity-100">
                      →
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
