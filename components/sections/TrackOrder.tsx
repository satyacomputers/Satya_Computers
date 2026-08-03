'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2, Sparkles } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    
    setIsSubmitting(true);
    // Add small delay for "technical feel"
    setTimeout(() => {
      router.push(`/order-status?id=${orderId.trim()}`);
    }, 800);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0A0A0A] text-white p-12 md:p-20 relative overflow-hidden group">
          {/* Animated background patterns */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(241,90,36,0.15)_0%,transparent_50%)]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full"
              >
                <div className="w-2 h-2 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
                <span className="font-heading text-[10px] tracking-[0.3em] uppercase text-white/40">Real-time Deployment Sync</span>
              </motion.div>
              
              <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.85] uppercase tracking-tighter">
                LOCATE YOUR <br />
                <span className="text-[var(--color-brand-primary)]">HARDWARE.</span>
              </h2>
              
              <p className="font-body text-white/50 text-base md:text-lg mb-10 max-w-md leading-relaxed uppercase tracking-widest text-[10px]">
                Access the global logistics grid to track your system architecture in real-time. Enter your deployment ID from your digital invoice.
              </p>

              <div className="flex gap-10 opacity-30">
                 <div className="flex flex-col">
                    <span className="font-heading text-xl mb-1">99.8%</span>
                    <span className="font-heading text-[8px] tracking-widest uppercase">DISPATCH_ACCURACY</span>
                 </div>
                 <div className="flex flex-col">
                    <span className="font-heading text-xl mb-1">HYD</span>
                    <span className="font-heading text-[8px] tracking-widest uppercase">LOGISTICS_HUB</span>
                 </div>
              </div>
            </div>

            <div className="relative">
              <form 
                onSubmit={handleTrack}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-2 group/form hover:border-white/20 transition-all duration-500"
              >
                <div className="absolute -top-10 right-4 flex items-center gap-2 text-white/20">
                   <MapPin size={12} />
                   <span className="font-heading text-[8px] tracking-[0.4em] uppercase">SYSTEM_LOCATION_HUB</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text"
                      placeholder="ENTER DEPLOYMENT ID (e.g. SATYA-XXXX)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full h-16 bg-white/[0.03] border border-white/5 px-8 outline-none font-heading text-sm tracking-[0.1em] text-white placeholder:text-white/20 transition-all focus:bg-white/[0.08] focus:border-[var(--color-brand-primary)]"
                      required
                    />
                    <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 text-white/5 group-hover/form:text-[var(--color-brand-primary)]/40 transition-colors" size={16} />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="h-16 px-10 bg-[var(--color-brand-primary)] text-white font-heading text-xs tracking-[0.3em] font-black uppercase flex items-center justify-center gap-4 hover:bg-white hover:text-black transition-all group/btn disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>INITIALIZE TRACKING</span>
                        <Search size={18} className="group-hover/btn:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <div className="mt-8 flex items-center gap-4">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0A] bg-zinc-800 overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?u=${i*123}`} alt="User" />
                      </div>
                    ))}
                 </div>
                 <p className="text-[9px] font-heading tracking-widest text-white/30 uppercase">
                    Joined by <span className="text-white/60">1,200+</span> Enterprise Partners tracking live deployments.
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
