'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart as PieChartIcon,
  Filter,
  RefreshCcw,
  Zap,
  Globe,
  Database,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [timeRange, setTimeRange] = useState('weekly'); // daily, weekly, monthly

  const fetchAnalytics = useCallback(async (range = 'weekly') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/dashboard?range=${range}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(timeRange);
  }, [timeRange, fetchAnalytics]);

  const chartData = data?.chartData || [
    { name: 'Initial', revenue: 0, orders: 0 }
  ];

  const brandData = [
    { name: 'NVIDIA', value: 45, color: '#F97316' },
    { name: 'INTEL', value: 25, color: '#0A1628' },
    { name: 'AMD', value: 20, color: '#3B82F6' },
    { name: 'ASUS', value: 10, color: '#94A3B8' },
  ];

  const handleExport = async () => {
    setExporting(true);
    // Simulate complex PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setExporting(false);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleRefresh = () => {
    fetchAnalytics(timeRange);
  };

  return (
    <div className="space-y-10 p-4 lg:p-0 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">TECHNICAL <span className="text-gray-300">/ TELEMETRY</span></h1>
          <p className="text-gray-500 font-medium mt-1">Deep-tissue analysis of system-wide transaction flow and asset velocity.</p>
        </div>
        <div className="flex flex-wrap gap-4">
           <button 
             onClick={handleRefresh}
             disabled={loading}
             title="Synchronize Live Telemetry"
             className="bg-white border border-gray-100 text-[#0A1628] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
           >
             <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /> {loading ? 'SYNCING...' : 'REFRESH'}
           </button>
           
           <button 
             onClick={handleExport}
             disabled={exporting || exportSuccess}
             title="Export Encrypted PDF Dossier"
             className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl active:scale-95 ${
               exportSuccess ? 'bg-emerald-500 text-white shadow-emerald-900/10' : 'bg-[#F97316] text-white shadow-orange-900/10 hover:bg-[#EA580C]'
             }`}
           >
             {exporting ? <Loader2 size={16} className="animate-spin" /> : exportSuccess ? <CheckCircle2 size={16} /> : <Download size={16} />}
             {exporting ? 'GENERATING...' : exportSuccess ? 'TRANSFERRED' : 'EXPORT DOSSIER'}
           </button>
        </div>
      </div>

      {/* KPI Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: 'Conversion Velocity', value: '4.8%', trend: '+0.5%', up: true, icon: Zap },
           { label: 'Asset Magnitude', value: data?.stats?.totalRevenue ? `₹${(data.stats.totalRevenue/100000).toFixed(1)}L` : '₹0.0L', trend: '+12%', up: true, icon: Database },
           { label: 'Asset Count', value: data?.stats?.productCount || '0', trend: '+5.4%', up: true, icon: Globe },
           { label: 'Retention rate', value: '92.4%', trend: '-1.2%', up: false, icon: TrendingUp },
         ].map((stat, i) => (
           <motion.div 
             key={i} 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col justify-between group hover:border-[#F97316]/30 transition-all relative overflow-hidden"
           >
              <div className="flex justify-between items-start relative z-10">
                 <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#F97316]/10 group-hover:text-[#F97316] transition-all">
                    <stat.icon size={24} />
                 </div>
                 <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[9px] font-black uppercase ${stat.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   {stat.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                   {stat.trend}
                 </div>
              </div>
              <div className="mt-8 relative z-10">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                 <p className="text-3xl font-heading font-black text-[#0A1628]">{stat.value}</p>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Strategic Vision Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-[1.5rem] bg-orange-50 flex items-center justify-center text-[#F97316] shadow-inner">
                     <TrendingUp size={28} />
                  </div>
                  <div>
                     <h3 className="text-2xl font-heading font-black text-[#0A1628] uppercase tracking-tight">REVENUE <span className="text-gray-300">FLOW</span></h3>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active asset monetization telemetry</p>
                  </div>
               </div>
                <div className="flex gap-2">
                  {[
                    { label: 'Daily', value: 'daily' },
                    { label: 'Weekly', value: 'weekly' },
                    { label: 'Monthly', value: 'monthly' }
                  ].map(p => (
                    <button 
                      key={p.value}
                      onClick={() => setTimeRange(p.value)}
                      title={`Switch to ${p.label} Perspective`}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                        timeRange === p.value ? 'bg-[#0A1628] text-white border-transparent shadow-lg' : 'bg-white border-gray-100 text-gray-400 hover:border-[#F97316] hover:text-[#F97316]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
            </div>
            
            <div className="h-96 w-full relative">
              <AnimatePresence mode="wait">
                {loading ? (
                   <motion.div 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10 rounded-3xl"
                   >
                      <Loader2 size={32} className="text-[#F97316] animate-spin" />
                   </motion.div>
                ) : null}
              </AnimatePresence>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={20} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                  <RechartsTooltip 
                    cursor={{stroke: '#F97316', strokeWidth: 2}}
                    contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(10 22 40 / 0.1)', padding: '24px', backgroundColor: '#0A1628', color: '#fff'}}
                    itemStyle={{color: '#F97316', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px'}}
                    labelStyle={{color: '#94A3B8', fontWeight: 900, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase'}}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#F97316" strokeWidth={5} fillOpacity={1} fill="url(#colorRev)" animationDuration={1000} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
         </div>

         <div className="bg-[#0A1628] p-12 rounded-[3.5rem] text-white flex flex-col items-center justify-between relative overflow-hidden shadow-2xl">
            <div className="relative z-10 text-center w-full">
               <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#F97316] mx-auto mb-6 border border-white/5">
                  <PieChartIcon size={32} />
               </div>
               <h3 className="text-2xl font-heading font-black uppercase tracking-tight">ASSET DISTRIBUTION</h3>
               <p className="text-[#F97316] text-[10px] font-black uppercase tracking-[0.3em] mt-2">Vertical Inventory Share</p>
            </div>
            
            <div className="h-72 w-full relative z-10 my-10">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie
                      data={brandData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={10}
                      dataKey="value"
                      stroke="none"
                    >
                      {brandData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                 </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-heading font-black text-white">100%</span>
                  <span className="text-[8px] font-black uppercase text-gray-500 tracking-widest mt-1">Total Assets</span>
               </div>
            </div>

            <div className="space-y-4 w-full relative z-10 pt-8 border-t border-white/5">
               {brandData.map((item, i) => (
                 <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                       <div className={`w-2.5 h-2.5 rounded-full ${
                         item.color === '#F97316' ? 'bg-[#F97316]' :
                         item.color === '#0A1628' ? 'bg-[#0A1628]' :
                         item.color === '#3B82F6' ? 'bg-blue-500' :
                         'bg-slate-400'
                       }`} />
                       <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <span className="text-sm font-black text-white">{item.value}%</span>
                 </div>
               ))}
            </div>

            <div className="absolute top-0 right-0 p-12 opacity-10 blur-[80px] pointer-events-none">
               <div className="w-48 h-48 rounded-full bg-[#F97316]" />
            </div>
         </div>
      </div>
    </div>
  );
}
