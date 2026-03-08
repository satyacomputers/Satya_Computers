'use client';

import { storeInfo } from '@/data/store-info';
import GrainOverlay from '@/components/ui/GrainOverlay';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckSquare, Zap, Users, Award } from 'lucide-react';

const stats = [
  { icon: Award, label: 'Years of Trust', value: '10+' },
  { icon: Users, label: 'Happy Clients', value: '2000+' },
  { icon: Zap, label: 'Systems Deployed', value: '5000+' },
  { icon: CheckSquare, label: 'Warranty Rate', value: '100%' },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white relative pb-24">
      <GrainOverlay opacity={30} />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-b border-black/10">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-6xl md:text-8xl text-[#1A1A1A] tracking-tight mb-4 uppercase"
        >
          ABOUT <span className="text-[#F15A24]">US</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="font-body text-xl text-[var(--color-brand-accent)] tracking-widest uppercase mb-8"
        >
          {storeInfo.tagline}
        </motion.p>
      </section>

      {/* Stats Row */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5, type: 'spring', bounce: 0.3 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative"
            >
              {/* Rotating shimmer border */}
              <div className="absolute -inset-[2px] z-0 overflow-hidden">
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'conic-gradient(from 0deg, transparent 0%, var(--color-brand-primary) 25%, transparent 50%)' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: i * 1.5 }}
                />
                <div className="absolute inset-[2px] bg-white" />
              </div>
              <div className="relative z-10 bg-white p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.05)] group-hover:shadow-[0_16px_48px_rgba(241,90,36,0.12)] transition-shadow duration-400">
                <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center border border-black/8 group-hover:border-[var(--color-brand-primary)] group-hover:bg-[var(--color-brand-primary)] transition-all duration-400">
                  <stat.icon className="w-5 h-5 text-[var(--color-brand-primary)] group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
                </div>
                <div className="font-heading text-3xl text-brand-text mb-1">{stat.value}</div>
                <div className="font-heading text-[9px] tracking-[0.25em] text-black/40 uppercase">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row gap-12">
        {/* Image card */}
        <motion.div
          className="w-full md:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, type: 'spring', bounce: 0.25 }}
        >
          <div className="relative group">
            <div className="absolute -inset-[2px] z-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{ background: 'conic-gradient(from 180deg, transparent 0%, var(--color-brand-accent) 25%, var(--color-brand-primary) 50%, transparent 75%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-[2px] bg-white" />
            </div>
            <div className="relative z-10 aspect-[4/3] bg-gradient-to-br from-[#f4f4f4] to-[#e9e9e9] flex items-center justify-center p-8 overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle,_#00000015_1px,_transparent_1px)] bg-[size:18px_18px]" />
              <motion.h2
                className="font-heading text-5xl text-brand-text/10 tracking-[0.4em] text-center"
                animate={{ opacity: [0.08, 0.15, 0.08] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                EST.<br />HYDERABAD
              </motion.h2>
            </div>
          </div>
        </motion.div>

        {/* Mission & Services */}
        <motion.div
          className="w-full md:w-1/2 flex flex-col justify-center"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.65, type: 'spring', bounce: 0.25 }}
        >
          <h2 className="font-heading text-4xl text-brand-text mb-4">OUR MISSION</h2>
          <div className="h-[3px] w-12 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] mb-6" />
          <p className="font-body text-brand-text/80 text-base leading-relaxed mb-8">
            {storeInfo.mission} {storeInfo.expertise}{' '}
            We believe that high-performance computing should be accessible without compromising on build quality or reliability.
          </p>

          <h2 className="font-heading text-2xl text-[var(--color-brand-primary)] mb-5 uppercase tracking-wider">OUR SERVICES</h2>
          <ul className="font-body text-brand-text-muted space-y-3 mb-10">
            {storeInfo.services.map((service, idx) => (
              <li key={idx} className="block">
                <motion.div
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="flex items-center gap-4 group/item"
                >
                  <motion.div
                    className="w-3 h-3 border-2 border-[var(--color-brand-primary)] flex-shrink-0"
                    whileHover={{ rotate: 45, backgroundColor: 'var(--color-brand-primary)' }}
                    transition={{ duration: 0.25 }}
                  />
                  <span className="text-sm group-hover/item:text-[var(--color-brand-primary)] transition-colors duration-200">{service}</span>
                </motion.div>
              </li>
            ))}
          </ul>

          <div>
            <Link href="/contact">
              <BrutalButton>GET IN TOUCH</BrutalButton>
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
