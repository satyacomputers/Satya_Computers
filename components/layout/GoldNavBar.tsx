'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X, LogOut, ChevronRight, Home, Box, Globe, Info, Phone } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import Portal from '@/components/ui/Portal';

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


      {/* Mobile Drawer using Portal */}
      <Portal>
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

              {/* Sidebar Shell: Optimized for 'Helium' Layout */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                className="relative ml-auto h-full w-full sm:w-[400px] bg-white flex flex-col shadow-[-10px_0_50px_rgba(0,0,0,0.5)]"
              >
                {/* Header Bar */}
                <div className="px-6 py-4 border-b border-black/5 flex items-center justify-between bg-white sticky top-0 z-20">
                  <button onClick={() => setMobileOpen(false)} className="p-2 -ml-2 text-black/40 hover:text-black">
                     <span className="font-heading text-xs tracking-widest font-bold uppercase">← Back</span>
                  </button>
                  <span className="font-heading text-lg tracking-[0.2em] text-black italic">
                    SATYA
                  </span>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-10 h-10 flex items-center justify-center bg-gray-50 text-black rounded-full border border-black/5 hover:bg-gray-100"
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Primary Nav Links */}
                <div className="flex-1 bg-white px-6 py-8 flex flex-col gap-1 overflow-y-auto">
                  {[
                    { label: 'Home', href: '/', icon: Home },
                    { label: 'Products', href: '/products', icon: Box },
                    { label: 'Solutions', href: '/solutions', icon: Globe },
                    { label: 'About', href: '/about', icon: Info },
                    { label: 'Contact', href: '/contact', icon: Phone },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="group"
                    >
                      <div className="flex items-center gap-5 py-4 px-4 hover:bg-gray-50 rounded-xl transition-all border-b border-black/[0.03]">
                        <div className={`p-2.5 rounded-xl border border-black/5 transition-all ${
                          pathname === item.href ? 'bg-[var(--color-brand-primary)] text-white shadow-lg shadow-[var(--color-brand-primary)]/20' : 'bg-gray-50 text-black/40 group-hover:bg-black group-hover:text-white'
                        }`}>
                           <item.icon size={20} />
                        </div>
                        <div className="flex-1 flex items-center justify-between">
                          <span className={`font-heading text-xl uppercase tracking-widest transition-all ${
                            pathname === item.href ? 'text-black font-black' : 'text-black/60 group-hover:text-black'
                          }`}>
                            {item.label}
                          </span>
                          <ChevronRight size={16} className="text-black/10 group-hover:text-black transition-all" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Account & Meta Links Footer */}
                <div className="p-8 border-t border-black/5 bg-gray-50/50 flex flex-col gap-8">
                  <div className="grid grid-cols-2 gap-3">
                     <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 bg-white border border-black/5 rounded-xl hover:border-black transition-all group shadow-sm">
                       <User size={18} className="text-black/30 group-hover:text-black" />
                       <span className="font-heading text-[11px] tracking-widest text-black/50 group-hover:text-black uppercase font-bold">Account</span>
                     </Link>
                     <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 p-4 bg-white border border-black/5 rounded-xl hover:border-black transition-all group shadow-sm">
                       <ShoppingCart size={18} className="text-black/30 group-hover:text-black" />
                       <span className="font-heading text-[11px] tracking-widest text-black/50 group-hover:text-black uppercase font-bold">Cart ({itemCount})</span>
                     </Link>
                  </div>
                  
                  <div className="flex flex-col gap-2 items-center text-center">
                    <div className="text-[9px] font-heading tracking-[0.4em] font-black text-black/20 uppercase">
                      SATYA COMPUTERS HYDERABAD
                    </div>
                    <div className="text-[8px] font-heading tracking-widest text-black/10 uppercase mb-2">
                       © 2026 PREMIUM BUSINESS COMPUTING
                    </div>
                    <div className="h-0.5 w-12 bg-black/5" />
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Portal>
    </>
  );
}
