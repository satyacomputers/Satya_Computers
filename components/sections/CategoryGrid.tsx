'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MonitorPlay, Briefcase, RefreshCw, Gamepad2, Laptop as LaptopIcon, ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  counts?: Record<string, number>;
}

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

export default function CategoryGrid({ counts = {} }: CategoryGridProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white rounded-lg mb-6 font-heading text-[10px] tracking-widest uppercase">
            <MonitorPlay size={12} className="text-[var(--color-brand-primary)]" /> Hardware Classification
          </div>
          <h2 className="font-heading text-4xl md:text-6xl text-brand-text mb-4 uppercase leading-none">
            OPERATIONAL <span className="text-gray-300">MATRICES</span>
          </h2>
          <p className="font-body text-gray-500 text-sm font-medium">Explore hardware stratified by specialized performance nodes. Professional certified inventory only.</p>
        </div>
        <Link href="/products" className="flex items-center gap-3 border-2 border-black px-6 py-3 bg-white hover:bg-black hover:text-white transition-all cursor-pointer group">
          <span className="font-heading text-xs tracking-widest uppercase font-black">All Modules</span>
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] md:auto-rows-[240px]">
        {categories.map((cat, idx) => {
          const count = counts[cat.id] || counts[cat.title.toLowerCase()] || 0;
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden bg-black ${cat.flex}`}
            >
              <Link href={`/products?category=${cat.id}`} className="absolute inset-0 z-20">
                <span className="sr-only">View {cat.title}</span>
              </Link>
              
              {/* Background Image */}
              <motion.div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 ease-in-out mix-blend-luminosity group-hover:mix-blend-normal"
                style={{ backgroundImage: `url(${cat.bgImg})` }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />
              
              {/* Top info */}
              <div className="absolute top-6 right-6 z-10">
                 <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                    <span className="font-heading text-[10px] text-white/50 tracking-widest uppercase">{count} ACTIVE</span>
                 </div>
              </div>

              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                <div className="translate-y-6 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-lg mb-6 group-hover:bg-[var(--color-brand-primary)] transition-colors">
                    <cat.icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl text-white tracking-widest uppercase mb-2 leading-none">{cat.title}</h3>
                  <p className="font-body text-xs text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-y-0 group-hover:scale-y-100 origin-bottom">
                    {cat.desc}
                  </p>
                </div>
              </div>
              
              {/* Progress visual */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10 overflow-hidden">
                 <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: idx * 0.1 }}
                    className="h-full bg-gradient-to-r from-transparent via-[var(--color-brand-primary)] to-[var(--color-brand-primary)]"
                 />
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
