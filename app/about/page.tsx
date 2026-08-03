'use client';

import { storeInfo } from '@/data/store-info';
import GrainOverlay from '@/components/ui/GrainOverlay';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Cpu, RotateCcw, Truck } from 'lucide-react';

const values = [
  {
    icon: Shield,
    title: "Enterprise Grade",
    description: "Every machine undergoes a 12-point industrial stress test before reaching your desk."
  },
  {
    icon: Cpu,
    title: "Peak Performance",
    description: "We optimize hardware configurations to ensure modern software runs without compromise."
  },
  {
    icon: RotateCcw,
    title: "Sustainability",
    description: "Reducing e-waste by extending the lifecycle of premium hardware through precision refurbishment."
  },
  {
    icon: Truck,
    title: "Global Standards",
    description: "Located in Hyderabad's tech hub, operating with global procurement standards."
  }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white relative pb-24 overflow-hidden">
      <GrainOverlay opacity={15} />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/5">
        <div className="absolute top-10 right-10 text-[12rem] font-heading text-black/[0.02] select-none pointer-events-none tracking-tighter">
          EST. 2014
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <span className="font-body text-xs tracking-[0.4em] text-[var(--color-brand-primary)] uppercase mb-4 block font-bold">The Ameerpet Legacy</span>
          <h1 className="font-heading text-5xl md:text-9xl text-[#1A1A1A] leading-[0.85] mb-8 uppercase">
            REDEFINING <br />
            <span className="text-[var(--color-brand-primary)]">PERFORMANCE.</span>
          </h1>
          <p className="font-body text-xl md:text-2xl text-black/60 max-w-2xl leading-relaxed">
            Satya Computers is not just a hardware store; we are a bridge between high-end industrial tech and the professionals who use it.
          </p>
        </motion.div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative aspect-[4/5] bg-[#F1F1F1] overflow-hidden group border-2 border-black/5 shadow-xl">
            <img 
              src="/images/about-precision.png" 
              alt="Precision Hardware Engineering" 
              className="absolute inset-0 w-full h-full object-cover grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 scale-[1.1] group-hover:scale-100 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-transparent z-10 opacity-40 group-hover:opacity-10 transition-opacity duration-700" />
          </div>
        </motion.div>

        <div className="space-y-10">
          <div>
            <h2 className="font-heading text-2xl md:text-4xl text-[#1A1A1A] mb-6 uppercase">Quality is Non-Negotiable.</h2>
            <p className="font-body text-black/70 leading-relaxed text-lg italic border-l-4 border-[var(--color-brand-primary)] pl-6 mb-8">
              "We founded Satya Computers in Hyderabad to solve a simple problem: Premium hardware was too expensive, and affordable hardware wasn't premium enough. We fixed that."
            </p>
            <p className="font-body text-black/60 leading-relaxed text-base">
              Over the last decade, we have established ourselves as the go-to destination for high-performance refurbished laptops. Our expertise isn't just in selling; it's in the precision engineering that goes into every system we release back into the market. From custom thermal repasting to memory optimization, we treat every laptop like our first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <motion.div 
                key={v.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-3"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black/5 text-[var(--color-brand-primary)]">
                  <v.icon size={20} />
                </div>
                <h4 className="font-heading text-xl text-[#1A1A1A] uppercase">{v.title}</h4>
                <p className="font-body text-xs text-black/50 leading-relaxed uppercase tracking-wider">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center border-t border-black/5">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-5xl md:text-7xl text-[#1A1A1A] mb-8 uppercase leading-[0.9]">READY TO UPGRADE YOUR <span className="text-[var(--color-brand-primary)]">WORKFLOW?</span></h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/products">
              <BrutalButton>BROWSE INVENTORY</BrutalButton>
            </Link>
            <Link href="/contact" className="font-heading text-lg tracking-widest text-black/40 hover:text-[var(--color-brand-primary)] transition-colors uppercase border-b border-transparent hover:border-[var(--color-brand-primary)]">
              CONSULT AN EXPERT &rarr;
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
