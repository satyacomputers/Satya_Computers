'use client';

import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, BarChart3, Globe } from 'lucide-react';

interface OperationsPulseProps {
  stats?: {
    marketReach: string;
    uptime: string;
    unitCount: number;
  };
}

export default function OperationsPulse({ stats }: OperationsPulseProps) {
  const pulses = [
    { label: "Market Reach", value: stats?.marketReach || "1.2k", icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Operational Uptime", value: stats?.uptime || "99.8%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Transactional Velocity", value: "Verified", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Total Asset Deployment", value: `${stats?.unitCount || 5000}+`, icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10" }
  ];

  return (
    <section className="py-24 bg-[#050B14] relative overflow-hidden">
      {/* Circuit board background effect */}
      {/* Technical Background Matrix */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none tech-grid-bg" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
          >
            <Activity className="text-[#F97316] animate-pulse" size={16} />
            <span className="text-white/60 font-heading text-[10px] tracking-[0.3em] uppercase">Operations Intelligence</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-heading font-black text-white uppercase leading-none mb-6">
            LIVE <span className="text-[#F97316]">SYSTEM</span> PULSE
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-lg">
            Real-time telemetry from our global deployment network. Transparent performance metrics for enterprise-scale operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pulses.map((pulse, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-[#F97316]/30 transition-all group overflow-hidden"
            >
              {/* Animated glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316]/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 ${pulse.bg} ${pulse.color} rounded-2xl flex items-center justify-center mb-8 shadow-lg`}>
                  <pulse.icon size={28} />
                </div>
                
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{pulse.label}</p>
                <h3 className="text-4xl font-heading font-black text-white tracking-tighter mb-4">
                  {pulse.value}
                </h3>
                
                <div className="flex items-center gap-2">
                   <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: idx * 0.2 }}
                        className={`h-full bg-gradient-to-r from-transparent to-current ${pulse.color}`}
                      />
                   </div>
                   <span className={`text-[10px] font-bold ${pulse.color}`}>85%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Performance Visualization (Mock) */}
        <div className="mt-20 p-1 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-[3rem]">
           <div className="bg-[#0A1628] rounded-[2.9rem] p-6 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 overflow-hidden relative">
              <div className="relative z-10">
                 <h3 className="text-3xl font-heading font-bold text-white mb-4 uppercase">Infrastructure Health</h3>
                 <p className="text-white/40 max-w-md mb-8">
                    Our edge nodes are synchronized across major technical hubs, ensuring minimal latency for bulk inventory synchronization.
                 </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 sm:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                       <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Latency</p>
                       <p className="text-white font-mono font-bold">12ms</p>
                    </div>
                    <div className="flex-1 sm:flex-none px-4 py-2 bg-white/5 border border-white/10 rounded-xl">
                       <p className="text-[10px] text-white/30 uppercase font-bold mb-1">Packet Loss</p>
                       <p className="text-white font-mono font-bold">0.02%</p>
                    </div>
                 </div>
              </div>
              
              <div className="relative w-full lg:w-1/2 h-48 flex items-end gap-1">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div 
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${20 + (i % 7) * 10}%` }}
                      transition={{ 
                        repeat: Infinity, 
                        repeatType: 'reverse', 
                        duration: 1 + (i % 3) * 0.5, 
                        delay: i * 0.05 
                      }}
                      className="flex-1 bg-blue-500/20 group-hover:bg-[#F97316]/20 transition-colors"
                    >
                       <div className="w-full h-1 bg-blue-500 group-hover:bg-[#F97316] shadow-[0_0_10px_currentcolor]" />
                    </motion.div>
                  ))}
              </div>
              
              <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-20">
                 <TrendingUp size={240} className="text-[#F97316]" />
              </div>
           </div>
        </div>
      </div>
    </section>
  );
}
