'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logoutAdmin } from '@/lib/api';
import { useAdminAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/stock', label: 'Stock' },
  { href: '/admin/settings', label: 'Settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const setAuth = useAdminAuthStore((s) => s.setAuth);

  const onLogout = async () => {
    try {
      await logoutAdmin();
      setAuth(false, null);
      toast.success('LOGGED OUT');
      router.push('/admin/login');
    } catch {
      toast.error('LOGOUT FAILED');
    }
  };

  return (
    <aside className="flex flex-col gap-8 border-b border-white/10 pb-8 md:w-56 md:border-b-0 md:border-r md:pb-0 md:pr-8">
      <p className="font-display text-3xl uppercase tracking-widest text-secondary">ADMIN</p>
      <nav className="flex flex-row flex-wrap gap-4 md:flex-col md:gap-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              'font-mono text-xs uppercase tracking-[0.25em]',
              pathname === l.href ? 'text-secondary' : 'text-muted hover:text-accent'
            )}
          >
            {l.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={onLogout}
          className="text-left font-mono text-xs uppercase tracking-[0.25em] text-muted hover:text-red-400"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}
