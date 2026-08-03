'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Search, 
  MoreVertical, 
  Trash2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Building2,
  Loader2,
  Plus,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientsPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    logo: '',
    website: '',
    category: 'Corporate'
  });
  const itemsPerPage = 8;

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/clients');
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchClients();

    const handleClickOutside = () => setShowOptionsId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingId('create');
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newClient)
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewClient({ name: '', logo: '', website: '', category: 'Corporate' });
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeleteClient = async (id: string | null) => {
    if (!id) return;
    if (!confirm('INITIATE DELETION PROTOCOL? This will permanently remove the corporate record.')) return;
    setProcessingId(`delete-${id}`);
    try {
      const res = await fetch(`/api/admin/clients?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchClients();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
      setShowOptionsId(null);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!mounted) return null;

  return (
    <div className="space-y-10 p-4 lg:p-0 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">PARTNER <span className="text-gray-300">/ DIRECTORY</span></h1>
          <p className="text-gray-500 font-medium mt-1">High-value corporate stakeholders and bulk procurement entities.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={() => setShowAddModal(true)}
             title="Provision New Corporate Partner Record"
             className="bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#EA580C] transition-all shadow-xl shadow-orange-950/10 active:scale-95"
           >
             <Building2 size={18} /> PROVISION NEW CLIENT
           </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 flex flex-col md:flex-row gap-6 items-stretch md:items-center">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F97316] transition-colors" size={24} />
          <input 
            type="text" 
            placeholder="Search by corporate identity or sector..."
            className="w-full pl-16 pr-8 py-5 rounded-[2rem] border border-transparent bg-gray-50 focus:bg-white focus:border-[#F97316] outline-none transition-all text-sm font-bold text-[#0A1628] shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden pb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Institutional Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Operational Sector</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Digital Link</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Matrix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-14 h-14 border-[5px] border-gray-100 border-t-[#F97316] rounded-full animate-spin" />
                      <p className="font-black text-[10px] uppercase tracking-[0.4em] text-gray-400">Accessing Institutional Database...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedClients.length > 0 ? (
                paginatedClients.map((client, idx) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50/80 transition-all group"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 overflow-hidden relative shadow-xl shadow-orange-950/5 p-1 group-hover:scale-110 transition-transform">
                          {client.logo ? (
                            <img src={client.logo} alt={client.name} className="w-full h-full object-contain" />
                          ) : (
                            <Building2 size={28} className="text-[#F97316] opacity-30 group-hover:opacity-100 transition-opacity" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-heading font-black text-[#0A1628] leading-tight text-lg group-hover:text-[#F97316] transition-colors uppercase tracking-tight">{client.name}</h4>
                          <p className="text-[10px] font-black text-[#F97316] tracking-[0.3em] uppercase mt-1 opacity-60">Verified Partner</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className="px-4 py-2 rounded-full bg-gray-100 text-[10px] font-black uppercase text-[#0A1628] tracking-widest">{client.category}</span>
                    </td>
                    <td className="px-10 py-8">
                       {client.website ? (
                         <a href={client.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-500 hover:text-blue-700 font-bold text-xs uppercase tracking-widest">
                            <ExternalLink size={14} /> Visit Portal
                         </a>
                       ) : <span className="text-gray-300 font-black text-[10px] uppercase">N/A</span>}
                    </td>
                    <td className="px-10 py-8">
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowOptionsId(showOptionsId === client.id ? null : client.id);
                          }}
                          title="Operational Matrix Core Options"
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            showOptionsId === client.id ? 'bg-[#0A1628] text-white' : 'bg-white border border-gray-100 text-gray-400 hover:text-[#0A1628] hover:shadow-xl'
                          }`}
                        >
                          <MoreVertical size={20} />
                        </button>
                        
                        <AnimatePresence>
                          {showOptionsId === client.id && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 top-14 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 py-4 z-[100] overflow-hidden"
                              onClick={e => e.stopPropagation()}
                            >
                               <button
                                  onClick={() => handleDeleteClient(client.id)}
                                  title="Authorize Immediate Record Termination"
                                  className="w-full flex items-center gap-4 px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                  Terminate Record
                                  {processingId === `delete-${client.id}` && <Loader2 size={12} className="animate-spin ml-auto" />}
                                </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-10 py-32 text-center text-gray-300 uppercase tracking-[0.5em] font-black text-xs">Zero Partner Records Identified</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 flex justify-between items-center px-10">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-3">
             <Users size={14} className="text-[#F97316]" /> {filteredClients.length} Stakeholders Profiled
          </p>
          <div className="flex gap-4">
            <button 
              disabled={currentPage === 1}
              title="Return to Previous Data Batch"
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-gray-400 hover:text-[#0A1628] hover:border-[#F97316] transition-all disabled:opacity-20 flex items-center justify-center shadow-sm"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2 px-6 rounded-2xl bg-gray-50 text-[10px] font-black text-[#0A1628] uppercase tracking-widest border border-gray-100">
               Page {currentPage} <span className="text-gray-300">/</span> {totalPages || 1}
            </div>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              title="Advance to Next Data Batch"
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="w-12 h-12 rounded-2xl bg-[#0A1628] text-white hover:bg-[#F97316] transition-all disabled:opacity-20 flex items-center justify-center shadow-xl shadow-navy-950/10"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-md" 
               onClick={() => setShowAddModal(false)} 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl"
             >
                <div className="p-10 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                   <div>
                      <h3 className="text-2xl font-heading font-black text-[#0A1628] uppercase tracking-tighter">PROVISION CLIENT</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure Corporate Identity Profile</p>
                   </div>
                   <button 
                     title="Abort Provisioning"
                     onClick={() => setShowAddModal(false)} 
                     className="text-gray-400 hover:text-red-500 transition-colors"
                   >
                      <X size={24} />
                   </button>
                </div>
                <form onSubmit={handleCreateClient} className="p-10 space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Company Primary Name *</label>
                      <input 
                        required
                        placeholder="e.g. Reliance Industrial Matrix"
                        value={newClient.name}
                        onChange={e => setNewClient({...newClient, name: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628] shadow-inner"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Corporate Sector</label>
                      <input 
                        placeholder="e.g. Information Technology"
                        value={newClient.category}
                        onChange={e => setNewClient({...newClient, category: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628] shadow-inner"
                      />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Digital Presence (URL)</label>
                      <input 
                        placeholder="https://company.com"
                        value={newClient.website}
                        onChange={e => setNewClient({...newClient, website: e.target.value})}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628] shadow-inner"
                      />
                   </div>
                   <div className="flex gap-4 pt-6">
                      <button 
                        type="button" 
                        title="Abort Provisioning Process"
                        onClick={() => setShowAddModal(false)} 
                        className="flex-1 py-5 text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-colors font-bold tracking-widest"
                      >
                         Abort
                      </button>
                      <button 
                        type="submit" 
                        disabled={processingId === 'create'}
                        title="Commit Client Identity to Database"
                        className="flex-1 py-5 bg-[#0A1628] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#F97316] transition-all shadow-lg active:scale-95 disabled:opacity-50"
                      >
                         {processingId === 'create' ? <Loader2 size={16} className="animate-spin mx-auto" /> : 'COMMIT PROVISION'}
                      </button>
                   </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
