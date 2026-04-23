import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  openGraph: {
    title: 'Contact | ZENTH',
    description: 'Reach ZENTH — WhatsApp, email, and studio details.',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
