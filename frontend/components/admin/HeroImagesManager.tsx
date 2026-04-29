'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { getHeroImages, updateHeroImages, uploadHeroImages } from '@/lib/api';

type View = 'mobile' | 'desktop';

export function HeroImagesManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<null | View>(null);
  const [mobile, setMobile] = useState<string[]>([]);
  const [desktop, setDesktop] = useState<string[]>([]);
  const [mobileUrlText, setMobileUrlText] = useState('');
  const [desktopUrlText, setDesktopUrlText] = useState('');
  const mobileRef = useRef<HTMLInputElement>(null);
  const desktopRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getHeroImages();
        if (cancelled) return;
        const m = await normalizeStoredList(res.heroImagesMobile || []);
        const d = await normalizeStoredList(res.heroImagesDesktop || []);
        if (cancelled) return;
        setMobile(m);
        setDesktop(d);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'FAILED TO LOAD HERO IMAGES');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onUpload = async (view: View, files: FileList | null) => {
    const list = files ? Array.from(files) : [];
    if (list.length === 0) return;
    setUploading(view);
    try {
      const res = await uploadHeroImages(view, list);
      const urls = res.items.map((x) => x.url).filter(Boolean);
      if (view === 'mobile') setMobile((prev) => [...urls, ...prev]);
      else setDesktop((prev) => [...urls, ...prev]);
      toast.success('HERO IMAGES UPLOADED');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'UPLOAD FAILED');
    } finally {
      setUploading(null);
      if (view === 'mobile' && mobileRef.current) mobileRef.current.value = '';
      if (view === 'desktop' && desktopRef.current) desktopRef.current.value = '';
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateHeroImages({
        heroImagesMobile: mobile,
        heroImagesDesktop: desktop,
      });
      toast.success('HERO IMAGES SAVED');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'SAVE FAILED');
    } finally {
      setSaving(false);
    }
  };

  const addUrls = (view: View) => {
    const text = view === 'mobile' ? mobileUrlText : desktopUrlText;
    const candidates = parseUrls(text);
    if (candidates.length === 0) {
      toast.error('PASTE ONE IMAGE URL PER LINE');
      return;
    }

    void (async () => {
      const direct: string[] = [];
      const unsplashIds: string[] = [];

      for (const c of candidates) {
        const d = normalizeDirectImageUrl(c);
        if (d) {
          direct.push(d);
          continue;
        }
        const id = extractUnsplashPhotoId(c);
        if (id) unsplashIds.push(id);
      }

      if (direct.length === 0 && unsplashIds.length === 0) {
        toast.error('NO VALID URLS OR UNSPLASH IDS FOUND');
        return;
      }

      let resolved: string[] = [];
      if (unsplashIds.length) {
        try {
          resolved = (await resolveUnsplashIdsToImageUrls(unsplashIds)).filter(Boolean);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : 'FAILED TO RESOLVE UNSPLASH IDS');
          toast(
            'Tip: If Unsplash API is blocked on your network, use "UPLOAD IMAGES" or paste a direct images.unsplash.com URL.',
            { duration: 7000 }
          );
        }
      }

      const merged = dedupe([...direct, ...resolved]);
      if (merged.length === 0) {
        toast.error('NO VALID IMAGE URLS FOUND');
        return;
      }

      if (view === 'mobile') {
        setMobile((prev) => dedupe([...merged, ...prev]));
        setMobileUrlText('');
      } else {
        setDesktop((prev) => dedupe([...merged, ...prev]));
        setDesktopUrlText('');
      }
      toast.success('URLS ADDED');
    })();
  };

  const canSave = useMemo(() => !loading && !saving && !uploading, [loading, saving, uploading]);

  return (
    <div className="space-y-10">
      <p className="text-sm text-muted">
        Upload hero images or paste direct image URLs (one per line). The homepage will automatically use these images
        for mobile and desktop views.
      </p>

      <Section
        title="HERO — MOBILE"
        inputRef={mobileRef}
        uploading={uploading === 'mobile'}
        urls={mobile}
        urlText={mobileUrlText}
        setUrlText={setMobileUrlText}
        onAddUrls={() => addUrls('mobile')}
        onRemove={(idx) => setMobile((prev) => prev.filter((_, i) => i !== idx))}
        onPick={() => mobileRef.current?.click()}
        onFile={(e) => onUpload('mobile', e.target.files)}
      />

      <Section
        title="HERO — DESKTOP"
        inputRef={desktopRef}
        uploading={uploading === 'desktop'}
        urls={desktop}
        urlText={desktopUrlText}
        setUrlText={setDesktopUrlText}
        onAddUrls={() => addUrls('desktop')}
        onRemove={(idx) => setDesktop((prev) => prev.filter((_, i) => i !== idx))}
        onPick={() => desktopRef.current?.click()}
        onFile={(e) => onUpload('desktop', e.target.files)}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" type="button" disabled={!canSave} onClick={save}>
          {saving ? 'SAVING…' : 'SAVE HERO IMAGES'}
        </Button>
        <Button
          variant="outline"
          type="button"
          disabled={loading || saving || !!uploading}
          onClick={() => {
            setMobile([]);
            setDesktop([]);
          }}
        >
          CLEAR LISTS
        </Button>
      </div>
    </div>
  );
}

