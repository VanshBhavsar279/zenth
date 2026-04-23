import type { Product } from '@/lib/types';
import { ProductCard } from '@/components/product/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';

export function ProductGrid({
  products,
  loading,
}: {
  products: Product[] | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-sm" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="rounded-lg border border-white/10 bg-surface py-24 text-center">
        <p className="font-display text-4xl uppercase text-accent">NO DROPS FOUND</p>
        <p className="mt-4 font-mono text-xs uppercase text-muted">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
