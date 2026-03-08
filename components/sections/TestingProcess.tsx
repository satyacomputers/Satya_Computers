'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, ThermometerSnowflake, BatteryWarning, ScanSearch } from 'lucide-react';
import NextImage from 'next/image';

const steps = [
  {
    id: 1,
    title: 'THERMAL STRESS',
    desc: 'Systems are subjected to 100% CPU/GPU load limits to verify cooling loop integrity.',
    icon: ThermometerSnowflake,
    col: 'var(--color-brand-primary)'
  },
  {
    id: 2,
    title: 'BATTERY DECAY',
    desc: 'Deep cycle checks ensure battery health is above 85% original capacity.',
    icon: BatteryWarning,
    col: 'var(--color-brand-accent)'
  },
  {
    id: 3,
    title: 'COMPONENT PURGE',
    desc: 'Ultrasonic cleaning and military-spec thermal paste reapplication.',
    icon: ScanSearch,
    col: '#1a1a1a'
  },
  {
    id: 4,
    title: 'FINAL BENCHMARK',
    desc: 'Cinebench R23 and specific load profiling before certification seals are placed.',
    icon: ShieldAlert,
    col: 'var(--color-brand-primary)'
  }
];

export default function TestingProcess() {
  return (
    <section className="py-24 bg-[#FAFAFA] border-y border-black/10 relative overflow-hidden">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#00000008_1px,_transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Header & Image */}
          <div className="flex flex-col">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-7xl text-brand-text mb-4 uppercase tracking-tighter leading-none">
              THE GOLD<br />
              <span className="text-[var(--color-brand-accent)]">STANDARD</span>
            </h2>
            <p className="font-body text-brand-text/60 leading-relaxed mb-10 max-w-md border-l-4 border-[var(--color-brand-primary)] pl-5">
              Refurbished doesn&apos;t mean compromised. Every workstation undergoes our relentless 4-stage hardware certification process before it ever hits the floor.
            </p>
            
            <motion.div 
               className="relative aspect-video bg-black p-1 shadow-2xl overflow-hidden group"
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
            >
               <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)]/20 to-[var(--color-brand-accent)]/20 z-10 mix-blend-overlay" />
               <NextImage 
                  src="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=1400&auto=format&fit=crop" 
                  alt="Motherboard CPU Socket" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute top-4 left-4 z-20 bg-black/80 px-3 py-1 border border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] font-heading text-[10px] tracking-[0.3em] uppercase animate-pulse">
                 DIAGNOSTICS: ACTIVE
               </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-black/10 pl-8 ml-4 md:ml-0 flex flex-col gap-12 py-8">
             {steps.map((step, idx) => (
                <motion.div 
                   key={step.id}
                   className="relative"
                   initial={{ opacity: 0, x: 30 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: idx * 0.15, type: 'spring', bounce: 0.3 }}
                >
                   {/* Track Node */}
                   <motion.div 
                     className="absolute -left-[45px] top-1 w-6 h-6 rounded-full border-4 border-[#FAFAFA] flex items-center justify-center bg-black transition-colors duration-300"
                   >
                     <motion.div className="w-2 h-2 rounded-full" style={{ backgroundColor: step.col }} />
                   </motion.div>
                   
                   {/* Step Card */}
                   <div className="group bg-white border border-black/5 p-6 hover:border-black/20 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                      {/* Hover fill line */}
                      <motion.div 
                         className="absolute inset-x-0 bottom-0 h-1 origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100"
                         style={{ backgroundColor: step.col }}
                      />
                      
                      <div className="flex items-start gap-5">
                         <div 
                            className="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-black/[0.03] border border-black/5 group-hover:scale-110 transition-transform duration-500"
                         >
                            <step.icon className="w-6 h-6" style={{ color: step.col }} strokeWidth={1} />
                         </div>
                         
                         <div>
                            <div className="font-heading text-[10px] tracking-[0.3em] text-black/30 mb-1">STAGE 0{step.id}.</div>
                            <h3 className="font-heading text-2xl text-brand-text/90 mb-2 uppercase">{step.title}</h3>
                            <p className="font-body text-sm text-brand-text/60 leading-relaxed">{step.desc}</p>
                         </div>
                      </div>
                   </div>
                </motion.div>
             ))}
          </div>

        </div>

      </div>
    </section>
  );
}
