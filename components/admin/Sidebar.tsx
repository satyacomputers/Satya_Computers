'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  Laptop, 
  Tag, 
  Package, 
  Users, 
  Megaphone, 
  LineChart, 
  Settings,
  LogOut,
  ChevronRight,
  Shield,
  User,
  Globe,
  ShoppingCart,
  CreditCard
} from 'lucide-react';

const navItems = [
  { id: 1, label: 'Overview', icon: LayoutDashboard, route: '/admin' },
  { id: 12, label: 'UPI Tracking', icon: CreditCard, route: '/admin/payments/upi' },
  { id: 2, label: 'Inventory', icon: Laptop, route: '/admin/products' },
  { id: 4, label: 'Promotions', icon: Tag, route: '/admin/offers' },
  { id: 5, label: 'B2B Quotes', icon: Package, route: '/admin/orders' },
  { id: 11, label: 'B2C Orders', icon: ShoppingCart, route: '/admin/customer-orders' },
  { id: 6, label: 'Directory', icon: Users, route: '/admin/clients' },
  { id: 10, label: 'Team', icon: User, route: '/admin/team' },
  { id: 7, label: 'Broadcast', icon: Megaphone, route: '/admin/announcements' },
  { id: 8, label: 'Analytics', icon: LineChart, route: '/admin/analytics' },
  { id: 9, label: 'Settings', icon: Settings, route: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside className="w-64 h-screen bg-[#0A1628] flex flex-col z-50 shadow-2xl border-r border-white/5 overflow-hidden">
      {/* Dynamic Branding Header */}
      <div className="relative p-8 overflow-hidden group">
        <Link href="/" className="relative z-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#F97316] flex items-center justify-center text-white shadow-lg shadow-orange-900/20 mb-4 group-hover:scale-110 transition-transform duration-500">
             <Shield size={28} />
          </div>
          <span className="text-white font-heading text-xl font-bold tracking-[0.3em]">SATYA</span>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mt-1">Control Matrix</span>
        </Link>
        
        {/* Aesthetic background glow */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#F97316]/10 rounded-full blur-[60px]" />
      </div>

      {/* Modern Navigation */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar pt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.route;
          return (
            <Link
              key={item.id}
              href={item.route}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-[#F97316] text-white shadow-lg shadow-orange-600/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <item.icon size={19} className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#F97316] transition-colors'} />
                <span className="font-heading text-[13px] font-bold tracking-wide uppercase">{item.label}</span>
              </div>
              {isActive ? (
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ) : (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Critical Actions */}
      <div className="p-6 space-y-3">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-300 font-heading text-xs font-bold tracking-widest border border-white/5 hover:border-white/20"
        >
          <Globe size={18} />
          <span>WEBSITE HOME</span>
        </Link>
        <button
          title="Logout"
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="flex items-center gap-3 px-5 py-4 w-full rounded-2xl bg-white/5 text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 font-heading text-xs font-bold tracking-widest border border-white/5 hover:border-red-500/20"
        >
          <LogOut size={18} />
          <span>TERMINATE SESSION</span>
        </button>
      </div>
    </aside>
  );
}
