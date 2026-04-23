'use client';

import Image from 'next/image';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ProductForm } from '@/components/admin/ProductForm';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { StockManager } from '@/components/admin/StockManager';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  deleteProduct,
  getProductsAdmin,
  toggleProductFeatured,
  toggleProductVisibility,
} from '@/lib/api';
import type { Product } from '@/lib/types';
import { isProductOutOfStock } from '@/lib/utils';

export default function AdminProductsPage() {
  return (
    <RequireAdmin>
      <ProductsInner />
    </RequireAdmin>
  );
}

function ProductsInner() {
  const [list, setList] = useState<Product[] | null>(null);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const load = useCallback(async () => {
    const data = await getProductsAdmin(q || undefined);
    setList(data);
  }, [q]);

  useEffect(() => {
    load().catch(() => setList([]));
  }, [load]);

  const filtered = useMemo(() => list ?? [], [list]);

  const onToggleVisible = async (p: Product) => {
    try {
      await toggleProductVisibility(p._id);
      toast.success('VISIBILITY UPDATED');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'FAILED');
    }
  };

  const onToggleFeatured = async (p: Product) => {
    try {
      await toggleProductFeatured(p._id);
      toast.success('FEATURED UPDATED');
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'FAILED');
    }
  };

  const onDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id);
      toast.success('DELETED');
      setDeleteTarget(null);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'FAILED');
    }
  };

  if (!list) {
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
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">INVENTORY</p>
            <h1 className="font-display text-5xl uppercase text-accent md:text-6xl">PRODUCTS</h1>
          </div>
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            ADD NEW PRODUCT
          </Button>
        </div>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="SEARCH NAME OR USE FILTERS FROM API…"
          className="w-full rounded-sm border border-white/10 bg-surface px-4 py-3 font-mono text-xs uppercase tracking-widest text-accent placeholder:text-muted"
        />

        <div className="overflow-x-auto border border-white/10">
          <table className="min-w-[960px] w-full border-collapse text-left font-mono text-[11px] uppercase tracking-wider">
            <thead className="bg-primary/90 text-[10px] text-muted">
              <tr>
                <th className="p-3">IMAGE</th>
                <th className="p-3">NAME</th>
                <th className="p-3">CATEGORY</th>
                <th className="p-3">PRICE</th>
                <th className="p-3">STOCK</th>
                <th className="p-3">VISIBLE</th>
                <th className="p-3">FEATURED</th>
                <th className="p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <Fragment key={p._id}>
                  <tr className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3">
                      <div className="relative h-14 w-12 bg-black">
                        <Image
                          src={
                            p.colors[0]?.images[0] ||
                            'https://placehold.co/120x160/111111/E8FF00/png?text=ZENTH'
                          }
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="max-w-[180px] truncate p-3 text-accent">{p.name}</td>
                    <td className="p-3 text-muted">{p.category}</td>
                    <td className="p-3 text-secondary">₹{p.price}</td>
                    <td className="p-3">
                      <button
                        type="button"
                        className="text-left underline decoration-dotted hover:text-secondary"
                        onClick={() =>
                          setExpandedId((id) => (id === p._id ? null : p._id))
                        }
                      >
                        {isProductOutOfStock(p) ? 'OUT' : 'OK'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button type="button" className="hover:text-secondary" onClick={() => onToggleVisible(p)}>
                        {p.isVisible ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button type="button" className="hover:text-secondary" onClick={() => onToggleFeatured(p)}>
                        {p.isFeatured ? 'YES' : 'NO'}
                      </button>
                    </td>
                    <td className="space-x-2 p-3 whitespace-nowrap">
                      <button
                        type="button"
                        className="hover:text-secondary"
                        onClick={() => {
                          setEditing(p);
                          setModalOpen(true);
                        }}
                      >
                        EDIT
                      </button>
                      <button
                        type="button"
                        className="hover:text-red-400"
                        onClick={() => setDeleteTarget(p)}
                      >
                        DELETE
                      </button>
                    </td>
                  </tr>
                  {expandedId === p._id && (
                    <tr className="border-t border-white/5 bg-black/40">
                      <td colSpan={8} className="p-0">
                        <StockManager product={p} onUpdated={load} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'EDIT PRODUCT' : 'NEW PRODUCT'}
        wide
      >
        <ProductForm
          initial={editing}
          onCancel={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            load();
          }}
        />
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="DELETE PRODUCT">
        <p className="font-mono text-xs uppercase text-muted">
          This cannot be undone. Delete {deleteTarget?.name}?
        </p>
        <div className="mt-6 flex gap-4">
          <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
            CANCEL
          </Button>
          <Button type="button" onClick={onDelete}>
            DELETE
          </Button>
        </div>
      </Modal>
    </div>
  );
}
