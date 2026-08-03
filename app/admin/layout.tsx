'use client';

import Sidebar from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, Activity, Lock, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasNotifications, setHasNotifications] = useState(true);
  const isLoginPage = pathname === '/admin/login' || pathname === '/admin/register';

  if (isLoginPage) {
    return <div className="min-h-screen bg-[#0A1628]">{children}</div>;
  }

  // Client-side Guard
  if (status === 'unauthenticated') {
     router.push('/admin/login?callbackUrl=' + pathname);
     return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F4F7FE] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Activity size={40} className="text-[#F97316] animate-spin" />
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hydrating Session Matrix...</p>
        </div>
      </div>
    );
  }

  const pageTitle = pathname.split('/').pop() || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex relative">
      {/* Sidebar with mobile toggle state */}
      <div className={`fixed inset-0 bg-black/50 z-[45] lg:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 z-[50] w-64 transform lg:translate-x-0 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <Sidebar />
      </div>
      
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen transition-all duration-300">
        {/* Elite Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              title="Toggle Menu"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-100 text-[#0A1628]"
            >
              <Activity size={20} />
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5">Inventory Management</span>
              <h1 className="text-xl font-heading font-bold text-[#0A1628] uppercase tracking-tight capitalize">
                {pageTitle === 'admin' ? 'Overview' : pageTitle}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Search Bar - Aesthetic */}
            <div className="hidden md:flex items-center gap-2 bg-gray-100/50 border border-gray-200 rounded-xl px-4 py-2 w-64 group focus-within:border-[#F97316] transition-all">
              <Search size={16} className="text-gray-400 group-focus-within:text-[#F97316]" />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="bg-transparent border-none outline-none text-sm w-full font-medium"
                suppressHydrationWarning
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    const input = e.currentTarget as HTMLInputElement;
                    const originalPlaceholder = input.placeholder;
                    input.placeholder = 'INITIALIZING SEARCH...';
                    input.disabled = true;
                    await new Promise(r => setTimeout(r, 1000));
                    input.placeholder = originalPlaceholder;
                    input.disabled = false;
                    input.focus();
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
              <button 
                title="View Notifications"
                onClick={async () => {
                   const btn = document.activeElement as HTMLElement;
                   btn.style.opacity = '0.5';
                   await new Promise(r => setTimeout(r, 1000));
                   setHasNotifications(false);
                   btn.style.opacity = '1';
                }}
                className="p-2.5 rounded-xl text-gray-400 hover:text-[#F97316] hover:bg-orange-50 transition-all relative"
                suppressHydrationWarning
              >
                <Bell size={20} />
                {hasNotifications && <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white animate-pulse" />}
              </button>
              
              <div className="relative group/profile">
                <div 
                  className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0A1628] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-navy-200">
                    <User size={18} />
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-bold text-[#0A1628] leading-none mb-1 uppercase tracking-tighter">System Admin</p>
                    <p className="text-[10px] font-bold text-[#F97316]">Active Now</p>
                  </div>
                </div>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all transform origin-top-right scale-95 group-hover/profile:scale-100 z-50">
                   <div className="px-5 py-2 border-b border-gray-50 mb-2">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Authentication Matrix</p>
                   </div>
                   <button 
                     onClick={() => router.push('/admin/settings')}
                     className="w-full flex items-center gap-4 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 hover:text-[#0A1628] transition-colors"
                   >
                      <Activity size={16} /> 
                      Security Log
                   </button>
                   <button 
                     onClick={async () => {
                       const { signOut } = await import('next-auth/react');
                       signOut({ callbackUrl: '/admin/login' });
                     }}
                     className="w-full flex items-center gap-4 px-5 py-3 text-[11px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors"
                   >
                      <Lock size={16} /> 
                      Terminate Session
                   </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with Page Transitions */}
        <div className="p-6 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer info */}
        <footer className="mt-auto p-8 text-center">
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">
              Satya Computers Administrative Protocol v2.4.0
            </p>
        </footer>
      </main>
    </div>
  );
}
