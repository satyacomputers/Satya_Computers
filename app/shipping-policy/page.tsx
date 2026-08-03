'use client';

import { storeInfo } from '@/data/store-info';
import { motion } from 'framer-motion';
import GrainOverlay from '@/components/ui/GrainOverlay';
import Link from 'next/link';
import { Truck, Clock, Calculator, AlertTriangle, Mail, MessageCircle, ArrowRight } from 'lucide-react';

export default function ShippingPolicyPage() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  const supportWhatsApp = "919133772323"; // Using the specific support number provided for shipping

  return (
    <main className="min-h-screen bg-white relative pb-32">
       <GrainOverlay opacity={10} />
       
       <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/5">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="font-heading text-xs tracking-[0.4em] text-[var(--color-brand-primary)] uppercase mb-4 block font-bold">LOGISTICS & DELIVERY</span>
          <h1 className="font-heading text-6xl md:text-9xl text-[#1A1A1A] leading-[0.85] mb-8 uppercase">
            SHIPPING <br />
            <span className="text-[var(--color-brand-primary)]">POLICY.</span>
          </h1>
          <p className="font-body text-black/50 uppercase tracking-widest text-sm">Last Revision: {lastUpdated}</p>
        </motion.div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            
            {/* Order Processing */}
            <motion.div 
               initial={{ opacity: 0, x: -10 }} 
               whileInView={{ opacity: 1, x: 0 }} 
               viewport={{ once: true }}
               className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center bg-black text-white">
                  <Clock size={28} strokeWidth={1} />
                </div>
                <h2 className="font-heading text-4xl text-black uppercase tracking-tight">Order Processing</h2>
              </div>
              <div className="space-y-6 font-body text-black/70 leading-relaxed text-lg pl-2 border-l border-black/10 sm:pl-10">
                <p>
                  All orders are processed within <strong className="text-black">1 to 2 business days</strong> (excluding holidays). 
                </p>
                <p>
                  Delivery estimates range between <strong className="text-black text-2xl font-heading">3 to 10 days</strong> across India after you receive your order confirmation email. 
                </p>
                <div className="flex items-center gap-3 p-4 bg-[#FAFAFA] border border-black/5 text-sm uppercase tracking-widest font-heading text-black/40">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                   Notification sent once order is shipped
                </div>
              </div>
            </motion.div>

            {/* Shipping Charges */}
            <motion.div 
               initial={{ opacity: 0, x: -10 }} 
               whileInView={{ opacity: 1, x: 0 }} 
               viewport={{ once: true }}
               className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center bg-black text-white">
                  <Calculator size={28} strokeWidth={1} />
                </div>
                <h2 className="font-heading text-4xl text-black uppercase tracking-tight">Shipping Charges</h2>
              </div>
              <div className="p-8 bg-[#FAFAFA] border border-black/5 space-y-4">
                <p className="font-body text-base text-black/60 tracking-wider leading-relaxed">
                  Shipping fees are calculated dynamically at checkout based on your selected shipping method and delivery location. 
                  The final amount will be clearly displayed before you complete your purchase.
                </p>
                <div className="flex items-center gap-2 text-[var(--color-brand-primary)] text-[10px] font-heading tracking-[0.3em] uppercase">
                   <Truck size={14} />
                   Real-time logistics calculation
                </div>
              </div>
            </motion.div>

            {/* Order Delays */}
            <motion.div 
               initial={{ opacity: 0, x: -10 }} 
               whileInView={{ opacity: 1, x: 0 }} 
               viewport={{ once: true }}
               className="space-y-8"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 flex items-center justify-center bg-black text-white">
                  <AlertTriangle size={28} strokeWidth={1} />
                </div>
                <h2 className="font-heading text-4xl text-black uppercase tracking-tight">Order Delays</h2>
              </div>
              <div className="bg-red-50 p-8 border-l-4 border-red-500">
                <p className="font-body text-base text-red-900 leading-relaxed italic">
                  "If you have not received your order within 15 days of receiving your shipping confirmation email, please reach out to us with your name and order number."
                </p>
                <p className="mt-4 font-body text-sm text-red-700/80 uppercase tracking-widest font-bold">
                  Prompt Investigation guaranteed
                </p>
              </div>
            </motion.div>

            {/* Returns & Refunds CTA */}
            <motion.div 
               initial={{ opacity: 0 }} 
               whileInView={{ opacity: 1 }} 
               viewport={{ once: true }}
               className="pt-10 border-t border-black/5"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-10 bg-black text-white">
                <div className="space-y-2">
                   <h3 className="font-heading text-2xl uppercase tracking-tight">Returns & Refunds</h3>
                   <p className="font-body text-xs text-white/40 uppercase tracking-widest">Satisfaction Guaranteed</p>
                </div>
                <Link 
                   href="/refund-policy" 
                   className="inline-flex items-center gap-4 py-4 px-8 border border-white/20 hover:bg-white hover:text-black transition-all duration-300 font-heading text-xs tracking-[0.3em] uppercase"
                >
                  View Policy <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] text-white p-10 h-fit border-[1px] border-white/5 relative overflow-hidden group sticky top-32">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 space-y-8">
                <h2 className="font-heading text-4xl mb-2 uppercase leading-[0.9]">Logistic <br /><span className="text-[var(--color-brand-primary)]">Support.</span></h2>
                <div className="prose prose-invert max-w-none font-body text-xs uppercase tracking-[0.1em] leading-[2.4] text-white/50">
                  <p>
                    For tracking inquiries or logistics escalations, connect with our dedicated shipping team.
                  </p>
                  <div className="pt-8 mt-8 border-t border-white/10 space-y-6">
                    <a href={`mailto:info@satyacomputers.in`} className="flex items-center gap-4 group/item no-underline">
                      <Mail size={18} className="text-[var(--color-brand-primary)] group-hover/item:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-heading text-sm text-white uppercase mb-0.5">Email Logistics</h4>
                        <p className="text-white/40 lowercase text-[10px]">info@satyacomputers.in</p>
                      </div>
                    </a>
                    <a href={`https://wa.me/${supportWhatsApp}`} className="flex items-center gap-4 group/item no-underline">
                      <MessageCircle size={18} className="text-green-500 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-heading text-sm text-white uppercase mb-0.5">WhatsApp Support</h4>
                        <p className="text-white/40 text-[10px]">MON–SAT, 10 AM – 7 PM</p>
                        <p className="text-[var(--color-brand-primary)] font-bold text-[11px] mt-1">+91 9133772323</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
