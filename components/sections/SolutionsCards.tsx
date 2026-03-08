'use client';

import { motion } from 'framer-motion';
import { Server, MonitorPlay, GraduationCap, Briefcase, Cpu, Database, ShieldCheck, ArrowRight } from 'lucide-react';

const solutions = [
  {
    id: "corp",
    title: "CORPORATE",
    accent: "SETUP",
    description: "Streamline your business operations with our end-to-end IT infrastructure solutions designed for modern workspaces. Uncompromising stability.",
    icon: Briefcase,
    color: "var(--color-brand-primary)",
    features: [
      { text: "Bulk workstation & laptop procurement", sub: "Premium Brands Only", icon: MonitorPlay },
      { text: "Secure networking & WiFi 6", sub: "Enterprise-grade", icon: Server },
      { text: "Server room architecture", sub: "Storage management", icon: Database },
      { text: "Professional AMC", sub: "Annual Maintenance Contracts", icon: ShieldCheck }
    ]
  },
  {
    id: "edu",
    title: "EDUCATION",
    accent: "LABS",
    description: "Empower the next generation with cutting-edge computing environments tailored for high-density academic use. Relentless performance.",
    icon: GraduationCap,
    color: "var(--color-brand-accent)",
    features: [
      { text: "High-performance lab setups", sub: "VFX, Coding & Design", icon: Cpu },
      { text: "Thin-client configurations", sub: "Efficient resource sharing", icon: Server },
      { text: "Smart classroom integration", sub: "Projection systems", icon: MonitorPlay },
      { text: "Centralized management", sub: "Software deployment & security", icon: ShieldCheck }
    ]
  },
  {
    id: "work",
    title: "ELITE",
    accent: "WORKSTATIONS",
    description: "Precision-engineered computing power for architects, engineers, and data scientists requiring extreme computational throughput.",
    icon: Cpu,
    color: "var(--color-brand-primary)",
    features: [
      { text: "CAD & Rendering nodes", sub: "NVIDIA RTX Optimized", icon: MonitorPlay },
      { text: "AI training clusters", sub: "Tensor-core accelerated", icon: Database },
      { text: "Data science notebooks", sub: "Pre-configured environments", icon: Briefcase },
      { text: "Custom liquid cooling", sub: "Extreme thermal management", icon: ShieldCheck }
    ]
  }
];

