'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner({ label = 'LOADING' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-16">
      <motion.div
        className="h-12 w-12 rounded-full border-2 border-muted border-t-secondary"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
      />
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-muted">{label}</span>
    </div>
  );
}
