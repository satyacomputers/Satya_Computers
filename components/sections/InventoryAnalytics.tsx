'use client';

import { motion, useSpring, useTransform, animate } from 'framer-motion';
import { BarChart3, Database, ShieldCheck, Zap, Activity, Info } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BrandStat {
  brand: string;
  count: number;
}

interface InventoryAnalyticsProps {
  stats: BrandStat[];
}

const CountUp = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 2,
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value]);

  return <>{displayValue}</>;
};

export default function InventoryAnalytics({ stats = [] }: InventoryAnalyticsProps) {
  const totalUnits = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden border-y border-black/5">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/50 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A1628] text-white rounded-lg mb-6 font-heading text-[10px] tracking-widest uppercase shadow-xl shadow-black/10"
            >
              <BarChart3 size={12} className="text-[#F97316]" /> Real-time Telemetry
            </motion.div>
            <h2 className="text-4xl md:text-7xl font-heading font-black text-[#0A1628] uppercase leading-[0.85] mb-8 tracking-tighter">
              INVENTORY <br/>
              <span className="text-gray-300">PENETRATION</span>
            </h2>
            <p className="text-gray-500 font-medium text-lg border-l-2 border-[#F97316] pl-6">
              Live hardware distribution metrics across our active inventory matrix. Automated synchronization with central deployment nodes.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white border border-black/5 p-4 rounded-2xl shadow-sm">
             <Activity className="text-[#F97316]" size={20} />
             <div className="flex flex-col">
                <span className="font-heading text-[10px] tracking-widest text-black/30 uppercase">Node Status</span>
                <span className="font-heading text-xs uppercase font-black">Sync Frequency: 15s</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
          {/* Main Visualizer */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white rounded-[4rem] p-10 md:p-16 border border-gray-100 shadow-2xl shadow-black/[0.02] flex flex-col md:flex-row gap-16 items-center relative overflow-hidden h-full min-h-[500px]"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]" />
            
            <div className="shrink-0 relative">
               {/* 3D-ish Donut */}
               <div className="w-56 h-56 rounded-full border-[24px] border-gray-50 relative flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                     <circle 
                        cx="112" cy="112" r="88" 
                        fill="none" stroke="#0A1628" strokeWidth="24"
                        strokeDasharray={552}
                        strokeDashoffset={552 * 0.25}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                     />
                  </svg>
                  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-full shadow-xl border border-black/5 z-10 w-40 h-40">
                     <span className="text-5xl font-black text-[#0A1628] tabular-nums tracking-tighter">
                        <CountUp value={totalUnits} />
                     </span>
                     <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-[0.2em] mt-2 whitespace-nowrap">Active Nodes</span>
                  </div>
                  
                  {/* Floating Pulsing Dots */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 w-4 h-4 rounded-full bg-white border-4 border-[#0A1628] z-20" />
               </div>
            </div>
            
            <div className="flex-1 w-full space-y-10">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
                  {stats.map((stat, i) => (
                    <div key={i} className="group cursor-default">
                       <div className="flex justify-between items-end mb-3">
                          <span className="text-xs font-black text-[#0A1628] uppercase tracking-widest group-hover:text-[#F97316] transition-colors">{stat.brand}</span>
                          <span className="font-mono text-[11px] font-bold text-black/30">
                            {stat.count} <span className="text-[#F97316]/60">({Math.round((stat.count / totalUnits) * 100)}%)</span>
                          </span>
                       </div>
                       <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden border border-black/[0.03]">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(stat.count / totalUnits) * 100}%` }}
                            transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                            className="h-full bg-gradient-to-r from-[#0A1628] to-[#1a2b44]" 
                          />
                       </div>
                    </div>
                  ))}
               </div>
               
               <div className="pt-8 border-t border-black/5 flex items-center justify-between text-[10px] font-bold text-black/30 tracking-widest uppercase">
                  <span>Hardware Refresh Interval: Weekly</span>
                  <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                     <span>Nodes Balanced</span>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Quick Stats Column */}
          <div className="lg:col-span-4 flex flex-col gap-8 h-full">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               className="bg-[#0A1628] text-white p-12 rounded-[4rem] relative overflow-hidden group flex-1 h-full min-h-[300px]"
             >
                <div className="relative z-10 h-full flex flex-col">
                   <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-[#F97316] border border-white/10 group-hover:bg-[#F97316] group-hover:text-white transition-all duration-500">
                      <Database size={28} />
                   </div>
                   <h3 className="text-2xl font-heading font-black uppercase mb-4 tracking-tight">INFRASTRUCTURE<br/>INTEGRITY</h3>
                   <p className="text-white/40 text-sm mb-10 leading-relaxed font-medium">Primary inventory nodes verified and operational within active deployment clusters.</p>
                   
                   <div className="mt-auto space-y-4">
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Node: HYD-01 ACTIVE</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl opacity-50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Node: BLR-04 READY</span>
                      </div>
                   </div>
                </div>
                <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-all duration-1000 group-hover:scale-110">
                   <Zap size={320} />
                </div>
             </motion.div>

             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2 }}
               className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl shadow-black/[0.01] relative group"
             >
                <div className="flex items-center justify-between mb-8">
                   <div className="w-12 h-12 bg-orange-50 text-[#F97316] rounded-2xl flex items-center justify-center border border-[#F97316]/10">
                      <ShieldCheck size={24} />
                   </div>
                   <Info size={16} className="text-black/10 hover:text-black/30 cursor-help" />
                </div>
                <div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-2 block">Standard Grade Baseline</span>
                   <p className="text-6xl font-black text-[#0A1628] tracking-tighter leading-none mb-1">A++</p>
                   <div className="flex items-center gap-2 mt-4 text-[#F97316]">
                      <div className="w-1 h-3 bg-[#F97316] rounded-full" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Certified Selection Only</span>
                   </div>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
