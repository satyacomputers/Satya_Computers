'use client';

import { useState, useEffect } from 'react';
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
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderManagement() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchOrders();

    const handleClickOutside = () => setShowOptionsId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch protocols failed:', err);
    } finally {
      setLoading(false);
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
        // Optimistic refresh
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
        setShowOptionsId(null);
      } else {
        const errorData = await res.json();
        alert(`System Alert: ${errorData.error || 'Protocol Update Rejected'}`);
      }
    } catch (err) {
      console.error('Update synchronization failed:', err);
      alert('Network Link Disrupted. Verify connection.');
    } finally {
      setProcessingId(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Identity', 'Corporate_Entity', 'Focal_Point', 'Unit_Count', 'Valuation_INR', 'Lifecycle_Status', 'Timestamp'];
    const rows = filteredOrders.map(o => [
      o.orderId || o.id,
      `"${o.companyName?.replace(/"/g, '""')}"`,
      `"${o.contactPerson?.replace(/"/g, '""')}"`,
      o.totalUnits,
      o.estimatedValue,
      o.status,
      new Date(o.createdAt).toISOString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `SATYA_LOGISTICS_LOG_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(order => {
    // Robust case-insensitive and fuzzy matching
    const orderStatus = order.status || 'Pending';
    const matchesFilter = filter === 'All' || orderStatus.toLowerCase() === filter.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      order.companyName?.toLowerCase().includes(searchLower) ||
      order.contactPerson?.toLowerCase().includes(searchLower) ||
      order.id?.toLowerCase().includes(searchLower) ||
      order.orderId?.toLowerCase().includes(searchLower);
      
    return matchesFilter && matchesSearch;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-8 p-4 lg:p-0 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">
            BULK <span className="text-gray-300">/ LOGISTICS</span>
          </h1>
          <p className="text-gray-500 font-medium mt-1">Strategic oversight of enterprise-tier hardware acquisitions and corporate contracts.</p>
        </div>
        <button
          onClick={exportToCSV}
          disabled={filteredOrders.length === 0}
          title="Export CSV Telemetry"
          className="bg-[#0A1628] text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-4 hover:bg-[#F97316] transition-all shadow-2xl active:scale-95 disabled:opacity-30 disabled:grayscale group"
        >
          <Download size={18} className="group-hover:translate-y-1 transition-transform" /> EXPORT TELEMETRY
        </button>
      </div>

      {/* High-Contrast Nav System */}
      <div className="flex gap-4 p-2 bg-gray-50/50 rounded-[2.5rem] border border-gray-100 overflow-x-auto no-scrollbar">
        {['All', 'Pending', 'Quote Sent', 'Confirmed', 'Delivered', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            title={`Show ${tab} Records`}
            className={`px-4 py-3 md:px-8 md:py-4 rounded-2xl font-heading text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all ${
              filter === tab 
                ? 'bg-white text-[#F97316] shadow-xl shadow-orange-950/5 border border-orange-100' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Control Interface */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="relative flex-1 group max-w-2xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#F97316] transition-colors" size={24} />
          <input
            type="text"
            placeholder="Identity scan: Company, User, or Protocol ID..."
            className="w-full pl-16 pr-8 py-5 rounded-[2.5rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all text-sm font-bold text-[#0A1628] shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-6 px-10 py-5 bg-white rounded-[2rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
           <div className="flex items-center gap-3">
              <Filter size={14} className="text-[#F97316]" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredOrders.length} Records Locked</span>
           </div>
        </div>
      </div>

      {/* Data Visualization Matrix */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="bg-white p-32 rounded-[4rem] flex flex-col items-center gap-8 border border-gray-50 shadow-sm">
             <div className="w-16 h-16 border-[6px] border-gray-50 border-t-[#F97316] rounded-full animate-spin" />
             <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-[10px]">Accessing Secure Ledger...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-32 rounded-[4rem] text-center border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
             <div className="w-24 h-24 bg-gray-50 text-gray-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8">
                <Search size={48} />
             </div>
             <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-sm">No synchronized assets identified</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 md:p-10 rounded-[3rem] border border-gray-100 shadow-[0_8px_30_rgb(0,0,0,0.02)] hover:shadow-2xl hover:border-[#F97316]/20 transition-all group flex flex-wrap items-center justify-between gap-10"
              >
                <div className="flex items-center gap-8 min-w-[280px]">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-[2rem] md:rounded-[2.5rem] bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-hover:bg-[#F97316]/5 group-hover:text-[#F97316] group-hover:border-[#F97316]/10 transition-all shadow-inner" title="Corporate Entity">
                    <Building2 size={36} />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-[#0A1628] leading-tight group-hover:text-[#F97316] transition-colors uppercase tracking-tight">
                      {order.companyName || 'Private Enterprise'}
                    </h3>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: ORDER-{ (order.orderId || order.id).toString().substring(0,8).toUpperCase()}</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-200" />
                      <span className="text-[10px] font-black text-[#F97316] uppercase tracking-widest opacity-70">B2B Class</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 opacity-60">Decision Maker</p>
                    <p className="text-md font-bold text-[#0A1628] uppercase">{order.contactPerson || 'System Entry'}</p>
                    <div className="flex gap-5 mt-4">
                      {order.email && (
                        <a 
                          href={`mailto:${order.email}`} 
                          title="Contact Client via Email"
                          className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      {order.phone && (
                        <a 
                          href={`tel:${order.phone}`} 
                          title="Contact Client via Voice"
                          className="p-3 rounded-xl bg-gray-50 text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 opacity-60">Telemetry / Value</p>
                    <p className="text-md font-bold text-[#0A1628]">{order.totalUnits} UNITS PROVISIONED</p>
                    <p className="text-xl font-heading font-black text-[#F97316] mt-1">₹{Number(order.estimatedValue).toLocaleString()}</p>
                  </div>

                  <div className="hidden xl:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 opacity-60">Registry Stamp</p>
                    <div className="flex items-center gap-3 text-md text-[#0A1628] font-bold">
                      <Calendar size={18} className="text-[#F97316] opacity-50" />
                      {new Date(order.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-1">Synchronization Active</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border ${
                    order.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    order.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' :
                    order.status === 'Quote Sent' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                    order.status === 'Delivered' ? 'bg-gray-100 text-gray-500 border-gray-200' :
                    'bg-red-50 text-red-600 border-red-100'
                  }`} title={`Order is currently ${order.status}`}>
                    {order.status}
                  </div>

                  <div className="flex items-center bg-gray-100/50 p-2 rounded-[2rem] gap-3 shadow-inner border border-gray-100">
                    {order.status === 'Pending' && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.id, 'Confirmed'); }}
                        disabled={processingId === order.id}
                        title="Approve Order"
                        className="px-8 h-12 md:h-14 rounded-2xl bg-[#0A1628] text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#F97316] transition-all shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-3"
                      >
                        {processingId === order.id ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                        Approve
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                      title="Initiate Deep-Trace Audit"
                      className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white text-gray-400 hover:text-[#0A1628] hover:border-[#0A1628]/20 transition-all flex items-center justify-center shadow-sm border border-gray-100 active:scale-90"
                    >
                      <Eye size={22} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOptionsId(showOptionsId === order.id ? null : order.id);
                        }}
                        title="Open Control Parameters"
                        className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl border transition-all flex items-center justify-center shadow-sm ${
                          showOptionsId === order.id ? 'bg-[#0A1628] text-white border-transparent' : 'bg-white border-gray-100 text-gray-400 hover:border-[#0A1628]'
                        }`}
                      >
                        <MoreHorizontal size={22} />
                      </button>

                      {showOptionsId === order.id && (
                        <div className="absolute right-0 top-16 w-56 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 py-4 z-[100] overflow-hidden animate-in slide-in-from-top-2">
                          <p className="px-6 py-2 text-[8px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-2">Internal Override</p>
                          {['Pending', 'Quote Sent', 'Confirmed', 'Delivered', 'Cancelled'].map((s) => (
                            <button
                              key={s}
                              disabled={processingId === order.id}
                              title={`Set Status to ${s}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateStatus(order.id, s);
                              }}
                              className={`w-full text-left px-6 py-3 text-xs font-bold transition-all flex items-center justify-between ${
                                order.status === s ? 'text-[#F97316] bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A1628]'
                              }`}
                            >
                              {s}
                              {order.status === s && <CheckCircle2 size={12} />}
                            </button>
                          ))}
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

      {/* Audit Overlay Component */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-[#0A1628]/95 backdrop-blur-3xl" 
               onClick={() => setSelectedOrder(null)} 
             />
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="relative w-full max-w-4xl bg-white rounded-[4rem] shadow-2xl overflow-hidden"
             >
                <div className="p-12 md:p-16 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                   <div className="space-y-4">
                      <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-orange-50 border border-orange-100">
                         <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
                         <span className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.2em]">Deep-Trace Audit Active</span>
                      </div>
                      <h2 className="text-4xl md:text-5xl font-heading font-black text-[#0A1628] leading-tight uppercase tracking-tighter">
                        {selectedOrder.companyName}
                      </h2>
                      <div className="flex items-center gap-6">
                         <p className="text-gray-400 font-black text-xs tracking-widest uppercase">Registry ID: {selectedOrder.orderId || selectedOrder.id}</p>
                         <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${selectedOrder.status === 'Confirmed' ? 'text-emerald-500' : 'text-orange-500'}`}>
                            Status: {selectedOrder.status}
                         </span>
                      </div>
                   </div>
                   <button 
                      onClick={() => setSelectedOrder(null)} 
                      title="Close Audit Trace"
                      className="w-16 h-16 rounded-full bg-gray-50 text-gray-400 hover:bg-white hover:text-red-500 hover:shadow-2xl transition-all flex items-center justify-center border border-transparent hover:border-red-100 group"
                   >
                      <XCircle size={32} className="group-hover:rotate-90 transition-transform" />
                   </button>
                </div>

                <div className="p-12 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="space-y-10">
                      <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100 shadow-inner group">
                         <div className="flex items-center gap-4 mb-6">
                            <Building2 className="text-[#F97316]" size={20} />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest underline decoration-orange-200 decoration-4 underline-offset-4">Decision Maker</p>
                         </div>
                         <p className="text-3xl font-heading font-black text-[#0A1628] uppercase">{selectedOrder.contactPerson}</p>
                         <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-4 text-gray-500">
                               <Mail size={16} className="text-[#F97316]/50" />
                               <span className="text-sm font-bold">{selectedOrder.email}</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-500">
                               <Phone size={16} className="text-[#F97316]/50" />
                               <span className="text-sm font-bold">{selectedOrder.phone}</span>
                            </div>
                         </div>
                      </div>

                      <div className="p-10 bg-[#0A1628] rounded-[3rem] shadow-2xl relative overflow-hidden">
                         <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                               <FileText className="text-[#F97316]" size={20} />
                               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Technical Payload</p>
                            </div>
                            <p className="text-3xl font-heading font-black text-white uppercase">{selectedOrder.totalUnits} Units Provisioned</p>
                            <p className="text-4xl font-heading font-black text-[#F97316] mt-4 tracking-tighter">₹{Number(selectedOrder.estimatedValue).toLocaleString()}</p>
                         </div>
                         <div className="absolute top-0 right-0 p-12 opacity-10 blur-[80px]">
                            <div className="w-48 h-48 rounded-full bg-[#F97316]" />
                         </div>
                      </div>
                   </div>

                   <div className="space-y-10">
                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] px-4">Registry Timeline</h4>
                        <div className="space-y-6 relative before:absolute before:left-[1.85rem] before:top-4 before:bottom-4 before:w-px before:bg-gray-100">
                           <div className="flex gap-6 items-start relative">
                              <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-white shadow-lg flex items-center justify-center text-emerald-500 shrink-0 relative z-10">
                                 <CheckCircle2 size={24} />
                              </div>
                              <div className="pt-2">
                                 <p className="text-sm font-black text-[#0A1628] uppercase tracking-tight">Order Initialized</p>
                                 <p className="text-[10px] font-bold text-gray-400 mt-1">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                                 <p className="text-[10px] text-emerald-600/60 font-black uppercase tracking-widest mt-2">Protocol: SECURE_CHANNEL_ALPHA</p>
                              </div>
                           </div>
                           <div className="flex gap-6 items-start relative opacity-30">
                              <div className="w-16 h-16 rounded-full bg-gray-50 border-4 border-white shadow-lg flex items-center justify-center text-gray-300 shrink-0 relative z-10">
                                 <Calendar size={24} />
                              </div>
                              <div className="pt-2">
                                 <p className="text-sm font-black text-gray-400 uppercase tracking-tight">Deployment Pending</p>
                                 <p className="text-[10px] font-bold text-gray-300 mt-1">Awaiting Logistics Sync</p>
                              </div>
                           </div>
                        </div>
                      </div>

                      <div className="pt-10 border-t border-gray-100 flex gap-6">
                         <button 
                           onClick={() => setSelectedOrder(null)} 
                           title="Finalize Data Audit"
                           className="flex-1 py-6 bg-[#0A1628] text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#F97316] transition-all shadow-xl active:scale-95"
                         >
                            Finalize Audit
                         </button>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             const auditTrace = `SATYA LOGISTICS - AUDIT TRACE\nIDENTITY: ${selectedOrder.orderId || selectedOrder.id}\nCOMPANY: ${selectedOrder.companyName}\nVALUATION: ₹${Number(selectedOrder.estimatedValue).toLocaleString()}\nSTATUS: ${selectedOrder.status}\nPHASE: Post-Audit Ledger Initialization\nTIMESTAMP: ${new Date().toISOString()}`;
                             const blob = new Blob([auditTrace], { type: 'text/plain' });
                             const url = URL.createObjectURL(blob);
                             const a = document.createElement('a');
                             a.href = url;
                             a.download = `audit_trace_${selectedOrder.id.substring(0,8)}.txt`;
                             a.click();
                           }}
                           title="Download Physical Audit Ledger"
                           className="w-20 h-20 rounded-[2rem] border-2 border-gray-100 text-gray-300 hover:text-[#F97316] hover:border-[#F97316]/20 transition-all flex items-center justify-center active:scale-90"
                         >
                            <Download size={24} />
                         </button>
                      </div>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
