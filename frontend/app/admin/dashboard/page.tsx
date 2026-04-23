'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getProductsAdmin } from '@/lib/api';
import type { Product } from '@/lib/types';
import { isProductOutOfStock } from '@/lib/utils';

export default function AdminDashboardPage() {
  return (
    <RequireAdmin>
      <DashboardInner />
    </RequireAdmin>
  );
}

function DashboardInner() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await getProductsAdmin();
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(() => {
    if (!products) return null;
    const total = products.length;
    const visible = products.filter((p) => p.isVisible).length;
    const oos = products.filter((p) => isProductOutOfStock(p)).length;
    const featured = products.filter((p) => p.isFeatured).length;
    return { total, visible, oos, featured };
  }, [products]);

  const recent = products?.slice(0, 8) ?? [];

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
      <div className="flex-1 space-y-12">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">OVERVIEW</p>
          <h1 className="font-display text-5xl uppercase text-accent md:text-6xl">DASHBOARD</h1>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats &&
            [
              { label: 'TOTAL PRODUCTS', value: stats.total },
              { label: 'VISIBLE', value: stats.visible },
              { label: 'OUT OF STOCK', value: stats.oos },
              { label: 'FEATURED', value: stats.featured },
            ].map((s) => (
              <div
                key={s.label}
                className="border border-white/10 bg-surface p-6 ring-1 ring-white/5"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  {s.label}
                </p>
                <p className="mt-3 font-display text-5xl text-secondary">{s.value}</p>
              </div>
            ))}
        </div>

        <div>
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl uppercase text-accent">RECENT PRODUCTS</h2>
            <Link href="/admin/products" className="font-mono text-xs uppercase text-secondary hover:underline">
              MANAGE →
            </Link>
          </div>
          <div className="mt-6 overflow-x-auto border border-white/10">
            <table className="w-full border-collapse text-left font-mono text-xs uppercase tracking-wider text-muted">
              <thead className="bg-primary/80 text-[10px]">
                <tr>
                  <th className="p-4">NAME</th>
                  <th className="p-4">CATEGORY</th>
                  <th className="p-4">PRICE</th>
                  <th className="p-4">VISIBLE</th>
                  <th className="p-4">FEATURED</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((p) => (
                  <tr key={p._id} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-4 text-accent">{p.name}</td>
                    <td className="p-4">{p.category}</td>
                    <td className="p-4">₹{p.price}</td>
                    <td className="p-4">{p.isVisible ? 'YES' : 'NO'}</td>
                    <td className="p-4">{p.isFeatured ? 'YES' : 'NO'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
