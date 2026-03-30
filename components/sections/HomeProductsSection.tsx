'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '@/components/store/ProductCard';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Loader2, Sparkles, Filter } from 'lucide-react';

export default function HomeProductsSection() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch home products:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const brands = ['All', 'Dell', 'Lenovo', 'HP', 'Apple'];
  
  const filteredProducts = activeTab === 'All' 
    ? products 
    : products.filter(p => p.brand.toLowerCase() === activeTab.toLowerCase());

  const displayProducts = filteredProducts.slice(0, 4);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 className="w-12 h-12 text-[#F15A24] animate-spin" />
        <p className="font-heading text-xs tracking-[0.4em] text-gray-400 uppercase font-black">Syncing Visual Matrices...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="py-32 relative overflow-hidden bg-white">
      {/* ── OLD WEBSITE STYLED COLORFUL ELEMENTS ── */}
      {/* Vibrant Gradient Mesh */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#401F5E]/5 via-[#F15A24]/5 to-transparent pointer-events-none" />
      
      {/* Floating Colorful Orbs (Legacy Vibe) */}
      <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-[#F15A24] opacity-[0.07] blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-40 left-[5%] w-[350px] h-[350px] bg-[#401F5E] opacity-[0.05] blur-[100px] rounded-full" />
      
      {/* Retro Dot Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#401F5E_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-10">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#F15A24] text-white rounded-none mb-8 shadow-[8px_8px_0_rgba(64,31,94,0.15)]"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span className="font-heading text-[10px] tracking-[0.3em] uppercase font-black">Limited Inventory Hub</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-heading text-6xl md:text-8xl text-[#401F5E] mb-6 uppercase leading-[0.8] tracking-tighter"
            >
              PREMIUM <br />
              <span className="text-[#F15A24]">HARDWARE</span> GRID.
            </motion.h2>
            
            <div className="h-1.5 w-32 bg-gradient-to-r from-[#F15A24] to-[#401F5E] mb-8" />
          </div>

          <div className="flex flex-col items-start lg:items-end gap-8">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex bg-gray-50 border-2 border-[#401F5E]/10 p-1.5 rounded-none shadow-sm"
            >
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setActiveTab(brand)}
                  className={`px-5 py-2.5 font-heading text-[11px] tracking-widest uppercase font-black transition-all ${
                    activeTab === brand 
                    ? 'bg-[#401F5E] text-white shadow-lg' 
                    : 'text-gray-400 hover:text-[#401F5E] hover:bg-white'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </motion.div>
            
            <p className="font-body text-gray-500 text-sm font-bold max-w-sm lg:text-right uppercase tracking-wider">
              Stratified hardware clusters optimized for high-fidelity professional deployment.
            </p>
          </div>
        </div>

        {/* Product Grid - limited to 4 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          <AnimatePresence mode="popLayout">
            {displayProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                {/* Legacy Colorful Card Wrapper */}
                <div className="relative p-1 bg-gradient-to-br from-[#F15A24]/20 via-transparent to-[#401F5E]/20 hover:from-[#F15A24] hover:to-[#401F5E] transition-all duration-500 shadow-xl group">
                   <ProductCard 
                    product={{
                      ...product,
                      slug: product.id,
                      specs: {
                        ...product.specs,
                        screen: product.specs.display || 'FHD'
                      }
                    }} 
                  />
                  {/* Colorful Hover Glow */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F15A24] to-[#401F5E] opacity-0 group-hover:opacity-10 dark:opacity-20 blur group-hover:blur-md transition-all -z-10" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Center View All Button - only visible if more products exist */}
        {filteredProducts.length > 4 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 flex justify-center"
          >
            <Link href="/products" className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#F15A24] to-[#401F5E] opacity-70 blur-sm group-hover:opacity-100 transition-opacity" />
              <button 
                className="relative bg-white border-4 border-[#401F5E] px-12 py-6 flex items-center gap-4 transition-transform active:scale-95 hover:-translate-y-1"
              >
                <span className="font-heading text-xl tracking-[0.2em] font-black text-[#401F5E] uppercase underline decoration-[#F15A24] decoration-4 underline-offset-8">
                  VIEW PRODUCTS
                </span>
                <ArrowRight size={24} className="text-[#F15A24] group-hover:translate-x-2 transition-transform" strokeWidth={3} />
              </button>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Decorative Brand Text (Old Version Vibe) */}
      <div className="absolute -bottom-10 left-10 font-heading text-[18rem] leading-none text-[#F15A24]/[0.03] pointer-events-none select-none uppercase -rotate-12">
        SATYA
      </div>
      <div className="absolute top-40 -right-20 font-heading text-[15rem] leading-none text-[#401F5E]/[0.03] pointer-events-none select-none uppercase rotate-90">
        TECH
      </div>
    </section>
  );
}
