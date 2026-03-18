'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X, LogOut, ChevronRight } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function GoldNavBar() {
  const { itemCount } = useCart();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('satya_user');
    if (savedUser) setUser(savedUser);
  }, []);

  const handleLogout = async () => {
    if (session) {
      await signOut({ redirect: true, callbackUrl: '/' });
    }
    localStorage.removeItem('satya_user');
    setUser(null);
    window.location.reload();
  };

  // Close drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const displayName = session?.user?.name || user;

  return (
    <>
      <nav className="w-full bg-transparent relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-3 group">
                <img
                  src="/satya_computers_logo.png"
                  alt="Satya Computers"
                  className="h-14 w-auto transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-heading text-3xl text-brand-text tracking-widest hidden sm:block group-hover:text-[var(--color-brand-primary)] transition-colors">
                  SATYA<span className="text-[var(--color-brand-primary)]">COMPUTERS</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="font-heading text-xl text-brand-text hover:text-[var(--color-brand-primary)] relative group overflow-hidden"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-[var(--color-brand-accent)] transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300"></span>
                </Link>
              ))}
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-5">
              <div className="flex items-center gap-3">
                <Link href="/account" className="flex items-center gap-2 text-brand-text hover:text-[var(--color-brand-primary)] transition-colors" aria-label="User Profile">
                  <User size={24} />
                  {displayName && <span className="font-heading text-sm hidden sm:block mt-1 tracking-widest">{displayName}</span>}
                </Link>
                {displayName && (
                  <button 
                    onClick={handleLogout}
                    className="text-brand-text hover:text-red-500 transition-colors p-1"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                )}
              </div>
              <Link href="/cart" className="relative text-brand-text hover:text-[var(--color-brand-primary)] transition-colors" aria-label="Shopping Cart">
                <ShoppingCart size={24} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-brand-primary)] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden text-brand-text hover:text-[var(--color-brand-primary)] transition-colors p-1"
                aria-label={mobileOpen ? 'Close Menu' : 'Open Menu'}
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </nav>


      {/* Mobile Drawer */}
      <AnimatePresence>
        {mounted && mobileOpen && (
          <div className="fixed inset-0 z-[99999] md:hidden flex overflow-hidden">
            {/* Backdrop: Solid black with subtle blur to mask the page completely */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-lg"
            />

            {/* Sidebar Shell: Ensures Opaque background */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="relative ml-auto h-full w-full sm:w-[400px] bg-white flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.5)] border-l border-black/5"
            >
              <div className="p-8 border-b border-black/5 flex items-center justify-between bg-white z-10">
                <span className="font-heading text-2xl tracking-[0.2em] text-black italic">
                  SATYA<span className="text-[var(--color-brand-primary)]">MENU</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-12 h-12 flex items-center justify-center border-2 border-[var(--color-brand-primary)]/20 rounded-full text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 bg-white px-8 py-12 flex flex-col gap-6 overflow-y-auto">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="group"
                  >
                    <div className="flex items-baseline justify-between py-2 border-b border-black/5">
                      <span className={`font-heading text-5xl uppercase tracking-tighter transition-all ${
                        pathname === item.href ? 'text-[var(--color-brand-primary)]' : 'text-black group-hover:text-[var(--color-brand-primary)]'
                      }`}>
                        {item.label}
                      </span>
                      <ChevronRight size={20} className="text-black/10 group-hover:text-[var(--color-brand-primary)] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="p-10 border-t border-black/5 flex flex-col gap-8 bg-gray-50/80 mt-auto">
                <div className="grid grid-cols-2 gap-4">
                   <Link href="/account" onClick={() => setMobileOpen(false)} className="flex flex-col gap-2 p-4 bg-white border border-black/5 hover:border-[var(--color-brand-primary)] transition-all group">
                     <User size={18} className="text-black/40 group-hover:text-[var(--color-brand-primary)]" />
                     <span className="font-heading text-[10px] tracking-widest text-black/60 uppercase font-black">Account</span>
                   </Link>
                   <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex flex-col gap-2 p-4 bg-white border border-black/5 hover:border-[var(--color-brand-primary)] transition-all group">
                     <ShoppingCart size={18} className="text-black/40 group-hover:text-[var(--color-brand-primary)]" />
                     <span className="font-heading text-[10px] tracking-widest text-black/60 uppercase font-black">Cart ({itemCount})</span>
                   </Link>
                </div>
                
                <div className="flex flex-col gap-1 items-center">
                  <div className="text-[9px] font-heading tracking-[0.4em] font-black text-black/20 uppercase">
                    HYDERABAD EST. 2014
                  </div>
                  <div className="h-0.5 w-12 bg-[var(--color-brand-primary)]/10" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
