'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import {
  createProduct,
  updateProduct,
  uploadImage,
} from '@/lib/api';
import type { ColorVariant, Product, ProductCategory } from '@/lib/types';

const categories: ProductCategory[] = [
  'Polo',
  'Printed',
  'Coloured',
];

const ALL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const TAG_OPTS = ['LIMITED', 'NEW DROP', 'BESTSELLER', 'SALE'];

type DraftColor = ColorVariant & { clientKey: string };

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Product | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? 'Printed'
  );
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [description, setDescription] = useState(initial?.description ?? '');
  const [sizes, setSizes] = useState<string[]>(initial?.sizes ?? ['M', 'L', 'XL']);
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isVisible, setIsVisible] = useState(initial?.isVisible ?? true);
  const [colors, setColors] = useState<DraftColor[]>(() =>
    initial?.colors?.length
      ? initial.colors.map((c) => ({
          ...c,
          clientKey: c._id ?? uid(),
          images: c.images ?? [],
        }))
      : [
          {
            clientKey: uid(),
            name: 'Jet Black',
            hex: '#0A0A0A',
            stock: 10,
            images: [],
          },
        ]
  );
  const [saving, setSaving] = useState(false);

  const toggleSize = (s: string) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const updateColor = (key: string, patch: Partial<DraftColor>) => {
    setColors((prev) => prev.map((c) => (c.clientKey === key ? { ...c, ...patch } : c)));
  };

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      {
        clientKey: uid(),
        name: `COLOR ${prev.length + 1}`,
        hex: '#FFFFFF',
        stock: 0,
        images: [],
      },
    ]);
  };

  const removeColor = (key: string) => {
    setColors((prev) => prev.filter((c) => c.clientKey !== key));
  };

  const onUploadImages = async (key: string, files: FileList | null) => {
    if (!files?.length) return;
    const urls: string[] = [];
    try {
      for (let i = 0; i < files.length; i++) {
        const { url } = await uploadImage(files[i]);
        urls.push(url);
      }
      const row = colors.find((c) => c.clientKey === key);
      if (!row) return;
      updateColor(key, { images: [...(row.images || []), ...urls] });
      toast.success('IMAGES UPLOADED');
    } catch {
      toast.error('UPLOAD FAILED');
    }
  };

  const submit = async () => {
    if (!name.trim()) {
      toast.error('NAME REQUIRED');
      return;
    }
    const cleanColors = colors.map(({ clientKey: _unused, ...rest }) => ({
      ...rest,
      images: (rest.images || []).filter(Boolean),
    }));

    const payload = {
      name,
      category,
      price: Number(price),
      description,
      sizes,
      tags,
      isFeatured,
      isVisible,
      colors: cleanColors,
    };

    setSaving(true);
    try {
      if (initial?._id) {
        await updateProduct(initial._id, payload as Partial<Product>);
        toast.success('PRODUCT UPDATED');
      } else {
        await createProduct(payload as Partial<Product>);
        toast.success('PRODUCT CREATED');
      }
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'SAVE FAILED');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Product Name
          </span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
          />
        </label>
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Category
          </span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-xs uppercase tracking-widest text-accent"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Price</span>
          <input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
        />
      </label>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Sizes</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSize(s)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                sizes.includes(s)
                  ? 'bg-secondary text-primary'
                  : 'bg-surface text-muted ring-1 ring-white/10'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Tags</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {TAG_OPTS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTag(t)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-widest ${
                tags.includes(t)
                  ? 'bg-secondary text-primary'
                  : 'bg-surface text-muted ring-1 ring-white/10'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured
        </label>
        <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-accent">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
          />
          Visible
        </label>
      </div>

      <div className="space-y-6 border-t border-white/10 pt-8">
        <div className="flex items-center justify-between gap-4">
          <p className="font-display text-2xl uppercase text-accent">COLORS</p>
          <Button type="button" variant="outline" onClick={addColor}>
            + ADD COLOR
          </Button>
        </div>

        {colors.map((c) => (
          <div key={c.clientKey} className="space-y-4 rounded-lg border border-white/10 bg-surface p-4">
            <div className="flex flex-wrap items-end gap-4">
              <label className="flex-1 space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Color Name
                </span>
                <input
                  value={c.name}
                  onChange={(e) => updateColor(c.clientKey, { name: e.target.value })}
                  className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Hex
                </span>
                <input
                  type="color"
                  value={c.hex}
                  onChange={(e) => updateColor(c.clientKey, { hex: e.target.value })}
                  className="h-10 w-14 cursor-pointer bg-transparent"
                />
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Stock
                </span>
                <input
                  type="number"
                  min={0}
                  value={c.stock}
                  onChange={(e) =>
                    updateColor(c.clientKey, { stock: Number(e.target.value) })
                  }
                  className="w-28 rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
                />
              </label>
              <button
                type="button"
                onClick={() => removeColor(c.clientKey)}
                aria-label="Remove color"
                title="Remove color"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-red-400/40 text-red-400 transition hover:bg-red-500/10"
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
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Images (drag files or browse)
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onUploadImages(c.clientKey, e.target.files)}
                className="mt-2 block w-full font-mono text-[10px] text-muted file:mr-4 file:bg-secondary file:px-3 file:py-2 file:font-mono file:text-[10px] file:uppercase file:text-primary"
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {c.images?.map((src) => (
                  <div key={src} className="relative h-20 w-16 overflow-hidden rounded-sm bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-4 border-t border-white/10 pt-8">
        <Button type="button" onClick={submit} disabled={saving}>
          {saving ? 'SAVING…' : 'SAVE PRODUCT'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          CANCEL
        </Button>
      </div>
    </div>
  );
}
