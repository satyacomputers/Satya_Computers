'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';

interface Order {
  companyName: string;
  totalUnits: number;
  status: string;
  createdAt: string | null;
}

interface LiveDeploymentsProps {
  orders: Order[];
}

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

export default function LiveDeployments({ orders }: LiveDeploymentsProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!orders || orders.length === 0) return null;

  return (
    <section className="py-24 bg-white border-y border-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
           <div className="max-w-xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full mb-6 font-bold text-[10px] tracking-widest uppercase"
              >
                <CheckCircle2 size={12} /> Live Sync
              </motion.div>
              <h2 className="text-5xl md:text-7xl font-heading font-black text-[#0A1628] uppercase leading-none">
                 RECENT <span className="text-emerald-500">DEPLOYMENTS</span>
              </h2>
           </div>
           <p className="max-w-sm text-gray-400 font-body text-lg border-l-2 border-emerald-500 pl-6">
              A real-time transparent feed of our latest hardware fulfillment cycles across corporate technical hubs.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orders.map((order, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#FAFAFA] border border-gray-100 p-8 rounded-[2.5rem] group hover:bg-white hover:shadow-xl transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-8">
                 <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#0A1628] group-hover:bg-[#0A1628] group-hover:text-white transition-colors duration-500">
                    <Package size={24} />
                 </div>
                 <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                    order.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-600' : 
                    order.status === 'Pending' ? 'bg-orange-100 text-orange-600' :
                    'bg-blue-100 text-blue-600'
                 }`}>
                    <div className={`w-1 h-1 rounded-full ${order.status === 'Confirmed' ? 'bg-emerald-600' : 'bg-orange-600'} animate-pulse`} />
                    {order.status}
                 </div>
              </div>

              <h3 className="text-xl font-heading font-bold text-[#0A1628] mb-1 uppercase tracking-tighter">
                 {order.companyName}
              </h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6">
                 {order.totalUnits} UNITS DELIVERED
              </p>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                 <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={14} />
                    <span className="text-[9px] font-bold uppercase">
                      {mounted ? formatDateProfessional(order.createdAt) : '...'}
                    </span>
                 </div>
                 <ShieldCheck size={16} className="text-gray-200" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
