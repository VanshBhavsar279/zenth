'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import Tilt from 'react-parallax-tilt';
import { Badge } from '@/components/ui/Badge';
import type { Product } from '@/lib/types';
import { formatPriceINR, getColorStock, isProductOutOfStock, productSecondImage } from '@/lib/utils';
import { cn } from '@/lib/utils';

export function ProductCard({ product, className }: { product: Product; className?: string }) {
  const [active, setActive] = useState(0);
  const [hoverColor, setHoverColor] = useState<number | null>(null);
  const [cardHover, setCardHover] = useState(false);

  const displayIdx = hoverColor !== null ? hoverColor : active;
  const PLACEHOLDER =
    'https://placehold.co/600x800/111111/E8FF00/png?text=ZENTH';
  const mainUrl = product.colors[displayIdx]?.images?.[0] || PLACEHOLDER;
  const secondUrl = productSecondImage(product, displayIdx);
  const oos = isProductOutOfStock(product);

  return (
    <div className={cn('group relative', className)}>
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        scale={1.02}
        transitionSpeed={1200}
        className="rounded-sm"
      >
        <Link
          href={`/products/${product._id}`}
          className="block overflow-hidden rounded-sm bg-surface ring-1 ring-white/10"
          onMouseEnter={() => setCardHover(true)}
          onMouseLeave={() => {
            setCardHover(false);
            setHoverColor(null);
          }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-primary md:aspect-[3/4]">
            {oos && (
              <div className="absolute left-3 top-3 z-20">
                <Badge>OUT OF STOCK</Badge>
              </div>
            )}
            <Image
              src={mainUrl}
              alt={product.name}
              fill
              className={cn(
                'object-cover transition-opacity duration-150',
                cardHover && secondUrl ? 'opacity-100' : 'opacity-100'
              )}
              sizes="(max-width:768px) 100vw, 33vw"
              unoptimized
            />
            {secondUrl && (
              <motion.div
                className="pointer-events-none absolute inset-0"
                initial={false}
                animate={{ opacity: cardHover ? 1 : 0, x: cardHover ? 0 : 24 }}
                transition={{ duration: 0.35 }}
              >
                <Image
                  src={secondUrl}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                  unoptimized
                />
              </motion.div>
            )}
            <motion.div
              className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4"
              initial={false}
              animate={{ y: cardHover ? 0 : '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 220 }}
            >
              <span
                className="block text-center font-mono text-xs uppercase tracking-[0.3em]"
                style={{ color: 'var(--color-secondary)' }}
              >
                INQUIRE
              </span>
            </motion.div>
          </div>
          <div className="space-y-2 p-3 md:space-y-3 md:p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base uppercase leading-tight text-accent md:text-xl">
                {product.name}
              </h3>
              <span className="font-mono text-xs text-secondary md:text-sm">
                {formatPriceINR(product.price)}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c, idx) => (
                <button
                  key={c.hex + c.name + idx}
                  type="button"
                  title={c.name}
                  className="relative h-5 w-5 rounded-full ring-2 ring-transparent transition ring-offset-2 ring-offset-surface hover:scale-110 md:h-6 md:w-6"
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: idx === active ? '0 0 0 1px var(--color-secondary)' : undefined,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActive(idx);
                  }}
                  onMouseEnter={() => setHoverColor(idx)}
                  onMouseLeave={() => setHoverColor(null)}
                >
                  {getColorStock(c) <= 0 && (
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                      ×
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Link>
      </Tilt>
    </div>
  );
}
