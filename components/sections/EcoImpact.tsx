'use client';

import { motion } from 'framer-motion';
import { Leaf, CircuitBoard, Battery, Globe2 } from 'lucide-react';
import { useEffect, useState } from 'react';

// Simple component to animate counting up 
function CountUp({ end, suffix, decimals = 0 }: { end: number, suffix: string, decimals?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end]);

  return (
    <span className="font-heading text-5xl md:text-7xl font-black text-white/90 group-hover:text-[var(--color-brand-primary)] transition-colors duration-500">
      {count.toFixed(decimals)}{suffix}
    </span>
  );
}

interface EcoImpactProps {
  unitCount?: number;
}

export default function EcoImpact({ unitCount = 5000 }: EcoImpactProps) {
  const dynamicStats = [
    { id: 1, label: "E-WASTE DIVERTED", value: unitCount * 0.09, suffix: " TONS", icon: CircuitBoard, decimals: 1 },
    { id: 2, label: "CO2 SAVED", value: unitCount * 0.065, suffix: " TONS", icon: Globe2, decimals: 1 },
    { id: 3, label: "BATTERIES RECYCLED", value: unitCount * 1.2, suffix: "+", icon: Battery, decimals: 0 }
  ];

  return (
    <section className="py-24 bg-[#0a0a0a] border-y border-[var(--color-brand-primary)] relative overflow-hidden group">
      
      {/* Dynamic Background */}
      <div 
         className="absolute inset-0 bg-gradient-to-tr from-[rgba(241,90,36,0.15)] via-transparent to-[rgba(15,15,15,0.8)] z-0 mix-blend-screen opacity-50 group-hover:opacity-100 transition-opacity duration-1000"
      />
      <div className="absolute -left-[50%] top-0 h-[200%] w-[1px] bg-gradient-to-b from-transparent via-[var(--color-brand-primary)] to-transparent opacity-30 transform rotate-45 group-hover:translate-x-[400vw] transition-transform duration-[3000ms] ease-in-out pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16 justify-between">
        
        {/* Left: Manifesto */}
        <div className="md:w-5/12 text-left">
           <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 border border-green-500/30 bg-green-500/10 rounded-full">
              <Leaf className="w-4 h-4 text-green-500" />
              <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-green-500">ESG Initiative</span>
           </div>
           
           <h2 className="font-heading text-4xl md:text-5xl text-white uppercase tracking-wider mb-6">
             PERFORMANCE WITHOUT <span className="text-green-500">THE PLANETARY COST.</span>
           </h2>
           
           <p className="font-body text-white/50 text-base leading-relaxed mb-8 border-l-2 border-[var(--color-brand-primary)] pl-5">
             Manufacturing a single enterprise laptop generates nearly 100kg of CO2. By deploying refurbished &quot;Gold Standard&quot; workstations to startups and students across India, we are drastically cutting industrial e-waste while maintaining absolute operational dominance.
           </p>
        </div>

        {/* Right: The Counters */}
        <div className="md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full">
           {dynamicStats.map((stat, idx) => (
             <motion.div 
               key={stat.id}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.2 }}
               className={`bg-[#111] p-8 md:p-10 border border-white/5 relative overflow-hidden group hover:border-green-500/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] transition-colors duration-500 ${idx === 0 ? 'sm:col-span-2' : ''}`}
             >
               {/* Animated corner accent */}
               <div className="absolute top-0 right-0 w-8 h-8 flex justify-end">
                 <div className="w-0 h-0 border-[16px] border-t-green-500 border-r-green-500 border-b-transparent border-l-transparent opacity-50 group-hover:scale-125 transition-transform origin-top-right duration-300" />
               </div>

               <stat.icon className="w-6 h-6 text-white/20 group-hover:text-green-500 transition-colors duration-500 mb-6" strokeWidth={1.5} />
               
               <CountUp 
                 end={stat.value} 
                 suffix={stat.suffix} 
                 decimals={stat.decimals} 
               />
               
               <div className="font-heading text-sm text-white/40 uppercase tracking-[0.3em] mt-2 group-hover:text-white transition-colors duration-300">
                 {stat.label}
               </div>

               {/* Hover scanline */}
               <div className="absolute inset-x-0 bottom-0 h-1 bg-green-500/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
             </motion.div>
           ))}
        </div>

      </div>
    </section>
  );
}
