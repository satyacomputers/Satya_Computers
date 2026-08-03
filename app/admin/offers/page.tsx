'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Tag, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit, 
  Clock,
  X
} from 'lucide-react';

export default function PromotionalOffers() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeOfferId, setActiveOfferId] = useState<string | null>(null);
  const [newOffer, setNewOffer] = useState({
    type: 'Flash',
    title: '',
    description: '',
    code: '',
    discount: '',
    expiryDate: ''
  });

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/offers');
      const data = await res.json();
      setOffers(data || []);
    } catch (err) {
      console.error('Fetch offers error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Purge this campaign directive?')) return;
    try {
      const res = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchOffers();
      } else {
        const errData = await res.json();
        alert(`Purge Protocol Failure: ${errData.error || 'Unknown Response'}`);
      }
    } catch (err) {
      console.error(err);
      alert('System Communication Error: Purge Directive Interrupted');
    }
  };

  const handleAddOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing && activeOfferId 
        ? `/api/admin/offers/${activeOfferId}` 
        : '/api/admin/offers';
      
      const res = await fetch(url, {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOffer)
      });
      
      if (res.ok) {
        setShowAddModal(false);
        setIsEditing(false);
        setActiveOfferId(null);
        fetchOffers();
        setNewOffer({ type: 'Flash', title: '', description: '', code: '', discount: '', expiryDate: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: number) => {
    try {
      const res = await fetch(`/api/admin/offers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: currentStatus === 1 ? 0 : 1 })
      });
      if (res.ok) fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditInit = (offer: any) => {
    setNewOffer({
      type: offer.type,
      title: offer.title,
      description: offer.description,
      code: offer.code,
      discount: offer.discount.toString(),
      expiryDate: offer.expiryDate ? offer.expiryDate.split('T')[0] : ''
    });
    setActiveOfferId(offer.id);
    setIsEditing(true);
    setShowAddModal(true);
  };

  return (
    <div className="space-y-8 p-4 lg:p-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-[#F97316]">
                <Zap size={18} fill="currentColor" />
             </div>
             <span className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">Traffic Acceleration</span>
          </div>
          <h2 className="text-3xl font-heading font-black text-[#0A1628] uppercase tracking-tight">SPECIAL <span className="text-gray-300">/ CAMPAIGNS</span></h2>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#0A1628] text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#F97316] transition-all shadow-xl shadow-gray-200 active:scale-95 group"
        >
          <Plus size={18} /> INITIALIZE CAMPAIGN
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          [1, 2].map(i => (
            <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 animate-pulse h-80" />
          ))
        ) : offers.length > 0 ? (
          offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#0A1628] flex items-center justify-center text-white shadow-xl">
                    <Tag size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-black text-[#0A1628] uppercase tracking-tighter leading-none">{offer.title}</h3>
                    <p className="text-gray-400 text-[10px] font-black mt-2 uppercase tracking-[0.2em]">TYPE: {offer.type}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleToggleStatus(offer.id, offer.isActive)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
                    offer.isActive === 1 ? 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {offer.isActive === 1 ? 'ACTIVE PROTOCOL' : 'DORMANT'}
                </button>
              </div>

              <div className="flex-1">
                <p className="text-gray-500 font-medium text-lg leading-relaxed mb-10 pr-6">
                  {offer.description}
                </p>

                <div className="flex items-center bg-gray-50/50 rounded-2xl border border-gray-100 mb-10 overflow-hidden">
                  <div className="flex-1 p-6 border-r border-gray-100">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 block">AUTHORIZATION CODE</span>
                    <span className="text-2xl font-heading font-black text-[#F97316] tracking-widest">{offer.code}</span>
                  </div>
                  <div className="flex-1 p-6">
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1 block">MARKDOWN VALUE</span>
                    <span className="text-2xl font-heading font-black text-emerald-500 uppercase">-{offer.discount}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-gray-50">
                <div className="flex items-center gap-2.5 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                  <Clock size={14} className="text-[#F97316]" />
                  EXPIRES: {offer.expiryDate ? new Date(offer.expiryDate).toLocaleDateString() : 'INDETERMINATE'}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEditInit(offer)}
                    title="Edit Directive" 
                    className="p-3 bg-white hover:bg-gray-50 border border-gray-100 text-gray-400 hover:text-[#0A1628] rounded-xl transition-all shadow-sm active:scale-90"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(offer.id)}
                    title="Purge Campaign" 
                    className="p-3 bg-white hover:bg-red-50 border border-gray-100 text-gray-400 hover:text-red-500 rounded-xl transition-all shadow-sm active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#F97316]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-white shadow-xl mb-8">
                <Plus size={32} className="text-gray-200" />
             </div>
             <p className="text-2xl font-heading font-black text-gray-300 uppercase tracking-widest">NO ACTIVE CAMPAIGN SIGNATURES</p>
             <p className="text-gray-400 font-bold text-xs uppercase mt-3">Ready to initialize high-conversion promotional assets.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-md" onClick={() => {
             setShowAddModal(false);
             setIsEditing(false);
             setActiveOfferId(null);
             setNewOffer({ type: 'Flash', title: '', description: '', code: '', discount: '', expiryDate: '' });
           }} />
           <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                 <h3 className="text-xl font-heading font-black text-[#0A1628] uppercase tracking-tight">
                   {isEditing ? 'MODIFY DIRECTIVE' : 'INITIALIZE CAMPAIGN'}
                 </h3>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                   {isEditing ? 'Update global discount parameters' : 'Configure global discount directive'}
                 </p>
              </div>
              <form onSubmit={handleAddOffer} className="p-8 space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Type</label>
                       <select 
                         title="Campaign Type Selection"
                         value={newOffer.type}
                         onChange={e => setNewOffer({...newOffer, type: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                       >
                          <option value="Flash">Flash Sale</option>
                          <option value="B2B">Corporate</option>
                          <option value="Seasonal">Seasonal</option>
                       </select>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Code</label>
                       <input 
                         required
                         placeholder="SATYA2026"
                         value={newOffer.code}
                         onChange={e => setNewOffer({...newOffer, code: e.target.value.toUpperCase()})}
                         className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                       />
                    </div>
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Campaign Title</label>
                    <input 
                      required
                      placeholder="MacBook Pro Launch Offer"
                      value={newOffer.title}
                      onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Directive Details</label>
                    <textarea 
                      placeholder="Describe the campaign reach..."
                      value={newOffer.description}
                      onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628] h-24 resize-none"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Discount (%)</label>
                       <input 
                         title="Offer Discount Percentage"
                         required
                         type="number"
                         placeholder="15"
                         value={newOffer.discount}
                         onChange={e => setNewOffer({...newOffer, discount: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                       />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiry Date</label>
                       <input 
                         title="Campaign Expiration Date"
                         required
                         type="date"
                         value={newOffer.expiryDate}
                         onChange={e => setNewOffer({...newOffer, expiryDate: e.target.value})}
                         className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 focus:border-[#F97316] outline-none transition-all font-bold text-sm text-[#0A1628]"
                       />
                    </div>
                 </div>
                 <div className="flex gap-4 pt-4">
                    <button 
                      type="button" 
                      onClick={() => {
                        setShowAddModal(false);
                        setIsEditing(false);
                        setActiveOfferId(null);
                        setNewOffer({ type: 'Flash', title: '', description: '', code: '', discount: '', expiryDate: '' });
                      }} 
                      className="flex-1 py-4 text-xs font-black uppercase text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Abort
                    </button>
                    <button type="submit" className="flex-1 py-4 bg-[#0A1628] text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-[#F97316] transition-all shadow-lg active:scale-95">
                      {isEditing ? 'COMMIT CHANGES' : 'DEPLOY DIRECTIVE'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
