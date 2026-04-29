'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import { updateContact } from '@/lib/api';
import type { ContactInfo } from '@/lib/types';

export function ContactForm({ initial }: { initial: ContactInfo | null }) {
  const [brandName, setBrandName] = useState('');
  const [heroKicker, setHeroKicker] = useState('');
  const [heroHeadline, setHeroHeadline] = useState('');
  const [heroTagline, setHeroTagline] = useState('');
  const [footerTagline, setFooterTagline] = useState('');
  const [whatsappNumber, setWhatsapp] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [instagramHandle, setIg] = useState('');
  const [facebookHandle, setFb] = useState('');
  const [mapEmbedUrl, setMap] = useState('');
  const [aboutText, setAbout] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setBrandName(initial.brandName ?? '');
    setHeroKicker(initial.heroKicker ?? '');
    setHeroHeadline(initial.heroHeadline ?? '');
    setHeroTagline(initial.heroTagline ?? '');
    setFooterTagline(initial.footerTagline ?? '');
    setWhatsapp(initial.whatsappNumber ?? '');
    setPhone(initial.phone ?? '');
    setEmail(initial.email ?? '');
    setAddress(initial.address ?? '');
    setIg(initial.instagramHandle ?? '');
    setFb(initial.facebookHandle ?? '');
    setMap(initial.mapEmbedUrl ?? '');
    setAbout(initial.aboutText ?? '');
  }, [initial]);

  const save = async () => {
    setSaving(true);
    try {
      await updateContact({
        brandName,
        heroKicker,
        heroHeadline,
        heroTagline,
        footerTagline,
        whatsappNumber,
        phone,
        email,
        address,
        instagramHandle,
        facebookHandle,
        mapEmbedUrl,
        aboutText,
      });
      toast.success('CONTACT SAVED');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'SAVE FAILED');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <label className="block space-y-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Brand Name</span>
        <input
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Hero Kicker</span>
        <input
          value={heroKicker}
          onChange={(e) => setHeroKicker(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
          placeholder="STREETWEAR"
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Hero Headline</span>
        <input
          value={heroHeadline}
          onChange={(e) => setHeroHeadline(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
          placeholder="DEFINE THE STREET"
        />
      </label>
      <label className="block space-y-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Hero Tagline</span>
        <input
          value={heroTagline}
          onChange={(e) => setHeroTagline(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
          placeholder="Limited drops. Premium fits. Built for the bold."
        />
      </label>
      <label className="block space-y-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Footer Tagline</span>
        <input
          value={footerTagline}
          onChange={(e) => setFooterTagline(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
          placeholder="Streetwear for the bold. Built in the culture."
        />
      </label>
      <label className="block space-y-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          WhatsApp Number (country code, no +)
        </span>
        <input
          value={whatsappNumber}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Phone</span>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Email</span>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
        />
      </label>
      <RichTextEditor
        label="Address"
        value={address}
        onChange={setAddress}
        placeholder="Write address with formatting..."
        className="md:col-span-2"
      />
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Instagram Handle
        </span>
        <input
          value={instagramHandle}
          onChange={(e) => setIg(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-sm text-accent"
        />
      </label>
      <label className="block space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Facebook Handle / URL
        </span>
        <input
          value={facebookHandle}
          onChange={(e) => setFb(e.target.value)}
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-sans text-sm text-accent"
        />
      </label>
      <label className="block space-y-2 md:col-span-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted">
          Google Maps Embed URL (iframe src)
        </span>
        <textarea
          value={mapEmbedUrl}
          onChange={(e) => setMap(e.target.value)}
          rows={3}
          placeholder="https://www.google.com/maps/embed?..."
          className="w-full rounded-sm border border-white/10 bg-primary px-3 py-2 font-mono text-xs text-accent"
        />
      </label>
      <RichTextEditor
        label="About Text"
        value={aboutText}
        onChange={setAbout}
        placeholder="Tell your brand story with formatting..."
        className="md:col-span-2"
      />

      <div className="md:col-span-2">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? 'SAVING…' : 'SAVE CONTACT'}
        </Button>
      </div>
    </div>
  );
}
