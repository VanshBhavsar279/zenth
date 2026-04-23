'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { StockManager } from '@/components/admin/StockManager';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getProductsAdmin } from '@/lib/api';
import type { Product } from '@/lib/types';

export default function AdminStockPage() {
  return (
    <RequireAdmin>
      <StockInner />
    </RequireAdmin>
  );
}

function StockInner() {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');

  const load = useCallback(async () => {
    const data = await getProductsAdmin(q || undefined);
    setProducts(data);
  }, [q]);

  useEffect(() => {
    load().catch(() => setProducts([]));
  }, [load]);

  const filtered = useMemo(
    () => (products ?? []).filter((p) => !p.isDeleted),
    [products]
  );

  if (!products) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:flex-row md:gap-14">
      <AdminSidebar />
      <div className="flex-1 space-y-8">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">INVENTORY</p>
          <h1 className="font-display text-5xl uppercase text-accent md:text-6xl">
            QUANTITY MANAGEMENT
          </h1>
          <p className="mt-3 font-sans text-sm text-muted">
            Use only +/- to update stock. Changes are saved instantly and reflected in products.
          </p>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH PRODUCT NAME…"
          className="w-full rounded-sm border border-white/10 bg-surface px-4 py-3 font-mono text-xs uppercase tracking-widest text-accent placeholder:text-muted"
        />

        <div className="space-y-4">
          {filtered.map((p) => (
            <div key={p._id} className="rounded-lg border border-white/10 bg-surface/60 p-4">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-xs uppercase tracking-widest text-accent">{p.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{p.category}</p>
              </div>
              <StockManager product={p} onUpdated={load} />
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="font-mono text-xs uppercase tracking-widest text-muted">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
