'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { SectionReveal } from '@/components/ui/SectionReveal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useContactInfo } from '@/lib/hooks/useContactInfo';
import { formatRichText } from '@/lib/richText';

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
  const whatsappDigits = data.whatsappNumber?.replace(/\D/g, '') || '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 md:py-24">
      <SectionReveal>
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-muted">REACH OUT</p>
        <h1 className="font-display text-6xl uppercase text-accent md:text-8xl">GET IN TOUCH</h1>
      </SectionReveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-2">
        <SectionReveal className="space-y-8">
          <InfoRow label="Brand Name">
            <p className="font-display text-4xl uppercase text-secondary">{data.brandName || '—'}</p>
          </InfoRow>

          <InfoRow label="WhatsApp">
            {whatsappDigits ? (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-accent hover:text-secondary"
              >
                {data.whatsappNumber}
              </a>
            ) : (
              <span className="font-sans text-sm text-muted">—</span>
            )}
          </InfoRow>

          <InfoRow label="Email">
            {data.email ? (
              <a href={`mailto:${data.email}`} className="font-mono text-sm text-accent hover:text-secondary">
                {data.email}
              </a>
            ) : (
              <span className="font-sans text-sm text-muted">—</span>
            )}
          </InfoRow>

          <InfoRow label="Address">
            {data.address ? (
              <div
                className="max-w-md font-sans text-sm leading-relaxed text-muted"
                dangerouslySetInnerHTML={{ __html: formatRichText(data.address) }}
              />
            ) : (
              <span className="font-sans text-sm text-muted">—</span>
            )}
          </InfoRow>

          <InfoRow label="Instagram">
            {ig ? (
              <a
                href={`https://instagram.com/${ig}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sm text-accent hover:text-secondary"
              >
                @{ig}
              </a>
            ) : (
              <span className="font-sans text-sm text-muted">—</span>
            )}
          </InfoRow>

          <InfoRow label="About">
            {data.aboutText ? (
              <div
                className="max-w-prose font-sans text-sm leading-relaxed text-muted"
                dangerouslySetInnerHTML={{ __html: formatRichText(data.aboutText) }}
              />
            ) : (
              <span className="font-sans text-sm text-muted">—</span>
            )}
          </InfoRow>
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

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.3 }}
    >
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted">{label}</p>
      <div className="mt-2">{children}</div>
    </motion.div>
  );
}
