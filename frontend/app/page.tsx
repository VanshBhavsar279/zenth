import type { Metadata } from 'next';
import { BrandStory } from '@/components/home/BrandStory';
import { CollectionStrip } from '@/components/home/CollectionStrip';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Hero } from '@/components/home/Hero';
import { InstagramBanner } from '@/components/home/InstagramBanner';
import { Marquee } from '@/components/home/Marquee';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'ZENTH | Streetwear for the Bold',
  openGraph: {
    title: 'ZENTH | Streetwear for the Bold',
    description:
      'Dark, bold urban streetwear. Limited drops and premium staples from ZENTH.',
  },
};

export default function HomePage() {
  return (
    <>
      <ErrorBoundary fallbackTitle="Hero unavailable">
        <Hero />
      </ErrorBoundary>
      <Marquee />
      <FeaturedProducts />
      <BrandStory />
      <CollectionStrip />
      <InstagramBanner />
    </>
  );
}
