'use client';

import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: Variant;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest transition-colors disabled:opacity-40';

  const styles: Record<Variant, string> = {
    primary:
      'bg-secondary text-primary px-8 py-3 hover:opacity-90 active:scale-[0.98]',
    outline:
      'border border-accent/30 px-8 py-3 text-accent hover:border-secondary hover:text-secondary',
    ghost: 'px-4 py-2 text-muted hover:text-secondary',
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(base, styles[variant], className)}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
