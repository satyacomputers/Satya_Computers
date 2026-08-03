'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import BrutalButton from '@/components/ui/BrutalButton';
import { Search, Activity, Wifi, ShieldCheck, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SpinningBadge = () => (
  <div className="absolute -bottom-16 -right-20 md:-bottom-24 md:-right-28 z-50 w-28 h-28 md:w-52 md:h-52 rounded-full border-2 border-black/10 bg-white/95 backdrop-blur-2xl flex items-center justify-center p-2 shadow-[0_30px_60px_rgba(0,0,0,0.25)] group/badge hover:scale-105 transition-transform duration-700 pointer-events-none">
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible animate-[spin_20s_linear_infinite] group-hover/badge:[animation-duration:10s]">
       <path id="circlePath" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" fill="transparent"/>
       <text className="font-heading text-[10.5px] tracking-[0.25em] font-bold fill-black/80 uppercase">
          <textPath href="#circlePath" startOffset="0%">
             • SATYA COMPUTERS • NEXT GEN LAPTOPS •&nbsp;
          </textPath>
       </text>
    </svg>
    <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
      <img src="/satya_computers_logo.png" alt="SC" className="w-full h-auto drop-shadow-xl saturate-[1.2]" />
    </div>
  </div>
);

const HUDLabel = ({ text, top, left, delay }: { text: string; top: string; left: string; delay: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.top = top;
      ref.current.style.left = left;
      ref.current.style.animationDelay = delay;
    }
  }, [top, left, delay]);

  return (
    <div
      ref={ref}
      className="absolute z-40 px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 text-white font-heading text-[8px] tracking-[0.4em] uppercase pointer-events-none animate-float shadow-2xl leading-none"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-1.5 h-1.5 bg-[var(--color-brand-primary)] animate-pulse flex-shrink-0" />
        {text}
      </div>
    </div>
  );
};

