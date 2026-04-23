'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-[50vh]">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
      <Curtain pathname={pathname} />
    </div>
  );
}

function Curtain({ pathname }: { pathname: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`curtain-${pathname}`}
        className="pointer-events-none fixed inset-0 z-[90] bg-primary"
        initial={{ clipPath: 'inset(0 100% 0 0)' }}
        animate={{
          clipPath: [
            'inset(0 100% 0 0)',
            'inset(0 0 0 0)',
            'inset(0 0 0 0)',
            'inset(0 0 0 100%)',
          ],
        }}
        transition={{
          duration: 0.85,
          times: [0, 0.38, 0.55, 1],
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </AnimatePresence>
  );
}
