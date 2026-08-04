'use client';

import { useState, useEffect } from 'react';
import {
  Users, Calendar, RefreshCw, CheckCircle, Clock, PhoneCall,
  MapPin, PhoneOff, XCircle, ShoppingBag, Lock, ArrowRight,
  PackageCheck, CheckCircle2, KeyRound, X, Check, LogOut, Settings,
  Activity, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── helpers ─────────────────────────────────────────────────────────────────
const getToday = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const getYesterday = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};
const fmt = (iso: string) => {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
};

// ─── Change-password modal ────────────────────────────────────────────────────
function ChangePasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(''); setErr('');
    if (next.length < 6) { setErr('New password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'change_password', currentPassword: current, newPassword: next }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setMsg(json.message || 'Password updated!');
        setTimeout(onClose, 1600);
      } else {
        setErr(json.error || 'Failed to update password.');
      }
    } catch {
      setErr('Connection error — try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0A1628]/80 z-[9999] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 w-full max-w-sm relative shadow-2xl border border-gray-100">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-[#0A1628] transition-colors">
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-orange-50 border border-orange-100 text-[#F97316] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">
            <KeyRound size={28} />
          </div>
          <p className="text-[10px] font-black tracking-widest text-[#F97316] uppercase">Dashboard Security</p>
          <h2 className="text-2xl font-heading font-black text-[#0A1628] uppercase mt-1">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password" placeholder="Current password" value={current}
            onChange={e => setCurrent(e.target.value)} required
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#F97316] transition-colors w-full"
          />
          <input
            type="password" placeholder="New password (min 6 chars)" value={next}
            onChange={e => setNext(e.target.value)} required
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-[#F97316] transition-colors w-full"
          />

          {err && <div className="bg-red-50 text-red-500 border border-red-100 rounded-xl px-4 py-3 text-xs font-bold text-center">{err}</div>}
          {msg && <div className="bg-green-50 text-green-600 border border-green-100 rounded-xl px-4 py-3 text-xs font-bold text-center">{msg}</div>}

          <button type="submit" disabled={loading} className="mt-2 w-full bg-[#0A1628] hover:bg-[#F97316] text-white font-heading font-bold text-sm uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-navy-200/50">
            {loading ? 'Saving…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Lead metric card (Mobile Colorful Style) ──────────────────────────────────
function LeadCard({ title, total, Ramya, Sandeep, Kishore, gradient }: any) {
  return (
    <div className={`relative overflow-hidden group rounded-[2rem] p-6 text-white shadow-xl w-full bg-gradient-to-br ${gradient}`}>
      <div className="absolute top-0 right-0 p-4 opacity-20">
         <Activity size={48} />
      </div>
      <div className="flex items-center gap-3 mb-2">
         <div className="w-2.5 h-2.5 rounded-full bg-white/50" />
         <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">{title}</p>
      </div>
      <h3 className="text-5xl font-heading font-black leading-none mb-6 text-white drop-shadow-md">{total ?? 0}</h3>
      <div className="flex gap-4 border-t border-white/20 pt-4 justify-between px-2">
        {[['RAMYA', Ramya], ['SANDEEP', Sandeep], ['KISHORE', Kishore]].map(([label, val]) => (
          <div key={label as string} className="text-center">
            <p className="text-[9px] font-black text-white/60 tracking-widest uppercase mb-1">{label}</p>
            <p className="text-lg font-bold text-white drop-shadow-sm">{val ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── COD Summary Card (Mobile Colorful Style) ─────────────────────────────────
function CodCard({ title, total, Ramya, Sandeep, Kishore, gradient }: any) {
  return (
    <div className={`relative overflow-hidden group rounded-[2rem] p-6 text-white shadow-xl w-full bg-gradient-to-br ${gradient}`}>
      <div className="absolute top-0 right-0 p-4 opacity-20">
         <PackageCheck size={48} />
      </div>
      <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-white/50 animate-pulse"/> COD METRIC
      </p>
      <h3 className="text-sm font-bold text-white/90 mb-4">{title}</h3>
      <div className="text-6xl font-heading font-black leading-none mb-6 drop-shadow-md">{total ?? 0}</div>
      <div className="flex gap-4 border-t border-white/20 pt-4 justify-between px-2">
        {[['RAMYA', Ramya], ['SANDEEP', Sandeep], ['KISHORE', Kishore]].map(([label, val]) => (
          <div key={label as string} className="text-center">
            <p className="text-[9px] font-black text-white/60 tracking-widest uppercase mb-1">{label}</p>
            <p className="text-lg font-bold text-white drop-shadow-sm">{val ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Date Range Bar (Mobile View) ──────────────────────────────────────────────
function DateRangeBar({ label, from, to, onFrom, onTo, preset, onPreset }: any) {
  return (
    <div className="flex flex-col md:flex-row gap-3 w-full bg-white p-3 md:p-4 rounded-[2rem] shadow-sm border border-gray-100 items-center justify-between">
      <div className="flex items-center justify-center gap-2 text-[10px] font-black text-white uppercase tracking-[0.2em] w-full md:w-auto bg-[#0A1628] py-2.5 px-5 rounded-2xl shadow-md whitespace-nowrap">
        <Calendar size={14} className="text-[#F97316]" /> {label}
      </div>
      <div className="flex items-center gap-2 flex-1 w-full max-w-lg">
        <div className="flex flex-col flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 transition-colors hover:border-[#0A1628]/30">
          <span className="text-[9px] font-bold text-gray-400 pl-1">FROM</span>
          <input
            type="date" value={from} onChange={e => { onFrom(e.target.value); onPreset('CUSTOM'); }}
            className="bg-transparent border-none outline-none text-xs font-bold text-[#0A1628] cursor-pointer w-full"
          />
        </div>
        <div className="flex flex-col flex-1 bg-gray-50 border border-gray-200 rounded-xl p-2 transition-colors hover:border-[#0A1628]/30">
          <span className="text-[9px] font-bold text-gray-400 pl-1">TO</span>
          <input
            type="date" value={to} onChange={e => { onTo(e.target.value); onPreset('CUSTOM'); }}
            className="bg-transparent border-none outline-none text-xs font-bold text-[#0A1628] cursor-pointer w-full"
          />
        </div>
      </div>
      <div className="flex gap-2 w-full md:w-auto mt-1 md:mt-0">
        {['TODAY', 'YESTERDAY'].map(p => (
          <button key={p} onClick={() => onPreset(p)} className={`flex-1 md:px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all ${preset === p ? 'bg-[#F97316] text-white shadow-lg shadow-orange-500/30' : 'bg-gray-50 border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-[#0A1628]'}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [password, setPassword] = useState('');
  const [isAuth, setIsAuth] = useState(false);
  const [authErr, setAuthErr] = useState('');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const [fromLead, setFromLead] = useState(getToday);
  const [toLead,   setToLead]   = useState(getToday);
  const [leadPreset, setLeadPreset] = useState('TODAY');

  const [fromCod, setFromCod] = useState(getToday);
  const [toCod,   setToCod]   = useState(getToday);
  const [codPreset, setCodPreset] = useState('TODAY');

  const [codSearch,  setCodSearch]  = useState('');
  const [codStatus,  setCodStatus]  = useState('ALL');
  const [showCPModal, setShowCPModal] = useState(false);

  // ── date preset handler
  const applyLeadPreset = (p: string) => {
    setLeadPreset(p);
    if (p === 'TODAY')     { const t = getToday();     setFromLead(t); setToLead(t); }
    if (p === 'YESTERDAY') { const y = getYesterday(); setFromLead(y); setToLead(y); }
  };
  const applyCodPreset = (p: string) => {
    setCodPreset(p);
    if (p === 'TODAY')     { const t = getToday();     setFromCod(t); setToCod(t); }
    if (p === 'YESTERDAY') { const y = getYesterday(); setFromCod(y); setToCod(y); }
  };

  // ── auth check on load
  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('standalone_dashboard_auth');
    if (saved) setIsAuth(true);
  }, []);

  // ── login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr('');
    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuth(true);
        localStorage.setItem('standalone_dashboard_auth', 'true');
        localStorage.setItem('standalone_dashboard_role', json.role || 'admin');
      } else {
        setAuthErr(json.error || 'Invalid passcode.');
      }
    } catch {
      // fallback hardcoded check
      if (password === 'Satya@2323' || password === 'admin123') {
        setIsAuth(true);
        localStorage.setItem('standalone_dashboard_auth', 'true');
        localStorage.setItem('standalone_dashboard_role', 'admin');
      } else {
        setAuthErr('Invalid security passcode.');
      }
    }
  };

  // ── fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams();
      if (fromLead) p.set('fromLeadDate', fromLead);
      if (toLead)   p.set('toLeadDate',   toLead);
      if (fromCod)  p.set('fromCodDate',  fromCod);
      if (toCod)    p.set('toCodDate',    toCod);
      const res = await fetch(`/api/leads?${p.toString()}`);
      const json = await res.json();
      if (res.ok) setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (isAuth) fetchData(); }, [isAuth, fromLead, toLead, fromCod, toCod]);

  // ── logout
  const handleLogout = () => {
    localStorage.removeItem('standalone_dashboard_auth');
    localStorage.removeItem('standalone_dashboard_role');
    localStorage.removeItem('satya_dev_session');
    setIsAuth(false);
  };

  // ─── LOGIN SCREEN (Mobile View Width) ────────────────────────────────────────
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] bg-[#112240] border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl relative z-10 text-center"
        >
          <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 text-[#F97316] rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 text-3xl">
            <Lock size={36} />
          </div>
          
          <p className="text-[10px] font-black tracking-[0.3em] text-[#F97316] uppercase mb-2">Satya Computers</p>
          <h2 className="text-3xl font-heading font-black text-white uppercase tracking-wider mb-8">System Access</h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="password" placeholder="••••••••" value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-center font-bold tracking-[0.2em] text-white focus:border-[#F97316] outline-none transition-colors w-full"
            />
            {authErr && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-xs font-bold text-red-400">{authErr}</div>
            )}
            <button type="submit" className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-heading font-bold text-lg uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-orange-900/50 mt-2">
              Authenticate
            </button>
          </form>

          <button onClick={() => setShowCPModal(true)} className="mt-8 text-xs font-bold text-gray-400 hover:text-white transition-colors underline decoration-gray-600 underline-offset-4">
            Manage Credentials
          </button>
        </motion.div>
        {showCPModal && <ChangePasswordModal onClose={() => setShowCPModal(false)} />}
      </div>
    );
  }

  // ─── DASHBOARD (Mobile App Style) ─────────────────────────────────────────────
  const metrics    = data?.metrics;
  const codMetrics = data?.codMetrics;

  const statusCards = [
    { title: 'Total Leads',          total: metrics?.total ?? 0,                                              Ramya: metrics?.teamTotal?.Ramya ?? 0,                                Sandeep: metrics?.teamTotal?.Sandeep ?? 0,                                Kishore: metrics?.teamTotal?.Kishore ?? 0, gradient: 'from-blue-600 to-indigo-700' },
    { title: 'Shared Details',       total: metrics?.statuses?.['Shared Details']?.total ?? 0,               Ramya: metrics?.statuses?.['Shared Details']?.Ramya ?? 0,             Sandeep: metrics?.statuses?.['Shared Details']?.Sandeep ?? 0,             Kishore: metrics?.statuses?.['Shared Details']?.Kishore ?? 0, gradient: 'from-emerald-500 to-green-600' },
    { title: 'Visit Store',          total: metrics?.statuses?.['Visit Store']?.total ?? 0,                  Ramya: metrics?.statuses?.['Visit Store']?.Ramya ?? 0,                Sandeep: metrics?.statuses?.['Visit Store']?.Sandeep ?? 0,                Kishore: metrics?.statuses?.['Visit Store']?.Kishore ?? 0, gradient: 'from-fuchsia-500 to-purple-600' },
    { title: 'Available for COD',    total: metrics?.statuses?.['Avaiable for COD']?.total ?? 0,             Ramya: metrics?.statuses?.['Avaiable for COD']?.Ramya ?? 0,           Sandeep: metrics?.statuses?.['Avaiable for COD']?.Sandeep ?? 0,           Kishore: metrics?.statuses?.['Avaiable for COD']?.Kishore ?? 0, gradient: 'from-cyan-500 to-teal-600' },
    { title: 'Shared Location',      total: metrics?.statuses?.['Shared Location']?.total ?? 0,              Ramya: metrics?.statuses?.['Shared Location']?.Ramya ?? 0,            Sandeep: metrics?.statuses?.['Shared Location']?.Sandeep ?? 0,            Kishore: metrics?.statuses?.['Shared Location']?.Kishore ?? 0, gradient: 'from-indigo-500 to-violet-600' },
    { title: 'Not Answering',        total: metrics?.statuses?.['Not answering']?.total ?? 0,                Ramya: metrics?.statuses?.['Not answering']?.Ramya ?? 0,              Sandeep: metrics?.statuses?.['Not answering']?.Sandeep ?? 0,              Kishore: metrics?.statuses?.['Not answering']?.Kishore ?? 0, gradient: 'from-orange-400 to-red-500' },
    { title: 'Not Interested',       total: metrics?.statuses?.['Not interested']?.total ?? 0,               Ramya: metrics?.statuses?.['Not interested']?.Ramya ?? 0,             Sandeep: metrics?.statuses?.['Not interested']?.Sandeep ?? 0,             Kishore: metrics?.statuses?.['Not interested']?.Kishore ?? 0, gradient: 'from-rose-500 to-pink-600' },
    { title: 'Not Working',          total: metrics?.statuses?.['Not working']?.total ?? 0,                  Ramya: metrics?.statuses?.['Not working']?.Ramya ?? 0,                Sandeep: metrics?.statuses?.['Not working']?.Sandeep ?? 0,                Kishore: metrics?.statuses?.['Not working']?.Kishore ?? 0, gradient: 'from-gray-500 to-slate-700' },
    { title: 'Store Visit Today',    total: metrics?.statuses?.['Store Visit Today']?.total ?? 0,            Ramya: metrics?.statuses?.['Store Visit Today']?.Ramya ?? 0,          Sandeep: metrics?.statuses?.['Store Visit Today']?.Sandeep ?? 0,          Kishore: metrics?.statuses?.['Store Visit Today']?.Kishore ?? 0, gradient: 'from-sky-500 to-blue-600' },
    { title: 'Store Visit Tomorrow', total: metrics?.statuses?.['Store Visit Tomorrow']?.total ?? 0,         Ramya: metrics?.statuses?.['Store Visit Tomorrow']?.Ramya ?? 0,       Sandeep: metrics?.statuses?.['Store Visit Tomorrow']?.Sandeep ?? 0,       Kishore: metrics?.statuses?.['Store Visit Tomorrow']?.Kishore ?? 0, gradient: 'from-teal-400 to-emerald-500' },
    { title: 'Call Back',            total: metrics?.statuses?.['Call back']?.total ?? 0,                    Ramya: metrics?.statuses?.['Call back']?.Ramya ?? 0,                  Sandeep: metrics?.statuses?.['Call back']?.Sandeep ?? 0,                  Kishore: metrics?.statuses?.['Call back']?.Kishore ?? 0, gradient: 'from-violet-500 to-fuchsia-600' },
  ];

  const codCards = [
    { title: 'Order Placed Members', gradient: 'from-[#0A1628] to-indigo-900', data: codMetrics?.cards?.['Order Placed'] },
    { title: 'Delivered',            gradient: 'from-emerald-500 to-teal-500', data: codMetrics?.cards?.['Delivered'] },
    { title: 'Cancelled Members',    gradient: 'from-rose-500 to-red-600', data: codMetrics?.cards?.['Cancelled'] },
  ];

  // COD table filter
  const codRows: any[] = data?.codSheet3Rows ?? [];
  const filteredCodRows = codRows.filter(r => {
    const matchSearch = !codSearch || [r.customerName, r.orderId, r.mobileNumber, r.names]
      .some(v => v?.toLowerCase().includes(codSearch.toLowerCase()));
    const matchStatus = codStatus === 'ALL' || r.status?.toLowerCase() === codStatus.toLowerCase();
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#F4F7FE] flex justify-center w-full">
      <div className="w-full max-w-[1600px] bg-[#F4F7FE] min-h-screen relative shadow-2xl flex flex-col md:border-x border-gray-100">
        
        {/* ── top bar ─────────────────────────────────────────────────────────── */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/50 flex items-center justify-between px-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#0A1628] to-indigo-900 flex items-center justify-center text-white shadow-lg shrink-0">
              <Activity size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-0.5 leading-none">Matrix</span>
              <h1 className="text-base font-heading font-black text-[#0A1628] uppercase tracking-tight leading-none">Dashboard</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowCPModal(true)} className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1628] hover:bg-gray-100 transition-all shadow-sm">
              <KeyRound size={18} />
            </button>
            <button onClick={fetchData} disabled={loading} className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1628] hover:bg-gray-100 transition-all shadow-sm">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <div className="p-4 w-full flex-1 flex flex-col gap-8 pb-10">
          {/* ── LEADS SECTION ─────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F97316] animate-pulse" />
                  <span className="text-[9px] font-bold text-[#F97316] uppercase tracking-[0.3em]">Module</span>
                </div>
                <h2 className="text-2xl font-heading font-black text-[#0A1628] leading-none uppercase">Leads Intel</h2>
              </div>
            </div>
            
            <DateRangeBar
              label="Pipeline Range"
              from={fromLead} to={toLead}
              onFrom={setFromLead} onTo={setToLead}
              preset={leadPreset} onPreset={applyLeadPreset}
            />

            {loading ? (
              <div className="h-48 rounded-[2rem] bg-white/50 border border-gray-200 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Activity size={24} className="text-[#F97316] animate-spin" />
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Aggregating...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {statusCards.map(c => (
                  <LeadCard key={c.title} {...c} />
                ))}
              </div>
            )}
          </div>

          {/* ── COD SECTION ───────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-4 pt-8 border-t border-gray-200/60">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A1628] animate-pulse" />
                  <span className="text-[9px] font-bold text-gray-500 uppercase tracking-[0.3em]">Module</span>
                </div>
                <h2 className="text-2xl font-heading font-black text-[#0A1628] leading-none uppercase">Logistics</h2>
              </div>
              <div className="px-3 py-1 bg-[#0A1628] text-white rounded-lg text-[9px] font-black tracking-widest uppercase shadow-md">
                {filteredCodRows.length} Records
              </div>
            </div>
            
            <DateRangeBar
              label="Fulfillment Range"
              from={fromCod} to={toCod}
              onFrom={setFromCod} onTo={setToCod}
              preset={codPreset} onPreset={applyCodPreset}
            />

            {loading ? null : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {codCards.map(c => (
                  <CodCard key={c.title} title={c.title} gradient={c.gradient}
                    total={c.data?.count ?? 0}
                    Ramya={c.data?.Ramya ?? 0} Sandeep={c.data?.Sandeep ?? 0} Kishore={c.data?.Kishore ?? 0}
                  />
                ))}
              </div>
            )}

            {/* Mobile Ledger Table */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden mt-4 w-full">
              <div className="p-5 border-b border-gray-100 flex flex-col gap-3">
                <h3 className="text-lg font-heading font-black text-[#0A1628] uppercase tracking-wide leading-none">Ledger</h3>
                
                <div className="flex flex-col gap-2 w-full">
                  <input
                    placeholder="Search name, phone, ID..."
                    value={codSearch} onChange={e => setCodSearch(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#0A1628] w-full placeholder-gray-400 outline-none focus:border-[#F97316] transition-all"
                  />
                  <select 
                    value={codStatus} onChange={e => setCodStatus(e.target.value)} 
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-[#0A1628] w-full outline-none focus:border-[#F97316] transition-all cursor-pointer"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="Order Placed">Order Placed</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {filteredCodRows.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 mb-3">
                    <Database size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-[#0A1628] uppercase tracking-widest mb-1">No Data</h4>
                </div>
              ) : (
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Date</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Order ID</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Way Bill Number</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Customer Name</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Mobile</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Address</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Weight</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Cost</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Status</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Delivery Date</th>
                        <th className="px-5 py-4 text-[10px] font-black tracking-[0.1em] text-gray-500 uppercase">Names</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredCodRows.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{r.date}</td>
                          <td className="px-5 py-4 text-xs font-mono font-bold text-[#0A1628] whitespace-nowrap">{r.orderId}</td>
                          <td className="px-5 py-4 text-xs font-medium text-gray-500 whitespace-nowrap">{r.wayBillNumber}</td>
                          <td className="px-5 py-4 text-sm font-bold text-[#0A1628] min-w-[200px]">{r.customerName}</td>
                          <td className="px-5 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{r.mobileNumber}</td>
                          <td className="px-5 py-4 text-xs font-medium text-gray-500 min-w-[250px]">{r.address}</td>
                          <td className="px-5 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{r.weight}</td>
                          <td className="px-5 py-4 text-sm font-bold text-[#0A1628] whitespace-nowrap">₹{r.cost}</td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase border ${
                              r.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                              r.status === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                              'bg-blue-50 text-blue-600 border-blue-100'
                            }`}>
                              {r.status || 'UNKNOWN'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs font-medium text-gray-600 whitespace-nowrap">{r.deliveryDate || '—'}</td>
                          <td className="px-5 py-4 text-xs font-bold text-[#F97316] uppercase whitespace-nowrap">{r.names}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showCPModal && <ChangePasswordModal onClose={() => setShowCPModal(false)} />}
    </div>
  );
}
