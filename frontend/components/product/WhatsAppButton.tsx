'use client';

import { encodeWhatsAppMessage } from '@/lib/utils';

export function WhatsAppButton({
  phone,
  message,
}: {
  phone: string;
  message: string;
}) {
  const digits = phone.replace(/\D/g, '');
  const href = `https://wa.me/${digits}?text=${encodeWhatsAppMessage(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-sm py-4 text-center font-mono text-sm font-bold uppercase tracking-[0.3em] transition hover:opacity-95"
      style={{
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-primary)',
      }}
    >
      WHATSAPP INQUIRE
    </a>
  );
}
