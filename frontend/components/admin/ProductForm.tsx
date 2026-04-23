'use client';

import { useEffect, useRef, useState } from 'react';
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

function syncSizeStock(
  sizeStock: Array<{ size: string; stock: number }> | undefined,
  sizes: string[]
) {
  const activeSizes = sizes.length ? sizes : ['ONE SIZE'];
  return activeSizes.map((size) => {
    const existing = sizeStock?.find((s) => s.size === size);
    return { size, stock: Number(existing?.stock ?? 0) };
  });
}

function sumSizeStock(rows: Array<{ size: string; stock: number }> | undefined): number {
  return (rows || []).reduce((sum, row) => sum + Number(row.stock || 0), 0);
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
  const [activeNumberField, setActiveNumberField] = useState<string | null>(null);
  const [colors, setColors] = useState<DraftColor[]>(() =>
    initial?.colors?.length
      ? initial.colors.map((c) => ({
          ...c,
          clientKey: c._id ?? uid(),
          images: c.images ?? [],
          sizeStock:
            c.sizeStock && c.sizeStock.length > 0
              ? c.sizeStock
              : [{ size: initial?.sizes?.[0] || 'ONE SIZE', stock: Number(c.stock || 0) }],
        }))
      : [
          {
            clientKey: uid(),
            name: 'Jet Black',
            hex: '#0A0A0A',
            stock: 10,
            images: [],
            sizeStock: [{ size: 'M', stock: 10 }],
          },
        ]
  );
  const [saving, setSaving] = useState(false);
  const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    setColors((prev) =>
      prev.map((c) => ({
        ...c,
        sizeStock: syncSizeStock(c.sizeStock, sizes),
      }))
    );
  }, [sizes]);

  const toggleSize = (s: string) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleTag = (t: string) => {
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const updateColor = (key: string, patch: Partial<DraftColor>) => {
    setColors((prev) => prev.map((c) => (c.clientKey === key ? { ...c, ...patch } : c)));
  };

  const getNumberFieldValue = (fieldKey: string, value: number) =>
    activeNumberField === fieldKey && value === 0 ? '' : value;

  const addColor = () => {
    setColors((prev) => [
      ...prev,
      {
        clientKey: uid(),
        name: `COLOR ${prev.length + 1}`,
        hex: '#FFFFFF',
        stock: 0,
        images: [],
        sizeStock: syncSizeStock([], sizes),
      },
    ]);
  };

  const removeColor = (key: string) => {
    setColors((prev) => prev.filter((c) => c.clientKey !== key));
  };

  const removeColorImage = (colorKey: string, imageIndex: number) => {
    setColors((prev) =>
      prev.map((color) =>
        color.clientKey === colorKey
          ? {
              ...color,
              images: (color.images || []).filter((_, idx) => idx !== imageIndex),
            }
          : color
      )
    );
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
    const cleanColors = colors.map(({ clientKey: _unused, ...rest }) => {
      const normalizedSizeStock = syncSizeStock(rest.sizeStock, sizes);
      return {
        ...rest,
        sizeStock: normalizedSizeStock,
        stock: Number(rest.stock || 0),
        images: (rest.images || []).filter(Boolean),
      };
    });

    for (const color of cleanColors) {
      const childrenTotal = sumSizeStock(color.sizeStock);
      if (childrenTotal !== Number(color.stock || 0)) {
        toast.error(
          `QUANTITY MISMATCH FOR ${color.name.toUpperCase()}: CHILD TOTAL ${childrenTotal}, MAIN ${color.stock}`
        );
        return;
      }
    }

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
            value={getNumberFieldValue('price', Number(price || 0))}
            onFocus={() => setActiveNumberField('price')}
            onBlur={() =>
              setActiveNumberField((prev) => (prev === 'price' ? null : prev))
            }
            onChange={(e) => setPrice(e.target.value === '' ? 0 : Number(e.target.value))}
            className="no-spinner w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
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
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-[minmax(0,1fr)_120px_160px_40px]">
              <label className="space-y-2">
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
                  Color
                </span>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={c.hex}
                    onChange={(e) => updateColor(c.clientKey, { hex: e.target.value.toUpperCase() })}
                    className="h-10 w-10 cursor-pointer appearance-none rounded-full border border-white/20 bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
                    aria-label="Pick color"
                  />
                </div>
              </label>
              <label className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Main Quantity
                </span>
                <input
                  type="number"
                  min={0}
                  value={getNumberFieldValue(`${c.clientKey}::main`, Number(c.stock || 0))}
                  onFocus={() => setActiveNumberField(`${c.clientKey}::main`)}
                  onBlur={() =>
                    setActiveNumberField((prev) =>
                      prev === `${c.clientKey}::main` ? null : prev
                    )
                  }
                  onChange={(e) =>
                    updateColor(c.clientKey, {
                      stock: Math.max(0, e.target.value === '' ? 0 : Number(e.target.value)),
                    })
                  }
                  className="no-spinner w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
                />
              </label>
              <button
                type="button"
                onClick={() => removeColor(c.clientKey)}
                aria-label="Remove color"
                title="Remove color"
                className="inline-flex h-10 w-10 items-center justify-center rounded-sm text-red-400 transition hover:bg-red-500/10"
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
                ref={(el) => {
                  fileInputsRef.current[c.clientKey] = el;
                }}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => onUploadImages(c.clientKey, e.target.files)}
                className="hidden"
              />
              <div className="mt-2 flex items-center gap-3">
                <Button
                  type="button"
                  onClick={() => fileInputsRef.current[c.clientKey]?.click()}
                  className="px-4 py-2 text-[10px]"
                >
                  CHOOSE FILES
                </Button>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                  Click button to select images
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {c.images?.map((src, idx) => (
                  <div
                    key={`${src}-${idx}`}
                    className="group relative h-20 w-16 overflow-hidden rounded-sm bg-black"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove image"
                      title="Remove image"
                      onClick={() => removeColorImage(c.clientKey, idx)}
                      className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/75 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M6 6l12 12" />
                        <path d="M18 6L6 18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
                Quantity by Size
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                {syncSizeStock(c.sizeStock, sizes).map((row) => (
                  <label
                    key={`${c.clientKey}-${row.size}`}
                    className="flex items-center justify-between gap-3 rounded-sm border border-white/10 bg-primary px-3 py-2"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
                      {row.size}
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={getNumberFieldValue(
                        `${c.clientKey}::${row.size}`,
                        Number(row.stock || 0)
                      )}
                      onFocus={() => setActiveNumberField(`${c.clientKey}::${row.size}`)}
                      onBlur={() =>
                        setActiveNumberField((prev) =>
                          prev === `${c.clientKey}::${row.size}` ? null : prev
                        )
                      }
                      onChange={(e) => {
                        const val = Math.max(0, e.target.value === '' ? 0 : Number(e.target.value));
                        updateColor(c.clientKey, {
                          sizeStock: syncSizeStock(c.sizeStock, sizes).map((s) =>
                            s.size === row.size ? { ...s, stock: val } : s
                          ),
                        });
                      }}
                      className="no-spinner w-20 rounded-sm border border-white/10 bg-surface px-2 py-1 text-right font-mono text-xs text-accent"
                    />
                  </label>
                ))}
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-muted">
                Child total: {sumSizeStock(syncSizeStock(c.sizeStock, sizes))} / Main:{' '}
                {Number(c.stock || 0)}
              </p>
              {sumSizeStock(syncSizeStock(c.sizeStock, sizes)) !== Number(c.stock || 0) && (
                <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-red-400">
                  CHILD SIZE QUANTITIES MUST EQUAL MAIN QUANTITY
                </p>
              )}
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