export default function SolutionsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
      {solutions.map((sol, idx) => (
        <motion.div
          key={sol.id}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: idx * 0.18, type: "spring", bounce: 0.35 }}
          className="group relative"
        >
          {/* Animated shimmer border */}
          <div className="absolute -inset-[2px] z-0 overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from 90deg, transparent 0%, var(--color-brand-primary) 25%, var(--color-brand-accent) 50%, transparent 75%)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: idx * 2 }}
            />
            <div className="absolute inset-[2px] bg-white" />
          </div>

          {/* Card Body */}
          <motion.div
            whileHover={{ y: -12, scale: 1.015 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="relative z-10 bg-white overflow-hidden flex flex-col h-full shadow-[0_8px_32px_rgba(0,0,0,0.06)] group-hover:shadow-[0_24px_64px_rgba(241,90,36,0.18)] transition-shadow duration-500"
          >
            {/* Top status bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-[#FAFAFA] border-b border-black/5">
              <span className="font-heading text-[9px] tracking-[0.35em] text-black/35 uppercase">MODULE: {sol.id.toUpperCase()}.SYS</span>
              <div className="flex items-center gap-1.5">
                <motion.div
                  animate={{ opacity: [1, 0.2, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: idx * 0.6 }}
                  className="w-1.5 h-1.5 rounded-full bg-green-500"
                />
                <span className="font-heading text-[9px] tracking-[0.2em] text-green-600">ONLINE</span>
              </div>
            </div>

            {/* Gradient top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)]" />

            {/* Animated scanline */}
            <motion.div
              className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[var(--color-brand-primary)]/8 to-transparent blur-xl pointer-events-none"
              animate={{ y: ['-100%', '500%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear', delay: idx * 1.3 }}
            />

            <div className="relative z-10 flex flex-col h-full p-8">

              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div>
                  <motion.div
                    className="w-12 h-[3px] mb-5 origin-left"
                    style={{ background: 'linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-accent))' }}
                    whileHover={{ scaleX: 1.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                  <h2 className="font-heading text-4xl md:text-5xl text-brand-text tracking-tight uppercase leading-none">
                    {sol.title}<br />
                    <span className="text-[var(--color-brand-primary)] italic">{sol.accent}</span>
                  </h2>
                </div>

                <div className="relative w-16 h-16 flex-shrink-0">
                  <motion.div
                    className="w-16 h-16 border-2 border-black/8 bg-[#F8F8F8] flex items-center justify-center relative overflow-hidden"
                    whileHover={{ scale: 1.1, borderColor: 'var(--color-brand-primary)' }}
                    transition={{ duration: 0.3 }}
                  >
                    <sol.icon className="w-7 h-7 text-[var(--color-brand-primary)] group-hover:text-[var(--color-brand-accent)] transition-colors duration-500 relative z-10" strokeWidth={1.5} />
                    <motion.div
                      className="absolute inset-0 bg-[var(--color-brand-primary)] opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                    />
                  </motion.div>
                  {/* Status dot */}
                  <div className="absolute -top-1.5 -right-1.5 flex items-center gap-1 bg-black text-white px-2 py-0.5 border border-white/20 shadow-xl">
                    <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[7px] font-heading font-bold tracking-tight">AVAIL.</span>
                  </div>
                </div>
              </div>

              <p className="font-body text-brand-text/65 mb-7 leading-relaxed border-l-[3px] border-black/8 pl-5 py-1 group-hover:border-[var(--color-brand-primary)] transition-colors duration-500 text-sm">
                {sol.description}
              </p>

              {/* Features */}
              <div className="space-y-2.5 mb-auto">
                <span className="font-heading text-[9px] tracking-[0.35em] text-black/35 uppercase block mb-3">SYSTEM INCLUSIONS</span>
                {sol.features.map((feature, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-4 p-3 border border-black/5 bg-[#FAFAFA] relative overflow-hidden"
                    whileHover={{ x: 6, borderColor: 'rgba(241,90,36,0.35)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {/* Left glow strip */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[3px]"
                      animate={{ backgroundColor: 'var(--color-brand-primary)', opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white border border-black/5 shadow-sm">
                      <feature.icon className="w-4 h-4 text-[var(--color-brand-primary)]" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-body font-semibold text-[11px] text-brand-text leading-tight mb-0.5 truncate">{feature.text}</span>
                      <span className="block font-heading text-[9px] tracking-widest text-black/40 uppercase">{feature.sub}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Ready indicator */}
              <div className="flex items-center gap-2 mt-6 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="font-heading text-[9px] tracking-[0.3em] text-green-600 uppercase">Ready for Deployment</span>
                <div className="flex-1 h-px bg-green-600/15" />
              </div>

              {/* CTA Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => window.open(`https://wa.me/918309178589?text=I am interested in the ${sol.title} ${sol.accent} solution.`, '_blank')}
                className="relative py-4 px-6 border-2 border-black font-heading text-[10px] tracking-[0.3em] font-black uppercase overflow-hidden flex items-center justify-between group/btn hover:border-[var(--color-brand-primary)] transition-colors duration-300"
              >
                <span className="absolute inset-0 bg-[var(--color-brand-primary)] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-400 ease-out" />
                <span className="relative group-hover/btn:text-white transition-colors duration-200">CONFIGURE / ENQUIRE</span>
                <ArrowRight className="relative w-4 h-4 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all duration-200" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
