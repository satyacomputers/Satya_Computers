import type { Metadata } from "next";
import { Bebas_Neue, Raleway } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/whatsapp/WhatsAppWidget";
import GoldNavBar from "@/components/layout/GoldNavBar";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/lib/CartContext";
import CustomCursor from "@/components/ui/CustomCursor";
import ScrollProgress from "@/components/ui/ScrollProgress";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "STONE & GOLD | Satya Computers",
  description: "Bold. Premium. Uncompromising. Business laptops, workstations, enterprise peripherals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} ${bebasNeue.variable} font-body bg-white text-brand-text antialiased`} suppressHydrationWarning>
        <CartProvider>
          <header className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md w-full border-b border-black/5">
            {/* Scroll Progress Bar */}
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
        </CartProvider>
      </body>
    </html>
  );
}
