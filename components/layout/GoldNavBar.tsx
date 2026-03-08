'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function GoldNavBar() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('satya_user');
    if (savedUser) setUser(savedUser);
  }, []);

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
              <Link href="/account" className="flex items-center gap-2 text-brand-text hover:text-[var(--color-brand-primary)] transition-colors" aria-label="User Profile">
                <User size={24} />
                {user && <span className="font-heading text-sm hidden sm:block mt-1 tracking-widest">{user}</span>}
              </Link>
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
          <div className="md:hidden fixed inset-0 z-[1000]">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[280px] bg-white shadow-2xl flex flex-col z-[1001]"
            >
              <div className="p-6 border-b border-black/10 flex items-center justify-between">
                <span className="font-heading text-xl tracking-widest text-brand-text">
                  SATYA<span className="text-[var(--color-brand-primary)]">MENU</span>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-10 h-10 flex items-center justify-center border-2 border-black/10 rounded-full text-black bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8 flex flex-col gap-2 overflow-y-auto">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-heading text-2xl py-3 border-b border-black/5 tracking-widest ${
                      pathname === item.href ? 'text-[var(--color-brand-primary)]' : 'text-brand-text'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-black/10 flex gap-4 mt-auto bg-gray-50/50">
                <Link href="/account" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-body text-sm text-brand-text/60 hover:text-brand-text transition-colors">
                  <User size={18} /> Account
                </Link>
                <Link href="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 font-body text-sm text-brand-text/60 hover:text-brand-text transition-colors">
                  <ShoppingCart size={18} /> Cart ({itemCount})
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
