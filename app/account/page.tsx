'use client';

import { useState } from 'react';
import GrainOverlay from '@/components/ui/GrainOverlay';
import BrutalButton from '@/components/ui/BrutalButton';

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    // Simulate network request
    setTimeout(() => {
      setIsSubmitting(false);
      if (isLogin) {
        localStorage.setItem('satya_user', formData.email.split('@')[0].toUpperCase());
        alert("Successfully logged in!");
      } else {
        localStorage.setItem('satya_user', formData.name.toUpperCase());
        alert("Account created successfully!");
      }
      // Force reload to update navigation bar state
      window.location.href = '/';
    }, 1500);
  };

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

