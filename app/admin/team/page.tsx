'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Mail, 
  Clock, 
  MoreVertical, 
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

export default function TeamManagement() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRole, setActiveRole] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    password: '',
    role: 'Admin'
  });
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAdminAction = async (adminId: string, actionLabel: string) => {
    // Unique ID for processing state
    const procKey = `${adminId}-${actionLabel}`;
    setProcessingId(procKey);
    
    // Simulate protocol latency
    await new Promise(r => setTimeout(r, 1800));
    
    setProcessingId(null);
    setShowOptionsId(null);
    
    // Terminal Access is a special protocol
    if (actionLabel === 'Terminate Access') {
      if (confirm(`INITIATE TERMINATION PROTOCOL FOR ${adminId}? This cannot be undone.`)) {
         setAdmins(prev => prev.filter(a => a.id !== adminId));
      }
    }
  };

  useEffect(() => {
    fetchAdmins();

    const handleClickOutside = () => setShowOptionsId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function fetchAdmins() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/team');
      const data = await res.json();
      if (Array.isArray(data)) {
        setAdmins(data);
      }
    } catch (err) {
      console.error('Failed to fetch team:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchAdmins();
        setNewAdmin({ username: '', password: '', role: 'Admin' });
        alert('Administrative Profile Provisioned Successfully');
      } else {
        const data = await res.json();
        alert(`Provisioning Failed: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network Protocol Interrupted');
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          admin.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeRole === 'All' || admin.role === activeRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 p-4 lg:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-heading font-black text-[#0A1628] uppercase tracking-tight">TEAM <span className="text-gray-300">/ ACCESS CONTROL</span></h2>
          <p className="text-gray-500 font-medium mt-1">Manage administrative profiles and system permissions.</p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#F97316] text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#EA580C] transition-all shadow-xl shadow-orange-900/10 active:scale-95 group"
        >
          <UserPlus size={18} /> PROVISION NEW USER
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#F97316] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by username or role..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 border-none outline-none focus:ring-2 focus:ring-[#F97316]/20 transition-all font-medium text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden md:flex gap-3">
           {['All', 'Admin', 'Management', 'Editor'].map(role => (
             <button 
               key={role} 
               onClick={() => setActiveRole(role)}
               className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                 activeRole === role 
                   ? 'bg-[#0A1628] text-white border-transparent shadow-lg' 
                   : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600'
               }`}
             >
               {role}
             </button>
           ))}
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 animate-pulse h-64" />
          ))
        ) : filteredAdmins.length > 0 ? (
          filteredAdmins.map((admin, idx) => (
            <motion.div
              key={admin.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptionsId(showOptionsId === admin.id ? null : admin.id);
                  }}
                  title="Administrative Controls"
                  className={`p-2.5 rounded-xl transition-all ${
                    showOptionsId === admin.id 
                      ? 'bg-[#0A1628] text-white' 
                      : 'hover:bg-gray-50 text-gray-400'
                  }`}
                >
                   <MoreVertical size={20} />
                </button>

                {showOptionsId === admin.id && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="px-5 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 mb-1">Access Protocol</p>
                    {[
                      { label: 'Rotate Credentials' },
                      { label: 'Modify Permissions' },
                      { label: 'View Access Logs' },
                      { label: 'Terminate Access' },
                    ].map((item, i) => {
                      const isProcessing = processingId === `${admin.id}-${item.label}`;
                      return (
                        <button
                          key={i}
                          disabled={isProcessing}
                          onClick={() => handleAdminAction(admin.id, item.label)}
                          className={`w-full text-left px-5 py-2.5 text-[11px] font-bold flex items-center justify-between group/item transition-all ${
                            item.label === 'Terminate Access' ? 'text-red-500 hover:bg-red-50' : 'text-gray-600 hover:bg-gray-50 hover:text-[#0A1628]'
                          } ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
                        >
                          <span>{isProcessing ? 'PROCESSING...' : item.label}</span>
                          {isProcessing && <Loader2 size={12} className="animate-spin text-[#F97316]" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#0A1628] to-gray-800 flex items-center justify-center text-white shadow-lg">
                   <User size={32} strokeWidth={1.5} />
                </div>
                <div>
                   <h3 className="text-xl font-heading font-bold text-[#0A1628] leading-tight capitalize">{admin.username}</h3>
                   <div className="flex items-center gap-1.5 mt-1">
                      <Shield size={12} className="text-[#F97316]" />
                      <span className="text-[10px] font-black uppercase text-[#F97316] tracking-widest">{admin.role}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-400">
                   <Mail size={16} />
                   <span className="text-sm font-medium">{admin.username}@satya.com</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400">
                   <Clock size={16} />
                   <span className="text-sm font-medium">Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Status</span>
                 </div>
                 <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3.5rem] border border-dashed border-gray-200">
             <AlertCircle size={48} className="text-gray-200 mx-auto mb-4" />
             <p className="text-xl font-heading font-bold text-gray-300">NO ADMINISTRATIVE PROFILES DETECTED</p>
          </div>
        )}
      </div>
      {/* Provisioning Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                 <h3 className="text-xl font-heading font-black text-[#0A1628] uppercase tracking-tight">PROVISION ACCESS</h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure Administrative Credentials</p>
              </div>
              <form onSubmit={handleProvision} className="p-8 space-y-4">
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username (Identity)</label>
                    <input 
                      required
                      placeholder="admin_prime"
                      value={newAdmin.username}
                      onChange={e => setNewAdmin({...newAdmin, username: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Passkey</label>
                    <input 
                      required
                      type="password"
                      placeholder="••••••••"
                      value={newAdmin.password}
                      onChange={e => setNewAdmin({...newAdmin, password: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Operational Role</label>
                    <select 
                      title="Access Level Selection"
                      value={newAdmin.role}
                      onChange={e => setNewAdmin({...newAdmin, role: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                    >
                       <option value="Admin">System Admin</option>
                       <option value="Management">Corporate Management</option>
                       <option value="Editor">Technical Editor</option>
                    </select>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-colors">Abort</button>
                    <button type="submit" className="flex-1 py-4 bg-[#0A1628] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#F97316] transition-all shadow-lg active:scale-95">COMMIT PROVISION</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
