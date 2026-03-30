'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, RotateCcw, ShieldCheck, X, ArrowRight } from 'lucide-react';

const policies = [
  {
    id: 'delivery',
    icon: Truck,
    title: 'Free Delivery',
    subtitle: 'Same day in Hyderabad',
    metric: '0h',
    metricLabel: 'Delivery Time',
    content: "Enjoy complimentary, lightning-fast delivery within Hyderabad limits. All systems are securely packaged in shock-proof, anti-static materials. Orders placed before 2 PM are guaranteed to be delivered the very same day. For orders outside Hyderabad, standard shipping rates apply with 3-5 days delivery.",
    gradientClass: 'bg-[conic-gradient(from_0deg,_transparent_0%,_var(--color-brand-primary)_30%,_transparent_60%)]',
    textClass: 'text-[var(--color-brand-primary)]',
    bgClass: 'bg-[var(--color-brand-primary)]',
    bgFadeClass: 'bg-[var(--color-brand-primary)]/10',
    borderClass: 'border-[var(--color-brand-primary)]/20',
  },
  {
    id: 'returns',
    icon: RotateCcw,
    title: '1-Month Replacement',
    subtitle: 'Piece to Piece policy',
    metric: '1mo',
    metricLabel: 'Replacement Window',
    content: "1 month piece to piece replacement. Your satisfaction is our priority. If you encounter any technical issues or if the product doesn't meet the described specifications, you can get a full unit replacement within 30 days. The device must be in its original refurbished condition.",
    gradientClass: 'bg-[conic-gradient(from_120deg,_transparent_0%,_#1a1a1a_30%,_transparent_60%)]',
    textClass: 'text-[#1a1a1a]',
    bgClass: 'bg-[#1a1a1a]',
    bgFadeClass: 'bg-[#1a1a1a]/10',
    borderClass: 'border-[#1a1a1a]/20',
  },
  {
    id: 'warranty',
    icon: ShieldCheck,
    title: '6-Month Warranty',
    subtitle: 'Full hardware cover',
    metric: '6mo',
    metricLabel: 'Coverage Period',
    content: "Every system sold by Satya Computers comes with a comprehensive 6-month warranty. This covers all internal hardware including the motherboard, RAM, storage drive, and display. You can claim your warranty directly at our Ameerpet store for immediate resolution, or reach out via our priority WhatsApp support line.",
    gradientClass: 'bg-[conic-gradient(from_240deg,_transparent_0%,_var(--color-brand-accent)_30%,_transparent_60%)]',
    textClass: 'text-[var(--color-brand-accent)]',
    bgClass: 'bg-[var(--color-brand-accent)]',
    bgFadeClass: 'bg-[var(--color-brand-accent)]/10',
    borderClass: 'border-[var(--color-brand-accent)]/20',
  }
];

export default function TrustBadges() {
  const [activePolicy, setActivePolicy] = useState<string | null>(null);
  const activeData = policies.find(p => p.id === activePolicy);

  return (
    <>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {policies.map((policy, idx) => {
          const Icon = policy.icon;
          return (
            <button
              key={policy.id}
              onClick={() => setActivePolicy(policy.id)}
              className="group relative text-left outline-none"
            >
              {/* Entrance Animation Wrapper to avoid hover conflict */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: 'spring', bounce: 0.3 }}
                className="relative flex flex-col h-full transform transition-transform duration-300 group-hover:-translate-y-2 group-active:scale-[0.98]"
              >
                {/* Rotating shimmer border */}
                <div className="absolute -inset-[2px] z-0 overflow-hidden pointer-events-none">
                  <motion.div
                    className={`absolute inset-0 ${policy.gradientClass}`}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: idx * 2.5 }}
                  />
                  <div className="absolute inset-[2px] bg-white" />
                </div>

                {/* Card body */}
                <div className="relative z-10 bg-white flex-grow p-6 overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500">
                  {/* Animated fill on hover */}
                  <div className="absolute inset-0 bg-[#FAFAFA] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] z-0" />

                  <div className="relative z-10 flex flex-col items-start bg-transparent">
                    {/* Top: Icon + Metric */}
                    <div className="flex items-start justify-between w-full mb-5">
                      <div className={`w-12 h-12 flex items-center justify-center border-2 transition-all duration-400 ${policy.borderClass} ${policy.bgFadeClass}`}>
                        <Icon className={`w-5 h-5 transition-colors duration-400 ${policy.textClass}`} strokeWidth={1.5} />
                      </div>
                      <div className="text-right">
                        <div className={`font-heading text-2xl ${policy.textClass}`}>{policy.metric}</div>
                        <div className="font-heading text-[8px] tracking-widest text-black/30 uppercase">{policy.metricLabel}</div>
                      </div>
                    </div>

                    {/* Animated accent line */}
                    <motion.div
                      className={`h-[2px] mb-4 origin-left ${policy.bgClass}`}
                      animate={{ scaleX: 0.15 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />

                    <span className="font-heading text-base tracking-widest text-brand-text uppercase mb-1.5 block">
                      {policy.title}
                    </span>
                    <span className="font-body text-xs text-brand-text/50 group-hover:text-brand-text/75 transition-colors block mb-5">
                      {policy.subtitle}
                    </span>

                    <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className={`text-[9px] font-heading tracking-[0.2em] uppercase ${policy.textClass}`}>READ DETAILS</span>
                      <ArrowRight className={`w-3 h-3 group-hover:translate-x-1 transition-transform ${policy.textClass}`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activePolicy && activeData && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActivePolicy(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
            />
            <div className="fixed inset-0 flex items-center justify-center z-[201] pointer-events-none p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                className="bg-white w-full max-w-md shadow-2xl pointer-events-auto overflow-hidden relative"
              >
                {/* Close */}
                <button
                  onClick={() => setActivePolicy(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-[#F5F5F3] hover:bg-black hover:text-white transition-colors duration-300"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Header */}
                <div className="h-24 bg-[#F7F7F5] border-b border-black/5 relative overflow-hidden flex items-end px-8 pb-5">
                  <div className={`absolute -top-10 -right-10 opacity-5 ${activeData.textClass}`}>
                    <activeData.icon className="w-48 h-48" strokeWidth={0.5} />
                  </div>
                  <div className="w-10 h-10 border border-black/10 bg-white flex items-center justify-center shadow-sm">
                    <activeData.icon className={`w-5 h-5 ${activeData.textClass}`} strokeWidth={1.5} />
                  </div>
                </div>

                <div className="p-8 pt-6">
                  <h3 className="font-heading text-2xl text-brand-text uppercase mb-2">{activeData.title}</h3>
                  <div className={`w-10 h-[3px] mb-6 ${activeData.bgClass}`} />
                  <p className="font-body text-sm text-brand-text/75 leading-relaxed mb-8">{activeData.content}</p>
                  <button
                    onClick={() => setActivePolicy(null)}
                    className="w-full py-4 text-[10px] font-heading tracking-[0.3em] text-center border border-black/10 hover:border-black hover:bg-black hover:text-white transition-all duration-300"
                  >
                    UNDERSTOOD / CLOSE
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
