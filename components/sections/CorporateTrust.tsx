'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Headphones, Award, CheckCircle2, Building2 } from 'lucide-react';

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Military-Grade Testing",
    desc: "Every workstation undergoes a 48-hour stress test before shipment to ensure zero failure rates.",
    color: "text-blue-500"
  },
  {
    icon: Award,
    title: "OEM Certified Parts",
    desc: "We use only genuine, manufacturer-certified components for all upgrades and maintenance.",
    color: "text-orange-500"
  },
  {
    icon: Truck,
    title: "Corporate Fleet Logistics",
    desc: "Specialized logistics for bulk corporate orders across India with real-time asset tracking.",
    color: "text-emerald-500"
  },
  {
    icon: Headphones,
    title: "24/7 Priority Support",
    desc: "Dedicated account managers for enterprise clients and round-the-clock technical assistance.",
    color: "text-purple-500"
  }
];

interface CorporateTrustProps {
  stats?: {
    clientCount: number;
    unitCount: number;
  };
}

export default function CorporateTrust({ stats }: CorporateTrustProps) {
  const displayStats = [
    { val: `${stats?.unitCount || 5000}+`, label: "Units Deployed" },
    { val: `${stats?.clientCount || 125}+`, label: "Corporate Clients" },
    { val: "15Yrs+", label: "Industry Expertise" },
    { val: "99.8%", label: "System Uptime" }
  ];

  return (
    <section className="py-24 bg-white border-y border-gray-100 relative overflow-hidden">
      {/* Decorative vertical lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-px bg-black absolute left-1/4" />
        <div className="h-full w-px bg-black absolute left-2/4" />
        <div className="h-full w-px bg-black absolute left-3/4" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Superiority Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-24">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 bg-black text-white px-4 py-1.5 mb-8"
            >
              <Building2 size={16} className="text-[#F97316]" />
              <span className="font-heading text-[10px] tracking-[0.4em] uppercase font-bold">Enterprise Standards</span>
            </motion.div>
            
            <h2 className="text-6xl md:text-8xl font-heading font-black text-[#0A1628] leading-[0.85] mb-8 uppercase">
              RELIABILITY<br />
              WITHOUT <span className="text-[#F97316]">EXCEPTION</span>
            </h2>
          </div>
          
          <div className="lg:max-w-sm">
            <p className="text-gray-500 text-lg font-medium leading-relaxed border-l-4 border-black pl-6">
              Satya Computers isn&apos;t just a reseller. We are the infrastructure partner for India&apos;s leading technical teams and corporations.
            </p>
          </div>
        </div>

        {/* Features Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-100 border border-gray-100 rounded-[2.5rem] overflow-hidden">
          {trustItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-10 hover:bg-gray-50 transition-colors group cursor-default"
            >
              <div className={`${item.color} mb-8 transform group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-heading font-bold text-[#0A1628] mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                {item.desc}
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-widest group-hover:text-[#F97316] transition-colors">
                <CheckCircle2 size={12} />
                <span>Verified Standard</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Corporate Success Metrics */}
        <div className="mt-24 grid grid-cols-2 lg:grid-cols-4 gap-12 px-8">
          {displayStats.map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-heading font-black text-[#0A1628] mb-2">{stat.val}</p>
              <p className="text-[10px] font-bold text-[#F97316] uppercase tracking-[0.2em]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
