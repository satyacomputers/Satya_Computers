'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  PhoneCall, 
  MapPin, 
  PhoneOff, 
  XCircle, 
  ShoppingBag, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  PackageCheck,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function StandaloneDashboardPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('standalone_dashboard_auth');
    if (saved === 'Satya@2323') {
      setIsAuthenticated(true);
      setPassword('Satya@2323');
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Satya@2323') {
      setIsAuthenticated(true);
      localStorage.setItem('standalone_dashboard_auth', 'Satya@2323');
      setPasswordError('');
    } else {
      setPasswordError('Invalid Security Passcode! Access Denied.');
    }
  };

  const fetchLeads = async (dateStr: string = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leads${dateStr ? `?date=${encodeURIComponent(dateStr)}` : ''}`);
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        console.error(json.error);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads(selectedDate);
    }
  }, [isAuthenticated, selectedDate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A1628] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#112240] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl text-white text-center relative overflow-hidden"
        >
          <div className="w-16 h-16 bg-[#F97316]/20 border border-[#F97316]/30 text-[#F97316] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <span className="text-[#F97316] text-[10px] font-bold tracking-[0.3em] uppercase block mb-2">Satya Computers</span>
          <h2 className="text-2xl font-heading font-black tracking-wide uppercase mb-2">LEADS & B2C COD DASHBOARD</h2>
          <p className="text-xs text-gray-400 font-medium mb-6">Enter password <code className="text-[#F97316] font-bold">Satya@2323</code> to access the live dashboard.</p>
          
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Enter Password (Satya@2323)" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-center font-bold tracking-widest text-sm focus:outline-none focus:border-[#F97316] transition-all text-white placeholder-gray-500"
              />
            </div>
            
            {passwordError && (
              <p className="text-xs font-bold text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{passwordError}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-[#F97316] hover:bg-orange-600 text-white font-heading font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition-all shadow-lg shadow-orange-900/30 flex items-center justify-center gap-2"
            >
              Access Dashboard <ArrowRight size={16} />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const metrics = data?.metrics;
  const codOrders = data?.codOrders || [];

  const cardConfig = [
    { title: 'Leads', key: null, isTotal: true, icon: Users, color: 'from-blue-600 to-indigo-600' },
    { title: 'Shared Details', key: 'Shared Details', icon: CheckCircle, color: 'from-[#F97316] to-orange-600' },
    { title: 'Visit Store', key: 'Visit Store', icon: MapPin, color: 'from-emerald-500 to-teal-600' },
    { title: 'Busy', key: 'Busy', icon: Clock, color: 'from-amber-500 to-yellow-600' },
    { title: 'Available for COD', key: 'Avaiable for COD', icon: ShoppingBag, color: 'from-purple-600 to-indigo-600', highlight: true },
    { title: 'Store Visit Today', key: 'Store Visit Today', icon: MapPin, color: 'from-emerald-600 to-green-600' },
    { title: 'Store Visit Tomorrow', key: 'Store Visit Tomorrow', icon: Calendar, color: 'from-sky-500 to-blue-600' },
    { title: 'Store Visit Day after Tomorrow', key: 'Store Visit Day after Tomorrow', icon: Calendar, color: 'from-indigo-500 to-purple-600' },
    { title: 'Call Back', key: 'Call back', icon: PhoneCall, color: 'from-cyan-500 to-blue-500' },
    { title: 'Shared Location', key: 'Shared Location', icon: MapPin, color: 'from-teal-500 to-emerald-600' },
    { title: 'Not Answering', key: 'Not answering', icon: PhoneOff, color: 'from-rose-500 to-red-600' },
    { title: 'Not Working', key: 'Not working', icon: XCircle, color: 'from-gray-600 to-slate-700' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FE] text-[#0A1628]">
      {/* Top Navbar */}
      <header className="bg-[#0A1628] text-white border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F97316] flex items-center justify-center font-bold text-white shadow-lg">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h1 className="font-heading font-black text-lg tracking-widest uppercase text-white">SATYA COMPUTERS</h1>
              <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-[0.2em]">Standalone Dashboard Portal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                localStorage.removeItem('standalone_dashboard_auth');
                setIsAuthenticated(false);
              }}
              className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-colors"
            >
              Lock Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-[#F97316] animate-pulse" />
              <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-[0.3em]">Live Google Sheets & Admin B2C Matrix</span>
            </div>
            <h2 className="text-3xl font-heading font-black text-[#0A1628] leading-tight">LEADS & B2C COD DASHBOARD</h2>
            <p className="text-gray-400 font-medium text-xs mt-1">satyacomputers.in/dashboard • Cards from Sheets | COD Orders from Admin B2C Portal</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-3">
              <Calendar size={18} className="text-[#F97316]" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent font-bold text-xs uppercase tracking-widest text-[#0A1628] focus:outline-none cursor-pointer"
              >
                <option value="">All Dates (Overview)</option>
                {(data?.availableDates || []).map((d: string) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => fetchLeads(selectedDate)}
              disabled={loading}
              className="bg-[#0A1628] text-white p-3.5 rounded-2xl hover:bg-[#F97316] transition-colors shadow-lg active:scale-95 disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Metrics Cards Grid (Synced from Google Sheets) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cardConfig.map((card, idx) => {
            let totalCount = 0;
            let ramyaCount = 0;
            let sandeepCount = 0;
            let kishoreCount = 0;

            if (card.isTotal) {
              totalCount = metrics?.total || 0;
              ramyaCount = metrics?.teamTotal?.Ramya || 0;
              sandeepCount = metrics?.teamTotal?.Sandeep || 0;
              kishoreCount = metrics?.teamTotal?.Kishore || 0;
            } else if (card.key && metrics?.statuses?.[card.key]) {
              const stat = metrics.statuses[card.key];
              totalCount = stat.total;
              ramyaCount = stat.Ramya;
              sandeepCount = stat.Sandeep;
              kishoreCount = stat.Kishore;
            }

            const IconComponent = card.icon;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className={`relative overflow-hidden rounded-[2.5rem] bg-white p-6 border shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${
                  card.highlight ? 'border-[#F97316] ring-2 ring-[#F97316]/20' : 'border-gray-100'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${card.color} text-white shadow-md`}>
                    <IconComponent size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 text-gray-500 rounded-full">
                    {card.isTotal ? 'Total Active' : 'Status'}
                  </span>
                </div>

                <div>
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</p>
                  <h3 className="text-3xl font-heading font-black text-[#0A1628] mb-4">{loading ? '...' : totalCount}</h3>

                  {/* Team Breakdown Bar */}
                  <div className="pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Ramya</p>
                      <p className="text-xs font-black text-[#0A1628]">{loading ? '-' : ramyaCount}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Sandeep</p>
                      <p className="text-xs font-black text-[#0A1628]">{loading ? '-' : sandeepCount}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">Kishore</p>
                      <p className="text-xs font-black text-[#0A1628]">{loading ? '-' : kishoreCount}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Dedicated Admin Portal B2C COD Section */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm p-8 lg:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-heading font-bold text-[#0A1628]">Website Admin B2C COD Orders</h3>
                <p className="text-xs text-gray-400 font-medium">Live sync with Admin Portal B2C Customer Orders (`CustomerOrder` database table).</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-purple-100 text-purple-700 font-bold text-xs rounded-xl self-start sm:self-auto flex items-center gap-2">
              <PackageCheck size={16} />
              {codOrders.length} B2C COD Orders
            </span>
          </div>

          {codOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-bold text-sm">
              No COD customer orders found in the website Admin database.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Customer Name</th>
                    <th className="py-4 px-4">Mobile Number</th>
                    <th className="py-4 px-4">Address / Notes</th>
                    <th className="py-4 px-4">Total Value</th>
                    <th className="py-4 px-4">Payment Status</th>
                    <th className="py-4 px-4 text-right">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {codOrders.map((order: any, i: number) => {
                    let itemsStr = 'COD Order';
                    try {
                      const parsed = JSON.parse(order.products);
                      if (Array.isArray(parsed) && parsed[0]?.name) {
                        itemsStr = parsed.map((p: any) => p.name).join(', ');
                      }
                    } catch {}

                    return (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-mono font-bold text-xs text-[#F97316] bg-orange-50 px-2.5 py-1 rounded-lg">
                            {order.orderId}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-[#0A1628]">{order.customerName}</td>
                        <td className="py-4 px-4 text-xs font-mono font-bold text-gray-600">{order.phone}</td>
                        <td className="py-4 px-4 text-xs text-gray-500 font-medium">
                          <p className="font-bold text-[#0A1628]">{order.address}</p>
                          <span className="text-[10px] text-gray-400">{order.notes || itemsStr}</span>
                        </td>
                        <td className="py-4 px-4 text-sm font-black text-emerald-600">
                          ₹{order.totalAmount?.toLocaleString() || '0'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.paymentStatus || 'Pending'} (COD)
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                            order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.orderStatus || 'Processing'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
