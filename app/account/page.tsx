'use client';

import { useState, useEffect } from 'react';
import GrainOverlay from '@/components/ui/GrainOverlay';
import BrutalButton from '@/components/ui/BrutalButton';
import Link from 'next/link';
import { Package, User, LogOut, ChevronRight, Settings, ShoppingBag } from 'lucide-react';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<{ name: string, email: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedName = localStorage.getItem('satya_user');
    const savedEmail = localStorage.getItem('satya_user_email');
    if (savedName && savedEmail) {
      setUser({ name: savedName, email: savedEmail });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.removeItem('satya_user');
    localStorage.removeItem('satya_user_email');
    setUser(null);
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setIsSubmitting(false);
      localStorage.setItem('satya_user', data.name.toUpperCase());
      localStorage.setItem('satya_user_email', data.email);
      
      alert(isLogin ? "Successfully logged in!" : "Account created successfully!");
      
      // Force reload to update navigation bar state
      window.location.href = '/account';
    } catch (error: any) {
      alert(error.message);
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (user) {
    return (
      <main className="min-h-screen bg-brand-bg relative pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <GrainOverlay opacity={30} />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-4 border-black pb-8">
            <div>
              <p className="font-heading text-xs tracking-[0.3em] text-[var(--color-brand-primary)] uppercase mb-2">Authenticated System Access</p>
              <h1 className="font-heading text-5xl text-brand-text tracking-tighter uppercase leading-none">
                WELCOME, <span className="text-[var(--color-brand-primary)]">{user.name}</span>
              </h1>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 font-heading text-xs tracking-widest text-black/40 hover:text-red-500 transition-colors uppercase border-2 border-black/5 px-4 py-2 bg-white"
            >
              <LogOut size={14} /> Terminate Session
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Action Cards */}
            <div className="md:col-span-2 space-y-6">
              <Link href="/my-orders" className="group">
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[var(--color-brand-primary)] flex items-center justify-center text-white border-2 border-black">
                      <ShoppingBag size={32} />
                    </div>
                    <div>
                      <h3 className="font-heading text-2xl text-brand-text uppercase tracking-tight">MY ORDERS & STATUS</h3>
                      <p className="font-body text-xs text-brand-text/50 uppercase tracking-widest mt-1">Check deployment logs & tracking</p>
                    </div>
                  </div>
                  <ChevronRight size={24} className="text-black/20 group-hover:text-black transition-colors" />
                </div>
              </Link>

              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0_rgba(0,0,0,1)] flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-black flex items-center justify-center text-white border-2 border-black">
                    <Settings size={32} />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-brand-text uppercase tracking-tight">PROFILE SETTINGS</h3>
                    <p className="font-body text-xs text-brand-text/50 uppercase tracking-widest mt-1">Modify registry credentials</p>
                  </div>
                </div>
                <span className="font-heading text-[10px] tracking-[0.2em] bg-black text-white px-3 py-1">LOCKED</span>
              </div>
            </div>

            {/* Profile Info */}
            <div className="bg-[#FAF9F6] border-4 border-black p-8 shadow-[8px_8px_0_rgba(241,90,36,0.1)] h-fit">
              <h4 className="font-heading text-lg text-brand-text uppercase tracking-widest mb-6 border-b-2 border-black/5 pb-2">Registrant Data</h4>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-heading tracking-[0.2em] text-black/40 uppercase mb-1">Identity</label>
                  <p className="font-body text-sm font-bold text-black uppercase">{user.name}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-[0.2em] text-black/40 uppercase mb-1">Electronic Mail</label>
                  <p className="font-body text-sm font-bold text-black">{user.email}</p>
                </div>
                <div>
                  <label className="block text-[10px] font-heading tracking-[0.2em] text-black/40 uppercase mb-1">Account Tier</label>
                  <div className="inline-block bg-[var(--color-brand-primary)] text-white text-[10px] font-heading tracking-[0.2em] px-2 py-0.5 mt-1">PREMIUM CLIENT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg relative pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
      <GrainOverlay opacity={30} />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-heading text-4xl text-brand-text mb-2 tracking-tighter uppercase">
            {isLogin ? 'SYSTEM ' : 'NEW '}
            <span className="text-[var(--color-brand-primary)]">{isLogin ? 'ACCESS' : 'REGISTRY'}</span>
          </h1>
          <div className="w-16 border-t-2 border-[var(--color-brand-primary)] mx-auto"></div>
        </div>
        
        <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0_rgba(0,0,0,1)]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs font-heading tracking-[0.2em] text-black/60 mb-2 uppercase font-bold">FULL NAME</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-[#F5F5F5] border-2 border-black/10 text-black px-4 py-3 focus:outline-none focus:border-black transition-colors font-body"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-heading tracking-[0.2em] text-black/60 mb-2 uppercase font-bold">EMAIL ADDRESS</label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-[#F5F5F5] border-2 border-black/10 text-black px-4 py-3 focus:outline-none focus:border-black transition-colors font-body"
                placeholder="developer@satya.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs font-heading tracking-[0.2em] text-black/60 mb-2 uppercase font-bold">PASSWORD</label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-[#F5F5F5] border-2 border-black/10 text-black px-4 py-3 focus:outline-none focus:border-black transition-colors font-body"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-heading tracking-[0.2em] text-black/60 mb-2 uppercase font-bold">CONFIRM PASSWORD</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-[#F5F5F5] border-2 border-black/10 text-black px-4 py-3 focus:outline-none focus:border-black transition-colors font-body"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 accent-black border-black cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-body text-black/60 cursor-pointer">
                  Remember me
                </label>
              </div>

              {isLogin && (
                <div className="text-sm">
                  <button type="button" className="font-heading text-xs tracking-wider text-[var(--color-brand-primary)] hover:underline">
                    FORGOT?
                  </button>
                </div>
              )}
            </div>

            <BrutalButton type="submit" disabled={isSubmitting} className="w-full !h-14 text-xl">
              {isSubmitting ? 'PROCESSING...' : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')}
            </BrutalButton>
          </form>
          
          <div className="mt-8 text-center pt-8 border-t-2 border-black/5">
            <p className="text-sm font-body text-black/40">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                }}
                className="font-bold text-black hover:text-[var(--color-brand-primary)] transition-colors underline underline-offset-4"
              >
                {isLogin ? 'Register here' : 'Sign in here'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


