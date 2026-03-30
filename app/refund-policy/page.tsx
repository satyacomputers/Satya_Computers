'use client';

import { storeInfo } from '@/data/store-info';
import { motion } from 'framer-motion';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { 
  ShieldCheck, 
  RotateCcw, 
  Clock, 
  FileCheck, 
  AlertCircle, 
  Banknote, 
  RefreshCcw, 
  ShieldAlert,
  HelpCircle,
  Mail,
  MessageCircle
} from 'lucide-react';

const sections = [
  {
    icon: RotateCcw,
    title: "7-Day Return Policy",
    content: "Return any product within 7 days of purchase if you are not satisfied. Units must be in their original refurbished state without any software modifications or physical damage."
  },
  {
    icon: RefreshCcw,
    title: "1-Month Replacement",
    content: "1 month piece to piece replacement. You may request a unit replacement within 30 days of receiving your order if the item is technically defective or significantly different from description."
  },
  {
    icon: ShieldCheck,
    title: "Warranty Policy (Beyond 1-Month)",
    content: "Warranty terms vary by purchase. Covers 1-year for manufacturing defects and 6-months for battery/adapter. Not covered: Physical or accidental damage caused by the user. Resolution may take up to 30 days."
  },
  {
    icon: FileCheck,
    title: "Return Conditions",
    content: "Product must be in original condition with all tags/packaging. Devices must be wiped of personal data. Items damaged while in your possession are not eligible. Restocking fees may apply for buyer's remorse."
  },
  {
    icon: Clock,
    title: "How to Return",
    content: "Contact Customer Support via the Contact Us page for approval. Unauthorized returns are not accepted. Technician visits may be arranged for inspection. Replacements dispatch within 24–48 hours after return receipt."
  },
  {
    icon: Banknote,
    title: "Refund Policy",
    content: "Undelivered (RTO): Refund initiated within 24–48 hours of warehouse receipt. Delivered (Customer Return): Inspection within 24–48 hours, refund credited in 14 business days to original payment method or bank transfer."
  },
  {
    icon: HelpCircle,
    title: "Lifetime Service Warranty",
    content: "We offer a Lifetime Service Warranty on all our systems. While hardware replacement has a defined period, our labor and technical support for your machine are guaranteed for its entire operational life. Get priority assistance anytime."
  }
];

export default function RefundPolicyPage() {
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
          <span className="font-heading text-xs tracking-[0.4em] text-[var(--color-brand-primary)] uppercase mb-4 block font-bold">COMMITMENT & TRUST</span>
          <h1 className="font-heading text-6xl md:text-9xl text-[#1A1A1A] leading-[0.85] mb-8 uppercase">
            REFUND & <br />
            <span className="text-[var(--color-brand-primary)]">RETURNS.</span>
          </h1>
          <p className="font-body text-black/50 uppercase tracking-widest text-sm">Last Revision: {lastUpdated}</p>
        </motion.div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-20">
            {/* Quick Summary Grid */}
            <div className="grid sm:grid-cols-2 gap-8">
              {sections.map((s, i) => (
                <motion.div 
                  key={s.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 border border-black/5 bg-[#FAFAFA] hover:border-[var(--color-brand-primary)] transition-colors group"
                >
                  <s.icon size={32} strokeWidth={1} className="text-[var(--color-brand-primary)] mb-6 group-hover:scale-110 transition-transform" />
                  <h3 className="font-heading text-xl text-black uppercase mb-4 tracking-tight">{s.title}</h3>
                  <p className="font-body text-xs text-black/50 leading-relaxed tracking-wider uppercase">{s.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Detailed Policy Sections */}
            <div className="space-y-16 pt-10 border-t border-black/5">
              
              {/* Refund Deductions */}
              <div className="space-y-6">
                <h2 className="font-heading text-4xl text-black uppercase tracking-tight flex items-center gap-4">
                  <AlertCircle size={28} className="text-[var(--color-brand-primary)]" />
                  Refund Deductions
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 bg-black text-white">
                    <h4 className="font-heading text-lg mb-2 uppercase text-[var(--color-brand-primary)]">Defective Products</h4>
                    <p className="font-body text-xs text-white/50 tracking-widest leading-relaxed">No additional deductions, apart from usage-based depreciation if applicable after the 1-month replacement window.</p>
                  </div>
                  <div className="p-6 bg-[#FAFAFA] border border-black/5">
                    <h4 className="font-heading text-lg mb-2 uppercase">Non-Defective / Changed Mind</h4>
                    <p className="font-body text-xs text-black/50 tracking-widest leading-relaxed">A minimum 10% restocking fee or 3% per month (whichever is greater) will be deducted from the refund.</p>
                  </div>
                </div>
              </div>

              {/* Non-Returnable */}
              <div className="space-y-6">
                <h2 className="font-heading text-4xl text-black uppercase tracking-tight flex items-center gap-4">
                  <ShieldAlert size={28} className="text-red-500" />
                  Non-Returnable Items
                </h2>
                <ul className="grid sm:grid-cols-3 gap-3 list-none p-0">
                  {['Not in original condition', 'Customized products', 'Physical damage by user'].map((item, i) => (
                    <li key={i} className="font-body text-[10px] text-black/40 uppercase tracking-[0.2em] border border-black/5 p-4 flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Our Rights */}
              <div className="p-10 bg-[var(--color-brand-primary)] text-white">
                <h2 className="font-heading text-3xl mb-6 uppercase tracking-tight italic">Reserved Rights</h2>
                <div className="font-body text-xs uppercase tracking-[0.15em] leading-[2.2] space-y-4 text-white/80">
                  <p>• Satya Computers reserves the right to decline returns not meeting stated conditions.</p>
                  <p>• We limit returns from accounts showing high return frequency or suspicious activity.</p>
                  <p>• Final decisions regarding eligibility for replacements rest solely with our technicians.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1A1A1A] text-white p-12 h-fit border-[1px] border-white/5 relative overflow-hidden group sticky top-32">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-primary)]/10 to-transparent opacity-10" />
              <div className="relative z-10 space-y-8">
                <h2 className="font-heading text-4xl mb-2 uppercase leading-[0.9]">Need <br /><span className="text-[var(--color-brand-primary)]">Help?</span></h2>
                <div className="prose prose-invert max-w-none font-body text-xs uppercase tracking-[0.1em] leading-[2.4] text-white/50">
                  <p>
                    If you have questions regarding return eligibility or your specific warranty tier, please connect with us.
                  </p>
                  <div className="pt-8 mt-8 border-t border-white/10 space-y-6">
                    <a href={`mailto:${storeInfo.email}`} className="flex items-center gap-4 group/item no-underline">
                      <Mail size={18} className="text-[var(--color-brand-primary)] group-hover/item:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-heading text-sm text-white uppercase mb-0.5">Email Support</h4>
                        <p className="text-white/40 lowercase text-[10px]">{storeInfo.email}</p>
                      </div>
                    </a>
                    <a href={`https://wa.me/${storeInfo.whatsapp}`} className="flex items-center gap-4 group/item no-underline">
                      <MessageCircle size={18} className="text-green-500 group-hover/item:scale-110 transition-transform" />
                      <div>
                        <h4 className="font-heading text-sm text-white uppercase mb-0.5">WhatsApp Chat</h4>
                        <p className="text-white/40 text-[10px]">MON–SAT, 10 AM – 7 PM</p>
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
