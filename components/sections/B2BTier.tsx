'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Globe, Truck, Calculator, ChevronRight, Check, Plus, X, ShoppingCart } from 'lucide-react';

// ── Local Type Definition ──────────────────────
type ProductItem = { id: string; name: string; brand: string; price: number };

const BRANDS = ['All', 'Dell', 'Lenovo', 'HP', 'Apple'];

const BRAND_COLORS: Record<string, string> = {
  Apple: 'bg-gray-800 text-white',
  Dell: 'bg-blue-700 text-white',
  HP:   'bg-sky-600 text-white',
  Lenovo: 'bg-red-700 text-white',
};

type CartEntry = { product: ProductItem; qty: number };

export default function B2BTier() {
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [showQuote, setShowQuote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setAllProducts(data.map((p: any) => ({
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price
          })));
        }
      } catch (err) {
        console.error('B2B Fetch Error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts =
    selectedBrand === 'All'
      ? allProducts
      : allProducts.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());


  const addToCart = (product: ProductItem) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.product.id === product.id);
      if (existing) {
        return prev.map((e) =>
          e.product.id === product.id ? { ...e, qty: e.qty + 1 } : e
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((e) => e.product.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart((prev) => prev.map((e) => (e.product.id === id ? { ...e, qty } : e)));
  };

  const totalUnits = cart.reduce((s, e) => s + e.qty, 0);
  const totalBase  = cart.reduce((s, e) => s + e.product.price * e.qty, 0);
  const discount   = totalUnits >= 50 ? 0.20 : totalUnits >= 10 ? 0.12 : totalUnits >= 5 ? 0.08 : 0;
  const totalFinal = totalBase * (1 - discount);

  const cartSummary = cart
    .map((e) => `${e.qty}x ${e.product.name} @ ₹${e.product.price.toLocaleString('en-IN')}`)
    .join('\n');

  const waMessage = encodeURIComponent(
    `Hi Satya Computers, I want a bulk quote for:\n${cartSummary}\n\nTotal Units: ${totalUnits}\nEstimated Quote: ₹${totalFinal.toLocaleString('en-IN')} (${(discount * 100).toFixed(0)}% off)\n\nPlease contact me.`
  );
  const mailBody = encodeURIComponent(
    `Hi Satya Computers,\n\nI would like a bulk order quote for:\n${cartSummary}\n\nTotal Units: ${totalUnits}\nEstimated Quote: ₹${totalFinal.toLocaleString('en-IN')} (${(discount * 100).toFixed(0)}% off)\n\nPlease get in touch.\n`
  );

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[var(--color-brand-primary)]/10 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* ── Left: B2B Content ─────────────────────────────────── */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/5 rounded-full mb-8">
              <Building2 size={14} className="text-[var(--color-brand-primary)]" />
              <span className="font-heading text-[10px] tracking-[0.2em] uppercase font-bold text-white/50">Enterprise Procurement</span>
            </div>

            <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.9] tracking-tighter">
              B2B <span className="text-[var(--color-brand-primary)]">SOLUTIONS</span> FOR SCALE.
            </h2>

            <p className="font-body text-white/60 text-lg leading-relaxed mb-12 max-w-lg">
              Optimized supply chain for educational institutions, corporate startups, and large-scale enterprises. Build your bulk order by selecting laptops below and get an instant quote.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Globe, title: 'COD AVAILABLE NATIONWIDE', sub: 'Hub-and-spoke delivery' },
                { icon: Truck, title: 'FAST-TRACK LOGISTICS', sub: '48hr node delivery' },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 p-6 bg-white/5 border border-white/10 hover:border-white/20 transition-all group">
                  <div className="w-10 h-10 bg-[var(--color-brand-primary)]/10 flex items-center justify-center border border-[var(--color-brand-primary)]/20 group-hover:bg-[var(--color-brand-primary)] group-hover:text-white transition-all">
                    <item.icon size={20} className="text-[var(--color-brand-primary)] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xs tracking-widest uppercase mb-1">{item.title}</h4>
                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-tight">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* COD Trust Banner */}
            <div className="mt-12 p-6 border-l-4 border-[var(--color-brand-primary)] bg-white/5">
               <p className="font-heading text-[10px] tracking-[0.3em] text-[var(--color-brand-primary)] mb-2 uppercase">Zero Risk Protocol</p>
               <p className="font-body text-sm text-white/60 leading-relaxed italic">
                 "We prioritize customer security. Our <strong>Cash on Delivery (COD)</strong> option ensures you only pay after the hardware architecture successfully reaches your deployment site."
               </p>
            </div>
          </div>

          {/* ── Right: Volume Estimator ───────────────────────────── */}
          <div className="relative">
            <div className="bg-white text-black shadow-[20px_20px_0_rgba(241,90,36,0.2)] md:shadow-[40px_40px_0_rgba(241,90,36,0.2)] border-2 border-black relative z-10 overflow-hidden">

              {/* Header */}
              <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b-2 border-black">
                <h3 className="font-heading text-xl md:text-2xl uppercase tracking-tighter">VOLUME ESTIMATOR</h3>
                <Calculator className="w-6 h-6 text-[var(--color-brand-primary)]" />
              </div>

              {/* Product Selector */}
              <div className="px-8 pt-6 pb-4 border-b border-black/10">
                <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-black/50 mb-3">SELECT LAPTOPS TO ADD</p>

                {/* Brand Tabs */}
                <div className="flex gap-1.5 flex-wrap mb-4">
                  {BRANDS.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3 py-1 font-heading text-[9px] tracking-widest uppercase font-black border transition-all ${
                        selectedBrand === brand
                          ? 'bg-black text-white border-black'
                          : 'bg-transparent text-black/40 border-black/20 hover:border-black hover:text-black'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>

                {/* Product Buttons Grid */}
                <div className="max-h-44 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                  {filteredProducts.map((product) => {
                    const inCart = cart.find((e) => e.product.id === product.id);
                    const brandColor = BRAND_COLORS[product.brand] ?? 'bg-gray-700 text-white';
                    return (
                      <button
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className={`w-full flex items-center justify-between px-3 py-2 border text-left transition-all group ${
                          inCart
                            ? 'border-[var(--color-brand-primary)] bg-orange-50'
                            : 'border-black/10 hover:border-black bg-gray-50 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`px-1.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-sm shrink-0 ${brandColor}`}>
                            {product.brand}
                          </span>
                          <span className="font-body text-[11px] font-semibold text-black/80 truncate">{product.name}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-2">
                          <span className="font-body text-[10px] font-black text-black/60">₹{product.price.toLocaleString('en-IN')}</span>
                          <Plus
                            size={14}
                            className={`transition-colors ${inCart ? 'text-[var(--color-brand-primary)]' : 'text-black/30 group-hover:text-black'}`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cart / Selected Items */}
              <div className="px-8 pt-5 pb-4 border-b border-black/10 min-h-[80px]">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-heading text-[10px] tracking-[0.2em] uppercase text-black/50 flex items-center gap-1.5">
                    <ShoppingCart size={12} /> BULK ORDER LIST
                  </p>
                  {cart.length > 0 && (
                    <button
                      onClick={() => setCart([])}
                      className="font-heading text-[8px] tracking-widest uppercase text-black/30 hover:text-red-500 transition-colors"
                    >
                      CLEAR ALL
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <p className="text-[11px] text-black/25 font-body italic text-center py-2">
                    👆 Click a laptop above to add it to your bulk order
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 scrollbar-thin">
                    {cart.map((entry) => (
                      <div key={entry.product.id} className="flex items-center gap-2 bg-gray-50 border border-black/5 px-3 py-1.5">
                        <span className="flex-1 font-body text-[10px] font-semibold text-black/70 truncate">{entry.product.name}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => updateQty(entry.product.id, entry.qty - 1)}
                            className="w-5 h-5 bg-black/5 hover:bg-black hover:text-white text-black font-black text-xs flex items-center justify-center transition-all"
                          >−</button>
                          <span className="font-heading text-[10px] font-black w-5 text-center">{entry.qty}</span>
                          <button
                            onClick={() => updateQty(entry.product.id, entry.qty + 1)}
                            className="w-5 h-5 bg-black/5 hover:bg-black hover:text-white text-black font-black text-xs flex items-center justify-center transition-all"
                          >+</button>
                        </div>
                        <span className="font-body text-[10px] font-black text-black/50 shrink-0">
                          ₹{(entry.product.price * entry.qty).toLocaleString('en-IN')}
                        </span>
                        <button onClick={() => removeFromCart(entry.product.id)} aria-label={`Remove ${entry.product.name} from order`} className="text-black/20 hover:text-red-500 transition-colors ml-1">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quote Summary */}
              <div className="px-8 py-6 space-y-4">
                <div className="bg-gray-50 p-5 border border-black/5 space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-black/50 font-heading tracking-widest">TOTAL UNITS</span>
                    <span className="font-body font-black italic">{totalUnits} Systems</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-black/50 font-heading tracking-widest">BASE VALUE</span>
                    <span className="font-body font-black italic">₹{totalBase.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-xs items-center font-bold">
                    <span className="text-black/50 font-heading tracking-widest">VOLUME REBATE</span>
                    <span className={`px-2 py-0.5 border font-black ${discount > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-black/40 border-black/10'}`}>
                      {(discount * 100).toFixed(0)}% OFF
                      {totalUnits < 5 && totalUnits > 0 && <span className="ml-1 text-[9px] font-medium">(5+ for discount)</span>}
                    </span>
                  </div>
                  <div className="h-px bg-black/10" />
                  <div className="flex justify-between items-end">
                    <span className="font-heading text-xs uppercase tracking-widest font-black">FINAL QUOTE</span>
                    <span className="font-body text-xl md:text-3xl font-black text-black leading-none">
                      ₹{totalFinal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => { if (totalUnits > 0) setShowQuote(true); }}
                  disabled={totalUnits === 0}
                  className={`w-full py-4 md:py-5 font-heading text-sm tracking-widest uppercase flex items-center justify-center gap-3 group transition-all ${
                    totalUnits > 0
                      ? 'bg-black text-white hover:bg-[var(--color-brand-primary)]'
                      : 'bg-gray-100 text-black/30 cursor-not-allowed'
                  }`}
                >
                  <span>SUBMIT FOR EVALUATION</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* ── Success Overlay ────── */}
              <AnimatePresence>
                {showQuote && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 bg-white flex flex-col items-center justify-center p-6 md:p-12 text-center"
                  >
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-emerald-500/10">
                      <Check size={24} />
                    </div>
                    <h4 className="font-heading text-xl md:text-2xl mb-2 uppercase tracking-tighter">REQUEST GENERATED</h4>
                    <p className="font-body text-xs text-black/40 mb-1">{totalUnits} systems · ₹{totalFinal.toLocaleString('en-IN')}</p>
                    <p className="font-body text-xs md:text-sm text-black/50 mb-8 leading-relaxed px-4">
                      Select your preferred channel to notify our corporate desk.
                    </p>

                    <div className="w-full space-y-3">
                      <a
                        href={`https://wa.me/919640272323?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 font-heading text-[10px] tracking-[0.2em] font-black uppercase hover:brightness-110 transition-all rounded-sm"
                      >
                        SEND VIA WHATSAPP
                      </a>
                      <a
                        href={`mailto:info@satyacomputers.in?subject=B2B Bulk Quote – ${totalUnits} Units&body=${mailBody}`}
                        className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 font-heading text-[10px] tracking-[0.2em] font-black uppercase hover:bg-[var(--color-brand-primary)] transition-all rounded-sm"
                      >
                        SEND VIA EMAIL
                      </a>
                    </div>

                    <button
                      onClick={() => setShowQuote(false)}
                      className="mt-8 font-heading text-[9px] tracking-[0.3em] uppercase text-black/30 hover:text-black transition-colors underline underline-offset-4"
                    >
                      ← Back to Configurator
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Brutalist Shapes */}
            <div className="absolute -bottom-6 -right-6 md:-bottom-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 bg-[var(--color-brand-primary)] -z-0" />
          </div>

        </div>
      </div>
    </section>
  );
}
