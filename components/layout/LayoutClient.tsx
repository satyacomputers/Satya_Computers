'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import GoldNavBar from "@/components/layout/GoldNavBar";
import Footer from "@/components/layout/Footer";
import WhatsAppWidget from "@/components/whatsapp/WhatsAppWidget";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import LivePurchaseTicker from "@/components/ui/LivePurchaseTicker";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isAdmin = mounted && (pathname?.includes('/admin') || pathname?.startsWith('/admin'));

  if (isAdmin) {
    return (
      <main className="bg-[#F4F7FE] min-h-screen relative z-0">
        {children}
      </main>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md w-full border-b border-black/5">
        <ScrollProgress />
        <AnnouncementBar />
        <GoldNavBar />
      </header>
      <main className="relative z-10 pt-[140px] md:pt-[124px]">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
      <div className="hidden lg:block">
        <CustomCursor />
      </div>
      <LivePurchaseTicker />
    </>
  );
}
