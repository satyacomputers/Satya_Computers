'use client';

import { motion } from 'framer-motion';

interface TrustedMarqueeProps {
  partners?: string[];
}

const defaultBrands = [
  "DELL", "HP", "LENOVO", "APPLE", "INTEL CORE", "AMD RYZEN", "NVIDIA RTX", "ASUS", "ACER", "MICROSOFT"
];

export default function TrustedMarquee({ partners = [] }: TrustedMarqueeProps) {
  // Merge dynamic partners from DB with default brands
  const brands = Array.from(new Set([...partners.map(p => p.toUpperCase()), ...defaultBrands]));
  
  // We duplicate the array to create a seamless infinite loop
  const duplicatedBrands = [...brands, ...brands, ...brands];

  return (
    <section className="py-8 bg-[#111] overflow-hidden relative border-y border-white/10">
      
      {/* Edge Gradients for fading effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#111] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#111] to-transparent z-10" />

      <div className="flex items-center gap-16 relative">
        <motion.div
          className="flex whitespace-nowrap items-center gap-16"
          animate={{ x: [0, -2000] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 40
          }}
        >
          {duplicatedBrands.map((brand, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-default">
              <span className="font-heading text-2xl md:text-3xl text-white/20 tracking-[0.2em] font-black uppercase group-hover:text-[var(--color-brand-primary)] transition-colors duration-300">
                {brand}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-[var(--color-brand-primary)] transition-colors duration-300" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
