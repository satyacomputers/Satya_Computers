'use client';

import { motion } from 'framer-motion';
import { Truck, ShieldCheck, Zap, Handshake, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Truck,
    title: "SAME-DAY DEPLOYMENT",
    desc: "Order before 2 PM and receive your systems within Hyderabad limits on the very same day. Securely packaged and ready to boot.",
    col: "var(--color-brand-primary)"
  },
  {
    icon: ShieldCheck,
    title: "6-MONTH WARRANTY",
    desc: "Comprehensive hardware coverage on all refurbished units. Direct replacement for any motherboard or display issues.",
    col: "var(--color-brand-accent)"
  },
  {
    icon: Zap,
    title: "CUSTOM CONFIGS",
    desc: "Need 64GB RAM or specifically patched Linux distros for a bulk team order? We build to your exact operational spec.",
    col: "#111"
  },
  {
    icon: Handshake,
    title: "BUYBACK PROGRAM",
    desc: "Upgrading your corporate fleet? We offer competitive buyback rates on your old workstations when purchasing new stock.",
    col: "var(--color-brand-primary)"
  }
];

export default function B2BTier() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      
      {/* Background Tech Details */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#f8f8f8] -skew-x-12 translate-x-32 hidden lg:block" />
      <div className="absolute top-10 left-10 font-mono text-[80px] md:text-[150px] font-black tracking-tighter text-black/5 select-none pointer-events-none">
        B2B
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-heading text-[10px] tracking-[0.2em] uppercase mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)] animate-pulse" />
              Corporate & Bulk Orders
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-brand-text mb-6 uppercase leading-[1.1]">
              POWERING <span className="text-[var(--color-brand-primary)]">TEAMS</span><br />
              AT SCALE
            </h2>
            
            <p className="font-body text-brand-text/60 leading-relaxed mb-10 text-lg">
              Whether you are equipping a startup of 10 or replacing a corporate fleet of 200, Satya Computers provides the hardware backbone you need without the premium markup. Let us handle the procurement logistics.
            </p>

            <Link href="/contact" className="group">
               <button className="bg-black text-white px-8 py-4 font-heading text-xs tracking-[0.3em] font-bold uppercase transition-all duration-300 hover:bg-[var(--color-brand-primary)] flex items-center gap-4">
                 REQUEST QUOTE
                 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
               </button>
            </Link>
          </div>

          {/* Right Features Column */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 border-black/5 p-8 group hover:border-[var(--color-brand-primary)] hover:shadow-[0_20px_40px_rgba(241,90,36,0.1)] transition-all duration-300 relative overflow-hidden"
              >
                {/* Accent line */}
                <motion.div 
                   className="absolute left-0 top-0 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"
                   style={{ backgroundColor: feature.col }}
                />
                
                <div 
                   className="w-12 h-12 flex items-center justify-center mb-6 bg-black/[0.03] group-hover:scale-110 transition-transform duration-500"
                >
                   <feature.icon className="w-6 h-6" style={{ color: feature.col }} strokeWidth={1.5} />
                </div>
                
                <h3 className="font-heading text-xl text-brand-text uppercase mb-3 tracking-wider">{feature.title}</h3>
                <p className="font-body text-sm text-brand-text/60 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
