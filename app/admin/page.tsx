'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Package, 
  Clock, 
  IndianRupee, 
  TrendingUp,
  ArrowUpRight,
  Zap,
  Activity,
  ChevronRight,
  Database,
  BarChart3,
  Loader2,
  FileText,
  Copy,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import dynamic from 'next/dynamic';

const OperationalIntegrity3D = dynamic(() => import('@/components/admin/OperationalIntegrity3D'), { 
  ssr: false,
  loading: () => <div className="w-full h-full min-h-[300px] bg-gray-50 animate-pulse rounded-[3rem] border border-gray-100 flex items-center justify-center text-gray-300 font-black tracking-widest text-xs uppercase">Connecting to Satellite...</div>
});

// Fixed stable formatter for consistent SSR/Client hydration
const formatDateProfessional = (dateStr: string | null) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${months[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, '0')}, ${d.getUTCFullYear()}`;
  } catch {
    return dateStr;
  }
};

export default function DashboardHome() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('weekly');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchStats() {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/dashboard?range=${timeRange}`);
        const json = await res.json();
        setDashboardData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [timeRange]);

  const chartData = dashboardData?.chartData || [
    { name: 'Loading...', revenue: 0, orders: 0 }
  ];

  const handleDownloadLogs = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 1000));
    const logs = {
      timestamp: new Date().toISOString(),
      stats: dashboardData?.stats,
      recentOrders: dashboardData?.recentOrders,
      systemStatus: 'ELITE-OPTIMIZED'
    };
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satya_admin_logs_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExporting(false);
  };

  const handleGenerateReport = () => {
    window.print();
  };

  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stats = [
    { 
      label: 'Inventory Assets', 
      value: loading ? '...' : (dashboardData?.stats?.productCount || '0'), 
      icon: Package, 
      color: 'from-blue-600 to-indigo-600',
      trend: '+12.5%',
      desc: 'Stock units currently active'
    },
    { 
      label: 'Active Requests', 
      value: loading ? '...' : (dashboardData?.stats?.orderCount || '0'), 
      icon: Clock, 
      color: 'from-orange-500 to-red-500', 
      trend: 'B2B: ' + (dashboardData?.stats?.b2bCount || '0'),
      desc: 'Pipeline throughput'
    },
    { 
      label: 'Market Reach', 
      value: '1.2k', 
      icon: Zap, 
      color: 'from-emerald-500 to-teal-500', 
      trend: '+22% Growth',
      desc: 'Client acquisition'
    },
    { 
      label: 'Gross Telemetry', 
      value: loading ? '...' : `₹${((dashboardData?.stats?.totalRevenue || 0) / 100000).toFixed(1)}L`, 
      icon: IndianRupee, 
      color: 'from-purple-600 to-pink-600', 
      trend: 'Target Aligned',
      desc: 'Consolidated revenue'
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-10 p-4 lg:p-0">
      {/* Dynamic Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse" />
            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-[0.3em]">System Engine: Live</span>
          </div>
          <h2 className="text-4xl font-heading font-black text-[#0A1628] leading-tight">CONTROL CENTER <span className="text-gray-300">/ DASHBOARD</span></h2>
          <p className="text-gray-400 font-medium max-w-lg mt-2">Real-time performance metrics and inventory oversight for Satya Computers.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadLogs}
            disabled={exporting}
            className="bg-white border border-gray-200 px-6 py-3 rounded-2xl font-heading font-bold text-xs text-[#0A1628] hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
            suppressHydrationWarning
          >
            {exporting ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
            {exporting ? 'EXPORTING...' : 'DOWNLOAD LOGS'}
          </button>
          <button 
            onClick={handleGenerateReport}
            className="bg-[#0A1628] px-6 py-3 rounded-2xl font-heading font-bold text-xs text-white hover:bg-[#F97316] transition-all shadow-xl shadow-navy-200 flex items-center gap-2 active:scale-95"
            suppressHydrationWarning
          >
            <Activity size={16} /> GENERATE REPORT
          </button>
        </div>
      </div>

      {/* Premium Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="relative overflow-hidden group rounded-[2.5rem] bg-white p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
          >
             <div className="flex justify-between items-start relative z-10 mb-6">
               <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                  <stat.icon size={24} />
               </div>
               <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <ArrowUpRight size={12} /> {stat.trend}
               </div>
             </div>
             
              <div className="relative z-10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-4xl font-heading font-black text-[#0A1628] tracking-tighter">{stat.value}</h3>
                   <span className="text-[10px] font-bold text-gray-300">Units</span>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-2 italic">{stat.desc}</p>
              </div>

             {/* Decorative Background Element */}
             <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700`} />
          </motion.div>
        ))}
      </div>

      {/* Advanced Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Performance Area Chart */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F97316]">
                  <TrendingUp size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-heading font-bold text-[#0A1628]">Revenue Pulse</h3>
                  <p className="text-sm text-gray-400 font-medium">Monthly transactional velocity</p>
               </div>
            </div>
            <div className="flex gap-2">
               {['daily', 'weekly', 'monthly'].map(t => (
                 <button 
                   key={t} 
                   onClick={() => setTimeRange(t)}
                   className={`px-4 h-10 rounded-xl text-[10px] font-black uppercase transition-all ${timeRange === t ? 'bg-[#F97316] text-white shadow-lg shadow-orange-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                   suppressHydrationWarning
                 >
                    {t}
                 </button>
               ))}
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 600}} dy={15} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Volume Distribution */}
        <div className="bg-[#0A1628] p-10 rounded-[3rem] text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#F97316]">
                  <BarChart3 size={24} />
               </div>
               <div>
                  <h3 className="text-xl font-heading font-bold">Request Volume</h3>
                  <p className="text-sm text-gray-500 font-medium">Bulk order throughput</p>
               </div>
            </div>

            <div className="h-64 mt-12 mb-10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <Bar dataKey="orders" fill="#FFFFFF" radius={[8, 8, 8, 8]} barSize={24} />
                  <Tooltip 
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    contentStyle={{display: 'none'}}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-4">
               <button 
                 onClick={() => router.push('/admin/orders')}
                 className="w-full flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
               >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#F97316]" />
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">Active Quotes</span>
                  </div>
                  <ChevronRight size={16} className="text-[#F97316] group-hover:translate-x-1 transition-transform" />
               </button>
               <button 
                 onClick={() => router.push('/admin/orders')}
                 className="w-full flex justify-between items-center bg-white/5 p-5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group"
               >
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-[#F97316]" />
                    <span className="text-sm font-bold text-gray-300 group-hover:text-white">Pending Approval</span>
                  </div>
                  <ChevronRight size={16} className="text-[#F97316] group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 p-12 opacity-10 blur-2xl">
              <div className="w-48 h-48 rounded-full bg-[#F97316]" />
          </div>
        </div>
      </div>

      {/* Activity Feed Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-10 border-b border-gray-50 flex justify-between items-center">
             <h3 className="text-xl font-heading font-bold text-[#0A1628]">Live Intelligence Feed</h3>
             <button 
               onClick={() => router.push('/admin/analytics')}
               className="text-[10px] font-black text-[#F97316] uppercase tracking-[0.2em] hover:underline"
               suppressHydrationWarning
             >
               Full Telemetry Log
             </button>
           </div>
           
           <div className="p-2">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Target Entity</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Type</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Value</th>
                     <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-left">Status Matrix</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-gray-300">INITIALIZING FEED...</td></tr>
                    ) : dashboardData?.recentOrders?.length > 0 ? (
                      dashboardData.recentOrders.map((order: any, i: number) => (
                        <tr 
                           key={i} 
                           className="hover:bg-gray-50/80 transition-all group border-l-2 border-transparent hover:border-[#F97316]"
                         >
                           <td className="px-8 py-6">
                             <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${order.type === 'B2B' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                   {order.type[0]}
                                </div>
                                <div>
                                   <p className="font-bold text-[#0A1628] leading-none mb-1 uppercase tracking-tighter text-sm">{order.companyName || order.customerName}</p>
                                   <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">ID: {order.orderId || order.id}</span>
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(order.orderId || order.id); }}
                                        title="Copy Order ID"
                                        aria-label={`Copy ID ${order.orderId || order.id}`}
                                        className="text-gray-300 hover:text-[#F97316] transition-colors"
                                      >
                                        {copiedId === (order.orderId || order.id) ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Copy size={10} />}
                                      </button>
                                   </div>
                                </div>
                             </div>
                           </td>
                           <td className="px-8 py-6">
                             <span className="text-[10px] font-bold text-gray-500">
                                {mounted ? formatDateProfessional(order.createdAt) : '...'}
                             </span>
                           </td>
                           <td className="px-8 py-6">
                             <p className="text-sm font-black text-[#F97316]">₹{(order.estimatedValue || order.totalAmount)?.toLocaleString()}</p>
                           </td>
                           <td className="px-8 py-6">
                             <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                                  order.status === 'Confirmed' || order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                  order.status === 'Pending' || order.status === 'Processing' ? 'bg-orange-50 text-orange-600 border border-orange-100 animate-pulse' :
                                  'bg-blue-50 text-blue-600 border border-blue-100'
                                }`}>
                                  {order.status}
                                </span>
                                <button 
                                   onClick={() => router.push(order.type === 'B2B' ? '/admin/orders' : '/admin/customer-orders')}
                                   title="View Order Details"
                                   aria-label="View Order Details"
                                   className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-lg bg-[#0A1628] text-white flex items-center justify-center transition-all hover:bg-[#F97316]"
                                >
                                   <ExternalLink size={14} />
                                </button>
                             </div>
                           </td>
                         </tr>
                      ))
                    ) : (
                      <tr><td colSpan={4} className="px-8 py-20 text-center font-bold text-gray-300 uppercase tracking-[0.2em]">Zero Intercepts Detected</td></tr>
                    )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

         {/* System Overview Card (3D Integration) */}
         <div className="bg-[#0A1628] p-10 rounded-[3rem] border border-white/10 shadow-2xl flex flex-col justify-between overflow-hidden relative group/integrity">
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-heading font-bold text-white">Operational Integrity</h3>
                 <div className="px-3 py-1 rounded-full bg-[#F97316]/20 text-[#F97316] text-[8px] font-black uppercase tracking-widest border border-[#F97316]/30">Active-Node</div>
              </div>
              <div className="h-[300px] w-full rounded-2xl overflow-hidden bg-white/5 border border-white/5 relative shadow-inner">
                 <OperationalIntegrity3D />
              </div>
            </div>
            
            <div className="mt-8 relative z-10 flex items-center gap-6">
               <div className="w-16 h-16 rounded-2xl bg-white/10 shadow-sm flex items-center justify-center text-[#F97316]">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Architecture Integrity</p>
                  <p className="text-sm font-bold text-gray-300 leading-snug">System utilizing libSQL edge database with sub-10ms latency thresholds.</p>
               </div>
            </div>
            
            {/* Background Grain/Grid decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,_transparent_1px),_linear-gradient(90deg,rgba(255,255,255,0.05)_1px,_transparent_1px)] bg-[size:20px_20px]" />
         </div>
      </div>
    </div>
  );
}
