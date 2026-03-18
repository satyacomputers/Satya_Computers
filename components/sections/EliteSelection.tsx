'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export interface EliteProduct {
  id: string;
  brand: string;
  title: string;
  specs: string;
  price: string;
  bg: string;
  img: string;
  link: string;
}

interface EliteSelectionProps {
  products?: EliteProduct[];
}

export default function EliteSelection({ products = [] }: EliteSelectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // If no products provided, we'll show nothing or a fallback (though in our case we'll fetch them)
  if (products.length === 0) return null;

  const scrollGallery = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[#5B3A8C] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none hero-dot-grid" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-6xl md:text-8xl lg:text-9xl text-white mb-2 leading-[0.85]"
            >
              ELITE
            </motion.h2>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-heading text-6xl md:text-8xl lg:text-9xl text-[#FF6B00] leading-[0.85]"
            >
              SELECTION.
            </motion.h2>
          </div>
          
          <div className="flex-1 md:max-w-sm lg:max-w-md">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="font-body text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
                Certified workstations and high-performance laptops. Ready for professional deployment.
              </p>
              <div className="w-24 h-1.5 bg-[#FF6B00]" />
            </motion.div>
          </div>
        </div>

        {/* Slider Container */}
        <div className="relative group/main">
          {/* Navigation Arrows */}
          <button 
            suppressHydrationWarning
            onClick={() => scrollGallery('left')}
            aria-label="Previous Stock"
            className="absolute -left-4 md:-left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:bg-black hover:text-white transition-all scale-100 md:scale-0 md:group-hover/main:scale-100 active:scale-95 border-none cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <button 
            suppressHydrationWarning
            onClick={() => scrollGallery('right')}
            aria-label="Next Stock"
            className="absolute -right-4 md:-right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl hover:bg-black hover:text-white transition-all scale-100 md:scale-0 md:group-hover/main:scale-100 active:scale-95 border-none cursor-pointer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-12 px-4 -mx-4 scroll-smooth snap-x snap-mandatory elite-scrollbar relative z-30"
          >
            <div className="flex gap-6 lg:gap-8 w-max">
              {products.map((product, idx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    delay: idx * 0.05, 
                    duration: 0.5 
                  }}
                  whileHover={{ y: -10 }}
                  style={{ backgroundColor: product.bg }}
                  className="group/card relative rounded-[2.5rem] w-[320px] md:w-[400px] aspect-[4/5] overflow-hidden p-8 flex flex-col items-center justify-between shadow-2xl flex-shrink-0 snap-center"
                >
                  {/* Link wrapper for the whole card to ensure interactivity */}
                  <Link href={product.link} className="absolute inset-0 z-10">
                    <span className="sr-only">View {product.title}</span>
                  </Link>

                  {/* Brand Badge */}
                  <div className="absolute top-8 left-8 bg-black px-5 py-2 rounded-xl z-20">
                    <span className="text-white font-heading text-sm tracking-widest">{product.brand}</span>
                  </div>

                  {/* Product Image */}
                  <div className="w-full h-48 relative mb-6 z-0">
                    <Image
                      src={product.img}
                      alt={product.brand}
                      fill
                      className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover/card:scale-110"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 w-full text-black z-20 pointer-events-none">
                    <h3 className="font-heading text-4xl lg:text-5xl leading-[0.9] mb-4 uppercase tracking-tighter">
                      {product.title}
                    </h3>
                    <p className="font-body text-[11px] lg:text-xs font-semibold leading-relaxed opacity-70 mb-8 max-w-[90%]">
                      {product.specs}
                    </p>
                    
                    <div className="mt-auto">
                      <p className="font-heading text-[10px] tracking-widest opacity-40 mb-1">PRICE START</p>
                      <p className="font-heading text-4xl">{product.price}</p>
                    </div>
                  </div>

                  {/* Action Circle (Bottom Right) - visual only as whole card is link */}
                  <div className="absolute bottom-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center text-black group-hover/card:bg-black group-hover/card:text-white transition-all duration-300 shadow-xl group-hover/card:scale-105 z-20 pointer-events-none">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Subtle Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity pointer-events-none z-0" />
                </motion.div>
              ))}

              {/* SEE ALL STOCK CARD */}
              <Link href="/products" className="block flex-shrink-0 snap-center">
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative rounded-[2.5rem] w-[320px] md:w-[400px] aspect-[4/5] bg-[#0A192F] overflow-hidden p-8 flex flex-col items-center justify-center shadow-2xl group/all"
                >
                  <div className="text-center z-10">
                    <h3 className="font-heading text-6xl md:text-7xl text-white leading-[0.8] mb-1">SEE ALL</h3>
                    <h3 className="font-heading text-6xl md:text-7xl text-[#FF6B00] leading-[0.8] mb-12">STOCK</h3>
                    
                    <div className="inline-block bg-white text-[#0A192F] font-heading text-2xl px-12 py-3 rounded-2xl group-hover/all:bg-[#FF6B00] group-hover/all:text-white transition-all duration-300 group-hover/all:scale-110 active:scale-95 shadow-xl">
                      EXPLORE
                    </div>
                  </div>
                  
                  {/* Decorative background circle */}
                  <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FF6B00]/10 rounded-full blur-3xl group-hover/all:bg-[#FF6B00]/20 transition-all duration-500" />
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
