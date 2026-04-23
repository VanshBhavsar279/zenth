'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/types';

export function useProducts(filters?: Record<string, string | string[] | undefined>) {
  const key = useMemo(() => JSON.stringify(filters ?? {}), [filters]);
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const parsed = key ? JSON.parse(key) : {};
      const products = await getProducts(parsed);
      setData(products);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Failed to load products'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [key]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

export function useFeaturedProducts() {
  const filters = useMemo(() => ({ featured: 'true' }), []);
  return useProducts(filters);
}
