'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Cpu, MonitorPlay, Check, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import NextImage from 'next/image';
import { getProductBySlug } from '@/data/products';

type QuizStep = 'workload' | 'budget' | 'analyzing' | 'result';

export default function SystemQuiz() {
  const [step, setStep] = useState<QuizStep>('workload');
  const [workload, setWorkload] = useState('');
  
  // Recommend a specific product based on selection
  // For demo: returning specific slugs that exist in the database
  const getRecommendation = () => {
    let slug = 'lenovo-thinkpad-t470'; 
    if (workload === 'vfx') slug = 'macbook-pro-a2141-2019';
    if (workload === 'code') slug = 'macbook-pro-a1708-2017';
    
    // Safety check just in case product doesn't exist
    return getProductBySlug(slug) || getProductBySlug('lenovo-thinkpad-t470'); 
  };
  
  const recommendedProduct = getRecommendation();

  const handleWorkloadSelect = (type: string) => {
    setWorkload(type);
    setStep('analyzing');
    // Simulate complex scan
    setTimeout(() => setStep('result'), 2500);
  };

  const overrideReset = () => {
    setStep('workload');
    setWorkload('');
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      
      {/* Title Area */}
      <div className="text-center mb-16">
        <h2 className="font-heading text-4xl md:text-6xl text-brand-text mb-4 uppercase">SYSTEM <span className="text-[var(--color-brand-primary)]">FINDER</span></h2>
        <div className="w-24 h-1 bg-[var(--color-brand-primary)] mx-auto mb-6" />
        <p className="font-body text-brand-text/50 max-w-xl mx-auto uppercase tracking-widest text-xs">A.I. Component Matching based on Workload Requirements</p>
      </div>

      <div className="max-w-4xl mx-auto bg-white border-2 border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[450px]">
          
          {/* Left Panel: Terminal Decor */}
          <div className="w-full md:w-1/3 bg-[#111] p-8 flex flex-col relative overflow-hidden">
             
             {/* Scanlines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] mix-blend-overlay pointer-events-none" />
             
             <div className="font-heading text-white/40 text-[10px] tracking-[0.3em] uppercase mb-8">DIAGNOSTIC TERMINAL</div>
             
             <div className="font-mono text-[10px] text-green-500/80 space-y-2 mt-auto">
                <p>{'>'} INITIALIZING SCALAR ROUTINE...</p>
                <p className="animate-pulse">{'>'} AWAITING USER INPUT_</p>
                {step === 'analyzing' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <p>{'>'} DB_QUERY: WORKLOAD=&quot;{workload.toUpperCase()}&quot;</p>
                    <p>{'>'} FILTERING COMPUTE NODES...</p>
                    <p>{'>'} CALCULATING THERMAL LIMITS...</p>
                  </motion.div>
                )}
                {step === 'result' && (
                  <motion.div initial={{opacity:0}} animate={{opacity:1}}>
                    <p>{'>'} DB_QUERY: WORKLOAD=&quot;{workload.toUpperCase()}&quot;</p>
                    <p>{'>'} MATCH FOUND.</p>
                    <p className="text-[var(--color-brand-primary)]">{'>'} STATUS: SYSTEM OPTIMIZED.</p>
                  </motion.div>
                )}
             </div>
             
             {/* Edge Glow */}
             <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[var(--color-brand-primary)] to-transparent opacity-50" />
          </div>

          {/* Right Panel: Interactive Area */}
          <div className="w-full md:w-2/3 p-8 relative flex flex-col justify-center">
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
                  <h3 className="font-heading text-2xl text-brand-text mb-2">SELECT PRIMARY WORKLOAD</h3>
                  <p className="font-body text-sm text-brand-text/50 mb-8">What will this machine primarily be used for?</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {[
                       { id: 'office', icon: Laptop, title: 'BUSINESS & OFFICE', desc: 'Excel, Browsing, Tally' },
                       { id: 'code', icon: Cpu, title: 'SOFTWARE DEV', desc: 'VS Code, Docker, VMs' },
                       { id: 'vfx', icon: MonitorPlay, title: 'CREATIVE & VFX', desc: 'Premiere, Blender, CAD' },
                     ].map(w => (
                       <button 
                         key={w.id}
                         onClick={() => handleWorkloadSelect(w.id)}
                         className="group p-6 border-2 border-black/5 hover:border-[var(--color-brand-primary)] bg-[#FAFAFA] hover:bg-white text-left transition-all duration-300 relative overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgba(241,90,36,0.12)] hover:-translate-y-1"
                       >
                         {/* Animated scanline on hover */}
                         <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[var(--color-brand-primary)]/10 to-transparent blur-xl pointer-events-none -translate-y-full group-hover:animate-scanline" />
                         
                         {/* Border fill effect */}
                         <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-brand-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                         
                         <div className="relative z-10">
                           <div className="w-12 h-12 flex items-center justify-center bg-white border border-black/5 rounded-md mb-5 group-hover:border-[var(--color-brand-primary)]/30 group-hover:bg-[var(--color-brand-primary)]/5 transition-colors">
                             <w.icon className="w-6 h-6 text-brand-text/50 group-hover:text-[var(--color-brand-primary)] transition-colors" strokeWidth={1.5} />
                           </div>
                           <div className="font-heading text-lg text-brand-text mb-1.5 uppercase tracking-wider group-hover:text-[var(--color-brand-primary)] transition-colors">{w.title}</div>
                           <div className="font-body text-xs text-brand-text/60 leading-relaxed">{w.desc}</div>
                         </div>
                       </button>
                     ))}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: ANALYZING */}
              {step === 'analyzing' && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <Loader2 className="w-12 h-12 text-[var(--color-brand-primary)] animate-spin mb-6" />
                  <h3 className="font-heading text-xl text-brand-text tracking-widest uppercase mb-2">SCANNING HARDWARE MATRIX</h3>
                  <div className="w-48 h-1 bg-gray-100 overflow-hidden relative">
                     <motion.div 
                       className="absolute top-0 bottom-0 left-0 bg-[var(--color-brand-primary)]"
                       animate={{ right: ['100%', '0%'] }}
                       transition={{ duration: 2.2, ease: 'easeInOut' }}
                     />
                  </div>
                </motion.div>
              )}

              {/* STEP 3: RESULT */}
              {step === 'result' && recommendedProduct && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full flex flex-col h-full"
                >
                  <div className="flex items-center gap-2 mb-6">
                     <Check className="w-5 h-5 text-green-500" strokeWidth={2.5} />
                     <span className="font-heading text-xs tracking-widest uppercase text-green-600">OPTIMAL MATCH FOUND</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6 items-center border border-[var(--color-brand-primary)]/20 bg-[#FAFAFA] p-6 mb-8 group relative overflow-hidden">
                    {/* Animated shine line */}
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[var(--color-brand-primary)] to-[var(--color-brand-accent)]" />
                    
                    <div className="w-32 h-32 relative flex-shrink-0 mix-blend-multiply">
                       <NextImage src={recommendedProduct.image} alt={recommendedProduct.name} fill className="object-contain" />
                    </div>
                    
                    <div className="flex flex-col items-start text-left">
                       <span className="font-heading text-[10px] tracking-[0.2em] text-brand-text/50 uppercase mb-1">{recommendedProduct.brand}</span>
                       <h4 className="font-heading text-xl text-brand-text uppercase leading-tight mb-3 line-clamp-2">{recommendedProduct.name}</h4>
                       
                       <div className="flex gap-4 mb-4">
                         <div className="bg-white border border-black/10 px-2 py-1 flex items-center gap-2">
                            <span className="font-heading text-[8px] text-black/40">CPU:</span>
                            <span className="font-body text-[10px] font-bold uppercase truncate max-w-[80px]">{recommendedProduct.specs.processor}</span>
                         </div>
                         <div className="bg-white border border-black/10 px-2 py-1 flex items-center gap-2">
                            <span className="font-heading text-[8px] text-black/40">RAM:</span>
                            <span className="font-body text-[10px] font-bold uppercase">{recommendedProduct.specs.ram}</span>
                         </div>
                       </div>
                       
                       <span className="font-body font-black text-xl text-[var(--color-brand-primary)]">
                         ₹{recommendedProduct.price.toLocaleString('en-IN')}
                       </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    <Link href={`/products/${recommendedProduct.slug}`} className="flex-1">
                      <button className="w-full bg-black text-white hover:bg-[var(--color-brand-primary)] transition-colors py-4 font-heading text-xs tracking-widest uppercase flex justify-center items-center gap-2">
                        VIEW SYSTEM SPECS <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                    <button onClick={overrideReset} className="px-6 py-4 border border-black/10 hover:bg-gray-50 text-brand-text font-heading text-xs tracking-widest uppercase transition-colors">
                      RE-SCAN
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
