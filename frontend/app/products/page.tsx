import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductsClient } from '@/app/products/ProductsClient';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const metadata: Metadata = {
  title: 'All Drops',
  openGraph: {
    title: 'All Drops | ZENTH',
    description: 'Browse every ZENTH release — filters, categories, and sizes.',
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner label="LOADING DROPS" />}>
      <ProductsClient />
    </Suspense>
  );
}
