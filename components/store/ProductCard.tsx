'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product } from '@/data/products';
import { useCart } from '@/lib/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const { addToCart, items, updateQuantity, removeFromCart } = useCart();
  const [added, setAdded] = useState(false);

  const cartItem = items.find(item => item.productId === product.id);
  const currentQuantity = cartItem ? cartItem.quantity : 0;

  const handleCardClick = () => router.push(`/products/${product.slug}`);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const isBrandColorBadge = product.badge === 'HOT' || product.badge === 'SALE';

  return (
    <motion.div
      className="group relative flex flex-col h-full cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      whileHover={{ y: -10, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 280, damping: 20 }}
    >
      {/* Animated Gradient Border Ring */}
      <div className="absolute -inset-[2px] rounded-none z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, var(--color-brand-primary) 20%, var(--color-brand-accent) 40%, transparent 60%)',
          }}
          animate={{ rotate: hovered ? 360 : 0 }}
          transition={{ duration: 2, repeat: hovered ? Infinity : 0, ease: 'linear' }}
        />
        <div className="absolute inset-[2px] bg-white" />
      </div>

      {/* Card Body */}
      <div className="relative z-10 flex flex-col h-full bg-white border border-black/5 overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] group-hover:shadow-[0_20px_60px_rgba(241,90,36,0.15)] transition-shadow duration-[400ms] ease-out">

        {/* Top Identity Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#FAFAFA] border-b border-black/5">
          <span className="font-heading text-[9px] tracking-[0.3em] text-black/35 uppercase">SYS: {product.brand.slice(0, 4)}.{product.id.slice(-4)}</span>
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-[var(--color-brand-primary)]"
            />
            <span className="font-heading text-[9px] tracking-[0.2em] text-[var(--color-brand-primary)]">ACTIVE</span>
          </div>
        </div>

        {/* Image Area */}
        <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#f7f7f7] to-[#efefef] overflow-hidden">
          {/* Dot Grid */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle,_#00000012_1px,_transparent_1px)] bg-[size:14px_14px]" />

          {/* Animated scanline on hover */}
          <motion.div
            className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[var(--color-brand-primary)]/12 to-transparent blur-lg pointer-events-none"
            animate={{ y: hovered ? ['-100%', '350%'] : '-100%' }}
            transition={{ duration: 1.4, repeat: hovered ? Infinity : 0, ease: 'linear' }}
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-20">
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`inline-flex items-center px-2.5 py-1 font-heading text-[10px] tracking-[0.25em] text-white font-bold shadow-lg ${isBrandColorBadge ? 'bg-[var(--color-brand-primary)]' : 'bg-black'}`}
              >
                {product.badge}
              </motion.span>
            </div>
          )}

          {/* Product Image with 3D lift */}
          <motion.div
            className="relative w-full h-full z-10 p-6"
            animate={{ scale: hovered ? 1.07 : 1, y: hovered ? -8 : 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            {/* Shadow blob under image */}
            <motion.div
              className="absolute inset-x-8 bottom-2 h-4 bg-black/20 blur-xl rounded-full pointer-events-none"
              animate={{ opacity: hovered ? 0.8 : 0.3, scaleX: hovered ? 0.75 : 1 }}
              transition={{ duration: 0.4 }}
            />
            <NextImage
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain mix-blend-multiply filter drop-shadow-xl"
            />
          </motion.div>
        </div>

        {/* Animated accent bar */}
        <motion.div
          className="h-[3px] bg-gradient-to-r from-[var(--color-brand-primary)] to-[var(--color-brand-accent)] origin-left"
          animate={{ scaleX: hovered ? 1 : 0.08 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Info Section */}
        <div className="flex flex-col flex-grow p-5 pt-4">
          <div className="flex-grow mb-4">
            <h3 className="font-heading text-xl text-brand-text leading-tight uppercase tracking-[0.02em] mb-1.5 line-clamp-2 group-hover:text-[var(--color-brand-primary)] transition-colors duration-300">
              {product.name}
            </h3>
            <p className="font-body text-[11px] text-black/45 line-clamp-2 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Tech Specs Grid */}
            <div className="grid grid-cols-2 gap-2 border-t border-black/5 pt-4">
              {[
                { label: 'CPU', value: product.specs.processor },
                { label: 'RAM', value: product.specs.ram },
                { label: 'SSD', value: product.specs.storage },
                { label: 'DISPLAY', value: product.specs.screen },
              ].map((spec, i) => (
                <motion.div
                  key={spec.label}
                  className="relative pl-2.5 space-y-0.5"
                  animate={{ x: hovered ? 0 : -3, opacity: hovered ? 1 : 0.85 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  {/* Animated left glow bar */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[2px] rounded-full"
                    animate={{ backgroundColor: hovered ? 'var(--color-brand-primary)' : '#00000018' }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="block font-heading text-[9px] tracking-[0.35em] text-black/35 uppercase">{spec.label}</span>
                  <span className="block font-body text-[10px] font-semibold text-brand-text uppercase tracking-tight truncate">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer: Price + Cart */}
          <div className="mt-auto pt-4 border-t-2 border-black/5 group-hover:border-[var(--color-brand-primary)]/20 transition-colors duration-300">
            <div className="flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex flex-col flex-shrink-0">
                <span className="font-heading text-[8px] tracking-[0.2em] text-black/30 uppercase">COST</span>
                <span className="font-body text-base font-black text-brand-text tracking-tight">₹{product.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-grow justify-end">
                <AnimatePresence mode="popLayout" initial={false}>
                  {currentQuantity > 0 ? (
                    <motion.div
                      key="qty-selector"
                      initial={{ opacity: 0, scale: 0.85, x: 8 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1"
                    >
                      <div className="flex border border-black/10 h-8 overflow-hidden">
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(cartItem!.id, currentQuantity - 1); }}
                          className="w-7 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-white border-r border-black/10 font-bold text-sm transition-colors">−</button>
                        <div className="w-7 flex items-center justify-center font-body text-[11px] font-bold">{currentQuantity}</div>
                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); updateQuantity(cartItem!.id, currentQuantity + 1); }}
                          className="w-7 flex items-center justify-center hover:bg-[var(--color-brand-primary)] hover:text-white border-l border-black/10 font-bold text-sm transition-colors">+</button>
                      </div>
                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeFromCart(cartItem!.id); }}
                        className="p-1.5 text-red-400 hover:text-red-600 hover:scale-110 transition-transform" title="Remove" aria-label="Remove from cart">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="add-btn"
                      type="button"
                      onClick={handleAdd}
                      whileTap={{ scale: 0.94 }}
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative h-8 px-4 overflow-hidden font-heading text-[9px] tracking-[0.15em] font-bold transition-all whitespace-nowrap min-w-[90px] border border-black text-black group/btn hover:border-[var(--color-brand-primary)]"
                    >
                      <span className="absolute inset-0 bg-[var(--color-brand-primary)] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out" />
                      <span className="relative group-hover/btn:text-white transition-colors duration-200">
                        {added ? '✓ ADDED' : 'ADD TO CART'}
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
