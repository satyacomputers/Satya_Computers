'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MonitorPlay, Briefcase, RefreshCw, Gamepad2, Laptop as LaptopIcon } from 'lucide-react';

const categories = [
  {
    id: 'ultrabooks',
    title: 'BUSINESS ULTRABOOKS',
    desc: 'Lightweight excellence. ThinkPad, Latitude, EliteBook.',
    icon: Briefcase,
    col: 'var(--color-brand-primary)',
    bgImg: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&q=80&w=800',
    flex: 'md:col-span-2 md:row-span-1'
  },
  {
    id: 'workstations',
    title: 'ELITE WORKSTATIONS',
    desc: 'Precision, ZBook, XPS.',
    icon: MonitorPlay,
    col: 'var(--color-brand-accent)',
    bgImg: 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=800',
    flex: 'md:col-span-1 md:row-span-2'
  },
  {
    id: 'apple',
    title: 'APPLE ECOSYSTEM',
    desc: 'M-Series MacBooks.',
    icon: LaptopIcon,
    col: '#1a1a1a',
    bgImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    flex: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'convertibles',
    title: '2-in-1 CONVERTIBLES',
    desc: 'Yoga, Spectre, Surface.',
    icon: RefreshCw,
    col: 'var(--color-brand-primary)',
    bgImg: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=800',
    flex: 'md:col-span-1 md:row-span-1'
  },
  {
    id: 'gaming',
    title: 'GAMING RIGS',
    desc: 'Predator, ROG, Legion.',
    icon: Gamepad2,
    col: 'var(--color-brand-accent)',
    bgImg: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=800',
    flex: 'md:col-span-2 md:row-span-1'
  }
];

export default function CategoryGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 border-y border-black/5">
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="font-heading text-4xl md:text-5xl text-brand-text mb-2 uppercase">
            OPERATIONAL <span className="text-[var(--color-brand-primary)]">MATRICES</span>
          </h2>
          <div className="w-16 h-1 bg-[var(--color-brand-primary)]" />
        </div>
        <div className="flex items-center gap-2 border border-black/10 px-3 py-1 bg-[#FAFAFA]">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="font-heading text-[10px] tracking-[0.2em] text-black/40 uppercase">Filter By Class</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[240px]">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className={`group relative overflow-hidden bg-black ${cat.flex}`}
          >
            <Link href={`/products`} className="absolute inset-0 z-20">
              <span className="sr-only">View {cat.title}</span>
            </Link>
            
            {/* Background Image */}
            <motion.div 
              className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700 ease-in-out mix-blend-luminosity"
              style={{ backgroundImage: `url(${cat.bgImg})` }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
               <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                 <cat.icon className="w-8 h-8 text-white/50 mb-4 group-hover:text-[var(--color-brand-primary)] transition-colors duration-300" strokeWidth={1.5} />
                 <h3 className="font-heading text-2xl md:text-3xl text-white tracking-widest uppercase mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors">{cat.title}</h3>
                 <p className="font-body text-sm text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{cat.desc}</p>
               </div>
            </div>
            
            {/* Accent Line */}
            <motion.div 
               className="absolute top-0 left-0 w-full h-[2px] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
               style={{ backgroundColor: cat.col }}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
