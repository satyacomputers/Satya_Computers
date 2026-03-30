import SplitHero from '@/components/sections/SplitHero';
import GrainOverlay from '@/components/ui/GrainOverlay';
import FlashSaleBanner from '@/components/sections/FlashSaleBanner';
import TestingProcess from '@/components/sections/TestingProcess';
import MissionLogs from '@/components/sections/MissionLogs';
import B2BTier from '@/components/sections/B2BTier';
import InteractiveFAQ from '@/components/sections/InteractiveFAQ';
import EliteSelection from '@/components/sections/EliteSelection';
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
  getCategoryStats
} from '@/lib/cms';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [
    featuredProducts, 
    liveAnnouncement, 
    activeOffers, 
    companyStats, 
    partners, 
    categoryStats
  ] = await Promise.all([
    getFeaturedProducts(),
    getLiveAnnouncement(),
    getActiveOffers(),
    getCompanyStats(),
    getPartners(),
    getCategoryStats()
  ]);

  return (
    <main className="min-h-screen bg-white relative">
      <GrainOverlay opacity={5} />
      
      <FlashSaleBanner announcement={liveAnnouncement} />
      <SplitHero />
      
      <EliteSelection products={featuredProducts} />
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
