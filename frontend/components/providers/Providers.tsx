'use client';

import { Toaster } from 'react-hot-toast';
import { MagneticCursor } from '@/components/layout/MagneticCursor';
import { BootLoader } from '@/components/ui/BootLoader';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MagneticCursor />
      <BootLoader>{children}</BootLoader>
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
