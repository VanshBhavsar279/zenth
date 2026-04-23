'use client';

import { cn } from '@/lib/utils';

export function SizeSelector({
  sizes,
  selected,
  onChange,
  disabledSizes,
}: {
  sizes: string[];
  selected: string | null;
  onChange: (s: string) => void;
  disabledSizes?: Set<string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const disabled = disabledSizes?.has(s);
        return (
          <button
            key={s}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange(s)}
            className={cn(
              'rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition',
              selected === s
                ? 'border-secondary bg-secondary text-primary'
                : 'border-white/20 text-accent hover:border-secondary',
              disabled && 'cursor-not-allowed opacity-35'
            )}
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}
