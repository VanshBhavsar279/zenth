'use client';

import { SectionReveal } from '@/components/ui/SectionReveal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useContactInfo } from '@/lib/hooks/useContactInfo';

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeRichHtml(input: string): string {
  if (typeof window === 'undefined') return input;
  const parser = new DOMParser();
  const doc = parser.parseFromString(input, 'text/html');
  const allowedTags = new Set([
    'P',
    'BR',
    'STRONG',
    'B',
    'EM',
    'I',
    'U',
    'UL',
    'OL',
    'LI',
    'A',
    'DIV',
    'SPAN',
  ]);

  const sanitizeNode = (node: Node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;
      if (!allowedTags.has(el.tagName)) {
        const text = doc.createTextNode(el.textContent || '');
        el.replaceWith(text);
        return;
      }

      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith('on') || name === 'style') {
          el.removeAttribute(attr.name);
        }
      });

      if (el.tagName === 'A') {
        const href = el.getAttribute('href') || '';
        const safe = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:');
        if (!safe) {
          el.removeAttribute('href');
        } else {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }
    [...node.childNodes].forEach(sanitizeNode);
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}

function formatRichText(input: string): string {
  const trimmed = input.trim();
  const hasHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (hasHtml) {
    return sanitizeRichHtml(trimmed);
  }
  return escapeHtml(trimmed).replace(/\r?\n/g, '<br />');
}

export default function ContactPage() {
  const { data, loading, error } = useContactInfo();

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <LoadingSpinner label="LOADING CONTACT" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24">
        <p className="font-mono text-xs uppercase text-red-400">{error?.message}</p>
      </div>
    );
  }

  const ig = data.instagramHandle?.replace(/^@/, '') || '';
  const fb = data.facebookHandle || '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">REACH OUT</p>
        <h1 className="font-display text-6xl uppercase text-accent md:text-8xl">GET IN TOUCH</h1>
      </SectionReveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <SectionReveal className="space-y-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Brand</p>
            <p className="mt-2 font-display text-4xl uppercase text-secondary">{data.brandName}</p>
          </div>
          {data.phone && (
            <a href={`tel:${data.phone}`} className="block font-mono text-sm text-accent hover:text-secondary">
              {data.phone}
            </a>
          )}
          {data.email && (
            <a
              href={`mailto:${data.email}`}
              className="block font-mono text-sm text-accent hover:text-secondary"
            >
              {data.email}
            </a>
          )}
          {data.whatsappNumber && (
            <a
              href={`https://wa.me/${data.whatsappNumber.replace(/\D/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm bg-secondary px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-primary"
            >
              WHATSAPP
            </a>
          )}
          {data.address && (
            <p
              className="max-w-md font-sans text-sm leading-relaxed text-muted"
              dangerouslySetInnerHTML={{ __html: formatRichText(data.address) }}
            />
          )}
          <div className="flex gap-6 font-mono text-xs uppercase tracking-widest">
            {ig && (
              <a
                href={`https://instagram.com/${ig}`}
                target="_blank"
                rel="noreferrer"
                className="text-secondary hover:underline"
              >
                INSTAGRAM
              </a>
            )}
            {fb && (
              <a href={fb} target="_blank" rel="noreferrer" className="text-secondary hover:underline">
                FACEBOOK
              </a>
            )}
          </div>
          {data.aboutText && (
            <p
              className="max-w-prose font-sans text-sm leading-relaxed text-muted"
              dangerouslySetInnerHTML={{ __html: formatRichText(data.aboutText) }}
            />
          )}
        </SectionReveal>

        <SectionReveal>
          <div className="aspect-video w-full overflow-hidden rounded-sm border border-white/10 bg-surface">
            {data.mapEmbedUrl ? (
              <iframe
                title="Map"
                src={data.mapEmbedUrl}
                className="h-full min-h-[280px] w-full"
                loading="lazy"
                allowFullScreen
              />
            ) : (
              <div className="flex h-full min-h-[280px] items-center justify-center font-mono text-xs uppercase text-muted">
                MAP EMBED URL NOT SET
              </div>
            )}
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
