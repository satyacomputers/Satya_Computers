'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, AlertCircle } from 'lucide-react';

const faqs = [
  {
    id: 'f1',
    q: 'WHAT IS THE WARRANTY ON REFURBISHED UNITS?',
    a: 'Every refurbished system from Satya Computers comes with a massive 6-Month comprehensive hardware warranty, including motherboard and display protection.'
  },
  {
    id: 'f2',
    q: 'DO YOU PROVIDE PAN-INDIA SHIPPING?',
    a: 'Yes. We ship Pan-India via secured bluedart courier networks. Orders within Hyderabad city limits are eligible for Same-Day deployment.'
  },
  {
    id: 'f3',
    q: 'CAN I CUSTOMIZE RAM & SSD BEFORE BUYING?',
    a: 'Absolutely. Over 90% of our enterprise systems (like ThinkPads and Latitudes) are fully upgradeable. Tell us your spec requirements on WhatsApp before purchase.'
  },
  {
    id: 'f4',
    q: 'WHAT IS THE BATTERY HEALTH ON THESE LAPTOPS?',
    a: 'All our refurbished models undergo the "Gold Standard" deep cycle test. We guarantee a minimum of 85% original battery capacity on arrival, meaning you easily get 4-6 hours of use depending on the workload.'
  },
  {
    id: 'f5',
    q: 'DO YOU ACCEPT BULK CORPORATE ORDERS?',
    a: 'Yes, we are the primary backend supplier for dozens of startups and BPOs. We offer bulk quantity discounts, GST billing, and custom imaging/OS deployment for teams over 5.'
  }
];

export default function InteractiveFAQ() {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  return (
    <section className="py-24 bg-[#FAFAFA] relative overflow-hidden">
      
      {/* Structural Accent */}
      <div className="absolute top-0 right-0 w-32 h-full border-l border-black/5 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:10px_10px] hidden md:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-16">
        
        {/* Left Column (Sticky Title) */}
        <div className="lg:w-1/3">
          <div className="sticky top-32">
             <div className="inline-flex items-center gap-2 mb-4">
               <AlertCircle className="w-5 h-5 text-[var(--color-brand-primary)]" strokeWidth={2.5} />
               <span className="font-heading text-xs uppercase tracking-[0.2em] text-brand-text/50">Support Database</span>
             </div>
             <h2 className="font-heading text-4xl md:text-5xl text-brand-text mb-6 uppercase leading-[1.1]">
               FREQUENTLY<br/>
               <span className="text-[var(--color-brand-primary)]">ASKED</span>
             </h2>
             <p className="font-body text-brand-text/60 leading-relaxed max-w-sm mb-8">
               Have questions about buying refurbished? We value radical transparency on warranty, battery life, and shipping. 
             </p>
             <button 
               suppressHydrationWarning
               onClick={() => window.open('https://wa.me/919640272323', '_blank')}
               className="btn-primary text-xs tracking-widest px-8 py-4"
             >
               ASK US DIRECTLY
             </button>
          </div>
        </div>

        {/* Right Column (Accordion) */}
        <div className="lg:w-2/3 flex flex-col gap-2">
           {faqs.map((faq, idx) => {
              const isOpen = openId === faq.id;
              
              return (
                 <motion.div 
                    key={faq.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className={`bg-white border-2 transition-colors duration-300 ${isOpen ? 'border-[var(--color-brand-primary)]' : 'border-black/5 hover:border-black/20'}`}
                 >
                    <button 
                       suppressHydrationWarning
                       className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group"
                       onClick={() => setOpenId(isOpen ? null : faq.id)}
                    >
                       <span className={`font-heading text-xl uppercase tracking-wider transition-colors duration-300 pr-8 ${isOpen ? 'text-[var(--color-brand-primary)]' : 'text-brand-text group-hover:text-[var(--color-brand-primary)]'}`}>
                          {faq.q}
                       </span>
                       
                       <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center border transition-all duration-300 ${isOpen ? 'bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)] text-white rotate-180' : 'bg-transparent border-black/10 text-brand-text/40 group-hover:bg-black/5'}`}>
                          <ChevronDown className="w-5 h-5" strokeWidth={isOpen ? 3 : 1.5} />
                       </div>
                    </button>
                    
                    <AnimatePresence>
                       {isOpen && (
                          <motion.div
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             transition={{ duration: 0.3, ease: 'easeInOut' }}
                             className="overflow-hidden"
                          >
                             <div className="p-6 md:p-8 pt-0 font-body text-brand-text/70 leading-relaxed border-t border-black/5 mx-6 md:mx-8">
                                <div className="mt-6 flex gap-4">
                                  <div className="w-1 bg-[var(--color-brand-primary)] rounded-full flex-shrink-0 relative overflow-hidden">
                                     {/* Subtle pulse down the text line */}
                                     <motion.div 
                                        className="absolute top-0 w-full h-8 bg-white/60 blur-sm"
                                        animate={{ top: ['-200%', '300%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                     />
                                  </div>
                                  <p>{faq.a}</p>
                                </div>
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </motion.div>
              );
           })}
        </div>
      </div>
    </section>
  );
}
