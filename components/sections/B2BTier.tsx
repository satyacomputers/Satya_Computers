'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, Truck, Calculator, ChevronRight, Check } from 'lucide-react';

export default function B2BTier() {
  const [quantity, setQuantity] = useState(1);
  const [showQuote, setShowQuote] = useState(false);

  const unitPrice = 28000;
  const discount = quantity >= 50 ? 0.20 : quantity >= 10 ? 0.12 : quantity >= 5 ? 0.08 : 0;
  const totalPrice = unitPrice * quantity * (1 - discount);

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-brand-primary)]/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          {/* Content Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/5 rounded-full mb-8">
               <Building2 size={14} className="text-[var(--color-brand-primary)]" />
               <span className="font-heading text-[10px] tracking-[0.2em] uppercase font-bold text-white/50">Enterprise Procurement</span>
            </div>
            
            <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.9] tracking-tighter">
              B2B <span className="text-[var(--color-brand-primary)]">SOLUTIONS</span> FOR SCALE.
            </h2>
            
            <p className="font-body text-white/60 text-lg leading-relaxed mb-12 max-w-lg">
              Optimized supply chain for educational institutions, corporate startups, and large-scale enterprises. Custom configurations with volume-based scaling.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Globe, title: 'PAN-INDIA DEPLOYMENT', sub: 'Hub-and-spoke logistics' },
                { icon: Truck, title: 'FAST-TRACK LOGISTICS', sub: '48hr node delivery' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                  <div className="w-10 h-10 bg-[var(--color-brand-primary)]/10 flex items-center justify-center border border-[var(--color-brand-primary)]/20">
                     <item.icon size={20} className="text-[var(--color-brand-primary)]" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs tracking-widest uppercase mb-1">{item.title}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Right */}
          <div className="relative">
             <div className="bg-white text-black p-8 md:p-14 shadow-[20px_20px_0_rgba(241,90,36,0.2)] md:shadow-[40px_40px_0_rgba(241,90,36,0.2)] border-2 border-black relative z-10">
                <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-6">
                   <h3 className="font-heading text-xl md:text-2xl uppercase tracking-tighter">VOLUME ESTIMATOR</h3>
                   <Calculator className="w-6 h-6 text-[var(--color-brand-primary)]" />
                </div>

                <div className="space-y-6 md:space-y-8">
                   <div className="space-y-4">
                      <div className="flex justify-between font-heading text-[10px] md:text-[11px] tracking-widest uppercase">
                        <span>UNITS REQUIRED</span>
                        <span className="text-[var(--color-brand-primary)] font-black">{quantity} SYSTEMS</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-100 appearance-none cursor-pointer accent-black"
                        aria-label="Quantity of systems"
                      />
                      <div className="flex justify-between text-[8px] md:text-[9px] text-black/40 font-bold uppercase tracking-tighter">
                         <span>SINGLE NODE</span>
                         <span>FLEET (100+)</span>
                      </div>
                   </div>

                   <div className="bg-gray-50 p-6 border border-black/5 space-y-4">
                      <div className="flex justify-between text-xs font-bold">
                         <span className="text-black/50 font-heading tracking-widest">BASE VALUE</span>
                         <span className="font-body font-black italic">₹{(unitPrice * quantity).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-xs items-center font-bold">
                         <span className="text-black/50 font-heading tracking-widest">VOLUME REBATE</span>
                         <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 border border-emerald-100 font-black">{(discount * 100).toFixed(0)}% OFF</span>
                      </div>
                      <div className="h-px bg-black/10" />
                      <div className="flex justify-between items-end">
                         <span className="font-heading text-xs uppercase tracking-widest font-black">FINAL QUOTE</span>
                         <span className="font-body text-xl md:text-4xl font-black text-black leading-none">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                   </div>

                   <button 
                    onClick={() => setShowQuote(true)}
                    className="w-full bg-black text-white py-4 md:py-5 font-heading text-sm tracking-widest uppercase hover:bg-[var(--color-brand-primary)] transition-all flex items-center justify-center gap-3 group"
                   >
                     <span>SUBMIT FOR EVALUATION</span>
                     <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
                
                {/* Success Overlay with Options */}
                <AnimatePresence>
                  {showQuote && (
                     <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center p-6 md:p-12 text-center"
                     >
                        <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                           <Check size={24} />
                        </div>
                        <h4 className="font-heading text-xl md:text-2xl mb-4 uppercase tracking-tighter">REQUEST GENERATED</h4>
                        <p className="font-body text-xs md:text-sm text-black/50 mb-8 leading-relaxed px-4">
                          Select your preferred transmission method to notify our corporate desk.
                        </p>
                        
                        <div className="w-full space-y-3">
                           <a 
                             href={`https://wa.me/919640272323?text=${encodeURIComponent(`Hi Satya Computers, I am interested in a bulk order of ${quantity} systems. My estimated quote is ₹${totalPrice.toLocaleString('en-IN')}. Please contact me.`)}`}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 font-heading text-[10px] tracking-[0.2em] font-black uppercase hover:brightness-110 transition-all rounded-sm"
                           >
                             SEND VIA WHATSAPP
                           </a>
                           
                           <a 
                             href={`mailto:info@satyacomputers.in?subject=B2B Quote Request - ${quantity} Units&body=${encodeURIComponent(`Hi Satya Computers,\n\nI am interested in a bulk order of ${quantity} systems.\n\nEstimated Quote: ₹${totalPrice.toLocaleString('en-IN')}\n\nPlease contact me with further details.\n\nQuantity: ${quantity}`)}`}
                             className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 font-heading text-[10px] tracking-[0.2em] font-black uppercase hover:bg-[var(--color-brand-primary)] transition-all rounded-sm"
                           >
                             SEND VIA EMAIL
                           </a>
                        </div>

                        <button onClick={() => setShowQuote(false)} className="mt-8 font-heading text-[9px] tracking-[0.3em] uppercase text-black/30 hover:text-black transition-colors underline underline-offset-4">
                          ← Back to Configurator
                        </button>
                     </motion.div>
                  )}
                </AnimatePresence>
             </div>

             {/* Background Brutalist Shapes */}
             <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 bg-[var(--color-brand-primary)] -z-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
