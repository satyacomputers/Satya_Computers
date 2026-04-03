'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, ArrowRight, Zap, Gift, Percent } from 'lucide-react';
import Link from 'next/link';

interface Offer {
  id: string;
  type: string;
  title: string;
  description: string | null;
  code: string | null;
  discount: number | string | null;
  expiryDate: string | null;
}

interface HotOffersProps {
  offers: Offer[];
}

// Fixed stable formatter for consistent SSR/Client hydration
const formatDateProfessional = (dateStr: string | null) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}, ${d.getUTCFullYear()}`;
  } catch {
    return dateStr;
  }
};

export default function HotOffers({ offers }: HotOffersProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!offers || offers.length === 0) return null;

  return (
    <section className="py-24 bg-[#0A1628] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[120px] -z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-6"
            >
              <Zap className="text-orange-500" size={14} fill="currentColor" />
              <span className="text-orange-500 font-heading text-[10px] tracking-widest uppercase font-bold">Exclusive Deals</span>
            </motion.div>
            
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white uppercase leading-none">
              HOT <span className="text-orange-500">OFFERS</span>
            </h2>
          </div>
          
          <p className="max-w-sm text-white/40 font-body text-lg border-l-2 border-orange-500 pl-6">
            Limited time promotions on workstations and bulk enterprise solutions. Claim your priority pricing now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] p-8 overflow-hidden backdrop-blur-sm"
            >
              {/* Card Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
                    {offer.type.toLowerCase().includes('percent') || offer.type.toLowerCase().includes('discount') ? (
                      <Percent className="text-white" size={28} />
                    ) : offer.type.toLowerCase().includes('gift') ? (
                      <Gift className="text-white" size={28} />
                    ) : (
                      <Tag className="text-white" size={28} />
                    )}
                  </div>
                  {offer.expiryDate && (
                    <div className="bg-red-500/20 border border-red-500/30 px-3 py-1 rounded-full">
                      <span className="text-red-500 font-mono text-[10px] uppercase font-bold">
                        Exp: {mounted ? formatDateProfessional(offer.expiryDate) : '...'}
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-heading font-bold text-white mb-3 group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                  {offer.title}
                </h3>
                
                <p className="text-white/50 text-sm leading-relaxed mb-8 line-clamp-2">
                  {offer.description || "Special offer available for a limited time. Contact our sales team for details."}
                </p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                  <div>
                    {offer.code && (
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">PROMO CODE</span>
                        <span className="text-orange-500 font-mono font-bold tracking-wider">{offer.code}</span>
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    href={`https://wa.me/919640272323?text=I am interested in the offer: ${offer.title}`}
                    target="_blank"
                    className="flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest group/btn"
                  >
                    REDEEM
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
