'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/product/ProductGrid';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { useProducts } from '@/lib/hooks/useProducts';
import type { ProductCategory } from '@/lib/types';

const categories: ProductCategory[] = [
  'Polo',
  'Printed',
  'Coloured',
];

export function ProductsClient() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') as ProductCategory | null;

  const [category, setCategory] = useState<ProductCategory | ''>(initialCategory || '');
  const [sort, setSort] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [gridMode, setGridMode] = useState<'grid' | 'list'>('grid');

  const filters = useMemo(() => {
    const f: Record<string, string | string[]> = {};
    if (category) f.category = category;
    if (minPrice) f.minPrice = minPrice;
    if (maxPrice) f.maxPrice = maxPrice;
    f.sort = sort;
    return f;
  }, [category, minPrice, maxPrice, sort]);

  const { data, loading, error } = useProducts(filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">CATALOG</p>
        <h1 className="font-display text-6xl uppercase text-accent md:text-8xl">ALL DROPS</h1>
      </SectionReveal>

      <div className="mt-12 flex flex-col gap-10 lg:flex-row">
        <aside className="w-full shrink-0 space-y-8 lg:sticky lg:top-28 lg:w-72">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Category</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCategory('')}
                className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                  !category ? 'bg-secondary text-primary' : 'bg-surface text-muted ring-1 ring-white/10'
                }`}
              >
                ALL
              </button>
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                    category === c ? 'bg-secondary text-primary' : 'bg-surface text-muted ring-1 ring-white/10'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Price (₹)</p>
            <div className="mt-3 flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-sm border border-white/10 bg-surface px-3 py-2 font-mono text-xs text-accent"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-sm border border-white/10 bg-surface px-3 py-2 font-mono text-xs text-accent"
              />
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Sort</p>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="mt-3 w-full rounded-sm border border-white/10 bg-surface px-3 py-2 font-mono text-xs uppercase tracking-widest text-accent"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price · Low → High</option>
              <option value="price_desc">Price · High → Low</option>
            </select>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setGridMode('grid')}
              className={`rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${
                gridMode === 'grid' ? 'bg-secondary text-primary' : 'bg-surface text-muted'
              }`}
            >
              GRID
            </button>
            <button
              type="button"
              onClick={() => setGridMode('list')}
              className={`rounded-sm px-3 py-2 font-mono text-[10px] uppercase tracking-widest ${
                gridMode === 'list' ? 'bg-secondary text-primary' : 'bg-surface text-muted'
              }`}
            >
              LIST
            </button>
          </div>

          {error && (
            <p className="mb-6 font-mono text-xs uppercase text-red-400">{error.message}</p>
          )}

          {gridMode === 'grid' ? (
            <ProductGrid products={data} loading={loading} />
          ) : (
            <ProductList products={data} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductList({
  products,
  loading,
}: {
  products: import('@/lib/types').Product[] | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-md bg-surface" />
        ))}
      </div>
    );
  }
  if (!products?.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-surface py-16 text-center font-display text-3xl uppercase text-accent">
        NO DROPS FOUND
      </div>
    );
  }
  return (
    <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-surface">
      {products.map((p) => (
        <Link
          key={p._id}
          href={`/products/${p._id}`}
          className="flex items-center gap-4 p-4 transition hover:bg-white/5"
        >
          <div className="relative h-24 w-20 bg-primary">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                p.colors[0]?.images[0] ||
                'https://placehold.co/200x240/111111/E8FF00/png?text=ZENTH'
              }
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-display text-xl uppercase text-accent">{p.name}</p>
            <p className="font-mono text-xs text-muted">{p.category}</p>
          </div>
          <p className="font-mono text-sm text-secondary">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(p.price)}
          </p>
        </Link>
      ))}
    </div>
  );
}
