'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Zap } from 'lucide-react';

export default function FlashSaleBanner() {
  const [timeLeft, setTimeLeft] = useState(48 * 60 * 60); // 48 hours in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const paddedFormat = (num: number) => num.toString().padStart(2, '0');

  return (
    <section className="py-2 px-4 bg-black border-y border-[var(--color-brand-primary)] overflow-hidden relative">
      {/* Background Animated Gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand-primary)]/20 via-transparent to-[var(--color-brand-accent)]/20"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
      />
      
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 relative z-10 py-3">
        
        {/* Sale Message */}
        <div className="flex items-center gap-3">
           <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400 animate-pulse" />
           <p className="font-heading text-white uppercase tracking-wider text-sm md:text-base">
             <span className="text-[var(--color-brand-primary)] font-black">SYSTEM UPGRADE:</span> Free DDR4 RAM doubling on all Dell Latitudes
           </p>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center gap-4 bg-white/10 px-4 py-2 border border-white/20">
           <Timer className="w-4 h-4 text-white/50" />
           <div className="flex items-center gap-2 font-mono text-xl font-bold text-white tracking-widest">
              <div className="flex flex-col items-center">
                <span>{paddedFormat(hours)}</span>
                <span className="text-[7px] text-[var(--color-brand-primary)] font-heading">HRS</span>
              </div>
              <span className="text-white/30 pb-3">:</span>
              <div className="flex flex-col items-center">
                <span>{paddedFormat(minutes)}</span>
                <span className="text-[var(--color-brand-accent)] text-[7px] font-heading">MIN</span>
              </div>
              <span className="text-white/30 pb-3">:</span>
              <div className="flex flex-col items-center">
                <span className="text-[var(--color-brand-primary)]">{paddedFormat(seconds)}</span>
                <span className="text-[7px] text-white/50 font-heading">SEC</span>
              </div>
           </div>
        </div>
        
        {/* CTA */}
        <button 
          onClick={() => window.open(`https://wa.me/918309178589?text=I am interested in the System Upgrade Flash Sale!`, '_blank')}
          className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-accent)] text-white px-6 py-2 font-heading text-[10px] tracking-[0.2em] font-bold uppercase transition-colors"
        >
          CLAIM UPGRADE →
        </button>

      </div>
    </section>
  );
}
