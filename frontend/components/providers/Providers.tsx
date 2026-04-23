'use client';

import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { MagneticCursor } from '@/components/layout/MagneticCursor';
import { useThemeLoader } from '@/lib/hooks/useTheme';
import { useThemeStore } from '@/lib/store';

export function Providers({ children }: { children: React.ReactNode }) {
  useThemeLoader();

  useEffect(() => {
    useThemeStore.getState().applyCssVariables();
  }, []);

  return (
    <>
      <MagneticCursor />
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          className: '!bg-surface !text-accent !font-mono !text-xs !uppercase !tracking-widest !border !border-white/10',
          duration: 3500,
        }}
      />
    </>
  );
}
