import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('skeleton-shimmer rounded-md bg-surface', className)}
      {...rest}
    />
  );
}
