'use client';

import { useEffect } from 'react';
import { getTheme } from '@/lib/api';
import { useThemeStore } from '@/lib/store';

export function useThemeLoader() {
  const setTheme = useThemeStore((s) => s.setTheme);
  const applyCssVariables = useThemeStore((s) => s.applyCssVariables);
  const setHydrated = useThemeStore((s) => s.setHydrated);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const t = await getTheme();
        if (cancelled) return;
        setTheme({
          primaryColor: t.primaryColor,
          secondaryColor: t.secondaryColor,
          logoUrl: t.logoUrl || '',
        });
        applyCssVariables();
      } catch {
        applyCssVariables();
      } finally {
        if (!cancelled) setHydrated(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [setTheme, applyCssVariables, setHydrated]);
}
