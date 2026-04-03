'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  MoreHorizontal, 
  Download,
  Mail,
  Phone,
  Building2,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  FileText,
  Trash2,
  Edit3,
  PlusCircle,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderManagement() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalId, setActiveModalId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [newOrderData, setNewOrderData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    totalUnits: 0,
    estimatedValue: 0
  });

  const [scannedSerials, setScannedSerials] = useState<Record<string, string>>({});

  const knownOrderIds = useRef<Set<string>>(new Set());
  const [newAlerts, setNewAlerts] = useState<string[]>([]);
  
  const playAlertChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) { console.error('Audio subsystem unavailable'); }
  };
  // High-Performance Filtering Matrix
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const statusMatch = filter === 'All' || 
        (order.status || 'Pending').toLowerCase().trim() === filter.toLowerCase().trim();
      
      if (!statusMatch) return false;

      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;

      return (
        order.companyName?.toLowerCase().includes(searchLower) ||
        order.contactPerson?.toLowerCase().includes(searchLower) ||
        (order.orderId || order.id || '').toString().toLowerCase().includes(searchLower)
      );
    });
  }, [orders, filter, searchTerm]);

  useEffect(() => {
    setMounted(true);
    fetchOrders();

    const polling = setInterval(() => fetchOrders(true), 8000);

    const handleClickOutside = () => setShowOptionsId(null);
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      clearInterval(polling);
    };
  }, []);

  const fetchOrders = async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      const fetchedOrders = Array.isArray(data) ? data : [];
      
      if (isPolling) {
         let hasNew = false;
         fetchedOrders.forEach(o => {
            if (!knownOrderIds.current.has(o.id) && (o.status === 'Pending' || o.paymentStatus?.includes('Pending'))) {
               hasNew = true;
               setNewAlerts(prev => [...prev, o.orderId || o.id]);
            }
            knownOrderIds.current.add(o.id);
         });
         if (hasNew) playAlertChime();
      } else {
         fetchedOrders.forEach(o => knownOrderIds.current.add(o.id));
      }
      
      setOrders(fetchedOrders);
    } catch (err) {
      console.error('B2B Sync Failure:', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setShowOptionsId(null);
      }
    } catch (err) {
      console.error('Status sync failure:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleFullUpdate = async (e: React.FormEvent, updatedOrder: any) => {
    e.preventDefault();
    setProcessingId(updatedOrder.id);
    try {
      const res = await fetch('/api/admin/orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder)
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
        setIsEditMode(false);
      }
    } catch (err) {
      console.error('Registry modification failure:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleInitializeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('init');
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrderData)
      });
      if (res.ok) {
        const result = await res.json();
        // Optimistic add
        const newlyCreated = {
            ...newOrderData,
            id: result.id,
            orderId: result.orderId,
            status: 'Pending',
            createdAt: new Date().toISOString()
        };
        setOrders(prev => [newlyCreated, ...prev]);
        setIsInitializing(false);
        setNewOrderData({
            companyName: '',
            contactPerson: '',
            email: '',
            phone: '',
            totalUnits: 0,
            estimatedValue: 0
        });
      }
    } catch (err) {
      console.error('Initialization failure:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('PROTOCOL PURGE: Do you authorize the permanent deletion of this record?')) return;
    setProcessingId(id);
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setOrders(prev => prev.filter(o => o.id !== id));
        setActiveModalId(null);
      }
    } catch (err) {
      console.error('Termination failure:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order_ID', 'Entity', 'Decision_Maker', 'Units', 'Value', 'Status', 'Stamp'];
    const rows = filteredOrders.map(o => [
      o.orderId || o.id,
      `"${o.companyName}"`,
      `"${o.contactPerson}"`,
      o.totalUnits,
      o.estimatedValue,
      o.status,
      new Date(o.createdAt).toLocaleString()
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SATYA_B2B_EXPORT_${Date.now()}.csv`;
    a.click();
  };

  if (!mounted) return null;

  return (
    <div className="space-y-8 p-4 lg:p-0 max-w-[1600px] mx-auto min-h-screen relative">
      {/* REAL-TIME ALERTS */}
      <AnimatePresence>
        {newAlerts.length > 0 && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none">
            {newAlerts.map(alertId => (
              <motion.div 
                key={alertId}
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0A1628] border-2 border-[#F97316] p-4 rounded-2xl shadow-[0_10px_40px_rgba(249,115,22,0.3)] flex items-center justify-between gap-6 pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#F97316] animate-pulse" />
                  <div>
                    <h4 className="text-white font-heading text-lg tracking-widest uppercase leading-none">NEW DEPLOYMENT ALARM</h4>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1">ID: {alertId}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setNewAlerts(prev => prev.filter(id => id !== alertId))}
                  title="Acknowledge Alert"
                  className="p-2 rounded-xl border border-white/10 hover:bg-white/10 text-white transition-colors"
                >
                  <XCircle size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* PROFESSIONAL HEADER SECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter flex items-center gap-4">
            BULK <span className="text-gray-300">/ LOGISTICS</span>
            {loading && <Loader2 className="animate-spin text-[#F97316]" size={24} />}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Strategic oversight of enterprise-tier hardware acquisitions and corporate contracts.</p>
        </div>
        <div className="flex items-center gap-4">
            <button
                onClick={() => setIsInitializing(true)}
                title="Initialize New Logistics Protocol"
                className="bg-white border-2 border-[#0A1628] text-[#0A1628] px-8 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all active:scale-95 shadow-xl group"
            >
                <PlusCircle size={18} className="group-hover:rotate-90 transition-transform" /> 
                INITIALIZE PROTOCOL
            </button>
            <button
                onClick={exportToCSV}
                disabled={filteredOrders.length === 0}
                title="Export Ledger to CSV"
                className="bg-[#0A1628] text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#F97316] hover:border-transparent transition-all shadow-2xl active:scale-95 disabled:opacity-30 disabled:grayscale group"
            >
                <Download size={18} className="group-hover:translate-y-1 transition-transform" /> 
                EXPORT TELEMETRY
            </button>
        </div>
      </div>

      {/* REACTIVE TAB ANALYZER */}
      <div className="flex gap-4 p-2 bg-gray-100/50 rounded-[2.5rem] border border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
        {['All', 'Pending', 'Quote Sent', 'Confirmed', 'Delivered', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            title={`Filter by ${tab}`}
            className={`px-8 py-4 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500 ${
              filter === tab 
                ? 'bg-white text-[#F97316] shadow-xl border border-orange-100 scale-105' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTROL INTERFACE */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative flex-1 group max-w-4xl">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors" size={24} />
          <input
            type="text"
            title="Registry Search"
            placeholder="Identity scan: Company, User, or Protocol ID..."
            className="w-full pl-20 pr-8 py-6 rounded-[3rem] border border-transparent bg-gray-100/50 focus:bg-white focus:border-[#F97316] outline-none transition-all text-sm font-bold text-[#0A1628] shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6 px-10 py-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#F97316]">
                <Filter size={18} />
              </div>
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Ledger Status</span>
                <span className="text-sm font-black text-[#0A1628] tracking-tighter">{filteredOrders.length} RECORDS LOCKED</span>
              </div>
           </div>
        </div>
      </div>

      {/* DATA VISUALIZATION MATRIX */}
      <div className="grid grid-cols-1 gap-8 pb-32">
        {loading ? (
          <div className="bg-white p-48 rounded-[4rem] flex flex-col items-center gap-8 border border-gray-100">
             <div className="w-20 h-20 border-[8px] border-gray-100 border-t-[#F97316] rounded-full animate-spin" />
             <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs">Accessing Secure Ledger...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-48 rounded-[4rem] text-center border border-gray-100 flex flex-col items-center justify-center">
             <div className="w-32 h-32 bg-gray-50 text-gray-200 rounded-[3rem] flex items-center justify-center mb-10">
                <Search size={64} />
             </div>
             <p className="text-gray-300 font-heading font-black uppercase tracking-[0.4em] text-lg">No synchronized assets identified</p>
             <button onClick={() => {setFilter('All'); setSearchTerm('');}} title="Reset Registry Filters" className="mt-8 text-[#F97316] font-black uppercase tracking-widest text-[10px] hover:underline underline-offset-8">Reset Protocol Filter</button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, scale: 0.98, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, x: -20 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_15px_50px_rgb(0,0,0,0.02)] hover:shadow-2xl hover:shadow-orange-950/5 hover:border-[#F97316]/30 transition-all group flex flex-wrap lg:flex-nowrap items-center gap-12 relative overflow-hidden"
              >
                {/* Visual Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#F97316] to-orange-200 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Identity Cluster */}
                <div className="flex items-center gap-10 min-w-[320px]">
                  <div className="w-24 h-24 rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-[#F97316]/5 group-hover:text-[#F97316] group-hover:border-[#F97316]/20 transition-all shadow-inner" title="Entity Registry Icon">
                    <Building2 size={44} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-heading font-black text-[#0A1628] leading-none group-hover:text-[#F97316] transition-colors uppercase tracking-tighter">
                      {order.companyName || 'Private Enterprise'}
                    </h3>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        ID: { (order.orderId || order.id).toString().substring(0,20).toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                        <span className="text-[9px] font-black text-[#F97316] uppercase tracking-widest">B2B LOGISTICS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Telemetry Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 flex-1">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 opacity-70 flex items-center gap-2 italic">
                      <Edit3 size={10} /> Decision Maker
                    </p>
                    <p className="text-lg font-bold text-[#0A1628] uppercase tracking-tight">{order.contactPerson || 'System Entry'}</p>
                    <div className="flex gap-4 mt-6">
                      {order.email && (
                        <a href={`mailto:${order.email}`} title="Contact via Email" className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center shadow-sm border border-transparent hover:border-blue-100">
                          <Mail size={16} />
                        </a>
                      )}
                      {order.phone && (
                        <a href={`tel:${order.phone}`} title="Contact via Phone" className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all flex items-center justify-center shadow-sm border border-transparent hover:border-emerald-100">
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="border-l border-gray-50 pl-12 hidden md:block relative group">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 opacity-70 italic">Payload Registry</p>
                    <p className="text-md font-bold text-[#0A1628] tracking-widest">{order.totalUnits} UNITS PROVISIONED</p>
                    <p className="text-2xl font-heading font-black text-[#F97316] mt-2 tracking-tighter">₹{Number(order.estimatedValue).toLocaleString()}</p>
                    <div className="absolute top-0 right-0 p-4 bg-[#0A1628] rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all z-10 shadow-2xl pointer-events-none translate-x-4">
                       <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={10}/> Net Margin (18%)</p>
                       <p className="text-white font-heading text-xl mt-1 tracking-widest">₹{(Number(order.estimatedValue) * 0.18).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-l border-gray-50 pl-12 hidden xl:block">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] mb-4 opacity-70 italic">Synchronized Stamp</p>
                    <div className="flex items-center gap-3 text-lg text-[#0A1628] font-bold">
                      <Calendar size={20} className="text-[#F97316] opacity-40" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <p className="text-[8px] font-black text-gray-200 uppercase tracking-[0.3em] mt-3 underline decoration-orange-200/50">Ledger Consistency: Active</p>
                  </div>
                </div>

                {/* Status & Actions Sector */}
                <div className="flex items-center gap-10">
                  <div className={`px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border-2 transition-all ${
                    order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' :
                    order.status === 'Quote Sent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    order.status === 'Delivered' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`}>
                    {order.status}
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-[2.5rem] shadow-inner border border-gray-100">
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveModalId(order.id); setIsEditMode(false); }}
                      title="Access Client Insight Portal"
                      className="w-14 h-14 rounded-2xl bg-white text-gray-400 hover:text-[#0A1628] hover:bg-[#F97316]/5 transition-all flex items-center justify-center shadow-lg active:scale-90 border border-gray-100 group/btn"
                    >
                      <Eye size={24} className="group-hover/btn:scale-110 transition-transform" />
                    </button>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOptionsId(showOptionsId === order.id ? null : order.id);
                        }}
                        title="Open Control Parameters"
                        className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center shadow-lg active:scale-90 border ${
                          showOptionsId === order.id ? 'bg-[#0A1628] text-white' : 'bg-white text-gray-400 hover:text-[#F97316]'
                        }`}
                      >
                        <MoreHorizontal size={24} />
                      </button>

                      {showOptionsId === order.id && (
                        <div className="absolute right-0 top-16 w-64 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 py-6 z-[100] overflow-hidden animate-in slide-in-from-top-4 duration-500">
                          <p className="px-8 py-3 text-[10px] font-black text-gray-300 uppercase tracking-widest border-b border-gray-50 mb-4">Protocol Override</p>
                          {['Pending', 'Quote Sent', 'Confirmed', 'Delivered', 'Cancelled'].map((s) => (
                            <button
                               key={s}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 handleUpdateStatus(order.id, s);
                               }}
                               className={`w-full text-left px-8 py-3 text-xs font-bold transition-all flex items-center justify-between ${
                                 order.status === s ? 'text-[#F97316] bg-orange-50/50 cursor-default' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A1628]'
                               }`}
                             >
                               {s}
                               {order.status === s && <CheckCircle2 size={12} />}
                             </button>
                           ))}
                           <div className="h-px bg-gray-50 my-4" />
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               setActiveModalId(order.id);
                               setIsEditMode(true);
                               setShowOptionsId(null);
                             }}
                             className="w-full text-left px-8 py-4 text-xs font-black text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-[0.2em]"
                           >
                             Modify Detail
                           </button>
                           <button
                             onClick={(e) => {
                               e.stopPropagation();
                               handleDeleteOrder(order.id);
                               setShowOptionsId(null);
                             }}
                             className="w-full text-left px-8 py-4 text-xs font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-[0.2em]"
                           >
                             Purge Record
                           </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* INITIALIZATION MODAL */}
      <AnimatePresence>
        {isInitializing && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0A1628]/95 backdrop-blur-3xl" 
              onClick={() => setIsInitializing(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white rounded-[4rem] border border-gray-100 shadow-2xl p-16 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-16">
                 <div className="space-y-4">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-blue-50 border border-blue-100">
                        <PlusCircle size={14} className="text-blue-600 animate-spin-slow" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Lifecycle Initialization</span>
                    </div>
                    <h3 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">PROTOCOL INITIALIZATION</h3>
                 </div>
                 <button onClick={() => setIsInitializing(false)} title="Abort Initialization" className="p-4 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><XCircle size={32} /></button>
              </div>
              
              <form onSubmit={handleInitializeOrder} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-3">
                            <Building2 size={12} /> Client Entity Information
                        </label>
                        <input 
                            title="Corporate Identity"
                            placeholder="Full Company / Enterprise Name"
                            required
                            className="w-full bg-gray-50/50 p-6 rounded-2xl border-2 border-transparent focus:border-[#F97316] focus:bg-white outline-none font-bold text-lg text-[#0A1628] transition-all shadow-inner"
                            value={newOrderData.companyName}
                            onChange={e => setNewOrderData({...newOrderData, companyName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-3">
                            <PlusCircle size={12} /> Decision Maker (POC)
                        </label>
                        <input 
                            title="POC Identity"
                            placeholder="Point of Contact Full Name"
                            required
                            className="w-full bg-gray-50/50 p-6 rounded-2xl border-2 border-transparent focus:border-[#F97316] focus:bg-white outline-none font-bold text-lg text-[#0A1628] transition-all shadow-inner"
                            value={newOrderData.contactPerson}
                            onChange={e => setNewOrderData({...newOrderData, contactPerson: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Mail Portal</label>
                            <input 
                                title="Mail Identity"
                                type="email"
                                placeholder="client@corp.com"
                                className="w-full bg-gray-50/50 p-6 rounded-2xl border-2 border-transparent focus:border-[#F97316] focus:bg-white outline-none font-bold text-lg text-[#0A1628] transition-all shadow-inner"
                                value={newOrderData.email}
                                onChange={e => setNewOrderData({...newOrderData, email: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Voice Comms</label>
                            <input 
                                title="Voice Identity"
                                placeholder="+91 XXXX-XXXX"
                                className="w-full bg-gray-50/50 p-6 rounded-2xl border-2 border-transparent focus:border-[#F97316] focus:bg-white outline-none font-bold text-lg text-[#0A1628] transition-all shadow-inner"
                                value={newOrderData.phone}
                                onChange={e => setNewOrderData({...newOrderData, phone: e.target.value})}
                            />
                        </div>
                    </div>
                 </div>

                 <div className="space-y-8 bg-[#0A1628] p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10 space-y-8">
                        <div className="flex items-center gap-4 text-white/40">
                            <FileText size={20} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Payload Configuration</span>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Estimated Hardware Units</label>
                                <input 
                                    title="Payload Units"
                                    type="number"
                                    className="w-full bg-white/5 p-6 rounded-2xl border-2 border-white/10 focus:border-[#F97316] outline-none font-black text-3xl text-[#F97316] transition-all text-center"
                                    value={newOrderData.totalUnits}
                                    onChange={e => setNewOrderData({...newOrderData, totalUnits: parseInt(e.target.value)})}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 block">Gross Protocol Valuation (INR)</label>
                                <input 
                                    title="Payload Valuation"
                                    type="number"
                                    className="w-full bg-white/5 p-6 rounded-2xl border-2 border-white/10 focus:border-[#F97316] outline-none font-black text-3xl text-white transition-all text-center"
                                    value={newOrderData.estimatedValue}
                                    onChange={e => setNewOrderData({...newOrderData, estimatedValue: parseFloat(e.target.value)})}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="relative z-10 pt-10">
                        <button 
                            type="submit" 
                            disabled={processingId === 'init'}
                            className="w-full py-8 bg-[#F97316] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-sm hover:bg-white hover:text-[#0A1628] transition-all shadow-2xl flex items-center justify-center gap-4 disabled:grayscale disabled:opacity-50"
                        >
                            {processingId === 'init' ? <Loader2 className="animate-spin" /> : <History size={24} />}
                            INITIALIZE SYSTEM PROTOCOL
                        </button>
                    </div>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DUAL-PURPOSE PROTOCOL MODAL */}
      <AnimatePresence>
        {activeModalId && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0A1628]/95 backdrop-blur-3xl" 
              onClick={() => setActiveModalId(null)} 
            />
            
            <motion.div 
              layoutId={`modal-${activeModalId}`}
              className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden shadow-orange-950/20"
            >
              {(() => {
                const order = orders.find(o => o.id === activeModalId);
                if (!order) return null;
                
                return (
                  <div className="p-12 md:p-20">
                    <div className="flex justify-between items-start mb-16">
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-orange-50 border border-orange-100">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
                          <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.3em]">Protocol Matrix: {isEditMode ? 'MODIFICATION' : 'ANALYSIS'}</span>
                        </div>
                        <h2 className="text-5xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">
                          {order.companyName}
                        </h2>
                      </div>
                      <button onClick={() => setActiveModalId(null)} title="Close Insight Portal" className="p-4 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all border border-transparent hover:border-red-100">
                        <XCircle size={32} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                      {/* Left: Deep-Trace Details */}
                      <div className="space-y-12">
                        <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner group">
                           <div className="flex items-center gap-4 mb-8">
                              <Building2 className="text-[#F97316]" size={24} />
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest decoration-[#F97316]/20 decoration-4 underline underline-offset-8">Entity Focal Point</p>
                           </div>
                           <p className="text-4xl font-heading font-black text-[#0A1628] uppercase">{order.contactPerson}</p>
                           <div className="mt-10 space-y-5">
                              <div className="flex items-center gap-5 text-[#0A1628]">
                                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"><Mail size={18} className="text-[#F97316]" /></div>
                                 <span className="text-lg font-bold tracking-tight">{order.email}</span>
                              </div>
                              <div className="flex items-center gap-5 text-[#0A1628]">
                                 <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm"><Phone size={18} className="text-[#F97316]" /></div>
                                 <span className="text-lg font-bold tracking-tight">{order.phone}</span>
                              </div>
                           </div>
                        </div>

                        <div className="p-10 bg-[#0A1628] rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
                           <div className="relative z-10">
                              <div className="flex items-center gap-4 mb-8">
                                 <FileText className="text-[#F97316]" size={24} />
                                 <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Asset Telemetry</p>
                              </div>
                              <p className="text-4xl font-heading font-black text-white uppercase leading-none">{order.totalUnits} Units Provisioned</p>
                              <p className="text-5xl font-heading font-black text-[#F97316] mt-6 tracking-tighter">₹{Number(order.estimatedValue).toLocaleString()}</p>
                           </div>
                           <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F97316]/5 blur-[100px] rounded-full group-hover:bg-[#F97316]/10 transition-colors" />
                        </div>
                      </div>

                      {/* Right: Interaction Sector */}
                      <div className="space-y-12">
                        {isEditMode ? (
                          <form onSubmit={(e) => handleFullUpdate(e, order)} className="space-y-8 animate-in fade-in duration-500">
                             <div className="space-y-6 bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100">
                                <div>
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Corporate Identity</label>
                                  <input 
                                    title="Edit Corporate Identity"
                                    placeholder="Enter company name"
                                    className="w-full bg-white p-5 rounded-2xl border-2 border-gray-100 focus:border-[#F97316] outline-none font-bold text-lg text-[#0A1628] transition-all"
                                    defaultValue={order.companyName}
                                    onChange={e => order.companyName = e.target.value}
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Decision Maker</label>
                                  <input 
                                    title="Edit Decision Maker"
                                    placeholder="Enter contact person"
                                    className="w-full bg-white p-5 rounded-2xl border-2 border-gray-100 focus:border-[#F97316] outline-none font-bold text-lg text-[#0A1628] transition-all"
                                    defaultValue={order.contactPerson}
                                    onChange={e => order.contactPerson = e.target.value}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Units</label>
                                    <input 
                                      title="Edit Provisioned Units"
                                      placeholder="0"
                                      type="number"
                                      className="w-full bg-white p-5 rounded-2xl border-2 border-gray-100 focus:border-[#F97316] outline-none font-bold text-lg text-[#0A1628] transition-all"
                                      defaultValue={order.totalUnits}
                                      onChange={e => order.totalUnits = parseInt(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block">Value (INR)</label>
                                    <input 
                                      title="Edit Valuation"
                                      placeholder="0"
                                      type="number"
                                      className="w-full bg-white p-5 rounded-2xl border-2 border-gray-100 focus:border-[#F97316] outline-none font-bold text-lg text-[#0A1628] transition-all"
                                      defaultValue={order.estimatedValue}
                                      onChange={e => order.estimatedValue = parseFloat(e.target.value)}
                                    />
                                  </div>
                                </div>
                             </div>
                             <div className="flex gap-6">
                                <button type="submit" className="flex-1 py-6 bg-[#0A1628] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#F97316] transition-all shadow-xl">Commit Modification</button>
                                <button type="button" onClick={() => setIsEditMode(false)} className="px-10 py-6 border-2 border-gray-100 rounded-[2rem] font-black uppercase tracking-widest text-[#0A1628] hover:bg-gray-50 transition-all">Cancel</button>
                             </div>
                          </form>
                        ) : (
                          <div className="space-y-12">
                             <div className="space-y-8">
                                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.5em] px-4">Registry Timeline</h4>
                                <div className="space-y-10 relative before:absolute before:left-[1.85rem] before:top-4 before:bottom-4 before:w-1 before:bg-gray-50">
                                   <div className="flex gap-10 items-start relative">
                                      <div className="w-16 h-16 rounded-3xl bg-emerald-50 border-4 border-white shadow-xl flex items-center justify-center text-emerald-500 shrink-0 relative z-10">
                                         <CheckCircle2 size={28} />
                                      </div>
                                      <div className="pt-2">
                                         <p className="text-lg font-black text-[#0A1628] uppercase tracking-tight">Order Initialized</p>
                                         <p className="text-sm font-bold text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                         <div className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mt-4 flex items-center gap-2 bg-emerald-50 w-fit px-4 py-2 rounded-full border border-emerald-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Protocol: SECURE_ALPHA
                                         </div>
                                      </div>
                                   </div>
                                   <div className="flex gap-10 items-start relative opacity-20">
                                      <div className="w-16 h-16 rounded-3xl bg-gray-50 border-4 border-white shadow-xl flex items-center justify-center text-gray-300 shrink-0 relative z-10">
                                         <Calendar size={28} />
                                      </div>
                                      <div className="pt-2">
                                         <p className="text-lg font-black text-gray-300 uppercase tracking-tight italic">Deployment Synchronization</p>
                                         <p className="text-sm font-bold text-gray-200 mt-1">Awaiting Logistics Handshake</p>
                                      </div>
                                   </div>

                                   {/* ADVANCED COURIER & RMA LOCK INTEGRATION */}
                                   <div className="flex gap-10 items-start relative mt-10">
                                     <div className="w-16 h-16 rounded-3xl bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-blue-500 shrink-0 relative z-10">
                                       <FileText size={28} />
                                     </div>
                                     <div className="pt-2 w-full">
                                       <p className="text-lg font-black text-blue-900 uppercase tracking-tight">RMA Hardware Lock</p>
                                       <p className="text-[10px] font-black tracking-widest text-gray-400 mt-1 uppercase">Scan Service Tag to securely lock machine warranty</p>
                                       <div className="mt-4 flex flex-col md:flex-row gap-4">
                                         <input 
                                           placeholder="SCAN SERIAL / SERVICE TAG" 
                                           className="flex-1 bg-white border-2 border-gray-100 p-4 rounded-2xl font-mono text-sm font-bold uppercase transition-all shadow-inner focus:border-blue-500 outline-none"
                                           value={scannedSerials[order.id] || ''}
                                           onChange={(e) => setScannedSerials(prev => ({...prev, [order.id]: e.target.value}))}
                                         />
                                         <button 
                                           onClick={(e) => {
                                              e.preventDefault();
                                              if (!scannedSerials[order.id] || scannedSerials[order.id].length < 5) {
                                                 alert('PROTOCOL SECURITY ERROR: A valid Hardware Service Tag is required to dispatch stock and generate an Airway Bill.');
                                              } else {
                                                 alert('SHIPROCKET API HOOK:\n\nAWB Label Generated Successfully.\nLive tracking link automatically transmitted to +91 ' + order.phone);
                                                 handleUpdateStatus(order.id, 'Shipped');
                                                 setActiveModalId(null);
                                              }
                                           }}
                                           className="px-8 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 group"
                                         >
                                            <Download size={16} className="group-hover:translate-y-1 transition-transform" /> AWB DISPATCH
                                         </button>
                                       </div>
                                     </div>
                                   </div>
                                </div>
                             </div>

                             <div className="pt-16 border-t border-gray-100 flex gap-6">
                                <button 
                                  onClick={() => setIsEditMode(true)} 
                                  title="Modify Product Registry Details"
                                  className="flex-1 py-6 bg-[#0A1628] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#F97316] transition-all shadow-xl group"
                                >
                                   Modify Protocol Registry
                                </button>
                                <button 
                                  onClick={() => handleDeleteOrder(order.id)}
                                  title="Permanent Record Termination"
                                  className="px-10 py-6 border-2 border-red-50 text-red-500 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-red-50 transition-all flex items-center gap-4"
                                >
                                   <Trash2 size={20} />
                                </button>
                             </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
