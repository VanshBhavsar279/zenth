'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { updateTheme, uploadImage } from '@/lib/api';
import { useThemeStore } from '@/lib/store';

export function LogoUpload() {
  const logoUrl = useThemeStore((s) => s.logoUrl);
  const setTheme = useThemeStore((s) => s.setTheme);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      const res = await updateTheme({ logoUrl: url });
      setTheme({ logoUrl: res.logoUrl || '' });
      toast.success('LOGO UPDATED');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'UPLOAD FAILED');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative h-24 w-40 bg-surface ring-1 ring-white/10">
        {logoUrl ? (
          <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" unoptimized />
        ) : (
          <div className="flex h-full items-center justify-center font-mono text-[10px] uppercase text-muted">
            NO LOGO
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
        disabled={uploading}
      />
      <Button type="button" variant="outline" disabled={uploading} onClick={() => inputRef.current?.click()}>
        {uploading ? 'UPLOADING…' : 'UPLOAD NEW LOGO'}
      </Button>
    </div>
  );
}
