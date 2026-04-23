'use client';

import { useEffect, useMemo, useState } from 'react';
import { ImageGallery } from '@/components/product/ImageGallery';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { SizeSelector } from '@/components/product/SizeSelector';
import { WhatsAppButton } from '@/components/product/WhatsAppButton';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { getContact, getProductById, getProducts } from '@/lib/api';
import type { ContactInfo, Product } from '@/lib/types';
import { formatPriceINR } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function ProductDetailClient({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [related, setRelated] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [colorIdx, setColorIdx] = useState(0);
  const [size, setSize] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [p, c] = await Promise.all([getProductById(id), getContact()]);
        if (cancelled) return;
        setProduct(p);
        setContact(c);
        const firstSize = p.sizes?.[0] ?? null;
        setSize(firstSize);
        const rel = await getProducts({
          category: p.category,
          sort: 'newest',
        });
        if (cancelled) return;
        setRelated(rel.filter((x) => x._id !== p._id).slice(0, 3));
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    setColorIdx(0);
  }, [id]);

  const images = useMemo(() => product?.colors[colorIdx]?.images ?? [], [product, colorIdx]);

  const selectedColor = product?.colors[colorIdx];
  const stock = selectedColor?.stock ?? 0;

  const whatsappMessage =
    product && selectedColor && size
      ? `Hey ZENTH! 👋
I'm interested in the following product:

🧥 *Product:* ${product.name}
🎨 *Color:* ${selectedColor.name}
📏 *Size:* ${size}
💰 *Price:* ₹${product.price}

Please share availability and further details. Thanks!`
      : '';

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="font-display text-3xl uppercase text-accent">{error || 'NOT FOUND'}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <SectionReveal>
          <ImageGallery images={images} productName={product.name} />
        </SectionReveal>

        <SectionReveal className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {product.tags?.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <div>
            <h1 className="font-display text-5xl uppercase leading-none text-accent md:text-7xl">
              {product.name}
            </h1>
            <p className="mt-4 font-mono text-xl text-secondary">{formatPriceINR(product.price)}</p>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">COLOR</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {product.colors.map((c, idx) => {
                const out = (c.stock ?? 0) <= 0;
                return (
                  <button
                    key={c._id ?? c.hex + idx}
                    type="button"
                    title={c.name}
                    onClick={() => setColorIdx(idx)}
                    className={cn(
                      'relative h-12 w-12 rounded-full ring-2 ring-offset-2 ring-offset-primary transition',
                      idx === colorIdx ? 'ring-secondary' : 'ring-white/20 hover:ring-white/40'
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {out && (
                      <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/70 text-lg font-bold text-white">
                        ×
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedColor && (
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
                {selectedColor.name}
                {stock <= 0 && (
                  <span className="ml-2 text-red-400">OUT OF STOCK FOR THIS COLOR</span>
                )}
              </p>
            )}
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">SIZE</p>
            <div className="mt-3">
              <SizeSelector
                sizes={product.sizes?.length ? product.sizes : ['ONE SIZE']}
                selected={size}
                onChange={setSize}
              />
            </div>
          </div>

          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">DETAILS</p>
            <p className="mt-2 max-w-prose font-sans text-sm leading-relaxed text-muted">
              {product.description || 'Premium construction. Limited quantities.'}
            </p>
          </div>

          {contact?.whatsappNumber && size && (
            <WhatsAppButton phone={contact.whatsappNumber} message={whatsappMessage} />
          )}
          {stock <= 0 && (
            <p className="font-mono text-xs uppercase text-red-400">CURRENT COLOR IS OUT OF STOCK — YOU CAN STILL REACH OUT.</p>
          )}
        </SectionReveal>
      </div>

      <div className="mt-24 border-t border-white/10 pt-16">
        <SectionReveal>
          <h2 className="font-display text-4xl uppercase text-accent">YOU MAY ALSO LIKE</h2>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
            Same category. Different energy.
          </p>
        </SectionReveal>
        <RelatedProducts products={related} loading={false} />
      </div>
    </div>
  );
}
