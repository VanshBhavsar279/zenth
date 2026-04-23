import type { Metadata } from 'next';
import { ProductDetailClient } from '@/app/products/[id]/ProductDetailClient';

async function fetchProductMeta(id: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  try {
    const res = await fetch(`${base}/api/products/${id}`, { next: { revalidate: 120 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await fetchProductMeta(id);
  const title = p?.name ? `${p.name} | ZENTH` : 'Product | ZENTH';
  return {
    title: p?.name || 'Product',
    openGraph: {
      title,
      description: p?.description || 'ZENTH streetwear product',
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductDetailClient id={id} />;
}
