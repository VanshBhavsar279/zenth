'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
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
  const [stockByKey, setStockByKey] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    const sizes = product.sizes?.length ? product.sizes : ['ONE SIZE'];
    product.colors.forEach((c) => {
      sizes.forEach((s) => {
        if (c._id) m[`${c._id}::${s}`] = getColorSizeStock(c, s);
      });
    });
    return m;
  });
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const save = async (colorId: string, size: string) => {
    const key = `${colorId}::${size}`;
    setSavingKey(key);
    try {
      await patchProductStock(product._id, colorId, stockByKey[key] ?? 0, size);
      toast.success('STOCK UPDATED');
      onUpdated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'FAILED');
    } finally {
      setSavingKey(null);
    }
  };

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

  const sizes = product.sizes?.length ? product.sizes : ['ONE SIZE'];

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
                return (
                  <div key={key} className="flex items-center gap-2 rounded border border-white/10 bg-surface p-2">
                    <span className="w-12 font-mono text-[10px] uppercase text-muted">{size}</span>
                    <button
                      type="button"
                      className="h-7 w-7 rounded border border-white/15 text-accent"
                      onClick={() => adjust(c._id!, size, -1)}
                      disabled={savingKey === key}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={stockByKey[key] ?? 0}
                      onChange={(e) =>
                        setStockByKey((prev) => ({
                          ...prev,
                          [key]: Math.max(0, Number(e.target.value)),
                        }))
                      }
                      className="w-16 rounded-sm border border-white/10 bg-primary px-2 py-1 text-center font-mono text-xs text-accent"
                    />
                    <button
                      type="button"
                      className="h-7 w-7 rounded border border-white/15 text-accent"
                      onClick={() => adjust(c._id!, size, 1)}
                      disabled={savingKey === key}
                    >
                      +
                    </button>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-2 py-1 text-[10px]"
                      disabled={savingKey === key}
                      onClick={() => save(c._id!, size)}
                    >
                      SAVE
                    </Button>
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
