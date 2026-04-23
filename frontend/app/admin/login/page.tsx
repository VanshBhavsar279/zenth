'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { authMe, loginAdmin } from '@/lib/api';
import { useAdminAuthStore } from '@/lib/store';

export default function AdminLoginPage() {
  const router = useRouter();
  const setAuth = useAdminAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await authMe();
        if (!cancelled && me.authenticated) router.replace('/admin/dashboard');
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginAdmin(email, password);
      setAuth(true, res.email);
      toast.success('WELCOME BACK');
      router.push('/admin/dashboard');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'LOGIN FAILED');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-white/10 bg-surface p-8 shadow-2xl">
        <p className="font-display text-4xl uppercase tracking-widest text-secondary">ZENTH</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-muted">
          ADMIN ACCESS
        </p>
        <form className="mt-10 space-y-6" onSubmit={submit}>
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Email
            </span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
              required
            />
          </label>
          <label className="block space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
              Password
            </span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 pr-12 font-sans text-sm text-accent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted hover:text-secondary"
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 3l18 18" />
                    <path d="M10.58 10.58A2 2 0 0012 14a2 2 0 001.42-.58" />
                    <path d="M9.88 5.09A9.78 9.78 0 0112 5c5 0 9.27 3.11 11 7-1.04 2.34-2.86 4.28-5.17 5.4" />
                    <path d="M6.61 6.61C4.58 8 3 9.87 2 12c.69 1.54 1.71 2.92 3 4.02" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </Button>
        </form>
      </div>
    </div>
  );
}
