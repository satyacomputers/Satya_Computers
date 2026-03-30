'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Cpu, MonitorPlay, Check, Loader2, ArrowRight, BrainCircuit, BarChart, Server } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { getProductBySlug } from '@/data/products';

type QuizStep = 'workload' | 'budget' | 'analyzing' | 'result';

export default function SystemQuiz() {
  const [step, setStep] = useState<QuizStep>('workload');
  const [workload, setWorkload] = useState('');
  const [budget, setBudget] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return (
    <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[600px] flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-black border-t-[var(--color-brand-primary)] animate-spin" />
    </div>
  );
  
  const getRecommendation = () => {
    // Better logic based on actual data
    let id = "1"; // Default
    
    if (workload === 'vfx') {
       // Creative: Needs good GPU/Apple
       if (budget === 'high') id = "31"; // MacBook Pro M1 2021
       else if (budget === 'mid') id = "28"; // MacBook Pro A1990
       else id = "10"; // Dell Latitude 5401 (2GB Graphics)
    } else if (workload === 'code') {
       // DevOps: Needs RAM/CPU
       if (budget === 'high') id = "23"; // ThinkPad P15
       else if (budget === 'mid') id = "12"; // Dell Latitude 5420
       else id = "11"; // Dell Latitude 3410
    } else if (workload === 'ai') {
       // AI: Needs ultimate RAM/VRAM
       if (budget === 'high') id = "23"; // ThinkPad P15
       else id = "22"; // ThinkPad P53
    } else if (workload === 'office') {
       // Corporate: Stability
       if (budget === 'high') id = "13"; // Dell Latitude 5430
       else if (budget === 'mid') id = "6"; // Dell Latitude 7490
       else id = "4"; // Dell Latitude 3400
    }
    
    return getProductBySlug(id) || getProductBySlug('1'); 
  };
  
  const recommendedProduct = getRecommendation();

  const handleWorkloadSelect = (type: string) => {
    setWorkload(type);
    setStep('budget');
  };

  const handleBudgetSelect = (b: string) => {
    setBudget(b);
    setStep('analyzing');
    // Simulate deep stack analysis
    setTimeout(() => setStep('result'), 3000);
  };

  const overrideReset = () => {
    setStep('workload');
    setWorkload('');
    setBudget(null);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      
      <div className="text-center mb-16 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black text-white rounded-none mb-8 font-heading text-[10px] tracking-[0.4em] uppercase border-l-4 border-[var(--color-brand-primary)]">
          <BrainCircuit size={12} className="text-[var(--color-brand-primary)] animate-pulse" /> Diagnostic Engine_v2.0
        </div>
        <h2 className="font-heading text-5xl md:text-7xl text-brand-text mb-6 uppercase leading-none tracking-tighter">
          SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)]">FINDER</span>
        </h2>
        <div className="flex items-center justify-center gap-4 max-w-xl mx-auto">
          <div className="h-[1px] flex-1 bg-black/5" />
          <p className="font-body text-brand-text/40 uppercase tracking-[0.3em] text-[9px] font-black whitespace-nowrap">
            Neural Hardware Optimization
          </p>
          <div className="h-[1px] flex-1 bg-black/5" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white border-2 border-black shadow-[20px_20px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          
          {/* Left Panel: Terminal Decor */}
          <div className="w-full md:w-1/3 bg-[#0A1628] p-8 flex flex-col relative overflow-hidden text-white/90">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(241,90,36,0.08)_2px,transparent_2px)] bg-[size:100%_4px] pointer-events-none" />
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-orange-500/5 pointer-events-none" />
             
             <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/10 relative z-10">
                <div className="flex flex-col">
                  <span className="font-heading text-[10px] tracking-[0.3em] uppercase opacity-40">Diagnostic Node</span>
                  <span className="font-mono text-[9px] text-emerald-400">SATYA_SYS_v2_4</span>
                </div>
                <div className="flex gap-2 p-1.5 bg-black/20 rounded-full border border-white/5">
                   <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   <div className="w-2 h-2 rounded-full bg-orange-500/30" />
                </div>
             </div>
             
             <div className="font-mono text-[10px] text-emerald-400/80 space-y-4 mt-auto relative z-10">
                <div className="space-y-1">
                  <p className="flex items-start gap-2">
                     <span className="opacity-40">{'>'}</span>
                     <span className="tracking-tighter">COREINIT: COMPLETED [OK]</span>
                  </p>
                  <p className="flex items-start gap-2">
                     <span className="opacity-40">{'>'}</span>
                     <span className="tracking-tighter">NEURAL_NET_V2: READY</span>
                  </p>
                </div>

                <div className="h-[1px] w-full bg-white/5" />

                {(workload || budget) ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 py-2">
                      {workload && (
                        <p className="flex items-center gap-2 text-orange-400">
                          <span className="w-1.5 h-[1px] bg-orange-400/50" />
                          <span>PROFILE: {workload.toUpperCase()}</span>
                        </p>
                      )}
                      {budget && (
                        <p className="flex items-center gap-2 text-orange-400">
                          <span className="w-1.5 h-[1px] bg-orange-400/50" />
                          <span>PARAM: {budget.toUpperCase()}</span>
                        </p>
                      )}
                      {step === 'analyzing' && (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          className="pt-2 text-white/30 italic font-mono text-[9px] space-y-1"
                        >
                          <p>{'>'} MATCHING TOPOLOGY...</p>
                          <p>{'>'} SYNCING DB_REF...</p>
                        </motion.div>
                      )}
                   </motion.div>
                ) : (
                  <p className="flex items-start gap-2 animate-pulse text-white/40">
                     <span className="opacity-40">{'>'}</span>
                     <span>AWAITING INPUT_STRING</span>
                  </p>
                )}
             </div>
             
             {/* Large background text decorative */}
             <div className="absolute bottom-[-20px] left-[-30px] font-heading text-[120px] leading-none text-white/[0.02] pointer-events-none select-none uppercase transform -rotate-12">
               FINDER
             </div>

             {/* Edge Glow */}
             <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-brand-primary)] to-transparent opacity-30" />
          </div>

          {/* Right Panel: Interactive Area */}
          <div className="w-full md:w-2/3 p-10 md:p-16 relative flex flex-col justify-center bg-white">
            <AnimatePresence mode="wait">
               
              {/* STEP 1: WORKLOAD */}
              {step === 'workload' && (
                <motion.div
                  key="workload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <h3 className="font-heading text-3xl text-brand-text mb-2 uppercase tracking-tight">Select <span className="text-[var(--color-brand-primary)]">Workload</span></h3>
                  <p className="font-body text-sm text-brand-text/50 mb-10 uppercase tracking-widest font-bold text-[10px]">What is the primary operational objective?</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                     {[
                       { id: 'office', icon: Laptop, title: 'Corporate', desc: 'DOCS, CRM, EXCEL', feat: 'High Stability' },
                       { id: 'code', icon: Cpu, title: 'DevOps', desc: 'DOCKER, VS CODE', feat: 'Fast Compilation' },
                       { id: 'vfx', icon: MonitorPlay, title: 'Creative', desc: '4K EDIT, BLENDER', feat: 'Color Accurate' },
                       { id: 'ai', icon: BrainCircuit, title: 'AI & Data', desc: 'PYTHON, FLOWS', feat: 'Neural Compute' },
                     ].map(w => (
                       <button 
                         key={w.id}
                         type='button' suppressHydrationWarning onClick={() => handleWorkloadSelect(w.id)}
                         className="group p-6 border-2 border-black/5 hover:border-black bg-white text-left transition-all duration-[400ms] relative overflow-hidden shadow-sm hover:shadow-[10px_10px_0_rgba(0,0,0,0.05)]"
                       >
                         {/* Hover Accent */}
                         <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-transparent translate-x-12 -translate-y-12 rotate-45 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500" />
                         
                         <div className="relative z-10">
                           <div className="w-12 h-12 flex items-center justify-center bg-gray-50 border border-black/5 rounded-none mb-6 group-hover:bg-black group-hover:text-white transition-all duration-300">
                             <w.icon className="w-6 h-6" strokeWidth={1} />
                           </div>
                           <div className="font-heading text-xl text-brand-text mb-1.5 uppercase tracking-wider group-hover:text-[var(--color-brand-primary)] transition-colors">{w.title}</div>
                           <div className="font-body text-[9px] text-brand-text/40 uppercase font-black tracking-widest mb-3">{w.desc}</div>
                           
                           <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="h-[1px] w-4 bg-[var(--color-brand-primary)]" />
                             <span className="font-heading text-[8px] tracking-widest text-[var(--color-brand-primary)] uppercase">{w.feat}</span>
                           </div>
                         </div>
                       </button>
                     ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: BUDGET */}
              {step === 'budget' && (
                <motion.div
                  key="budget"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <h3 className="font-heading text-3xl text-brand-text mb-2 uppercase tracking-tight">Compute <span className="text-[var(--color-brand-primary)]">Tier</span></h3>
                  <p className="font-body text-sm text-brand-text/50 mb-10 uppercase tracking-widest font-bold text-[10px]">Select investment bracket for this system.</p>
                  
                  <div className="grid grid-cols-1 gap-4">
                     {[
                       { id: 'low', title: 'ENTRY SCALE', desc: 'BEST FOR LIGHT TASKS', price: '₹15,000 - ₹25,000', icon: Server },
                       { id: 'mid', title: 'MID-RANGE ELITE', desc: 'BALANCED FOR PROS', price: '₹25,000 - ₹45,000', icon: BarChart },
                       { id: 'high', title: 'ULTIMATE PERFORMANCE', desc: 'NO LIMITS WORKSTATION', price: '₹45,000+', icon: Cpu },
                     ].map(b => (
                       <button 
                         key={b.id}
                         type='button' suppressHydrationWarning onClick={() => handleBudgetSelect(b.id)}
                         className="group p-6 border-2 border-black/5 hover:border-black bg-white text-left transition-all duration-300 flex items-center gap-6 relative"
                       >
                         <div className="w-14 h-14 flex items-center justify-center bg-gray-50 border border-black/5 rounded-none group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all duration-300">
                             <b.icon className="w-7 h-7" strokeWidth={1} />
                         </div>
                         <div className="flex-1">
                            <div className="font-heading text-[10px] tracking-[0.2em] text-black/30 mb-1 uppercase font-black">{b.desc}</div>
                            <div className="font-heading text-2xl text-brand-text uppercase leading-none mb-1 group-hover:text-[var(--color-brand-primary)] transition-colors">{b.title}</div>
                            <div className="font-body text-xs text-brand-text/60 font-black uppercase tracking-widest">{b.price}</div>
                         </div>
                         <div className="w-10 h-10 flex items-center justify-center border border-black/5 group-hover:border-black transition-colors">
                           <ArrowRight className="w-5 h-5 text-black/20 group-hover:text-black group-hover:translate-x-1 transition-all" />
                         </div>
                       </button>
                     ))}
                  </div>
                  
                  <button 
                    type="button"
                    suppressHydrationWarning
                    onClick={() => setStep('workload')} 
                    className="mt-8 font-heading text-[10px] tracking-widest uppercase text-black/30 hover:text-black transition-colors"
                  >
                    ← Change Workload
                  </button>
                </motion.div>
              )}

              {/* STEP 3: ANALYZING */}
              {step === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="relative mb-8">
                     <div className="w-24 h-24 rounded-full border-4 border-gray-50 border-t-[var(--color-brand-primary)] animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-black/10" />
                     </div>
                  </div>
                  <h3 className="font-heading text-2xl text-brand-text tracking-widest uppercase mb-2">Analyzing Node Matrix</h3>
                  <p className="font-body text-[10px] text-brand-text/40 uppercase font-black tracking-[0.2em]">Verifying hardware compatibility benchmarks...</p>
                </motion.div>
              )}

              {/* STEP 4: RESULT */}
              {step === 'result' && recommendedProduct && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col h-full relative"
                >
                  {/* Decorative Professional Badges around the container */}
                  <div className="absolute -top-12 -right-12 hidden lg:flex items-center gap-2 px-3 py-1.5 border border-black/10 font-heading text-[10px] tracking-widest text-black/30 uppercase bg-white">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-none shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                    System Ready
                  </div>
                  <div className="absolute -top-12 -left-12 hidden lg:flex items-center gap-2 px-3 py-1.5 border border-black/10 font-heading text-[10px] tracking-widest text-black/30 uppercase bg-white">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-none animate-pulse" />
                    Neural Engine Active
                  </div>

                  <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/10">
                     <div className="flex items-center gap-3">
                        <div className="bg-emerald-500/10 p-1.5 rounded-none border border-emerald-500/20">
                          <Check className="w-4 h-4 text-emerald-600" strokeWidth={3} />
                        </div>
                        <span className="font-heading text-xs tracking-[0.2em] uppercase text-emerald-600 font-black">MATCH VERIFIED [OK]</span>
                     </div>
                     <div className="flex items-center gap-4">
                        <span className="font-mono text-[9px] text-black/40">LATENCY: 12ms</span>
                        <span className="font-mono text-[9px] text-black/25">DB_ID: SYS_{recommendedProduct.id.padStart(3,'0')}</span>
                     </div>
                  </div>

                  {/* Main Result Card */}
                  <div className="bg-[#050B14] shadow-[0_40px_100px_rgba(0,0,0,0.1)] p-1 md:p-1 mb-8 relative group overflow-hidden border border-black/5">
                    {/* Blue Printing Grid Overlay internally */}
                    <div className="absolute inset-4 opacity-[0.05] pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-[size:24px_24px]" />
                    
                    <div className="bg-white p-8 md:p-12 relative flex flex-col md:flex-row gap-12 items-center">
                      
                      {/* Product Visual Area */}
                      <div className="w-full md:w-1/2 relative aspect-square max-w-[320px]">
                         {/* Technical Badges as seen in image */}
                         <div className="absolute -top-4 -left-4 z-40 flex flex-col gap-1 shadow-lg">
                           <div className="bg-black text-white px-3 py-1.5 font-heading text-[10px] tracking-widest font-black border border-white/10 uppercase">
                             Elite Spec
                           </div>
                           <motion.div 
                              animate={{ backgroundColor: ['#F97316', '#000', '#F97316'] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="bg-[#F97316] text-white px-3 py-1.5 font-heading text-[10px] tracking-widest font-black uppercase"
                           >
                             Hot Asset
                           </motion.div>
                         </div>

                         {/* Holographic Scan Bar */}
                         <motion.div 
                           className="absolute inset-x-[-10%] h-1 bg-gradient-to-r from-transparent via-[var(--color-brand-primary)] to-transparent blur-[2px] z-20 shadow-[0_0_15px_rgba(241,90,36,0.6)]"
                           animate={{ top: ['0%', '100%', '0%'] }}
                           transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                         />
                         
                         {/* Technical HUD around the image */}
                         <div className="absolute inset-0 border border-black/[0.03] rounded-none z-0" />
                         <div className="absolute top-0 right-0 w-8 h-8 border-t border-right border-black/10" />
                         <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-left border-black/10" />

                         <NextImage 
                           src={recommendedProduct.image} 
                           alt={recommendedProduct.name} 
                           fill 
                           className="object-contain z-10 p-6 drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-[1.2s] ease-out pointer-events-none" 
                         />
                         
                         {/* Static blueprint text inside Visual Area */}
                         <div className="absolute bottom-2 right-2 text-[8px] font-mono text-black/15 rotate-90 origin-bottom-right uppercase tracking-[0.2em] pointer-events-none">
                           RENDER_NODE_v{recommendedProduct.id}
                         </div>
                      </div>
                      
                      {/* Specs Area */}
                      <div className="w-full md:w-1/2 text-left space-y-8">
                         <div>
                          <p className="font-heading text-[10px] tracking-[0.4em] text-[var(--color-brand-primary)] uppercase font-bold mb-4 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-[var(--color-brand-primary)]/30" />
                            {recommendedProduct.brand} PLATFORM CORE
                          </p>
                          <h4 className="font-heading text-4xl lg:text-5xl text-brand-text uppercase leading-none tracking-tighter mb-4">{recommendedProduct.name}</h4>
                          <p className="font-body text-[11px] text-black/40 uppercase font-black leading-relaxed max-w-sm">
                            Professional enterprise system optimized for high-reliability operations. Rigorously tested for thermal efficiency and sustained workload performance.
                          </p>
                         </div>
                         
                         {/* Blueprint Spec Grid */}
                         <div className="grid grid-cols-2 gap-4">
                           <div className="bg-gray-50/50 p-5 border border-black/[0.03] group-hover:border-black/5 transition-colors">
                              <span className="block font-heading text-[9px] text-black/30 tracking-widest mb-1.5 uppercase font-bold">PROCESSOR_UNIT</span>
                              <span className="block font-body text-[13px] font-black uppercase text-brand-text mb-1">{recommendedProduct.specs.processor}</span>
                              <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: ['0%', '85%'] }} className="h-full bg-black/10" />
                              </div>
                           </div>
                           <div className="bg-gray-50/50 p-5 border border-black/[0.03] group-hover:border-black/5 transition-colors">
                              <span className="block font-heading text-[9px] text-black/30 tracking-widest mb-1.5 uppercase font-bold">DRAM_DEPLOYED</span>
                              <span className="block font-body text-[13px] font-black uppercase text-brand-text mb-1">{recommendedProduct.specs.ram}</span>
                              <div className="h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div animate={{ width: ['0%', '70%'] }} className="h-full bg-black/10" />
                              </div>
                           </div>
                         </div>

                         <div className="pt-2 flex flex-col gap-1">
                           <div className="flex items-baseline gap-4">
                             <span className="font-body font-black text-5xl text-black tracking-tighter">
                               ₹{recommendedProduct.price.toLocaleString('en-IN')}
                             </span>
                             <span className="text-sm font-bold text-black/20 line-through">₹{(recommendedProduct.price * 1.25).toLocaleString('en-IN')}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                             <span className="text-[10px] font-heading tracking-widest text-emerald-600 font-bold uppercase">Asset Verified: Highly Recommended</span>
                           </div>
                         </div>
                      </div>
                    </div>

                    {/* Highly Professional Background Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-heading text-[300px] text-black/[0.02] pointer-events-none select-none uppercase z-0 leading-none">
                      {recommendedProduct.brand}
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col sm:flex-row gap-5">
                    <Link href={`/products/${recommendedProduct.slug}`} className="flex-[2]">
                      <button 
                        type="button"
                        suppressHydrationWarning
                        className="w-full relative h-16 group/btn overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-black translate-y-0 group-hover/btn:translate-y-full transition-transform duration-500 ease-in-out" />
                        <span className="absolute inset-0 bg-[var(--color-brand-primary)] -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-in-out" />
                        <div className="relative z-10 flex items-center justify-center gap-3 font-heading text-sm tracking-[0.3em] font-black text-white px-8 uppercase">
                          Initialize System Deployment <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300" />
                        </div>
                      </button>
                    </Link>
                    <button 
                      type="button"
                      suppressHydrationWarning
                      onClick={overrideReset} 
                      className="flex-1 h-16 border-2 border-black flex items-center justify-center font-heading text-sm tracking-[0.2em] font-black uppercase transition-all hover:bg-black hover:text-white"
                    >
                      Re-Evaluate
                    </button>
                  </div>
                </motion.div>
              )}
               
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

