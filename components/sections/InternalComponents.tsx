'use client';

import { motion } from 'framer-motion';
import { Cpu, Database, Battery, Cpu as Gpu, HardDrive, Settings } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';

const components = [
  {
    id: "samsung-990-pro-1tb",
    name: "Enterprise SSDs",
    specs: "NVMe Gen4 | Up to 7450 MB/s",
    icon: HardDrive,
    image: "/products/samsung-990-pro.png",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    id: "crucial-16gb-ddr5-5600",
    name: "DDR4/DDR5 RAM",
    specs: "3200MHz - 5600MHz | ECC Support",
    icon: Database,
    image: "/products/crucial-ram.png",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    id: "dell-latitude-battery-63wh",
    name: "Original Batteries",
    specs: "High-Cycle | OEM Certified",
    icon: Battery,
    image: "/products/dell-battery.png",
    color: "from-emerald-500/20 to-teal-500/20"
  },
  {
    id: "coolermaster-liquid-metal",
    name: "Internal Cooling",
    specs: "Dual-Fan | Liquid Metal Ready",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=800",
    color: "from-purple-500/20 to-pink-500/20"
  }
];

export default function InternalComponents() {
  const { addToCart } = useCart();

  const handleAddToCart = (comp: any) => {
    addToCart({
      productId: comp.id,
      name: comp.name,
      price: comp.id === 'samsung-990-pro-1tb' ? 9500 : comp.id === 'crucial-16gb-ddr5-5600' ? 5200 : 4500,
      image: comp.image,
      quantity: 1
    });
    alert(`${comp.name} added to cart!`);
  };

  return (
    <section className="py-32 bg-[#050B14] relative overflow-hidden">
      {/* Absolute Hexagon Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 opacity-10 pointer-events-none hex-grid-bg" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8"
          >
            <Settings className="text-[#F97316] animate-spin-slow" size={16} />
            <span className="text-white/60 font-heading text-[10px] tracking-[0.3em] uppercase">Precision Spares</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-heading font-black text-white uppercase leading-[0.9] mb-6">
            THE <span className="text-[#F97316]">ANATOMY</span> OF<br />
            PERFORMANCE
          </h2>
          <p className="max-w-xl mx-auto text-white/40 text-lg">
            We don't just sell laptops. We provide the internal architecture that keeps your business running at peak velocity.
          </p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {components.map((comp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              className="group relative h-[450px] rounded-[3rem] overflow-hidden bg-white/5 border border-white/10"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${comp.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <img 
                src={comp.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0 will-change-transform"
              />

              <div className="absolute inset-0 p-12 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                   <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden flex items-center justify-center backdrop-blur-xl group-hover:bg-white/20 transition-all">
                      <img src={comp.image} alt={comp.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="text-right">
                      <p className="text-[#F97316] font-bold text-xs uppercase tracking-widest mb-1">Stock: Available</p>
                      <p className="text-white/40 text-[10px] font-mono">CODE: SC-P-{idx + 100}</p>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <h3 className="text-3xl font-heading font-bold text-white mb-1 uppercase tracking-tight">{comp.name}</h3>
                   <p className="text-white/60 font-medium mb-2">{comp.specs}</p>
                   <div className="flex items-center gap-6">
                      <button 
                       suppressHydrationWarning
                       onClick={() => handleAddToCart(comp)}
                       className="bg-[#F97316] text-white px-8 py-3 font-heading text-xs tracking-[0.2em] font-bold hover:bg-white hover:text-black transition-all shadow-[8px_8px_0_rgba(249,115,22,0.2)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      >
                         ADD TO CART
                      </button>
                      <Link href="/products?category=parts" className="flex items-center gap-3 text-white font-bold text-sm group/btn hover:text-[#F97316] transition-colors">
                         VIEW SPEC SHEET 
                         <div className="w-8 h-[2px] bg-[#F97316] group-hover/btn:w-16 transition-all" />
                      </Link>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        section {
          --hex-color: rgba(249, 115, 22, 0.3);
        }
        .hex-grid-bg {
          background-image: radial-gradient(var(--hex-color) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>
    </section>
  );
}
