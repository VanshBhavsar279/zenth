'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useThemeStore } from '@/lib/store';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'HOME' },
  { href: '/products', label: 'PRODUCTS' },
  { href: '/contact', label: 'CONTACT' },
];

export function Navbar() {
  const pathname = usePathname();
  const logoUrl = useThemeStore((s) => s.logoUrl);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const atHome = pathname === '/';
  const transparent = atHome && !scrolled && !open;

  return (
    <>
      <motion.header
        className={cn(
          'fixed left-0 right-0 top-0 z-50 border-b transition-colors duration-300',
          transparent ? 'border-transparent bg-transparent' : 'border-white/10 bg-primary/95 backdrop-blur-md'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:py-5">
          <Link href="/" className="relative z-[60] flex items-center gap-3">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="ZENTH"
                width={120}
                height={40}
                className="h-9 w-auto object-contain md:h-10"
                unoptimized
              />
            ) : (
              <span className="font-display text-3xl uppercase tracking-[0.2em] text-secondary md:text-4xl">
                ZENTH
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'font-mono text-xs uppercase tracking-[0.25em] transition-colors hover:text-secondary',
                  pathname === l.href ? 'text-secondary' : 'text-accent/90'
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="Menu"
            className="relative z-[60] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
            onClick={() => setOpen((o) => !o)}
          >
            <span
              className={cn(
                'h-0.5 w-7 bg-accent transition-transform',
                open && 'translate-y-2 rotate-45'
              )}
            />
            <span className={cn('h-0.5 w-7 bg-accent transition-opacity', open && 'opacity-0')} />
            <span
              className={cn(
                'h-0.5 w-7 bg-accent transition-transform',
                open && '-translate-y-2 -rotate-45'
              )}
            />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-primary pt-24 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link
                    href={l.href}
                    className="font-display text-5xl uppercase tracking-wide text-accent"
                    onClick={() => setOpen(false)}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
