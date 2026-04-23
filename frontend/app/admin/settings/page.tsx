'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ContactForm } from '@/components/admin/ContactForm';
import { LogoUpload } from '@/components/admin/LogoUpload';
import { RequireAdmin } from '@/components/admin/RequireAdmin';
import { ThemePicker } from '@/components/admin/ThemePicker';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useContactInfo } from '@/lib/hooks/useContactInfo';
import { useThemeStore } from '@/lib/store';

export default function AdminSettingsPage() {
  return (
    <RequireAdmin>
      <SettingsInner />
    </RequireAdmin>
  );
}

function SettingsInner() {
  const { data, loading } = useContactInfo();
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const secondaryColor = useThemeStore((s) => s.secondaryColor);
  const logoUrl = useThemeStore((s) => s.logoUrl);
  const [editMode, setEditMode] = useState({
    theme: false,
    logo: false,
    contact: false,
  });

  if (loading && !data) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 md:flex-row">
        <AdminSidebar />
        <div className="flex-1">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 md:flex-row md:gap-14">
      <AdminSidebar />
      <div className="flex-1 space-y-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">CONTROL ROOM</p>
          <h1 className="font-display text-5xl uppercase text-accent md:text-6xl">SETTINGS</h1>
        </div>

        <section className="space-y-6 border-t border-white/10 pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl uppercase text-secondary">THEME</h2>
            <button
              type="button"
              aria-label={editMode.theme ? 'Close theme edit mode' : 'Open theme edit mode'}
              title={editMode.theme ? 'Close' : 'Edit'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-muted transition hover:border-secondary hover:text-secondary"
              onClick={() =>
                setEditMode((prev) => ({
                  ...prev,
                  theme: !prev.theme,
                }))
              }
            >
              {editMode.theme ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              )}
            </button>
          </div>
          {editMode.theme ? (
            <ThemePicker />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-sm border border-white/10 bg-surface p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Primary</p>
                <div className="mt-3 h-14 rounded-sm border border-white/10" style={{ background: primaryColor }} />
                <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                  {primaryColor}
                </p>
              </div>
              <div className="rounded-sm border border-white/10 bg-surface p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Secondary</p>
                <div
                  className="mt-3 h-14 rounded-sm border border-white/10"
                  style={{ background: secondaryColor }}
                />
                <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                  {secondaryColor}
                </p>
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6 border-t border-white/10 pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl uppercase text-secondary">LOGO</h2>
            <button
              type="button"
              aria-label={editMode.logo ? 'Close logo edit mode' : 'Open logo edit mode'}
              title={editMode.logo ? 'Close' : 'Edit'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-muted transition hover:border-secondary hover:text-secondary"
              onClick={() =>
                setEditMode((prev) => ({
                  ...prev,
                  logo: !prev.logo,
                }))
              }
            >
              {editMode.logo ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              )}
            </button>
          </div>
          {editMode.logo ? (
            <LogoUpload />
          ) : (
            <div className="rounded-sm border border-white/10 bg-surface p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Current Logo</p>
              <div className="mt-3 relative h-24 w-40 overflow-hidden rounded-sm border border-white/10 bg-primary">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Current logo" fill className="object-contain p-2" unoptimized />
                ) : (
                  <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase tracking-widest text-muted">
                    No logo saved
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        <section className="space-y-6 border-t border-white/10 pt-10">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-3xl uppercase text-secondary">CONTACT INFO</h2>
            <button
              type="button"
              aria-label={editMode.contact ? 'Close contact edit mode' : 'Open contact edit mode'}
              title={editMode.contact ? 'Close' : 'Edit'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/15 text-muted transition hover:border-secondary hover:text-secondary"
              onClick={() =>
                setEditMode((prev) => ({
                  ...prev,
                  contact: !prev.contact,
                }))
              }
            >
              {editMode.contact ? (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.1 2.1 0 113 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              )}
            </button>
          </div>
          {editMode.contact ? (
            <ContactForm initial={data ?? null} />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <PreviewItem label="Brand Name" value={data?.brandName} />
              <PreviewItem label="WhatsApp" value={data?.whatsappNumber} />
              <PreviewItem label="Phone" value={data?.phone} />
              <PreviewItem label="Email" value={data?.email} />
              <PreviewItem label="Instagram" value={data?.instagramHandle} />
              <PreviewItem label="Facebook" value={data?.facebookHandle} />
              <PreviewItem label="Address" value={data?.address} full />
              <PreviewItem label="Map URL" value={data?.mapEmbedUrl} full />
              <PreviewItem label="About" value={data?.aboutText} full />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function PreviewItem({
  label,
  value,
  full,
}: {
  label: string;
  value?: string;
  full?: boolean;
}) {
  return (
    <div className={`rounded-sm border border-white/10 bg-surface p-4 ${full ? 'sm:col-span-2' : ''}`}>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 break-all font-sans text-sm text-accent/90">{value?.trim() ? value : '—'}</p>
    </div>
  );
}
