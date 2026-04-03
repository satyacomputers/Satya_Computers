'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Search, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Copy,
  LayoutGrid,
  List as ListIcon,
  Filter,
  DollarSign,
  Smartphone,
  Check,
  ShieldCheck,
  X,
  Loader2,
  Package,
  MapPin,
  Mail,
  Phone,
  Hash
} from 'lucide-react';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function UPIPaymentsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    // Real-time synchronization pulse: Every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/customer-orders');
      if (res.ok) {
        const data = await res.json();
        const upiOnly = data.filter((o: any) => o.paymentMethod === 'UPI');
        setOrders(upiOnly);
      }
    } catch (err) {
      console.error('Failed to fetch UPI records:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (e: React.MouseEvent, id: string, status: string) => {
    e.stopPropagation(); // Prevent modal from opening
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/customer-orders?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentStatus: status })
      });
      if (res.ok) {
        await fetchOrders();
        if (selectedOrder?.id === id) {
          setSelectedOrder((prev: any) => ({ ...prev, paymentStatus: status }));
        }
      }
    } catch (err) {
      console.error('Status sync failure:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.paymentStatus !== 'Paid').length,
    verified: orders.filter(o => o.paymentStatus === 'Paid').length,
    totalValue: orders.reduce((sum, o) => sum + o.totalAmount, 0)
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-[#060B14] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#F97316] font-heading font-black tracking-widest animate-pulse">SYNCHRONIZING RECORDS</p>
          </div>
       </div>
     );
  }

  return (
    <main className="min-h-screen bg-[#060B14] text-white pb-20 relative overflow-hidden font-sans">
      <GrainOverlay opacity={8} />
      
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#F97316]/5 rounded-full blur-[150px]" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 rounded-full blur-[120px]" />

      <header className="pt-12 pb-8 px-8 relative z-10 border-b border-white/5 bg-[#0A1628]/80 backdrop-blur-xl sticky top-0">
        <div className="flex flex-col lg:row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#F97316] rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
                  <ShieldCheck size={20} className="text-white" />
               </div>
               <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight uppercase">
                 UPI <span className="text-[#F97316]">TRACKER</span>
               </h1>
            </div>
            <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[9px] pl-1 w-full">Automated Financial Verification Matrix</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 flex-1 lg:flex-none justify-center lg:justify-start">
               <DollarSign size={18} className="text-[#F97316]" />
               <div>
                  <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Total Volume</p>
                  <p className="font-heading text-xl leading-none tracking-tighter">₹{stats.totalValue.toLocaleString()}</p>
               </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-4 flex-1 lg:flex-none justify-center lg:justify-start">
               <Smartphone size={18} className="text-blue-400" />
               <div>
                  <p className="text-[7px] font-black text-gray-500 uppercase tracking-widest">Captured Count</p>
                  <p className="font-heading text-xl leading-none tracking-tighter">{stats.total}</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      <section className="p-8 relative z-10 max-w-[1600px] mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-12">
          <div className="relative flex-1 max-w-lg group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#F97316] transition-colors" size={18} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, Customer, Amount..." 
              className="w-full bg-white/5 border-2 border-white/10 p-5 pl-16 rounded-[1.5rem] outline-none focus:border-[#F97316]/50 focus:bg-[#0A1628] transition-all font-bold text-sm tracking-wide placeholder:text-gray-600"
            />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
             <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
                <button 
                  onClick={() => setViewMode('list')}
                  title="List Matrix"
                  className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-[#F97316] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <ListIcon size={20} />
                </button>
                <button 
                   onClick={() => setViewMode('grid')}
                   title="Grid Matrix"
                   className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-[#F97316] text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
                >
                  <LayoutGrid size={20} />
                </button>
             </div>

             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               title="Filter Status"
               className="bg-white/5 border-2 border-white/10 p-4 px-6 rounded-2xl font-heading text-[10px] tracking-widest uppercase outline-none cursor-pointer focus:border-[#F97316]/50 hover:bg-white/10 transition-all appearance-none"
             >
                <option value="All">All Transactions</option>
                <option value="Paid">Verified (Paid)</option>
                <option value="Paid (Pending Verification)">Pending Review</option>
             </select>
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          viewMode === 'list' ? (
            <div className="bg-[#0A1628]/50 border border-white/10 rounded-[2rem] overflow-hidden backdrop-blur-md">
               <table className="w-full text-left">
                  <thead className="bg-[#121D2F]/50 border-b border-white/10">
                     <tr>
                        <th className="p-8 font-heading text-[10px] tracking-widest text-[#F97316] uppercase">ORDER ID</th>
                        <th className="p-8 font-heading text-[10px] tracking-widest text-gray-500 uppercase">CLIENT</th>
                        <th className="p-8 font-heading text-[10px] tracking-widest text-gray-500 uppercase">AMOUNT</th>
                        <th className="p-8 font-heading text-[10px] tracking-widest text-emerald-500 uppercase">VERIFICATION ID (UTR)</th>
                        <th className="p-8 font-heading text-[10px] tracking-widest text-gray-500 uppercase text-center">INTEGRITY</th>
                        <th className="p-8 font-heading text-[10px] tracking-widest text-gray-500 uppercase text-right">ACTIONS</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map(order => (
                      <tr 
                        key={order.id} 
                        onClick={() => setSelectedOrder(order)}
                        className="hover:bg-white/5 transition-all cursor-pointer group"
                      >
                        <td className="p-8">
                           <div className="flex items-center gap-3">
                              <Hash size={14} className="text-gray-600" />
                              <span className="font-heading text-lg group-hover:text-[#F97316] transition-colors">{order.orderId}</span>
                           </div>
                        </td>
                        <td className="p-8">
                           <div className="flex flex-col">
                              <p className="font-bold text-base text-gray-200">{order.customerName}</p>
                              <p className="text-xs text-gray-500">+91 {order.phone}</p>
                           </div>
                        </td>
                        <td className="p-8 font-heading text-xl text-white">₹{order.totalAmount.toLocaleString()}</td>
                        <td className="p-8">
                           <code className="bg-emerald-500/5 text-emerald-500 px-3 py-1.5 rounded-lg font-mono text-xs font-black tracking-widest border border-emerald-500/10">
                              {order.transactionId || 'NOT_CAPTURED'}
                           </code>
                        </td>
                        <td className="p-8">
                           <div className="flex justify-center">
                              {order.paymentStatus === 'Paid' ? (
                                <span className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[9px] font-black uppercase tracking-widest">
                                   <ShieldCheck size={12} /> SYNCED
                                </span>
                              ) : (
                                <span className="flex items-center gap-2 px-5 py-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">
                                   <Clock size={12} /> PENDING
                                </span>
                              )}
                           </div>
                        </td>
                        <td className="p-8 text-right">
                           {order.paymentStatus !== 'Paid' ? (
                              <button 
                                onClick={(e) => updateStatus(e, order.id, 'Paid')}
                                disabled={updatingId === order.id}
                                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-heading text-[10px] tracking-widest uppercase flex items-center gap-2 ml-auto shadow-lg shadow-emerald-900/20"
                              >
                                {updatingId === order.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                                AUTHORIZE
                              </button>
                           ) : (
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                                className="p-3 bg-white/5 text-gray-500 hover:bg-white/10 hover:text-white rounded-xl transition-all ml-auto"
                                title="View Record Details"
                              >
                                <ExternalLink size={18} />
                              </button>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
               {filteredOrders.map(order => (
                 <div 
                   key={order.id} 
                   onClick={() => setSelectedOrder(order)}
                   className="bg-[#0A1628]/80 border-2 border-white/5 p-8 rounded-[2.5rem] hover:border-[#F97316]/40 transition-all group relative overflow-hidden cursor-pointer shadow-xl hover:translate-y-[-4px]"
                 >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F97316]/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-[#F97316]/10 transition-all duration-700" />
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                       <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#F97316] group-hover:scale-110 transition-transform">
                          <Smartphone size={28} />
                       </div>
                       <div className="pt-2">
                          {order.paymentStatus === 'Paid' ? (
                            <div className="bg-emerald-500/10 text-emerald-500 p-2 rounded-lg border border-emerald-500/20">
                               <ShieldCheck size={18} />
                            </div>
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.5)] animate-pulse" />
                          )}
                       </div>
                    </div>

                    <div className="space-y-5 mb-10 relative z-10">
                       <div>
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">IDENTIFICATION</p>
                          <p className="font-heading text-xl text-[#F97316] tracking-tight truncate">#{order.orderId}</p>
                       </div>
                       <div>
                          <p className="font-bold text-lg text-white mb-1">{order.customerName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-2"><Phone size={10} /> +91 {order.phone}</p>
                       </div>
                       <div className="pt-5 border-t border-white/5">
                          <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest mb-1.5">DEPLOYMENT VALUE</p>
                          <div className="flex items-end gap-2">
                             <p className="font-heading text-4xl tracking-tighter text-white">₹{order.totalAmount.toLocaleString()}</p>
                             <p className="text-[10px] text-gray-600 mb-1 font-bold tracking-widest uppercase">INR</p>
                          </div>
                       </div>
                    </div>

                    <div className="relative z-10 flex gap-3">
                       {order.paymentStatus !== 'Paid' ? (
                          <button 
                            onClick={(e) => updateStatus(e, order.id, 'Paid')}
                            disabled={updatingId === order.id}
                            className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-heading text-[11px] tracking-widest uppercase rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-900/10"
                          >
                             {updatingId === order.id ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                             AUTHORIZE
                          </button>
                       ) : (
                          <div className="flex-1 py-4 bg-white/5 text-[#F97316] font-heading text-[11px] tracking-widest uppercase rounded-2xl text-center border border-white/10 flex items-center justify-center gap-3">
                             <ShieldCheck size={16} /> SYNCED
                          </div>
                       )}
                       <button 
                         onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                         className="p-4 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white rounded-2xl border border-white/10 transition-all flex items-center justify-center"
                         title="View Manifest Details"
                       >
                          <ExternalLink size={18} />
                       </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                       <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">MANIFEST TIMESTAMP</p>
                       <p className="text-[8px] font-bold text-white uppercase tracking-widest">{format(new Date(order.createdAt), 'PP')}</p>
                    </div>
                 </div>
               ))}
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-52 text-center border-4 border-dashed border-white/5 rounded-[4rem] bg-white/2">
             <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-10 shadow-inner">
                <Smartphone size={50} className="text-gray-700" />
             </div>
             <h3 className="font-heading text-5xl text-gray-800 tracking-tighter mb-6 uppercase">NO DATA ECHOES</h3>
             <p className="text-gray-600 max-w-sm font-bold uppercase tracking-[0.2em] text-[10px] leading-relaxed px-6">The tracking matrix is currently silent. No active live-pay protocols have been detected within the current secure session.</p>
          </div>
        )}
      </section>

      {/* DETAIL MODAL - HIGH FIDELITY */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4 md:p-12 overflow-hidden pointer-events-auto">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedOrder(null)}
               className="absolute inset-0 bg-[#060B14]/95 backdrop-blur-3xl"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 40 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 40 }}
               className="relative w-full max-w-4xl bg-[#0A1628] border-2 border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto"
             >
                {/* Left Side - Visuals & Meta */}
                <div className="w-full md:w-[280px] bg-[#121D2F] p-10 flex flex-col items-center text-center gap-8 border-r border-white/5">
                   <div className="w-24 h-24 bg-[#F97316] rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-orange-500/20">
                      <Smartphone size={40} />
                   </div>
                   
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Transaction Reference</p>
                      <h2 className="font-heading text-3xl tracking-tight text-white mb-2">#{selectedOrder.orderId}</h2>
                      {selectedOrder.paymentStatus === 'Paid' ? (
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-500 text-white rounded-full font-heading text-[10px] tracking-widest uppercase">
                           <ShieldCheck size={14} /> AUTHORIZED
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#F97316] text-white rounded-full font-heading text-[10px] tracking-widest uppercase animate-pulse">
                           <Clock size={14} /> PENDING REVIEW
                        </div>
                      )}
                   </div>

                   <div className="mt-auto w-full pt-8 border-t border-white/5">
                      <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Registry Capture Time</p>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-300">{format(new Date(selectedOrder.createdAt), 'PPPP')}</p>
                        <p className="text-xs text-gray-500">{format(new Date(selectedOrder.createdAt), 'pp')}</p>
                      </div>
                   </div>
                </div>

                {/* Right Side - Content */}
                <div className="flex-1 p-10 md:p-14 overflow-y-auto custom-scrollbar space-y-12">
                   <button 
                     onClick={() => setSelectedOrder(null)}
                     className="absolute top-8 right-8 p-3 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                     title="Close Manifest"
                   >
                     <X size={24} />
                   </button>

                   {/* Grid 1: Client Metadata */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                         <div className="flex items-center gap-3 text-[#F97316]">
                            <Smartphone size={18} />
                            <h3 className="font-heading text-xs tracking-[0.3em] uppercase">Consignee Identity</h3>
                         </div>
                         <div className="space-y-3 pl-7">
                            <p className="text-3xl font-bold text-white leading-none">{selectedOrder.customerName}</p>
                            <div className="flex flex-col gap-2">
                               <p className="text-gray-400 text-sm flex items-center gap-3 font-bold"><Phone size={14} className="text-gray-600" /> +91 {selectedOrder.phone}</p>
                               <p className="text-gray-400 text-sm flex items-center gap-3 font-bold"><Mail size={14} className="text-gray-600" /> {selectedOrder.email}</p>
                               <p className="text-emerald-500 text-xs font-black tracking-widest flex items-center gap-3 mt-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10"><Smartphone size={14} /> UTR: {selectedOrder.transactionId || 'N/A'}</p>
                            </div>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="flex items-center gap-3 text-blue-400">
                            <MapPin size={18} />
                            <h3 className="font-heading text-xs tracking-[0.3em] uppercase">Surface Domain Address</h3>
                         </div>
                         <div className="pl-7">
                            <p className="text-gray-300 text-sm font-bold leading-relaxed uppercase">
                               {selectedOrder.address}
                            </p>
                         </div>
                      </div>
                   </div>

                   {/* Section 2: Artifact Snapshot (Products) */}
                   <div className="space-y-6 pt-10 border-t border-white/5">
                      <div className="flex items-center gap-3 text-gray-500">
                         <Package size={18} />
                         <h3 className="font-heading text-xs tracking-[0.3em] uppercase font-bold">Hardware Manifest (Products)</h3>
                      </div>
                      <div className="space-y-4">
                        {JSON.parse(selectedOrder.products || '[]').map((item: any, idx: number) => (
                           <div key={idx} className="flex items-center justify-between p-6 bg-white/2 border border-white/5 rounded-2xl hover:border-white/15 transition-all">
                              <div className="flex items-center gap-5">
                                 <div className="w-12 h-12 bg-[#060B14] rounded-xl flex items-center justify-center font-black text-gray-600">
                                    {item.quantity}×
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="font-bold text-base text-gray-100">{item.name}</p>
                                    <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Unit Artifact</p>
                                 </div>
                              </div>
                              <p className="font-heading text-lg text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                           </div>
                        ))}
                      </div>
                   </div>

                   {/* Footer - Actions & Total */}
                   <div className="pt-10 mt-10 border-t-2 border-dashed border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
                      <div>
                         <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em] mb-2">Aggregate Settlement</p>
                         <div className="flex items-end gap-3">
                            <p className="font-heading text-6xl tracking-tighter text-white">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                            <p className="text-sm font-black text-[#F97316] mb-2 uppercase tracking-widest">Protocol Value</p>
                         </div>
                      </div>

                      <div className="flex gap-4 w-full md:w-auto">
                        {selectedOrder.paymentStatus !== 'Paid' ? (
                           <button 
                             onClick={(e) => updateStatus(e, selectedOrder.id, 'Paid')}
                             disabled={updatingId === selectedOrder.id}
                             className="flex-1 md:flex-none px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-heading text-xs tracking-widest uppercase rounded-2xl transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-500/20"
                           >
                              {updatingId === selectedOrder.id ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                              EXECUTE AUTHORIZATION
                           </button>
                        ) : (
                           <div className="flex-1 md:flex-none px-12 py-5 bg-white/5 border border-white/10 text-emerald-400 font-heading text-xs tracking-widest uppercase rounded-2xl flex items-center gap-4 cursor-default">
                              <ShieldCheck size={20} /> ARCHIVE SYNCED
                           </div>
                        )}
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
