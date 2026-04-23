import type { Product } from './types';

export const API_URL =
  typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatPriceINR(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function productPrimaryImage(product: Product): string | null {
  const first = product.colors?.[0];
  const img = first?.images?.[0];
  return img || null;
}

export function productImageForColor(product: Product, colorIdx: number): string | null {
  const c = product.colors?.[colorIdx];
  const img = c?.images?.[0];
  return img || null;
}

export function productSecondImage(product: Product, colorIdx: number): string | null {
  const c = product.colors?.[colorIdx];
  const img = c?.images?.[1];
  return img || c?.images?.[0] || null;
}

export function isProductOutOfStock(product: Product): boolean {
  if (!product.colors?.length) return true;
  return product.colors.every((c) => (c.stock ?? 0) <= 0);
}

export function encodeWhatsAppMessage(text: string): string {
  return encodeURIComponent(text);
}
