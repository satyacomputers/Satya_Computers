'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function HotlineInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [productName, setProductName] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    // Try to get product name from page title or meta
    if (pathname?.startsWith('/products/') && pathname.split('/').length > 2) {
      setTimeout(() => {
        const h1 = document.querySelector('h1');
        if (h1) setProductName(h1.textContent?.slice(0, 60) || null);
      }, 800);
    } else {
      setProductName(null);
    }
  }, [pathname]);

  if (!mounted) return null;
  // Don't show on admin pages
  if (pathname?.startsWith('/admin')) return null;

  const getContextMessage = () => {
    const orderId = searchParams?.get('id');

    if (pathname?.startsWith('/products/') && productName) {
      return `Hi, I'm interested in *${productName}* on your website. Can you help me with more details?`;
    }
    if (pathname === '/checkout') {
      return `Hi, I need help completing my order on the checkout page. Can you assist me?`;
    }
    if (pathname === '/cart') {
      return `Hi, I have some questions about my cart. Can you help me?`;
    }
    if (pathname?.startsWith('/order-status') && orderId) {
      return `Hi, I need help with my order *${orderId}*. Can you provide an update?`;
    }
    if (pathname === '/warranty') {
      return `Hi, I need to raise a warranty/service request. Can you help me?`;
    }
    return `Hi, I need help on the Satya Computers website. Can you assist me?`;
  };

  const whatsappUrl = `https://wa.me/919640272323?text=${encodeURIComponent(getContextMessage())}`;

  const quickActions = [
    { label: '📦 Track My Order', msg: 'Hi, I want to track my recent order. My order ID is:' },
    { label: '💻 Bulk Inquiry', msg: 'Hi, I want to inquire about bulk laptop pricing for my company.' },
    { label: '🔧 Service Request', msg: 'Hi, I have a warranty/service request for my product.' },
    { label: '💰 Get Best Price', msg: 'Hi, can I get the best price for a laptop from Satya Computers?' },
  ];

  return (
    <div className="fixed bottom-8 left-6 z-[9998] flex flex-col items-start gap-3 pointer-events-none">
      {/* Quick Action Panel */}
      {open && (
        <div className="pointer-events-auto w-72 bg-white border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#0A1628] text-white p-4 flex items-center justify-between">
            <div>
              <p className="font-heading text-sm tracking-widest uppercase">Customer Support</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="font-body text-[10px] text-white/50 uppercase tracking-widest">Available Now</span>
              </div>
            </div>
            <button 
              onClick={() => setOpen(false)} 
              title="Close Hotline Panel"
              className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>

          {/* Context smart message */}
          <div className="p-4 bg-emerald-50 border-b-2 border-emerald-100">
            <p className="font-body text-[10px] text-emerald-700 uppercase tracking-widest font-bold mb-1">🧠 Smart Context</p>
            <p className="font-body text-xs text-emerald-800 leading-relaxed">{getContextMessage()}</p>
          </div>

          {/* Quick Actions */}
          <div className="p-4 space-y-2">
            <p className="font-heading text-[10px] text-black/30 uppercase tracking-widest mb-3">Quick Topics</p>
            {quickActions.map((action) => (
              <a
                key={action.label}
                href={`https://wa.me/919640272323?text=${encodeURIComponent(action.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-left px-3 py-2 border-2 border-black/5 font-body text-xs text-brand-text hover:border-[var(--color-brand-primary)] hover:bg-orange-50 transition-all flex items-center gap-2"
              >
                {action.label}
              </a>
            ))}
          </div>

          {/* Primary CTA */}
          <div className="p-4 pt-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-[var(--color-brand-primary)] text-white font-heading text-xs tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-orange-600 transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              OPEN IN WHATSAPP
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        title="Talk to Customer Support"
        className="pointer-events-auto w-14 h-14 bg-[var(--color-brand-primary)] border-4 border-black text-white shadow-[4px_4px_0_rgba(0,0,0,1)] flex items-center justify-center hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all duration-150 relative"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
        )}
        {/* Notification dot when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </span>
        )}
      </button>
    </div>
  );
}

export default function EngineerHotline() {
  return (
    <Suspense fallback={null}>
      <HotlineInner />
    </Suspense>
  );
}
