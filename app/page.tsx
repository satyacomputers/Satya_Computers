import Link from 'next/link';
import SplitHero from '@/components/sections/SplitHero';
import ProductCard from '@/components/store/ProductCard';

import GrainOverlay from '@/components/ui/GrainOverlay';
import { getAllProducts } from '@/data/products';

import FlashSaleBanner from '@/components/sections/FlashSaleBanner';
import TrustedMarquee from '@/components/sections/TrustedMarquee';
import TestingProcess from '@/components/sections/TestingProcess';
import MissionLogs from '@/components/sections/MissionLogs';
import B2BTier from '@/components/sections/B2BTier';
import CategoryGrid from '@/components/sections/CategoryGrid';
import InteractiveFAQ from '@/components/sections/InteractiveFAQ';
import EcoImpact from '@/components/sections/EcoImpact';
import SystemQuiz from '@/components/sections/SystemQuiz';

export default function Home() {
  const featuredProducts = getAllProducts().slice(0, 4);

  return (
    <main className="min-h-screen bg-white relative">
      <GrainOverlay opacity={5} />
      
      <FlashSaleBanner />
      <SplitHero />
      <TrustedMarquee />
      <CategoryGrid />

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative mt-12">
        
        <div className="mb-16">
          <h2 className="font-heading text-5xl text-[#1A1A1A] mb-4 uppercase">FEATURED <span className="text-[#F15A24]">WORKSTATIONS</span></h2>
          <div className="w-24 border-t-4 border-[#F15A24]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--section-gap)]">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
        <div className="mt-12 flex justify-center">
          <Link href="/products" className="btn-brutal px-12 py-4">VIEW ALL COLLECTION</Link>
        </div>
      </section>

      <SystemQuiz />
      <TestingProcess />
      <EcoImpact />
      <B2BTier />
      <InteractiveFAQ />
      <MissionLogs />
    </main>
  );
}
