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
  User,
  Calendar,
  CreditCard,
  MapPin
} from 'lucide-react';

export default function CustomerOrderManagement() {
  const [mounted, setMounted] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState<'All' | 'Today' | 'Week' | 'Month'>('All');
  const [isEditingOrder, setIsEditingOrder] = useState<any>(null);
  const [editForm, setEditForm] = useState({ phone: '', address: '', orderStatus: '', paymentMethod: '' });

  useEffect(() => {
    setMounted(true);
    fetchOrders();

    const handleClickOutside = () => setShowOptionsId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/admin/customer-orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateStatus = async (id: string, newOrderStatus?: string, newPaymentStatus?: string) => {
    setUpdatingId(id);
    try {
      const body: any = { id };
      if (newOrderStatus) body.orderStatus = newOrderStatus;
      if (newPaymentStatus) body.paymentStatus = newPaymentStatus;

      const order = orders.find(o => o.id === id);
      if (newOrderStatus === 'Delivered' && order?.paymentMethod === 'COD') {
        body.paymentStatus = 'Paid';
      }

      const res = await fetch('/api/admin/customer-orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await fetchOrders(true);
        setShowOptionsId(null);
        // Show success briefly
        const btn = document.querySelector(`[data-order-id="${id}"]`);
        if (btn) {
          (btn as HTMLElement).innerText = 'COMMITTED';
          setTimeout(() => { if (btn) (btn as HTMLElement).innerText = 'COMMIT CHANGES'; }, 2000);
        }
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleEditDetails = async () => {
    if (!isEditingOrder) return;
    setUpdatingId(isEditingOrder.id);
    try {
      const res = await fetch('/api/admin/customer-orders/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: isEditingOrder.id,
          phone: editForm.phone,
          address: editForm.address,
          orderStatus: editForm.orderStatus,
          paymentMethod: editForm.paymentMethod
        })
      });
      if (res.ok) {
        await fetchOrders(true);
        setIsEditingOrder(null);
      }
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const exportToCSV = () => {
    const headers = ['Order ID', 'Customer', 'Phone', 'Total Amount', 'Payment Method', 'Payment Status', 'Order Status', 'Date'];
    const rows = filteredOrders.map(o => [
      o.id,
      o.customerName,
      o.phone,
      o.totalAmount,
      o.paymentMethod,
      o.paymentStatus,
      o.orderStatus,
      new Date(o.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `satya_customer_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCounts = (tabName: string) => {
    if (tabName === 'All') return orders.length;
    if (['COD', 'UPI'].includes(tabName)) {
      return orders.filter(o => o.paymentMethod === tabName).length;
    }
    return orders.filter(o => o.orderStatus === tabName).length;
  };

  const filteredOrders = orders.filter(order => {
    // Tab Filter
    const matchesTab = filter === 'All' || 
                       ( ['COD', 'UPI'].includes(filter) ? order.paymentMethod === filter : order.orderStatus === filter );
    
    // Search Filter
    const searchLow = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                          order.customerName?.toLowerCase().includes(searchLow) ||
                          order.orderId?.toLowerCase().includes(searchLow) ||
                          order.phone?.includes(searchTerm);
    
    // Date Filter
    let matchesDate = true;
    if (dateFilter !== 'All') {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      if (dateFilter === 'Today') {
        matchesDate = orderDate.toDateString() === today.toDateString();
      } else if (dateFilter === 'Week') {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        matchesDate = orderDate >= weekAgo;
      } else if (dateFilter === 'Month') {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        matchesDate = orderDate >= monthAgo;
      }
    }

    return matchesTab && matchesSearch && matchesDate;
  });

  if (!mounted) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#0A1628]">Customer Orders (B2C)</h1>
          <p className="text-gray-500 text-sm">Review retail purchases via COD and UPI.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="bg-[#0A1628] text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-[#F97316] transition-all shadow-lg active:scale-95"
        >
          <Download size={18} /> EXPORT CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-px overflow-x-auto no-scrollbar">
        {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'COD', 'UPI'].map((tab) => {
          const count = getCounts(tab);
          return (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 font-heading text-xs font-black uppercase tracking-[0.2em] transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                filter === tab ? 'border-[#F97316] text-[#F97316]' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                  filter === tab ? 'bg-orange-100 text-[#F97316]' : 'bg-gray-100 text-gray-400'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Customer, ID, or Phone..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 bg-white shadow-sm focus:border-[#F97316] outline-none transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-[0.2em] ${
              showAdvancedFilters || dateFilter !== 'All' ? 'bg-[#0A1628] text-white border-transparent' : 'bg-white border-gray-100 text-gray-400 hover:text-[#0A1628]'
            }`}
          >
             <Filter size={14} className={showAdvancedFilters || dateFilter !== 'All' ? 'text-[#F97316]' : 'text-gray-300'} /> 
             {dateFilter === 'All' ? 'ADVANCED FILTER' : `TIME: ${dateFilter}`}
          </button>

          {showAdvancedFilters && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
               <p className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Time Horizon</p>
               {['All', 'Today', 'Week', 'Month'].map((t: any) => (
                 <button
                   key={t}
                   onClick={() => {
                     setDateFilter(t);
                     setShowAdvancedFilters(false);
                   }}
                   className={`w-full text-left px-5 py-2 text-xs font-bold transition-colors ${
                     dateFilter === t ? 'text-[#F97316] bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A1628]'
                   }`}
                 >
                   {t === 'All' ? 'Reset All Time' : `Last ${t}`}
                 </button>
               ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] bg-gray-100/50 px-4 py-2 rounded-xl">
           <span className="text-[#F97316]">{filteredOrders.length}</span> MATCHES
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="bg-white p-20 rounded-[2.5rem] flex flex-col items-center gap-4 border border-gray-50">
             <div className="w-10 h-10 border-4 border-gray-100 border-t-[#F97316] rounded-full animate-spin" />
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Hydrating Data Stream...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-20 rounded-[2.5rem] text-center border border-gray-100 shadow-sm">
             <div className="w-16 h-16 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={32} />
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest">Zero matches detected</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            let parsedProducts: any[] = [];
            try {
              parsedProducts = JSON.parse(order.products || '[]');
            } catch (e) {
              console.error(e);
            }

            return (
            <div
              key={order.id}
              className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#F97316]/20 transition-all group flex flex-col gap-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-6 pb-6 border-b border-gray-50">
                <div className="flex items-center gap-5 min-w-[280px]">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                    <User size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0A1628] leading-tight group-hover:text-[#F97316] transition-colors">{order.customerName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {order.orderId}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">B2C Retail</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 flex-1">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">CONTACT</p>
                    <p className="text-sm font-bold text-[#0A1628]">{order.phone}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">{order.email}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">TELEMETRY / VALUE</p>
                    <p className="text-sm font-bold text-[#0A1628]">{parsedProducts.length} Products</p>
                    <p className="text-sm font-black text-[#F97316]">₹{order.totalAmount?.toLocaleString()}</p>
                  </div>

                  <div className="hidden md:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">PAYMENT / TIMING</p>
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center w-fit px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${order.paymentMethod === 'COD' ? 'bg-[#F97316]' : 'bg-blue-600'}`}>
                        {order.paymentMethod}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-[#0A1628] font-bold mt-1">
                        <Calendar size={12} className="text-[#F97316]" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="flex items-center gap-6">
                    {updatingId === order.id && (
                      <div className="w-4 h-4 border-2 border-gray-100 border-t-[#F97316] rounded-full animate-spin" />
                    )}
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${
                        order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        order.orderStatus === 'Processing' ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' :
                        order.orderStatus === 'Shipped' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        'bg-red-50 text-red-600 border-red-100'
                      }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                        order.paymentStatus === 'Paid' ? 'text-emerald-600 flex items-center gap-1.5' : 'text-orange-500'
                      }`}>
                        {order.paymentStatus === 'Paid' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                        Pay: {order.paymentStatus || 'Pending'}
                      </span>
                    </div>

                  <div className="flex items-center bg-gray-50/50 p-1.5 rounded-2xl gap-1.5 shadow-inner">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      title="Audit Trace Analysis"
                      className="w-12 h-12 rounded-xl bg-white text-gray-400 hover:text-[#0A1628] transition-all flex items-center justify-center shadow-sm border border-gray-100 hover:border-[#0A1628]/20"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingOrder(order);
                        setEditForm({ 
                          phone: order.phone || '', 
                          address: order.address || '',
                          orderStatus: order.orderStatus || 'Processing',
                          paymentMethod: order.paymentMethod || 'COD'
                        });
                      }}
                      title="Edit Order Parameters"
                      className="w-12 h-12 rounded-xl bg-white text-gray-400 hover:text-blue-500 transition-all flex items-center justify-center shadow-sm border border-gray-100 hover:border-blue-200"
                    >
                      <Search className="rotate-0" size={18} />
                    </button>
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowOptionsId(showOptionsId === order.id ? null : order.id);
                        }}
                        title="Status Control Parameters"
                        className={`w-12 h-12 rounded-xl border transition-all flex items-center justify-center shadow-sm ${
                          showOptionsId === order.id ? 'bg-[#0A1628] text-white border-transparent' : 'bg-white border-gray-100 text-gray-400 hover:border-[#0A1628] hover:text-[#0A1628]'
                        }`}
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {showOptionsId === order.id && (
                        <div className="absolute right-0 top-14 w-56 bg-white rounded-[2rem] shadow-2xl border border-gray-100 py-4 z-[100] animate-in slide-in-from-top-2 zoom-in-95 duration-200 overflow-hidden">
                          <div className="px-5 pb-3 border-b border-gray-50 mb-2">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status Intelligence</p>
                             <p className="text-[10px] font-bold text-[#0A1628]">Assigning node status...</p>
                          </div>
                          
                          <div className="px-3 space-y-1">
                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleUpdateStatus(order.id, s, undefined)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/item ${
                                  order.orderStatus === s ? 'text-[#F97316] bg-orange-50/50' : 'text-gray-600 hover:bg-gray-50 hover:px-5 hover:text-[#0A1628]'
                                }`}
                              >
                                {s}
                                {order.orderStatus === s && <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />}
                              </button>
                            ))}
                          </div>
                          
                          <div className="px-5 py-3 border-y border-gray-50 my-2">
                             <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Financial Integrity</p>
                          </div>
                          
                          <div className="px-3 space-y-1">
                            {['Pending', 'Paid'].map((s) => (
                              <button
                                key={s}
                                onClick={() => handleUpdateStatus(order.id, undefined, s)}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group/item ${
                                  order.paymentStatus === s ? 'text-emerald-500 bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-50 hover:px-5 hover:text-[#0A1628]'
                                }`}
                              >
                                {s}
                                {order.paymentStatus === s && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Order products summarized visual */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {parsedProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl flex-shrink-0 border border-gray-100">
                    <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden border border-gray-200">
                       {p.image ? (
                         <img src={p.image.startsWith('http') ? p.image : `/${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                       ) : (
                         <div className="text-xs text-gray-300">Img</div>
                       )}
                    </div>
                    <div>
                       <p className="text-xs font-bold text-[#0A1628] max-w-[150px] truncate">{p.name || 'Product'}</p>
                       <p className="text-[10px] text-gray-500 font-bold">Qty: {p.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )})
        )}
      </div>

      {/* Modal - Audit Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
           <div className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-xl" onClick={() => setSelectedOrder(null)} />
           <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-[3rem] shadow-2xl animate-in custom-scrollbar">
              <div className="p-10 border-b border-gray-50 flex justify-between items-start sticky top-0 bg-white/90 backdrop-blur-md z-10">
                 <div>
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-[#F97316] text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Retail Order Details</span>
                    <h2 className="text-3xl font-heading font-black text-[#0A1628] uppercase">{selectedOrder.customerName}</h2>
                    <p className="text-gray-400 font-bold text-xs mt-1 tracking-widest uppercase">Order ID: {selectedOrder.orderId}</p>
                 </div>
                 <button 
                    onClick={() => setSelectedOrder(null)} 
                    title="Close Overlay"
                    className="w-12 h-12 rounded-full bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                 >
                    <Search className="rotate-45" size={24} />
                 </button>
              </div>
              
              <div className="p-10 space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group/status cursor-pointer relative overflow-hidden" 
                         onClick={() => setShowOptionsId(showOptionsId === selectedOrder.id ? null : selectedOrder.id)}>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-2"><CreditCard size={14} /> Method & Status</p>
                       <p className="text-xl font-bold text-[#0A1628] uppercase flex items-center gap-2">
                         {selectedOrder.paymentMethod}
                         <span className="text-[10px] bg-white border border-gray-100 px-2 rounded-full text-gray-300">Edit</span>
                       </p>
                       <p className={`text-sm font-black mt-1 uppercase tracking-widest ${selectedOrder.paymentStatus === 'Paid' ? 'text-emerald-500' : 'text-orange-500'}`}>
                         {selectedOrder.paymentStatus}
                       </p>

                       {showOptionsId === selectedOrder.id && (
                         <div className="absolute inset-0 bg-white z-10 p-4 border border-[#F97316] animate-in slide-in-from-bottom-2">
                            <p className="text-[8px] font-black text-gray-300 mb-2 uppercase">Switch Payment Status</p>
                            <div className="flex gap-2">
                               {['Pending', 'Paid'].map(s => (
                                 <button key={s} onClick={(e) => { e.stopPropagation(); handleUpdateStatus(selectedOrder.id, undefined, s); setSelectedOrder({...selectedOrder, paymentStatus: s}); }} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${selectedOrder.paymentStatus === s ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-400'}`}>{s}</button>
                               ))}
                            </div>
                            <button className="w-full mt-2 text-[8px] font-black uppercase text-[#F97316]" onClick={(e) => { e.stopPropagation(); setShowOptionsId(null); }}>Close Control</button>
                         </div>
                       )}
                    </div>

                    <div className="p-6 bg-orange-50 rounded-3xl border border-orange-100 relative group/order cursor-pointer"
                         onClick={() => setShowOptionsId(showOptionsId === `status-${selectedOrder.id}` ? null : `status-${selectedOrder.id}`)}>
                       <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Workflow Status</p>
                       <p className="text-xl font-black text-[#F97316] uppercase truncate">{selectedOrder.orderStatus || 'Pending'}</p>
                       <p className="text-[10px] text-orange-600/40 font-black mt-1 uppercase tracking-tighter">Click to sync with database</p>
                       
                       {showOptionsId === `status-${selectedOrder.id}` && (
                         <div className="absolute inset-0 bg-white z-10 p-4 border border-[#F97316] animate-in slide-in-from-bottom-2 grid grid-cols-2 gap-2">
                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                              <button key={s} onClick={(e) => { e.stopPropagation(); handleUpdateStatus(selectedOrder.id, s, undefined); setSelectedOrder({...selectedOrder, orderStatus: s}); }} className={`px-1 py-2 rounded-lg text-[9px] font-bold ${selectedOrder.orderStatus === s ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                {updatingId === selectedOrder.id ? 'SYNCING' : s}
                              </button>
                            ))}
                            <button className="col-span-2 text-[8px] font-black uppercase text-[#F97316]" onClick={(e) => { e.stopPropagation(); setShowOptionsId(null); }}>Commit & Close</button>
                         </div>
                       )}
                    </div>

                    <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 lg:col-span-2">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2"><MapPin size={14} /> Shipping Destination</p>
                       <p className="text-sm font-bold text-[#0A1628] line-clamp-2">{selectedOrder.address}</p>
                       <div className="flex gap-4 mt-3">
                         <a href={`tel:${selectedOrder.phone}`} className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                           <Phone size={12} /> {selectedOrder.phone}
                         </a>
                         <button 
                           onClick={() => {
                             setIsEditingOrder(selectedOrder);
                             setEditForm({ 
                               phone: selectedOrder.phone || '', 
                               address: selectedOrder.address || '',
                               orderStatus: selectedOrder.orderStatus || 'Processing',
                               paymentMethod: selectedOrder.paymentMethod || 'COD'
                             });
                           }}
                           className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
                         >
                           <Search size={12} className="rotate-0" /> Edit Logistics
                         </button>
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 pt-6 border-t border-gray-50">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Product Allocation</h4>
                    <div className="bg-white border text-sm border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                       <table className="w-full text-left border-collapse">
                         <thead>
                           <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                             <th className="p-4">Product</th>
                             <th className="p-4 text-center">Qty</th>
                             <th className="p-4 text-right">Price</th>
                             <th className="p-4 text-right">Subtotal</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-50">
                           {(() => {
                              let prods: any[] = [];
                              try { prods = JSON.parse(selectedOrder.products); } catch (e) {}
                              return prods.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="p-4 flex items-center gap-4">
                                     <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 p-1">
                                       {item.image ? (
                                         <img src={item.image.startsWith('http') ? item.image : `/${item.image}`} className="w-full h-full object-contain" alt="" />
                                       ) : <div className="w-full h-full bg-gray-50 rounded" />}
                                     </div>
                                     <span className="font-bold text-[#0A1628]">{item.name || 'Unknown Product'}</span>
                                  </td>
                                  <td className="p-4 text-center font-bold text-gray-600">{item.quantity}</td>
                                  <td className="p-4 text-right font-medium text-gray-600">₹{(item.price || 0).toLocaleString()}</td>
                                  <td className="p-4 text-right font-black text-[#F97316]">₹{(item.quantity * (item.price || 0)).toLocaleString()}</td>
                                </tr>
                              ));
                           })()}
                         </tbody>
                       </table>
                    </div>
                 </div>
              </div>
              <div className="p-10 bg-gray-50/50 flex gap-4 sticky bottom-0 border-t border-gray-100">
                 <button onClick={() => setSelectedOrder(null)} className="flex-1 py-4 bg-[#0A1628] text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-[#F97316] transition-all">Close Viewer</button>
              </div>
           </div>
        </div>
      )}

      {/* Modal - Edit Form */}
      {isEditingOrder && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 sm:p-12">
            <div className="absolute inset-0 bg-[#0A1628]/60 backdrop-blur-md" onClick={() => setIsEditingOrder(null)} />
            <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300 p-10">
                <div className="mb-8">
                   <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-3 inline-block">Parameter Adjustment</span>
                   <h3 className="text-2xl font-black text-[#0A1628]">Edit Order Logistics</h3>
                   <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">ID: {isEditingOrder.orderId}</p>
                </div>

                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label htmlFor="edit-status" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Workflow Node</label>
                         <select 
                           id="edit-status"
                           className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm appearance-none"
                           value={editForm.orderStatus}
                           onChange={(e) => setEditForm({...editForm, orderStatus: e.target.value})}
                         >
                            {['Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                         </select>
                      </div>
                      <div>
                         <label htmlFor="edit-payment" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Payment Method</label>
                         <select 
                           id="edit-payment"
                           className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm appearance-none"
                           value={editForm.paymentMethod}
                           onChange={(e) => setEditForm({...editForm, paymentMethod: e.target.value})}
                         >
                            {['COD', 'UPI'].map(m => <option key={m} value={m}>{m}</option>)}
                         </select>
                      </div>
                   </div>

                   <div>
                      <label htmlFor="edit-phone" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Contact Phone</label>
                      <input 
                        id="edit-phone"
                        type="text" 
                        placeholder="e.g. +91 9876543210"
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                      />
                   </div>
                   <div>
                      <label htmlFor="edit-address" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 px-1">Shipping Destination</label>
                      <textarea 
                        id="edit-address"
                        placeholder="Full delivery address..."
                        className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm min-h-[100px]"
                        value={editForm.address}
                        onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                      />
                   </div>
                </div>

                <div className="flex gap-4 mt-10 text-xs font-black uppercase tracking-widest">
                   <button 
                     onClick={() => setIsEditingOrder(null)}
                     className="flex-1 py-4 bg-gray-100 text-gray-400 rounded-2xl hover:bg-gray-200 transition-all active:scale-95"
                   >
                     Cancel
                   </button>
                   <button 
                     onClick={handleEditDetails}
                     disabled={updatingId === isEditingOrder.id}
                     className="flex-1 py-4 bg-[#0A1628] text-white rounded-2xl hover:bg-[#F97316] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                   >
                     {updatingId === isEditingOrder.id ? (
                        <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     ) : 'Commit Changes'}
                   </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
