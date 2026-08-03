'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Plus, Bell, Clock, Trash2, ShieldCheck, Mail, X, TrendingUp, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    type: 'Flash',
    status: 'Live',
    date: new Date().toISOString().split('T')[0]
  });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      const data = await res.json();
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Fetch announcements error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const handleClickOutside = () => {}; // For now
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Abort this broadcast directive?')) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAnnouncements();
      } else {
        const data = await res.json();
        alert(`Purge Protocol Failure: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Protocol Failure');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Live' ? 'Scheduled' : 'Live';
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchAnnouncements();
        setNewAnnouncement({ 
          title: '', 
          type: 'Flash', 
          status: 'Live', 
          date: new Date().toISOString().split('T')[0] 
        });
        alert('Broadcast Deployment Protocol Successful');
      } else {
        const data = await res.json();
        alert(`Broadcast Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Protocol Failure');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-heading font-black text-[#0A1628] uppercase tracking-tight">SITE <span className="text-gray-300">/ BROADCASTS</span></h1>
          <p className="text-gray-500 font-medium mt-1">Deploying multi-channel notification layers across the ecosystem.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          title="Initialize New Broadcast Feed"
          className="bg-[#0A1628] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#F97316] transition-all shadow-xl shadow-navy-900/10 active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> INITIATE BROADCAST
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20">
        <div className="bg-white rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F97316]">
                   <Megaphone size={24} />
                </div>
                <div>
                   <h3 className="font-heading font-black text-[#0A1628] uppercase tracking-widest text-sm">Active Feed</h3>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Real-time Telemetry</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed
             </div>
          </div>
          
          <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto custom-scrollbar">
            {loading ? (
              <div className="p-20 text-center flex flex-col items-center gap-4">
                 <div className="w-10 h-10 border-4 border-gray-100 border-t-[#F97316] rounded-full animate-spin" />
                 <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Scanning frequencies...</p>
              </div>
            ) : announcements.length > 0 ? (
              announcements.map((a, idx) => (
                <motion.div 
                  key={a.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-8 hover:bg-gray-50/50 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#F97316] border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                      <Bell size={24} />
                    </div>
                    <div>
                      <h4 className="font-heading font-black text-[#0A1628] text-base leading-tight group-hover:text-[#F97316] transition-colors">{a.title}</h4>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[9px] font-black text-[#F97316] bg-orange-50 px-3 py-1 rounded-lg uppercase tracking-widest">{a.type}</span>
                        <span className="text-[9px] font-bold text-gray-300 flex items-center gap-1.5 uppercase tracking-widest">
                           <Clock size={12} className="text-gray-200" /> {a.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleStatusToggle(a.id, a.status)}
                      title={`Toggle Broadcast Status: ${a.status}`}
                      className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-sm border ${
                        a.status === 'Live' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-100 text-gray-400 border-transparent'
                      }`}
                    >
                      {a.status}
                    </button>
                    <button 
                      onClick={() => handleDelete(a.id)}
                      title="Decommission Broadcast Directive"
                      className="w-12 h-12 rounded-xl bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 hover:border-red-100 border border-transparent transition-all flex items-center justify-center active:scale-90 shadow-sm"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-32 text-center">
                 <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <Megaphone className="text-gray-200" size={32} />
                 </div>
                 <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em]">No active broadcasts detected</p>
                 <button onClick={() => setShowAddModal(true)} className="mt-6 text-[10px] font-black text-[#F97316] uppercase tracking-widest hover:underline">Initialize First Directive</button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0A1628] p-12 rounded-[3.5rem] text-white flex flex-col justify-between relative overflow-hidden h-full shadow-2xl">
           <div className="relative z-10">
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center text-[#F97316] mb-8 border border-white/5">
                 <Mail size={32} />
              </div>
              <h3 className="text-3xl font-heading font-black mb-4 uppercase tracking-tight">NEWSLETTER <span className="text-[#F97316]">ENGINE</span></h3>
              <p className="text-gray-400 text-base leading-relaxed mb-10">Reach over <span className="text-white font-black underline decoration-[#F97316] underline-offset-4">1,240 subscribers</span> with technical inventory updates and corporate directives.</p>
              
              <div className="space-y-6">
                 <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-white/[0.07] transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-xl">
                       <TrendingUp size={24} className="text-[#F97316]" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Subscriber Velocity</p>
                       <p className="text-lg font-black">+42 New Assets this week</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[2rem] border border-white/5 group hover:bg-white/[0.07] transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shadow-xl">
                       <ShieldCheck size={24} className="text-[#F97316]" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Identity Protection</p>
                       <p className="text-lg font-black">Corporate Grade ISO Encrypted</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="mt-16 relative z-10">
              <button 
                onClick={() => setShowNewsletterModal(true)}
                title="Initialize multi-channel engagement broadcast"
                className="w-full bg-[#F97316] py-6 rounded-[2rem] font-heading font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-500 transition-all shadow-2xl shadow-orange-950/40 active:scale-[0.98] flex items-center justify-center gap-4"
              >
                <Mail size={20} /> COMPOSE BROADCAST
              </button>
           </div>

           {/* Aesthetic details */}
           <div className="absolute top-0 right-0 p-12 opacity-10 blur-3xl pointer-events-none">
              <div className="w-64 h-64 rounded-full bg-[#F97316]" />
           </div>
           <div className="absolute -bottom-20 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_transparent_0%,_#0A1628_70%)] opacity-50 pointer-events-none" />
        </div>
      </div>

      {/* Newsletter Modal */}
      <AnimatePresence>
        {showNewsletterModal && (
           <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 lg:p-10 lg:ml-64 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0A1628]/95 backdrop-blur-xl" 
                onClick={() => setShowNewsletterModal(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-3xl bg-white rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl my-auto"
              >
                <div className="p-8 md:p-12 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                   <div>
                      <h3 className="text-2xl md:text-3xl font-heading font-black text-[#0A1628] uppercase tracking-tight">ENGAGEMENT <span className="text-[#F97316]">PROTOCOL</span></h3>
                      <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1 md:mt-2">Initializing Sequential multi-channel broadcast</p>
                   </div>
                   <button 
                     onClick={() => setShowNewsletterModal(false)}
                     title="Terminate Protocol" 
                     className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-all active:scale-90"
                   >
                      <X size={24} />
                   </button>
                </div>
                <div className="p-8 md:p-12 space-y-6 md:space-y-8">
                   <div className="p-6 md:p-8 bg-[#0A1628] rounded-[2rem] md:rounded-[2.5rem] border border-white/5 flex items-center gap-6 md:gap-8 shadow-2xl relative overflow-hidden group">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-[#F97316] flex items-center justify-center text-white shadow-xl relative z-10 group-hover:scale-105 transition-transform">
                         <Mail size={32} className="md:w-10 md:h-10" />
                      </div>
                      <div className="relative z-10">
                         <p className="text-2xl md:text-3xl font-heading font-black text-white">1,240 RECIPIENTS</p>
                         <p className="text-[9px] md:text-[10px] font-black text-[#F97316] uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1">Verified Stakeholder Database</p>
                      </div>
                      <div className="absolute top-0 right-0 p-6 md:p-8 opacity-10 pointer-events-none">
                         <Mail size={100} className="rotate-12 translate-x-8 -translate-y-8" />
                      </div>
                   </div>
                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Directive Subject</label>
                         <input 
                           title="Broadcast Subject Specification"
                           className="w-full px-8 py-5 rounded-3xl bg-gray-50 border border-transparent focus:bg-white focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                           placeholder="The Elite Hardware Selection - March Q1"
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Message Body</label>
                         <textarea 
                           title="Broadcast Content Parameters"
                           className="w-full px-8 py-6 h-32 md:h-40 rounded-[2rem] md:rounded-[2.5rem] bg-gray-50 border border-transparent focus:bg-white focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628] resize-none shadow-inner"
                           placeholder="Provision technical specifications and pricing updates for corporate assets..."
                         />
                      </div>
                   </div>
                   <div className="flex gap-6 pt-6">
                      <button 
                        onClick={async () => {
                          setProcessingId('newsletter');
                          await new Promise(r => setTimeout(r, 2000));
                          setProcessingId('newsletter-success');
                          setTimeout(() => {
                            setProcessingId(null);
                            setShowNewsletterModal(false);
                          }, 2000);
                        }}
                        disabled={processingId === 'newsletter' || processingId === 'newsletter-success'}
                        title="Authorize Broadcast Sequence"
                        className={`flex-1 py-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 ${
                          processingId === 'newsletter-success' ? 'bg-emerald-500 text-white' : 'bg-[#0A1628] text-white hover:bg-[#F97316]'
                        }`}
                      >
                        {processingId === 'newsletter' ? <Loader2 size={18} className="animate-spin" /> : 
                         processingId === 'newsletter-success' ? <CheckCircle2 size={18} /> : 
                         null}
                        {processingId === 'newsletter' ? 'SYNCHRONIZING...' : 
                         processingId === 'newsletter-success' ? 'BROADCAST AUTHORIZED' : 
                         'AUTHORIZE BROADCAST SEQUENCE'}
                      </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
           <div className="fixed inset-0 z-[200] flex items-start justify-center p-4 lg:p-10 lg:ml-64 overflow-y-auto custom-scrollbar">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-[#0A1628]/80 backdrop-blur-md" 
                onClick={() => setShowAddModal(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl my-auto"
              >
                <div className="p-10 border-b border-gray-50 bg-gray-50/50">
                   <h3 className="text-2xl font-heading font-black text-[#0A1628] uppercase tracking-tight">INITIATE <span className="text-[#F97316]">BROADCAST</span></h3>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Deploying site-wide notification layer</p>
                </div>
                <form onSubmit={handleAddAnnouncement} className="p-10 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Broadcast Title</label>
                      <input 
                        required
                        placeholder="e.g. Price Drop on NVIDIA GPUs"
                        title="Broadcast Identity Specification"
                        value={newAnnouncement.title}
                        onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                      />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Directive Class</label>
                         <select 
                           title="Broadcast Category Selection"
                           value={newAnnouncement.type}
                           onChange={e => setNewAnnouncement({...newAnnouncement, type: e.target.value})}
                           className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                         >
                            <option value="Flash">Flash Alert</option>
                            <option value="Promo">Promotional</option>
                            <option value="Update">System Update</option>
                            <option value="Event">Corporate Event</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Base Date</label>
                         <input 
                           title="Broadcast Initialization Date"
                           required
                           type="date"
                           value={newAnnouncement.date}
                           onChange={e => setNewAnnouncement({...newAnnouncement, date: e.target.value})}
                           className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deployment Status</label>
                      <select 
                        title="Directive Lifecycle Status"
                        value={newAnnouncement.status}
                        onChange={e => setNewAnnouncement({...newAnnouncement, status: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-black text-sm text-[#0A1628] shadow-inner"
                      >
                         <option value="Live">Live (Immediate)</option>
                         <option value="Scheduled">Scheduled</option>
                      </select>
                   </div>
                   <div className="flex gap-6 pt-8">
                      <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-colors tracking-widest">Abort</button>
                      <button type="submit" className="flex-1 py-5 bg-[#0A1628] text-white rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-[#F97316] transition-all shadow-2xl active:scale-95">Deploy Feed</button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
