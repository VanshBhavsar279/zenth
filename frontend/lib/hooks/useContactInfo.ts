'use client';

import { useEffect, useState } from 'react';
import { getContact } from '@/lib/api';
import type { ContactInfo } from '@/lib/types';

export function useContactInfo() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const c = await getContact();
        if (!cancelled) setData(c);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e : new Error('Failed to load contact'));
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
