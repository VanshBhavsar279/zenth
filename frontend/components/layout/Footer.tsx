'use client';

import Link from 'next/link';
import { useContactStore } from '@/lib/store';

export function Footer() {
  const year = new Date().getFullYear();
  const brandName = useContactStore((s) => s.contact?.brandName?.trim() || 'ZENTH');
  const footerTagline = useContactStore((s) => s.contact?.footerTagline?.trim() || '');
  return (
    <footer className="border-t border-white/10 bg-surface">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl uppercase tracking-widest text-secondary">{brandName}</p>
          {footerTagline ? (
            <p className="mt-2 max-w-md font-mono text-xs uppercase tracking-wider text-muted">{footerTagline}</p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest">
          <Link href="/products" className="text-accent/80 hover:text-secondary">
            SHOP
          </Link>
          <Link href="/contact" className="text-accent/80 hover:text-secondary">
            CONTACT
          </Link>
        </div>
      </div>
      <div className="border-t border-white/5 px-4 py-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        © {year} {brandName} ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}
