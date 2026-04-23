'use client';

import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { patchProductStock } from '@/lib/api';
import type { Product } from '@/lib/types';
import { getColorSizeStock } from '@/lib/utils';

export function StockManager({
  product,
  onUpdated,
}: {
  product: Product;
  onUpdated: () => void;
}) {
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const adjust = async (colorId: string, size: string, delta: number) => {
    const key = `${colorId}::${size}`;
    setSavingKey(key);
    try {
      await patchProductStock(product._id, colorId, 0, size, delta);
      toast.success(delta > 0 ? 'STOCK INCREASED' : 'STOCK DECREASED');
      onUpdated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'FAILED');
    } finally {
      setSavingKey(null);
    }
  };

  const sizes = useMemo(
    () => (product.sizes?.length ? product.sizes : ['ONE SIZE']),
    [product.sizes]
  );
  const stockByKey = useMemo(() => {
    const map: Record<string, number> = {};
    product.colors.forEach((c) => {
      if (!c._id) return;
      sizes.forEach((size) => {
        map[`${c._id}::${size}`] = getColorSizeStock(c, size);
      });
    });
    return map;
  }, [product, sizes]);

  return (
    <div className="mt-4 space-y-4 rounded-lg border border-white/10 bg-primary p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        STOCK MASTER (COLOR × SIZE)
      </p>
      {product.colors.map((c) =>
        c._id ? (
          <div key={c._id} className="space-y-3 rounded border border-white/10 bg-black/25 p-3">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{c.name}</p>
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {sizes.map((size) => {
                const key = `${c._id}::${size}`;
                const stock = stockByKey[key] ?? 0;
                return (
                  <div key={key} className="flex items-center gap-2 rounded border border-white/10 bg-surface p-2">
                    <span className="w-12 font-mono text-[10px] uppercase text-muted">{size}</span>
                    <button
                      type="button"
                      className="h-7 w-7 rounded border border-white/15 text-accent"
                      onClick={() => adjust(c._id!, size, -1)}
                      disabled={savingKey === key || stock <= 0}
                    >
                      -
                    </button>
                    <span className="inline-flex w-14 justify-center rounded-sm border border-white/10 bg-primary px-2 py-1 text-center font-mono text-xs text-accent">
                      {stock}
                    </span>
                    <button
                      type="button"
                      className="h-7 w-7 rounded border border-white/15 text-accent"
                      onClick={() => adjust(c._id!, size, 1)}
                      disabled={savingKey === key}
                    >
                      +
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
