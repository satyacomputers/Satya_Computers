'use client';

import { storeInfo } from '@/data/store-info';
import GrainOverlay from '@/components/ui/GrainOverlay';
import BrutalButton from '@/components/ui/BrutalButton';
import { motion, Variants } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.55, type: 'spring', bounce: 0.3 }
  })
};



export default function ContactPage() {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-white relative pb-24">
      <GrainOverlay opacity={5} />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-b border-black/10">
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="font-heading text-6xl md:text-8xl text-brand-text tracking-tight mb-4 uppercase"
        >
          CONTACT <span className="text-[var(--color-brand-primary)]">US</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="font-body text-xl text-brand-text-muted max-w-2xl"
        >
          Get in touch with our team for bulk orders, enterprise sales, or support inquiries.
        </motion.p>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-10">

        {/* Contact Info Cards */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5">

          {/* Visit Store */}
          <motion.div
            custom={0}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="group relative"
          >
            <div className="absolute -inset-[2px] z-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{ background: 'conic-gradient(from 0deg, transparent 0%, var(--color-brand-accent) 30%, transparent 60%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-[2px] bg-white" />
            </div>
            <div className="relative z-10 bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_48px_rgba(64,31,94,0.14)] transition-shadow duration-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-[var(--color-brand-accent)]/20 bg-[var(--color-brand-accent)]/5 group-hover:bg-[var(--color-brand-accent)] group-hover:border-[var(--color-brand-accent)] transition-all duration-400">
                  <MapPin className="w-5 h-5 text-[var(--color-brand-accent)] group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg text-[var(--color-brand-accent)] tracking-widest">VISIT STORE</h3>
              </div>
              <div className="h-[2px] w-8 bg-[var(--color-brand-accent)] mb-4 group-hover:w-full transition-all duration-500 ease-out" />
              <a
                href="https://www.google.com/maps/place/Satya+Computers/@17.4381008,78.4449618,17z/data=!4m14!1m7!3m6!1s0x4f64ae8bda9f24bd:0xa4712061712e6176!2sSatya+Computers!8m2!3d17.4381008!4d78.4449618!16s%2Fg%2F11y2bprzd0!3m5!1s0x4f64ae8bda9f24bd:0xa4712061712e6176!8m2!3d17.4381008!4d78.4449618!16s%2Fg%2F11y2bprzd0?entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                title="Get directions to Satya Computers on Google Maps"
                id="contact-maps-link"
                className="block no-underline"
              >
                <p className="font-body text-brand-text-muted leading-relaxed text-sm group-hover:text-[var(--color-brand-accent)] transition-colors duration-200">
                  {storeInfo.address}
                </p>
                <span className="block text-[10px] text-[var(--color-brand-accent)]/60 group-hover:text-[var(--color-brand-accent)] mt-2 font-heading tracking-widest uppercase transition-colors duration-200">
                  Get Directions →
                </span>
              </a>
            </div>
          </motion.div>

          {/* Call Us */}
          <motion.div
            custom={1}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="group relative"
          >
            <div className="absolute -inset-[2px] z-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{ background: 'conic-gradient(from 120deg, transparent 0%, var(--color-brand-primary) 30%, transparent 60%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 2.5 }}
              />
              <div className="absolute inset-[2px] bg-white" />
            </div>
            <div className="relative z-10 bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_48px_rgba(241,90,36,0.14)] transition-shadow duration-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary)]/5 group-hover:bg-[var(--color-brand-primary)] group-hover:border-[var(--color-brand-primary)] transition-all duration-400">
                  <Phone className="w-5 h-5 text-[var(--color-brand-primary)] group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg text-[var(--color-brand-primary)] tracking-widest">CALL US</h3>
              </div>
              <div className="h-[2px] w-8 bg-[var(--color-brand-primary)] mb-4 group-hover:w-full transition-all duration-500 ease-out" />
              <a
                href={`tel:+91${storeInfo.phone}`}
                id="contact-call-link"
                className="group/call flex items-center gap-3 no-underline"
              >
                <p className="font-body text-brand-text text-xl font-semibold group-hover/call:text-[var(--color-brand-primary)] transition-colors duration-200">
                  +91 {storeInfo.phone}
                </p>
              </a>
              <p className="font-body text-brand-text/40 mt-1.5 text-xs tracking-widest">MON–SAT: 10AM – 8PM</p>
              <p className="font-body text-[var(--color-brand-primary)]/60 mt-1 text-[10px] tracking-widest font-heading uppercase">Tap to Call →</p>
            </div>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            custom={2}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            whileHover={{ y: -6, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 280, damping: 20 }}
            className="group relative"
          >
            <div className="absolute -inset-[2px] z-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{ background: 'conic-gradient(from 240deg, transparent 0%, #25D366 30%, transparent 60%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear', delay: 5 }}
              />
              <div className="absolute inset-[2px] bg-white" />
            </div>
            <div className="relative z-10 bg-white p-7 shadow-[0_4px_24px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_48px_rgba(37,211,102,0.18)] transition-shadow duration-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center border-2 border-green-500/20 bg-green-50 group-hover:bg-green-500 group-hover:border-green-500 transition-all duration-400">
                  <MessageCircle className="w-5 h-5 text-green-500 group-hover:text-white transition-colors duration-400" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-lg text-green-600 tracking-widest">WHATSAPP</h3>
              </div>
              <div className="h-[2px] w-8 bg-green-500 mb-4 group-hover:w-full transition-all duration-500 ease-out" />
              <p className="font-body text-brand-text text-xl font-semibold mb-4">+{storeInfo.whatsapp}</p>
              <a href={`https://wa.me/${storeInfo.whatsapp}`} target="_blank" rel="noreferrer">
                <BrutalButton className="w-full text-sm">MESSAGE NOW</BrutalButton>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Message Form */}
        <motion.div
          className="w-full lg:w-2/3"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, type: 'spring', bounce: 0.25 }}
        >
          <div className="relative group">
            {/* Animated border */}
            <div className="absolute -inset-[2px] z-0 overflow-hidden">
              <motion.div
                className="absolute inset-0"
                style={{ background: 'conic-gradient(from 60deg, transparent 0%, var(--color-brand-primary) 20%, var(--color-brand-accent) 45%, transparent 70%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-[2px] bg-white" />
            </div>

            <div className="relative z-10 bg-white p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <h2 className="font-heading text-4xl text-brand-text mb-2">SEND A MESSAGE</h2>
              <div className="h-[3px] w-16 bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] mb-8" />

              <form className="flex flex-col gap-5 font-body text-brand-text">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { id: 'name', label: 'Full Name', type: 'text' },
                    { id: 'contact', label: 'Phone / Email', type: 'text' },
                  ].map((field) => (
                    <div key={field.id} className="relative">
                      <label htmlFor={field.id} className="block text-[10px] font-heading tracking-[0.25em] text-black/40 uppercase mb-2">{field.label}</label>
                      <input
                        id={field.id}
                        type={field.type}
                        onFocus={() => setFocused(field.id)}
                        onBlur={() => setFocused(null)}
                        className="w-full bg-[#FAFAFA] border border-black/10 p-4 text-sm focus:outline-none focus:border-[var(--color-brand-primary)] focus:bg-white transition-all duration-300"
                      />
                      <motion.div
                        className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)]"
                        animate={{ scaleX: focused === field.id ? 1 : 0 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        style={{ originX: 0 }}
                      />
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <label htmlFor="message" className="block text-[10px] font-heading tracking-[0.25em] text-black/40 uppercase mb-2">Message</label>
                  <textarea
                    id="message"
                    rows={5}
                    onFocus={() => setFocused('message')}
                    onBlur={() => setFocused(null)}
                    className="w-full bg-[#FAFAFA] border border-black/10 p-4 text-sm focus:outline-none focus:border-[var(--color-brand-primary)] focus:bg-white transition-all duration-300 resize-none"
                  />
                  <motion.div
                    className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)]"
                    animate={{ scaleX: focused === 'message' ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                  />
                </div>

                <div className="mt-2">
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.97 }}
                    className="relative group/btn flex items-center gap-3 py-4 px-10 border-2 border-black font-heading text-sm tracking-[0.3em] font-black uppercase overflow-hidden hover:border-[var(--color-brand-primary)] transition-colors duration-300"
                  >
                    <span className="absolute inset-0 bg-[var(--color-brand-primary)] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-400 ease-out" />
                    <Send className="relative w-4 h-4 group-hover/btn:text-white transition-colors duration-200" />
                    <span className="relative group-hover/btn:text-white transition-colors duration-200">SEND INQUIRY</span>
                  </motion.button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
