import type { Metadata } from "next";
import { Bebas_Neue, Raleway } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import LayoutClient from "@/components/layout/LayoutClient";

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
  title: "Satya Computers",
  description: "Trusted bulk laptop reseller in Hyderabad. Business laptops, workstations, and enterprise peripherals at competitive prices.",
  icons: {
    icon: "/satya_computers_logo.png",
    shortcut: "/satya_computers_logo.png",
    apple: "/satya_computers_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${raleway.variable} ${bebasNeue.variable} font-body bg-white text-brand-text antialiased`} suppressHydrationWarning>
        <Providers>
          <LayoutClient>
            {children}
          </LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
