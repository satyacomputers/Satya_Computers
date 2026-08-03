'use client';

import { storeInfo } from '@/data/store-info';
import { motion } from 'framer-motion';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { ShieldCheck, UserCircle, Laptop, Boxes, Tag, Mail, MessageSquare } from 'lucide-react';

const terms = [
  {
    icon: ShieldCheck,
    title: "Privacy Practices",
    content: "We are committed to safeguarding your personal information. Your use of this website (“Site”) is governed by our Privacy Policy. By accessing or using the Site, you consent to the collection, use, and disclosure of your personal data as outlined in the Privacy Policy, which may be updated periodically."
  },
  {
    icon: UserCircle,
    title: "Your Account",
    content: "Use of the Site is permitted only for individuals 18 years or older. By creating an account (“Account”), you agree to keep your login credentials confidential, accept responsibility for all activity under your account, and provide accurate, lawful, and complete information. If you suspect unauthorized access, please notify us immediately."
  },
  {
    icon: Laptop,
    title: "Product Information",
    content: "We aim to provide accurate up-to-date product details. However, we do not guarantee that product descriptions, specifications, or images are always error-free. Actual product appearance and features may vary. We reserve the right to correct any inaccuracies or omissions without prior notice."
  },
  {
    icon: Boxes,
    title: "Product Use",
    content: "Products and samples offered on the Site are intended for your personal and/or professional use only and must not be resold for commercial purposes."
  },
  {
    icon: Tag,
    title: "Pricing Information",
    content: "Pricing or product information errors may occur. In such cases, we reserve the right to cancel orders. If you've already paid, we will initiate a refund to your original payment method. Prices and product availability are subject to change without notice."
  }
];

export default function TermsOfServicePage() {
  const lastUpdated = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <main className="min-h-screen bg-white relative pb-32">
       <GrainOverlay opacity={10} />
       
       <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-black/5">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
        >
          <span className="font-heading text-xs tracking-[0.4em] text-[var(--color-brand-primary)] uppercase mb-4 block font-bold">GOVERNANCE & STANDARDS</span>
          <h1 className="font-heading text-6xl md:text-9xl text-[#1A1A1A] leading-[0.85] mb-8 uppercase">
            TERMS OF <br />
            <span className="text-[var(--color-brand-primary)]">SERVICE.</span>
          </h1>
          <p className="font-body text-black/50 uppercase tracking-widest text-sm">Last Revision: {lastUpdated}</p>
        </motion.div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {terms.map((t, i) => (
            <motion.div 
              key={t.title}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 flex items-center justify-center bg-[#1A1A1A] text-white group-hover:bg-[var(--color-brand-primary)] transition-colors duration-300">
                  <t.icon size={28} strokeWidth={1.5} />
                </div>
                <h2 className="font-heading text-4xl text-[#1A1A1A] uppercase leading-none tracking-tight">{t.title}</h2>
              </div>
              <p className="font-body text-base text-black/60 leading-relaxed tracking-wider sm:pl-20 max-w-2xl">{t.content}</p>
            </motion.div>
          ))}
        </div>

        <div className="bg-[#000] text-white p-12 h-fit border-[1px] border-white/5 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 sticky top-32">
          <div className="absolute inset-0 hero-dot-grid opacity-10 invert translate-x-2 translate-y-2" />
          <div className="relative z-10">
            <h2 className="font-heading text-4xl mb-8 uppercase leading-[0.9]">Legal <br /><span className="text-[var(--color-brand-primary)]">Support.</span></h2>
            <div className="prose prose-invert max-w-none font-body text-xs uppercase tracking-[0.1em] leading-[2.4] text-white/50">
              <p>
                For detailed legal inquiries or clarifications regarding our commercial protocol, please connect with our administrative team.
              </p>
              <div className="pt-8 mt-8 border-t border-white/10 space-y-4">
                <h4 className="font-heading text-xl text-white mb-2 uppercase tracking-widest">Queries Channel</h4>
                <div className="flex items-center gap-3 text-white/80 hover:text-[var(--color-brand-primary)] transition-colors">
                  <Mail size={16} className="text-[var(--color-brand-primary)]" />
                  <span className="lowercase">{storeInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-white/80 hover:text-[var(--color-brand-primary)] transition-colors">
                  <MessageSquare size={16} className="text-[var(--color-brand-primary)]" />
                  <a
                    href={`tel:+91${storeInfo.phone}`}
                    className="hover:text-[var(--color-brand-primary)] transition-colors no-underline font-bold"
                  >
                    +91 {storeInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
