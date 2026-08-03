'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Zap, Laptop, Award, RotateCcw, X, Search, FileText } from 'lucide-react';

const qualityPoints = [
  {
    id: 'inspection',
    title: "45-Point Professional Inspection",
    description: "Every device undergoes a rigorous automated and manual hardware diagnostic process before listing.",
    icon: CheckCircle2,
    color: "bg-blue-50 text-blue-600",
    details: [
      "Thermal stress test (CPU/GPU load)",
      "Bit-error memory diagnostics",
      "Display pixel-perfect validation",
      "I/O port signal integrity check",
      "BIOS level security audit"
    ]
  },
  {
    id: 'warranty',
    title: "6-Month Premium Warranty",
    description: "Industry-leading warranty coverage on all refurbished enterprise laptops for your absolute peace of mind.",
    icon: ShieldCheck,
    color: "bg-orange-50 text-orange-600",
    details: [
      "Complete logic board coverage",
      "On-site replacement services",
      "Software OS support included",
      "Zero-cost return logistics",
      "Dedicated technical account desk"
    ]
  },
  {
    id: 'cosmetic',
    title: "Certified A++ Cosmetic Grade",
    description: "We only sell the highest physical quality units. Minor wear is rare; major dents or scratches are non-existent.",
    icon: Award,
    color: "bg-purple-50 text-purple-600",
    details: [
      "Micro-abrasion inspection",
      "Keypad tactility verification",
      "Chassis structural integrity",
      "Screen coating uniformity",
      "Port physical health check"
    ]
  }
];

export default function ProfessionalTrust() {
  const [activeAudit, setActiveAudit] = useState<typeof qualityPoints[0] | null>(null);

  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute top-0 right-0 font-heading text-[12vw] font-black text-black/[0.02] leading-none select-none pointer-events-none translate-x-20 -translate-y-10">
        CERTIFIED
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 border-b border-black/5 pb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-1bg-black" />
               <span className="font-heading text-xs tracking-[0.4em] uppercase text-black/40">Audit Protocol 04.1</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-heading font-black text-[#0A1628] leading-[0.9] mb-8 uppercase tracking-tighter">
              BEYOND <span className="text-[#F97316]">REFURBISHED.</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-medium">
              We operate at the intersection of enterprise hardware and clinical diagnostic precision. Every unit in our inventory is a testament to technical excellence.
            </p>
          </div>
          <div className="flex gap-12 pl-8">
            <div className="text-center">
              <p className="text-4xl font-black text-[#0A1628]">10k+</p>
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mt-1">NODES DEPLOYED</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-[#0A1628]">0%</p>
              <p className="text-[10px] font-bold text-black/30 uppercase tracking-[0.2em] mt-1">DOA RATE</p>
            </div>
          </div>
        </div>

        {/* Quality Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {qualityPoints.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveAudit(point)}
              className="bg-white p-12 border-2 border-black/5 hover:border-black cursor-pointer group transition-all duration-500 relative flex flex-col items-start min-h-[400px]"
            >
              <div className={`${point.color} w-16 h-16 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-black group-hover:text-white transition-all duration-500`}>
                <point.icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-heading text-[#0A1628] mb-6 uppercase tracking-tight leading-none">{point.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">{point.description}</p>
              
              <div className="mt-auto pt-6 border-t border-black/5 w-full flex items-center justify-between group-hover:text-[var(--color-brand-primary)] transition-colors">
                 <span className="font-heading text-[10px] tracking-[0.2em] uppercase font-bold">Inspect Audit Parameters</span>
                 <Search size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Interactive Audit Overlay */}
        <AnimatePresence>
          {activeAudit && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            >
               <motion.div 
                  initial={{ y: 50, scale: 0.95 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 50, scale: 0.95 }}
                  className="bg-white w-full max-w-4xl relative shadow-2xl overflow-hidden"
               >
                  <button 
                    onClick={() => setActiveAudit(null)}
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 transition-colors z-20"
                    title="Close Audit Report"
                  >
                    <X size={24} />
                  </button>

                  <div className="flex flex-col md:flex-row h-full">
                     <div className="w-full md:w-1/3 bg-[#0A1628] p-10 md:p-14 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(241,90,36,0.2)_0%,transparent_50%)]" />
                        
                        <div className="relative z-10">
                           <FileText size={48} className="text-[var(--color-brand-primary)] mb-8" />
                           <h4 className="font-heading text-3xl uppercase tracking-tighter mb-4 leading-none">TECHNICAL AUDIT</h4>
                           <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Verification ID: SC-{activeAudit.id.toUpperCase()}-001</p>
                        </div>
                        
                        <div className="relative z-10 mt-20 pt-10 border-t border-white/10">
                           <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-white/30">Laboratory Status</span>
                           <div className="flex items-center gap-2 mt-2">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <p className="font-heading text-xs tracking-widest uppercase">Nodes Online</p>
                           </div>
                        </div>
                     </div>

                     <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
                        <h3 className="font-heading text-3xl mb-10 text-black uppercase tracking-tight">{activeAudit.title}</h3>
                        <div className="space-y-6">
                           {activeAudit.details.map((detail, i) => (
                              <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-4 group/item"
                              >
                                 <div className="w-2 h-2 bg-[var(--color-brand-primary)] rounded-full group-hover:scale-150 transition-transform" />
                                 <p className="font-body text-base font-bold text-black group-hover:text-[var(--color-brand-primary)] transition-colors uppercase tracking-tight">{detail}</p>
                              </motion.div>
                           ))}
                        </div>
                        <button 
                          onClick={() => setActiveAudit(null)}
                          className="mt-14 w-fit px-12 py-4 bg-black text-white font-heading text-[10px] tracking-[0.4em] uppercase hover:bg-[var(--color-brand-primary)] transition-all"
                        >
                          CLOSE REPORT
                        </button>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
