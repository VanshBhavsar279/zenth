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
  return product.colors.every((c) => getColorStock(c) <= 0);
}

export function encodeWhatsAppMessage(text: string): string {
  return encodeURIComponent(text);
}

export function getColorStock(color: Product['colors'][number]): number {
  if (Array.isArray(color.sizeStock) && color.sizeStock.length > 0) {
    return color.sizeStock.reduce((sum, row) => sum + Number(row.stock || 0), 0);
  }
  return Number(color.stock || 0);
}

export function getColorSizeStock(
  color: Product['colors'][number],
  size: string | null | undefined
): number {
  if (!size) return getColorStock(color);
  if (Array.isArray(color.sizeStock) && color.sizeStock.length > 0) {
    const row = color.sizeStock.find((r) => r.size === size);
    return Number(row?.stock || 0);
  }
  return Number(color.stock || 0);
}