export default function SplitHero({ spotlightProduct }: { spotlightProduct?: any }) {
  // Use DB product or fallback to default
  const product = spotlightProduct || {
    name: "Dell XPS 14",
    brand: "DELL",
    processor: "Ultra 7 155H",
    ram: "32GB",
    storage: "RTX 4050",
    price: 27200,
    mrp: 170000,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1200"
  };

  const [, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    requestAnimationFrame(() => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setMousePos({ x, y });
      
      if (cursorRef.current) {
        cursorRef.current.style.left = `calc(${(x + 0.5) * 100}% - 20px)`;
        cursorRef.current.style.top = `calc(${(y + 0.5) * 100}% - 20px)`;
      }
      if (watermarkRef.current) {
        watermarkRef.current.style.transform = `rotate(-8deg) scale(1.3) translate(${x * -25}px, ${y * -25}px)`;
      }
      if (stackRef.current) {
        stackRef.current.style.transform = `perspective(2500px) rotateX(${y * -14}deg) rotateY(${x * 14}deg)`;
      }
    });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  if (!mounted) return <div className="min-h-[90vh] bg-white" />;

  return (
    <section className="relative w-full min-h-[90vh] flex flex-col lg:flex-row overflow-hidden border-b-2 border-black/10 bg-[#FAF9F6]">
      
      {/* ─── LEFT ─── */}
      <div className="w-full lg:w-[48%] h-full flex flex-col justify-center items-start px-6 py-16 md:p-16 lg:px-20 relative z-20">
        
        {/* New: Status Bar */}
        <div className="flex items-center gap-6 mb-12 border-b-2 border-black/5 pb-4 w-full max-w-sm">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-heading text-[10px] tracking-widest text-black/40 uppercase">Server: Active</span>
           </div>
           <div className="flex items-center gap-2">
              <Wifi size={12} className="text-black/20" />
              <span className="font-heading text-[10px] tracking-widest text-black/40 uppercase">SECURE_SSL</span>
           </div>
           <div className="ml-auto hidden sm:flex items-center gap-2">
              <Activity size={12} className="text-[var(--color-brand-primary)]" />
              <span className="font-heading text-[10px] tracking-widest text-[var(--color-brand-primary)] uppercase font-black">99.8% Uptime</span>
           </div>
        </div>

        <h1 className="font-heading text-[3.8rem] leading-[0.85] md:text-[6.5rem] lg:text-[7rem] xl:text-[8rem] tracking-normal text-brand-text mb-8 md:mb-10 relative z-10 w-full break-words">
          BOLD.<br/>
          PREMIUM.<br/>
          <span className="text-[var(--color-brand-primary)] relative block mt-2 text-[3rem] leading-[0.85] md:text-[5.5rem] lg:text-[6rem] xl:text-[6.8rem]">
            UNCOMPROMISING.
            <span className="absolute -bottom-2 -right-4 w-4 h-1 bg-black animate-pulse opacity-20 hidden md:block" />
          </span>
        </h1>

        <p className="font-body font-semibold text-lg md:text-xl text-brand-text/70 max-w-[400px] mb-12 border-l-[3px] border-[var(--color-brand-primary)] pl-6 leading-relaxed">
          Elite-tier calculating machinery for creators and engineers. Brutal performance, refined aesthetics.
        </p>

        <div className="flex flex-wrap gap-4 md:gap-6 items-center w-full">
          <Link href="/products" className="w-full sm:w-auto">
            <BrutalButton className="!h-14 md:!h-16 !px-8 md:!px-12 text-xl md:text-2xl w-full">ACCESS SYSTEMS</BrutalButton>
          </Link>
          
          <Link href="/products?focus=search" className="h-14 w-14 md:h-16 md:w-16 bg-white border-2 border-black flex items-center justify-center group hover:bg-black transition-all">
             <Search size={24} className="group-hover:text-white transition-colors" />
          </Link>

          <div className="hidden xl:flex items-center gap-10 ml-auto border-l border-black/10 pl-10">
             <div className="flex flex-col">
                <span className="font-heading text-[24px] text-black leading-none mb-1 font-black">450+</span>
                <span className="font-heading text-[9px] tracking-widest text-black/40 uppercase">LIVE_STOCK</span>
             </div>
             <div className="flex flex-col">
                <span className="font-heading text-[24px] text-black leading-none mb-1 font-black">2h</span>
                <span className="font-heading text-[9px] tracking-widest text-black/40 uppercase">AVG_DISPATCH</span>
             </div>
          </div>
        </div>
        
        {/* High-Fidelity Highlight Section */}
        <div className="mt-16 w-full max-w-lg">
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="group relative p-6 bg-white border border-black/5 hover:border-[var(--color-brand-primary)] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-5">
                   <ShieldCheck size={48} className="text-black" />
                </div>
                <div className="relative z-10">
                   <div className="w-8 h-8 rounded-full bg-[var(--color-brand-primary)]/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                      <ShieldCheck size={16} className="text-[var(--color-brand-primary)]" />
                   </div>
                   <h4 className="font-heading text-lg text-black uppercase tracking-tight mb-2 leading-none font-black">Lifetime Service<br/><span className="text-[var(--color-brand-primary)]">Warranty</span></h4>
                   <p className="font-body text-[9px] text-black/40 tracking-[0.2em] font-bold uppercase leading-relaxed">Guaranteed labor & support for the existence of your hardware.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="group relative p-6 bg-[#030303] text-white border border-white/5 hover:border-[var(--color-brand-primary)] transition-all shadow-2xl overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-2 opacity-10">
                   <Box size={48} className="text-white" />
                </div>
                <div className="relative z-10">
                   <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                      <Box size={16} className="text-[var(--color-brand-primary)]" />
                   </div>
                   <h4 className="font-heading text-lg text-white uppercase tracking-tight mb-2 leading-none font-black text-shadow-glow">1-Month <br/><span className="text-[var(--color-brand-primary)]">Replacement</span></h4>
                   <p className="font-body text-[9px] text-white/40 tracking-[0.2em] font-bold uppercase leading-relaxed">Full unit piece-to-piece exchange for technical defects.</p>
                </div>
              </motion.div>
           </div>
        </div>
      </div>

      {/* ─── RIGHT: THE VOID ─── */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full lg:w-[52%] min-h-[50vh] md:min-h-[75vh] lg:min-h-full bg-[#030303] relative flex items-center justify-center overflow-hidden cursor-none"
      >
        {/* ─ Digital Environment ─ */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]" />
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(241,90,36,0.06),transparent)]" />
          {/* Scan line */}
          <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-brand-primary)]/60 to-transparent animate-scan-line shadow-[0_0_20px_4px_rgba(241,90,36,0.3)]" />
          {/* Noise */}
          <div className="absolute inset-0 hero-noise-overlay opacity-[0.04]" />
        </div>

        {/* ─ Crosshair cursor ─ */}
        <div 
          ref={cursorRef}
          className="absolute pointer-events-none z-[100] w-10 h-10 border border-white/20 flex items-center justify-center transition-transform duration-75 ease-out hidden lg:flex"
        >
          <div className="absolute inset-y-0 w-px bg-white/20 left-1/2" />
          <div className="absolute inset-x-0 h-px bg-white/20 top-1/2" />
          <div className="w-1.5 h-1.5 bg-[var(--color-brand-primary)] animate-ping" />
        </div>

        {/* ─ Watermark text ─ */}
        <div
          ref={watermarkRef}
          className="absolute inset-0 flex flex-col justify-center opacity-[0.02] pointer-events-none select-none overflow-hidden"
        >
          {[...Array(12)].map((_, i) => (
            <h2 key={i} className="font-heading text-[11rem] md:text-[20rem] whitespace-nowrap leading-[0.65] tracking-tighter text-white font-black">
              {i % 2 === 0 ? 'SATYA COMPUTERS' : '// PEAK PERFORMANCE //'}
            </h2>
          ))}
        </div>

        {/* ─ HUD Labels ─ Hidden on mobile for cleaner aesthetic */}
        <div className="hidden md:block">
          <HUDLabel text="Neural Engine Active" top="14%" left="10%" delay="0s" />
          <HUDLabel text="Thermal: Optimal" top="80%" left="8%" delay="1.3s" />
          <HUDLabel text="System Ready" top="10%" left="72%" delay="2.7s" />
        </div>

        {/* ─ 3D CARD STACK ─ */}
        <div
          ref={stackRef}
          className="relative w-full max-w-5xl h-[500px] md:h-[820px] flex items-center justify-center group transition-transform duration-150 ease-out transform scale-75 md:scale-100"
        >
          {/* ── CARD 1: Back-Left (MacBook) ── */}
          <Link
            href="/products?brand=apple"
            className="absolute w-[65%] sm:w-[55%] aspect-[16/10] bg-zinc-900/95 border border-white/5 p-2 shadow-2xl
              -translate-y-20 -translate-x-32 md:-translate-y-32 md:-translate-x-48 -rotate-12 scale-90 opacity-30 blur-[5px]
              group-hover:-translate-y-32 group-hover:-translate-x-40 md:group-hover:-translate-y-44 md:group-hover:-translate-x-60 group-hover:-rotate-8 group-hover:scale-100 group-hover:blur-0 group-hover:opacity-100
              transition-all duration-[900ms] ease-out z-10 hover:!z-[60] hover:ring-2 hover:ring-[var(--color-brand-primary)]"
          >
            <div className="relative w-full h-full overflow-hidden bg-black ring-1 ring-white/10 group/c1">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000"
                alt="MacBook"
                className="w-full h-full object-cover opacity-50 grayscale group-hover/c1:grayscale-0 group-hover/c1:opacity-70 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent p-5 flex flex-col justify-end">
                <span className="font-heading text-[9px] text-[var(--color-brand-primary)] tracking-[0.4em] mb-1.5 font-bold">UNIFIED MEMORY</span>
                <span className="font-body text-white text-sm font-black uppercase">MacBook Pro Ecosystem</span>
              </div>
            </div>
          </Link>

          {/* ── CARD 2: Back-Right (ROG) ── */}
          <Link
            href="/products?focus=gaming"
            className="absolute w-[65%] sm:w-[55%] aspect-[16/10] bg-zinc-900/95 border border-[var(--color-brand-primary)]/20 p-2 shadow-2xl
              translate-y-20 translate-x-32 md:translate-y-32 md:translate-x-48 rotate-12 scale-90 opacity-30 blur-[5px]
              group-hover:translate-y-32 group-hover:translate-x-40 md:group-hover:-translate-y-44 md:group-hover:-translate-x-60 group-hover:rotate-8 group-hover:scale-100 group-hover:blur-0 group-hover:opacity-100
              transition-all duration-[900ms] ease-out z-10 hover:!z-[60] hover:ring-2 hover:ring-[var(--color-brand-primary)]"
          >
            <div className="relative w-full h-full overflow-hidden bg-black ring-1 ring-white/10 group/c2">
              <img
                src="https://images.unsplash.com/photo-1624701928517-44c8ac49d93c?auto=format&fit=crop&q=80&w=1000"
                alt="ROG Gaming"
                className="w-full h-full object-cover opacity-50 mix-blend-screen group-hover/c2:opacity-80 transition-opacity duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--color-brand-primary)]/60 to-transparent h-1/2 p-5 flex flex-col justify-end">
                <span className="font-heading text-[9px] text-white tracking-[0.4em] mb-1.5 font-bold">RTX OPTIMIZED</span>
                <span className="font-body text-white text-sm font-black uppercase">High-Hz Gaming Nodes</span>
              </div>
            </div>
          </Link>

          {/* ── CARD 3: Main Focus (Dell XPS 14) ── */}
          <div
            className="absolute w-[80%] sm:w-[70%] max-w-[500px] aspect-[4/5] bg-white border-[4px] border-black p-4 md:p-5
              shadow-[0_40px_100px_-20px_rgba(0,0,0,0.6)]
              md:shadow-[0_80px_150px_-30px_rgba(0,0,0,0.8)]
              group-hover:scale-[1.04] group-hover:shadow-[0_100px_180px_-40px_rgba(241,90,36,0.35)]
              transition-all duration-500 ease-out z-30 hover:!z-[70]"
          >
            <div className="relative w-full h-full bg-zinc-100 flex flex-col group/main overflow-hidden">
              
              {/* ─ Product Image Zone ─ */}
              <div className="relative w-full h-[63%] bg-[#060606] overflow-hidden flex items-center justify-center p-10">
                {/* Radar pings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border border-white/[0.04] rounded-full animate-[ping_3s_ease-out_infinite]" />
                  <div className="absolute w-48 h-48 border border-white/[0.06] rounded-full animate-[ping_3s_ease-out_1s_infinite]" />
                  <div className="absolute w-28 h-28 border border-white/[0.08] rounded-full animate-[ping_3s_ease-out_2s_infinite]" />
                </div>
                
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.95)]
                    transition-all duration-1000 ease-out
                    group-hover/main:scale-110 group-hover/main:-rotate-3"
                />
                
                {/* Glare sweep */}
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/8 to-transparent skew-x-[45deg] transition-all duration-[1800ms] ease-in-out group-hover/main:left-[200%] pointer-events-none" />
                
                <div className="absolute top-5 left-5 z-20 flex gap-2">
                  <span className="bg-black text-white font-heading text-[10px] tracking-[0.3em] px-4 py-1.5 font-bold border border-white/10">ELITE SPEC</span>
                  <span className="bg-[var(--color-brand-primary)] text-white font-heading text-[10px] tracking-[0.2em] px-3 py-1.5 font-bold">HOT</span>
                </div>
              </div>

              {/* ─ Data Panel ─ */}
              <div className="flex-1 bg-white p-4 md:p-7 pt-4 md:pt-6 flex flex-col justify-between relative">
                <div className="absolute bottom-0 right-0 p-5 opacity-[0.04] pointer-events-none">
                  <img src="/satya_computers_logo.png" alt="" className="h-24 w-auto grayscale" />
                </div>
                
                <div className="relative z-20">
                  <h3 className="font-heading text-[1.8rem] md:text-[3.2rem] text-black uppercase leading-[0.82] tracking-[-0.03em] font-black mb-4 md:mb-6">
                    {product.name.split(' ').slice(0, 2).join(' ')}<br/>
                    <span className="text-[var(--color-brand-primary)] italic">{product.name.split(' ').slice(2).join(' ') || 'STUDIO'}</span>
                  </h3>
                  
                <div className="grid grid-cols-2 gap-4 text-left sm:text-left">
                  <div className="border-l-[2px] md:border-l-[3px] border-black pl-2 md:pl-3">
                    <span className="block font-heading text-[7px] md:text-[8px] text-black/30 tracking-[0.4em] mb-1 uppercase font-bold">ARC ENGINE</span>
                    <span className="block font-body text-[10px] md:text-[12px] font-black text-black uppercase">{product.processor}</span>
                  </div>
                  <div className="border-l-[2px] md:border-l-[3px] border-black/10 pl-2 md:pl-3">
                    <span className="block font-heading text-[7px] md:text-[8px] text-black/30 tracking-[0.4em] mb-1 uppercase font-bold">MEMORY/GFX</span>
                    <span className="block font-body text-[10px] md:text-[12px] font-black text-black uppercase">{product.ram} / {product.storage}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-between border-t-[3px] border-black pt-4 md:pt-5 mt-auto gap-4">
                <div className="text-center h-12 md:h-12 overflow-hidden w-full">
                  <div className="group-hover/main:-translate-y-full transition-transform duration-500 ease-in-out">
                    <div className="h-12 flex flex-col justify-end items-center">
                      <p className="font-heading text-[8px] text-black/30 tracking-[0.3em] mb-1 uppercase font-bold">MKT VALUE</p>
                      <p className="font-body text-xl md:text-3xl font-black text-black leading-none tracking-tighter">₹{product.mrp?.toLocaleString()}</p>
                    </div>
                    <div className="h-12 flex flex-col justify-end items-center">
                      <p className="font-heading text-[8px] text-[var(--color-brand-primary)] tracking-[0.3em] mb-1 uppercase font-bold">OUR PRICE</p>
                      <p className="font-body text-xl md:text-3xl font-black text-[var(--color-brand-primary)] leading-none tracking-tighter">₹{product.price?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="group/stock w-full">
                  <span className="flex items-center justify-center gap-2.5 bg-black text-white px-5 py-2.5 font-heading text-[11px] tracking-[0.3em] font-bold cursor-pointer hover:bg-[var(--color-brand-primary)] transition-colors duration-300 active:scale-95 w-full">
                    <Box size={14} className="text-emerald-400" />
                    LIVE&nbsp;INVENTORY
                  </span>
                </div>
              </div>
              </div>
            </div>

            <SpinningBadge />
          </div>
        </div>
      </div>
    </section>
  );
}
