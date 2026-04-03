'use client';

import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function AnnouncementBar() {
  const { items, expiresAt } = useCart();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    if (!expiresAt) return;
    const update = () => {
       const ms = expiresAt - Date.now();
       if (ms <= 0) { setTimeLeft('00:00'); return; }
       const m = Math.floor(ms / 60000);
       const s = Math.floor((ms % 60000) / 1000);
       setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const int = setInterval(update, 1000);
    return () => clearInterval(int);
  }, [expiresAt]);

  if (items.length > 0 && expiresAt && timeLeft) {
    return (
      <div className="w-full bg-[#1A1A1A] border-b-2 border-[#F15A24] text-[#F15A24] px-4 py-2 flex justify-center items-center z-50 relative font-mono text-xs font-black uppercase tracking-[0.2em] shadow-[0_5px_15px_rgba(241,90,36,0.2)]">
        <Clock size={14} className="mr-3 animate-pulse" />
        Hardware locked for {timeLeft} — Complete checkout to guarantee inventory
      </div>
    );
  }

  return (
    <div className="w-full bg-[var(--color-brand-accent)] text-white px-4 py-2 flex justify-center items-center z-50 relative">
      <p className="font-heading tracking-widest text-sm md:text-base">
        PREMIUM BUSINESS WORKSTATIONS NOW IN STOCK — <Link href="/products" className="underline font-bold ml-2 text-[var(--color-brand-primary)] hover:opacity-80 transition-opacity">SHOP NOW</Link>
      </p>
    </div>
  );
}
