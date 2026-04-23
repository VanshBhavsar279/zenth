'use client';

import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { Product } from '@/lib/types';

export function RelatedProducts({
  products,
  loading,
}: {
  products: Product[] | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="aspect-[3/4]" />
        ))}
      </div>
    );
  }

  if (!products?.length) return null;

  return (
    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
