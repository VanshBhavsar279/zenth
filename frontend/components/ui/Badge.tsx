import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Badge({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm border border-secondary/40 bg-surface px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-secondary',
        className
      )}
    >
      {children}
    </span>
  );
}
