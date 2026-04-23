'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { patchProductStock } from '@/lib/api';
import type { Product } from '@/lib/types';

export function StockManager({
  product,
  onUpdated,
}: {
  product: Product;
  onUpdated: () => void;
}) {
  const [stockById, setStockById] = useState<Record<string, number>>(() => {
    const m: Record<string, number> = {};
    product.colors.forEach((c) => {
      if (c._id) m[c._id] = c.stock ?? 0;
    });
    return m;
  });
  const [savingId, setSavingId] = useState<string | null>(null);

  const save = async (colorId: string) => {
    setSavingId(colorId);
    try {
      await patchProductStock(product._id, colorId, stockById[colorId] ?? 0);
      toast.success('STOCK UPDATED');
      onUpdated();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'FAILED');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="mt-4 space-y-4 rounded-lg border border-white/10 bg-primary p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
        STOCK BY VARIANT
      </p>
      {product.colors.map((c) =>
        c._id ? (
          <div key={c._id} className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs text-accent">{c.name}</span>
            <input
              type="number"
              min={0}
              value={stockById[c._id] ?? 0}
              onChange={(e) =>
                setStockById((prev) => ({
                  ...prev,
                  [c._id!]: Number(e.target.value),
                }))
              }
              className="w-24 rounded-sm border border-white/10 bg-surface px-2 py-1 font-mono text-xs text-accent"
            />
            <Button
              type="button"
              variant="outline"
              disabled={savingId === c._id}
              onClick={() => save(c._id!)}
            >
              UPDATE
            </Button>
          </div>
        ) : null
      )}
    </div>
  );
}
