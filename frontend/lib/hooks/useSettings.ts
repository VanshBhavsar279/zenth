'use client';

import { useEffect, useState } from 'react';
import { getTheme } from '@/lib/api';
import type { ThemeSettings } from '@/lib/types';

/** Fetch theme once (for pages that need settings object without global store) */
export function useSettings() {
  const [data, setData] = useState<ThemeSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t = await getTheme();
        if (!cancelled) setData(t);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e : new Error('Failed to load settings'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}
