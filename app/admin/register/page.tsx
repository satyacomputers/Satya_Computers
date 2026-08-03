'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Shield, User, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminRegister() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role, inviteCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Identity provision failed.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background FX */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#F97316]/5 blur-[120px] rounded-full" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full relative z-10"
      >
        <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[3rem] p-12 shadow-2xl">
          
          <div className="flex justify-between items-start mb-12">
            <div>
               <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white">
                     <Shield size={24} />
                  </div>
                  <span className="text-gray-500 text-xs font-black uppercase tracking-[0.3em]">Administrator Identity Portal</span>
               </div>
               <h1 className="text-4xl font-heading font-black text-white leading-none uppercase tracking-tighter">
                  PROVISION <span className="text-[#F97316]">NEW</span> PROFILE
               </h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3"
                >
                  <AlertCircle size={18} /> {error}
                </motion.div>
              )}
              {success && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-2xl text-xs font-bold flex items-center gap-3"
                >
                  <CheckCircle2 size={18} /> Profile provisioned successfully. Routing to secure access...
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity UID</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#F97316] transition-colors" size={18} />
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white/[0.04] border border-white/5 text-white outline-none focus:border-[#F97316]/50 focus:bg-white/[0.08] transition-all font-bold"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Access Token</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#F97316] transition-colors" size={18} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white/[0.04] border border-white/5 text-white outline-none focus:border-[#F97316]/50 focus:bg-white/[0.08] transition-all font-bold"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Administrative Invite Code</label>
              <div className="relative group">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#F97316] transition-colors" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Enter Provisioning Code"
                  className="w-full pl-12 pr-4 py-4 rounded-[1.5rem] bg-white/[0.04] border border-white/5 text-white outline-none focus:border-[#F97316]/50 focus:bg-white/[0.08] transition-all font-extrabold tracking-widest"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Security Permission Matrix</label>
              <div className="grid grid-cols-3 gap-3">
                {['admin', 'management', 'editor'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-3 rounded-2xl border transition-all text-[10px] font-black uppercase tracking-widest ${
                      role === r 
                        ? 'bg-[#F97316] border-[#F97316] text-white shadow-lg shadow-orange-900/20 scale-[1.02]' 
                        : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-heading font-black py-5 rounded-[1.5rem] transition-all shadow-xl shadow-orange-900/30 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-xl uppercase tracking-tighter"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>PROVISION ACCOUNT <UserPlus size={22} /></>}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6">
            <Link href="/admin/login" className="text-sm font-bold text-gray-500 hover:text-[#F97316] transition-colors flex items-center gap-2 group">
              Return to Core Security Access <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
