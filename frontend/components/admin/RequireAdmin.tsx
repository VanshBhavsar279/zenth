'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { authMe } from '@/lib/api';
import { useAdminAuthStore } from '@/lib/store';

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { checked, authenticated, setAuth } = useAdminAuthStore();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await authMe();
        if (cancelled) return;
        if (me.authenticated && me.email) setAuth(true, me.email);
        else {
          setAuth(false, null);
          router.replace('/admin/login');
        }
      } catch {
        if (!cancelled) {
          setAuth(false, null);
          router.replace('/admin/login');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, setAuth]);

  if (!checked) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <LoadingSpinner label="CHECKING SESSION" />
      </div>
    );
  }

  if (!authenticated) return null;

  return <>{children}</>;
}
