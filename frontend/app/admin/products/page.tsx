'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ProductForm } from '@/components/admin/ProductForm';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  deleteProduct,
  getProductsAdmin,
  restoreProduct,
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

  const onRestore = async (p: Product) => {
    try {
      await restoreProduct(p._id);
      toast.success('PRODUCT RESTORED');
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
          <div className="flex items-center gap-3">
            <Link
              href="/admin/stock"
              className="inline-flex h-11 items-center justify-center rounded-sm border border-white/15 px-4 font-mono text-xs uppercase tracking-widest text-muted transition hover:border-secondary hover:text-secondary"
            >
              MANAGE STOCK
            </Link>
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
                <th className="p-3">STATUS</th>
                <th className="p-3">VISIBLE</th>
                <th className="p-3">FEATURED</th>
                <th className="p-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p._id}
                  className={`border-t border-white/10 ${p.isDeleted ? 'bg-red-500/5 text-muted' : 'hover:bg-white/5'}`}
                >
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
                      <span>{isProductOutOfStock(p) ? 'OUT' : 'OK'}</span>
                    </td>
                    <td className="p-3">
                      <span className={p.isDeleted ? 'text-red-300' : 'text-emerald-300'}>
                        {p.isDeleted ? 'DELETED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        className="hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => onToggleVisible(p)}
                        disabled={Boolean(p.isDeleted)}
                      >
                        {p.isVisible ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        className="hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
                        onClick={() => onToggleFeatured(p)}
                        disabled={Boolean(p.isDeleted)}
                      >
                        {p.isFeatured ? 'YES' : 'NO'}
                      </button>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {!p.isDeleted ? (
                          <>
                            <button
                              type="button"
                              aria-label={`Edit ${p.name}`}
                              title="Edit product"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted transition hover:bg-white/10 hover:text-secondary"
                              onClick={() => {
                                setEditing(p);
                                setModalOpen(true);
                              }}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              aria-label={`Delete ${p.name}`}
                              title="Delete product"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-muted transition hover:bg-red-500/10 hover:text-red-400"
                              onClick={() => setDeleteTarget(p)}
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M3 6h18" />
                                <path d="M8 6V4h8v2" />
                                <path d="M19 6l-1 14H6L5 6" />
                                <path d="M10 11v6" />
                                <path d="M14 11v6" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            aria-label={`Restore ${p.name}`}
                            title="Restore product"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-sm text-emerald-300 transition hover:bg-emerald-500/10 hover:text-emerald-200"
                            onClick={() => onRestore(p)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M3 12a9 9 0 101.8-5.4" />
                              <path d="M3 4v6h6" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
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
          This will soft delete and hide from storefront. You can restore it later. Delete {deleteTarget?.name}?
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
