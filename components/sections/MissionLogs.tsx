'use client';

import { motion } from 'framer-motion';
import { Quote, TerminalSquare } from 'lucide-react';

const reviews = [
  {
    id: "LOG-01A",
    company: "DEFY CREATIVES",
    tagline: "Unreal Rendering Performance",
    desc: "Procured 5 MacBooks for our rendering team. The multi-core stability is insane. Zero thermal throttling reported even during 48hr continuous node renders.",
    author: "Arjun M.",
    role: "VFX Supervisor",
    status: "VERIFIED DEPLOYMENT"
  },
  {
    id: "LOG-02B",
    company: "NEXUS CODELABS",
    tagline: "Bulk Order Precision",
    desc: "Needed 20 ThinkPads within 48 hours for a new dev batch. Satya Computers delivered them pre-configured with Linux environments exactly on schedule.",
    author: "Priya S.",
    role: "System Admin",
    status: "VERIFIED DEPLOYMENT"
  },
  {
    id: "LOG-03C",
    company: "INDEPENDENT ARCHITECT",
    tagline: "Saved 40% on RTX Quadro",
    desc: "The Dell Precision workstation I got here handles Revit and AutoCAD simultaneously without a stutter. Identical performance to a brand new rig but at a fraction of the cost.",
    author: "Rahul K.",
    role: "Lead Architect",
    status: "VERIFIED DEPLOYMENT"
  }
];

export default function MissionLogs() {
  return (
    <section className="py-24 bg-black relative border-y border-[var(--color-brand-primary)] overflow-hidden">
      
      {/* High-tech Background */}
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(241,90,36,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(241,90,36,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-white/20 pb-6">
          <div>
             <h2 className="font-heading text-4xl md:text-5xl text-white mb-2 tracking-widest uppercase flex items-center gap-4">
               <TerminalSquare className="w-10 h-10 text-[var(--color-brand-primary)]" />
               MISSION <span className="text-[var(--color-brand-primary)]">LOGS</span>
             </h2>
             <p className="font-heading text-xs tracking-[0.4em] text-white/40 uppercase">Encrypted Client Feedback Data</p>
          </div>
          
          <div className="hidden md:flex gap-2 items-center">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
             <span className="font-heading text-[10px] tracking-[0.3em] text-green-500">LIVE SYNC</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, type: 'spring' }}
              className="bg-[#111] border border-white/10 p-8 relative group hover:border-[var(--color-brand-primary)] transition-colors duration-500"
            >
              {/* Scanline hover effect */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--color-brand-primary)] opacity-0 group-hover:opacity-100 group-hover:animate-scanline" />
              
              <div className="flex justify-between items-start mb-6">
                <span className="font-mono text-[9px] text-[var(--color-brand-accent)] tracking-widest border border-[var(--color-brand-accent)]/30 px-2 py-0.5">
                  ID: {log.id}
                </span>
                <Quote className="w-5 h-5 text-white/10 group-hover:text-[var(--color-brand-primary)] transition-colors" />
              </div>

              <h3 className="font-heading text-xl text-white uppercase tracking-wider mb-2">{log.tagline}</h3>
              <p className="font-body text-sm text-white/50 leading-relaxed min-h-[100px] border-l-2 border-white/5 pl-4 mb-6 group-hover:border-[var(--color-brand-primary)]/50 transition-colors">
                &quot;{log.desc}&quot;
              </p>

              <div className="flex flex-col border-t border-white/10 pt-4">
                 <span className="font-heading text-sm text-[var(--color-brand-primary)] uppercase tracking-wider">{log.company}</span>
                 <span className="font-body text-[11px] text-white/30 uppercase mt-1">{log.author} — {log.role}</span>
                 
                 <div className="mt-4 flex items-center gap-2">
                   <div className="w-1 h-3 bg-green-500/50" />
                   <span className="font-mono text-[8px] text-green-500/50 tracking-widest">{log.status}</span>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
