import SplitHero from '@/components/sections/SplitHero';
import GrainOverlay from '@/components/ui/GrainOverlay';
import FlashSaleBanner from '@/components/sections/FlashSaleBanner';
import TestingProcess from '@/components/sections/TestingProcess';
import MissionLogs from '@/components/sections/MissionLogs';
import B2BTier from '@/components/sections/B2BTier';
import InteractiveFAQ from '@/components/sections/InteractiveFAQ';
import HotOffers from '@/components/sections/HotOffers';
import SystemQuiz from '@/components/sections/SystemQuiz';
import EcoImpact from '@/components/sections/EcoImpact';
import HomeProductsSection from '@/components/sections/HomeProductsSection';
import { 
  getFeaturedProducts, 
  getLiveAnnouncement, 
  getActiveOffers, 
  getCompanyStats, 
  getPartners, 
  getCategoryStats,
  getHeroProduct
} from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [
    featuredProducts, 
    liveAnnouncement, 
    activeOffers, 
    companyStats, 
    partners, 
    categoryStats,
    heroProduct
  ] = await Promise.all([
    getFeaturedProducts(),
    getLiveAnnouncement(),
    getActiveOffers(),
    getCompanyStats(),
    getPartners(),
    getCategoryStats(),
    getHeroProduct()
  ]);

  return (
    <main className="min-h-screen bg-white relative">
      <GrainOverlay opacity={5} />
      
      <FlashSaleBanner announcement={liveAnnouncement} />
      <SplitHero spotlightProduct={heroProduct} />
      
      <HomeProductsSection />
      <HotOffers offers={activeOffers} />

      <SystemQuiz />
      <TestingProcess />
      <EcoImpact unitCount={companyStats.unitCount} />
      <B2BTier />
      <InteractiveFAQ />
      <MissionLogs />
    </main>
  );
}
