'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { Skeleton } from '@/components/ui/Skeleton';
import { useFeaturedProducts } from '@/lib/hooks/useProducts';

export function FeaturedProducts() {
  const { data, loading, error } = useFeaturedProducts();

  return (
    <section className="bg-primary px-4 py-20 md:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionReveal>
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">CURATED</p>
              <h2 className="font-display text-5xl uppercase tracking-wide text-accent md:text-7xl">
                FRESH DROPS
              </h2>
            </div>
            <Link href="/products">
              <Button variant="outline">VIEW ALL</Button>
            </Link>
          </div>
        </SectionReveal>

        <div className="mt-14">
          <ErrorBoundary fallbackTitle="Could not load featured products">
            {loading && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-[3/4] w-full" />
                ))}
              </div>
            )}
            {error && (
              <p className="font-mono text-xs uppercase text-muted">{error.message}</p>
            )}
            {!loading && !error && (!data || data.length === 0) && (
              <p className="font-mono text-xs uppercase text-muted">No featured products yet.</p>
            )}
            {data && data.length > 0 && (
              <motion.div
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-60px' }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.08 } },
                }}
              >
                {data.map((p) => (
                  <motion.div
                    key={p._id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                    }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </ErrorBoundary>
        </div>
      </div>
    </section>
  );
}
