import type { Metadata } from 'next';
import { Bebas_Neue, Inter, Space_Mono } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'ZENTH | Streetwear for the Bold',
    template: '%s | ZENTH',
  },
  description:
    'Dark, bold urban streetwear. Limited drops and premium staples from ZENTH.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: 'ZENTH',
    title: 'ZENTH | Streetwear for the Bold',
    description:
      'Dark, bold urban streetwear. Limited drops and premium staples from ZENTH.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bebas.variable} ${inter.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen pt-20">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
