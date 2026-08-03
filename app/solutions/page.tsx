'use client';

import GrainOverlay from '@/components/ui/GrainOverlay';
import { motion } from 'framer-motion';
import { Building2, Laptop, ShieldCheck, Cpu, Headphones } from 'lucide-react';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';

const solutions = [
  {
    icon: Building2,
    title: "Enterprise Bulk Procurement",
    description: "Equipping entire IT departments with high-spec workstations from Dell, HP, and Apple. Scalable procurement with localized support.",
    tier: "CORPORATE",
    accent: "bg-[var(--color-brand-primary)]"
  },
  {
    icon: Laptop,
    title: "Creative & Engineering Hub",
    description: "Precision-tuned machines for 4K video editing, 3D rendering, and CAD applications. Max out your RAM and GPU performance.",
    tier: "PRO-CREATIVE",
    accent: "bg-black"
  },
  {
    icon: ShieldCheck,
    title: "Warranty & Support Tiers",
    description: "Beyond the sale. We offer extended warranty packages and priority onsite support for business critical systems.",
    tier: "RELIABILITY",
    accent: "bg-[var(--color-brand-primary)]"
  },
  {
    icon: Cpu,
    title: "Custom Hardware Stacks",
    description: "Need a specific configuration? We build custom RAM and Storage stacks tailored to your development workload.",
    tier: "ENGINEERING",
    accent: "bg-[#401F5E]"
  },
  {
    icon: Headphones,
    title: "IT Asset Management",
    description: "Trade-in programs and lifecycle management for companies looking to maintain peak technological agility.",
    tier: "MANAGEMENT",
    accent: "bg-black"
  }
];

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-white relative pb-24">
      <GrainOverlay opacity={10} />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.6 }}
        >
          <h1 className="font-heading text-7xl md:text-9xl text-[#1A1A1A] mb-6 uppercase tracking-tight">
            SYSTEM <span className="text-[var(--color-brand-primary)]">SOLUTIONS</span>
          </h1>
          <p className="font-body text-xl text-black/60 max-w-2xl leading-relaxed">
            We don't just sell computers; we engineer environments where technology enables growth. Explore our specialized service tiers.
          </p>
        </motion.div>
      </section>

      {/* Solutions Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {solutions.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="relative p-1 border-[1px] border-black/10 group"
            >
              <div className="bg-white p-8 h-full flex flex-col items-start justify-between border-b-[6px] border-black/5 group-hover:border-[var(--color-brand-primary)] transition-all duration-300">
                <div className="space-y-6 w-full">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 flex items-center justify-center border border-black/5 bg-black/[0.02] group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-colors">
                      <s.icon size={22} strokeWidth={1.5} />
                    </div>
                    <span className="font-heading text-[10px] tracking-[0.3em] text-black/40 font-bold uppercase ml-auto">{s.tier}</span>
                  </div>
                  
                  <h3 className="font-heading text-3xl text-[#1A1A1A] leading-none uppercase">{s.title}</h3>
                  <p className="font-body text-sm text-black/50 leading-relaxed uppercase tracking-wider">{s.description}</p>
                </div>
                
                
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Inquiry section */}
      <section className="mt-24 py-20 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-dot-grid opacity-20 invert" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-heading text-5xl md:text-7xl mb-8 uppercase leading-[0.9]">Custom Enterprise <br /><span className="text-[var(--color-brand-primary)]">Architecture?</span></h2>
          <p className="font-body text-white/50 max-w-xl mx-auto mb-10 text-lg uppercase tracking-widest">Connect with our systems architects for specialized bulk pricing and architecture consultation.</p>
          <Link href="/contact">
            <BrutalButton>INQUIRE NOW</BrutalButton>
          </Link>
        </div>
      </section>
    </main>
  );
}
