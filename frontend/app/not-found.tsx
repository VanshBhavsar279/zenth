import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.5em] text-muted">404</p>
      <h1 className="mt-6 font-display text-6xl uppercase leading-none text-accent md:text-8xl">
        LOST IN THE STREETS
      </h1>
      <p className="mt-6 max-w-md font-sans text-muted">This drop doesn&apos;t exist.</p>
      <Link href="/" className="mt-10">
        <Button variant="primary">BACK HOME</Button>
      </Link>
    </div>
  );
}
