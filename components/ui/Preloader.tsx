'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Determine how long the preloader stays on screen
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); // 2.8 seconds loading experience

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-[#030303] overflow-hidden"
        >
          {/* Subtle Background Elements */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(241,90,36,0.06),transparent)] pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

          {/* Main Content Area */}
          <div className="relative flex flex-col items-center z-10 w-full max-w-2xl px-6">
            
            {/* Logo Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="flex items-center gap-4 md:gap-6"
            >
              <img 
                src="/satya_computers_logo.png" 
                alt="" 
                className="w-16 h-16 md:w-24 md:h-24 object-contain contrast-125" 
              />
              <h1 className="font-heading text-4xl md:text-6xl tracking-[0.2em] text-white">
                SATYA<span className="text-[var(--color-brand-primary)]">COMPUTERS</span>
              </h1>
            </motion.div>

            {/* Glowing Progress Line */}
            <div className="relative w-full md:w-3/4 mt-12 md:mt-16 h-[2px] bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, delay: 0.2, ease: "easeInOut" }}
                className="absolute left-0 top-0 h-full bg-[var(--color-brand-primary)] shadow-[0_0_15px_rgba(241,90,36,0.8)]"
              />
            </div>

            {/* Boot Sequence Text */}
            <div className="mt-8 flex flex-col items-center mt-6 h-8 overflow-hidden relative w-full">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="absolute font-heading text-[10px] md:text-xs tracking-[0.4em] text-white/50 uppercase font-bold"
              >
                INITIALIZING CORE ENGINE...
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute bg-[#030303] font-heading text-[10px] md:text-xs tracking-[0.4em] text-[var(--color-brand-primary)] uppercase font-bold"
              >
                SYSTEM READY. WELCOME.
              </motion.div>
            </div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