function Section({
  title,
  inputRef,
  uploading,
  urls,
  urlText,
  setUrlText,
  onAddUrls,
  onRemove,
  onPick,
  onFile,
}: {
  title: string;
  inputRef: React.RefObject<HTMLInputElement>;
  uploading: boolean;
  urls: string[];
  urlText: string;
  setUrlText: (v: string) => void;
  onAddUrls: () => void;
  onRemove: (idx: number) => void;
  onPick: () => void;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-2xl uppercase text-secondary">{title}</h3>
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFile}
            disabled={uploading}
          />
          <Button variant="outline" type="button" disabled={uploading} onClick={onPick}>
            {uploading ? 'UPLOADING…' : 'UPLOAD IMAGES'}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
            Paste URLs (one per line). Unsplash photo page URLs are supported too.
          </p>
          <textarea
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
            rows={4}
            placeholder="https://...jpg&#10;https://unsplash.com/photos/<id>&#10;<unsplash-id>"
            className="w-full rounded-sm border border-white/10 bg-surface p-3 font-mono text-xs text-accent/90 outline-none ring-0 placeholder:text-muted/60 focus:border-secondary"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" type="button" disabled={uploading} onClick={onAddUrls}>
            ADD URLS
          </Button>
        </div>
      </div>

      {urls.length === 0 ? (
        <div className="rounded-sm border border-white/10 bg-surface p-4 font-mono text-[10px] uppercase text-muted">
          No images added yet
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {urls.map((url, idx) => (
            <div key={`${url}-${idx}`} className="rounded-sm border border-white/10 bg-surface p-3">
              <div className="relative aspect-[16/10] overflow-hidden rounded-sm border border-white/10 bg-primary">
                <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="truncate font-mono text-[10px] uppercase tracking-widest text-muted">
                  {idx + 1}. {url}
                </p>
                <button
                  type="button"
                  className="rounded-sm border border-white/15 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted transition hover:border-secondary hover:text-secondary"
                  onClick={() => onRemove(idx)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function parseUrls(text: string) {
  return text
    .split(/\r?\n/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function dedupe(list: string[]) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const x of list) {
    const k = x.trim();
    if (!k) continue;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(k);
  }
  return out;
}

function normalizeDirectImageUrl(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Allow direct images
  if (/^https?:\/\/.+\.(png|jpe?g|webp|gif)(\?.*)?$/i.test(raw)) return raw;

  // Also allow already-resolved Unsplash images CDN URLs.
  if (/^https?:\/\/images\.unsplash\.com\/photo-[^?\s]+/i.test(raw)) return raw;

  return null;
}

function extractUnsplashPhotoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Plain Unsplash photo id (e.g. 3fXs48dBpH4)
  if (/^[A-Za-z0-9_-]{8,}$/.test(raw) && !raw.includes('/')) return raw;

  // Unsplash photo page
  // Example: https://unsplash.com/photos/<id> or .../photos/<slug>-<id>
  const m = raw.match(/^https?:\/\/(www\.)?unsplash\.com\/photos\/([^/?#]+)(?:[/?#].*)?$/i);
  if (m) {
    const idOrSlug = m[2];
    const id = idOrSlug.split('-').at(-1) || idOrSlug;
    return id;
  }

  // Unsplash download link: /photos/<id>/download?...
  const d = raw.match(
    /^https?:\/\/(www\.)?unsplash\.com\/photos\/([^/?#]+)\/download(?:[?#].*)?$/i
  );
  if (d) {
    const idOrSlug = d[2];
    const id = idOrSlug.split('-').at(-1) || idOrSlug;
    return id;
  }

  return null;
}

async function resolveUnsplashIdsToImageUrls(ids: string[]) {
  const key = (process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '').trim();
  if (!key) throw new Error('Missing NEXT_PUBLIC_UNSPLASH_ACCESS_KEY');

  const uniq = Array.from(new Set(ids));
  try {
    const results = await Promise.all(
      uniq.map(async (id) => {
        const res = await fetch(`https://api.unsplash.com/photos/${encodeURIComponent(id)}?client_id=${key}`);
        if (!res.ok) return null;
        const json = (await res.json()) as {
          urls?: { raw?: string; full?: string; regular?: string };
        };
        const url = json.urls?.raw || json.urls?.full || json.urls?.regular || null;
        if (!url) return null;
        // Prefer raw with a conservative width so Unsplash serves an actual image.
        if (url === json.urls?.raw) return `${url}${url.includes('?') ? '&' : '?'}w=2200&auto=format&fit=crop`;
        return url;
      })
    );
    return results.filter(Boolean) as string[];
  } catch {
    throw new Error(
      'Cannot reach Unsplash API from this browser (SSL/network). Please upload images or paste direct image URLs.'
    );
  }
}

async function normalizeStoredList(list: string[]) {
  const direct: string[] = [];
  const ids: string[] = [];
  for (const x of list) {
    const d = normalizeDirectImageUrl(x);
    if (d) direct.push(d);
    else {
      const id = extractUnsplashPhotoId(x);
      if (id) ids.push(id);
    }
  }
  if (ids.length === 0) return dedupe(direct);
  try {
    const resolved = await resolveUnsplashIdsToImageUrls(ids);
    return dedupe([...direct, ...resolved]);
  } catch {
    // If we cannot resolve Unsplash entries (API blocked), drop them to avoid broken previews.
    return dedupe(direct);
  }
}

