'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';
import BrutalButton from '@/components/ui/BrutalButton';
import GrainOverlay from '@/components/ui/GrainOverlay';

import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, cartOriginalTotal, cartDiscount } = useCart();

  return (
    <main className="min-h-screen bg-brand-bg relative pb-24">
      <GrainOverlay opacity={30} />
      
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-b border-white/10">

        <h1 className="font-heading text-6xl md:text-8xl text-brand-text tracking-tight mb-4">
          YOUR <span className="text-[var(--color-gold)]">CART</span>
        </h1>
        <p className="font-body text-xl text-brand-text/70 max-w-2xl">
          Review your selected premium hardware before checkout.
        </p>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-12">
        
        {/* Cart Items */}
        <div className="w-full lg:w-2/3">
          {items.length === 0 ? (
            <div className="bg-white border border-black/10 p-12 text-center">
              <h3 className="font-heading text-3xl text-brand-text mb-4">YOUR CART IS EMPTY</h3>
              <p className="font-body text-brand-text/60 mb-8">Browse our products to find something you love.</p>
              <Link href="/products">
                <BrutalButton>BROWSE PRODUCTS</BrutalButton>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white border border-black/10 p-6 flex flex-col md:flex-row gap-6 items-center">
                  <div className="relative w-32 h-32 bg-brand-bg/50 mix-blend-luminosity hover:mix-blend-normal transition-all">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h4 className="font-heading text-2xl text-[var(--color-gold)] mb-2">{item.name}</h4>
                    <p className="font-body text-xl text-brand-text mb-4">₹{item.price.toLocaleString('en-IN')}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4">
                      <div className="flex border border-black/20">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-brand-text hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"
                        >-</button>
                        <span className="px-4 py-1 border-x border-black/20 font-body">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-brand-text hover:bg-[var(--color-brand-primary)] hover:text-white transition-colors"
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500/70 hover:text-red-500 transition-colors p-2"
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-right hidden md:block">
                    <p className="font-heading text-sm text-[var(--color-gold)] mb-1">TOTAL</p>
                    <p className="font-body text-2xl text-brand-text">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-1/3">
          <div className="sticky top-28 bg-white border border-black/10 p-8">
            <h3 className="font-heading text-3xl mb-8 tracking-widest text-brand-text border-b border-black/10 pb-4">SUMMARY</h3>
            
            <div className="space-y-4 font-body text-brand-text/80 mb-8 border-b border-black/10 pb-8">
              <div className="flex justify-between">
                <span>Subtotal (MRP)</span>
                <span className="line-through opacity-70">₹{cartOriginalTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[#F97316] font-bold">
                <span>Discount</span>
                <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end mb-8">
              <span className="font-heading text-xl text-[var(--color-brand-primary)] tracking-widest">ESTIMATED TOTAL</span>
              <span className="font-body text-4xl text-brand-text">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>

            <Link href={items.length > 0 ? "/checkout" : "#"}>
              <BrutalButton 
                className={`w-full ${items.length === 0 ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
              >
                PROCEED TO CHECKOUT
              </BrutalButton>
            </Link>

            <div className="mt-8 pt-8 border-t border-black/10 text-center font-body text-sm text-brand-text/50">
              <p>Secure Payments • Free Shipping over ₹999</p>
            </div>
          </div>
        </div>

      </section>
    </main>
  );
}
