'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowRight, 
  History, 
  ShieldCheck, 
  QrCode,
  IndianRupee,
  BadgePercent,
  User,
  ShoppingBag,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdministrativeBillingHub() {
  const [mounted, setMounted] = useState(false);
  const [bills, setBills] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [gstRate, setGstRate] = useState(18);
  const [isProcessing, setIsProcessing] = useState(false);
  const [viewingBillId, setViewingBillId] = useState<string | null>(null);
  const [utrInput, setUtrInput] = useState('');

  const adminUpi = "9133772323-2@ybl";

  useEffect(() => {
    setMounted(true);
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await fetch('/api/admin/billing');
      const data = await res.json();
      setBills(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Ledger sync failed:', e);
    }
  };

  const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: string, val: any) => {
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const gstAmount = (subtotal * gstRate) / 100;
  const totalAmount = subtotal + gstAmount;

  const handleSubmitBill = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/admin/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName, customerPhone, items, subtotal, gstRate, gstAmount, totalAmount,
          status: 'Unpaid'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setViewingBillId(data.id);
        fetchBills();
      }
    } catch (e) {
      console.error('Bill commit failure:', e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMarkPaid = async (id: string) => {
    if (!utrInput) return alert('Enter UTR / Transaction ID for verification');
    try {
      await fetch('/api/admin/billing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, transactionId: utrInput, status: 'Paid' })
      });
      fetchBills();
      setViewingBillId(null);
      setUtrInput('');
    } catch (e) {}
  };

  if (!mounted) return null;

  const getUpiUrl = (amount: number, billId: string) => {
    const upiLink = `upi://pay?pa=${adminUpi}&pn=Satya%20Computers&am=${amount.toFixed(2)}&cu=INR&tn=Bill%20ID:${billId}`;
    return `https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${encodeURIComponent(upiLink)}`;
  };

  return (
    <div className="space-y-10 p-4 lg:p-0 max-w-[1600px] mx-auto min-h-screen pb-40">
      {/* HEADER PROTOCOL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 py-4">
        <div>
          <h1 className="text-4xl font-heading font-black text-[#0A1628] uppercase tracking-tighter flex items-center gap-4">
            QUICK <span className="text-gray-300">/ BILL v1.0</span>
            <ShieldCheck className="text-emerald-500" size={24} />
          </h1>
          <p className="text-gray-500 font-medium mt-1">Real-time point-of-sale interface for professional walk-in transactions.</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
              <History size={16} className="text-[#F97316]" />
              <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{bills.length} RECENT PROTOCOLS</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         <div className="xl:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
               <div className="flex items-center gap-4 mb-10 pb-10 border-b border-gray-50">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-[#F97316]">
                     <User size={28} />
                  </div>
                  <div>
                     <h3 className="text-xl font-heading font-black text-[#0A1628] uppercase">Client Identity</h3>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4">Customer Name</label>
                     <input placeholder="Walk-In Customer" className="w-full bg-gray-50 p-6 rounded-2xl border-2 border-transparent focus:border-[#F97316] outline-none font-bold text-[#0A1628] transition-all" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest px-4">Contact Phone</label>
                     <input placeholder="+91-XXXXX-XXXXX" className="w-full bg-gray-50 p-6 rounded-2xl border-2 border-transparent focus:border-[#F97316] outline-none font-bold text-[#0A1628] transition-all" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                  </div>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-[0_20px_60px_rgba(0,0,0,0.02)] relative overflow-hidden">
               <div className="flex items-center justify-between mb-10 pb-10 border-b border-gray-50">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
                        <ShoppingBag size={28} />
                     </div>
                     <div><h3 className="text-xl font-heading font-black text-[#0A1628] uppercase">Inventory List</h3></div>
                  </div>
                  <button onClick={addItem} title="Initialize New Product Row" className="flex items-center gap-3 px-6 py-4 bg-[#0A1628] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#F97316] transition-all active:scale-95">
                     <Plus size={16} /> Add Provision
                  </button>
               </div>

               <div className="space-y-6">
                  {items.map((item, idx) => (
                     <div key={idx} className="flex flex-wrap items-center gap-4 p-6 bg-gray-50/50 rounded-2xl border border-transparent hover:border-gray-100 transition-all">
                        <div className="flex-1 min-w-[200px]">
                           <input placeholder="Asset Name" className="w-full bg-white px-6 py-4 rounded-xl border border-gray-100 outline-none font-bold text-sm text-[#0A1628]" value={item.name} onChange={e => updateItem(idx, 'name', e.target.value)} />
                        </div>
                        <div className="w-24">
                           <input type="number" placeholder="QTY" className="w-full bg-white px-6 py-4 rounded-xl border border-gray-100 outline-none font-bold text-sm text-[#0A1628] text-center" value={item.quantity} onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value))} />
                        </div>
                        <div className="w-40 flex items-center gap-3 bg-white px-6 py-4 rounded-xl border border-gray-100">
                           <span className="text-gray-300 font-bold">₹</span>
                           <input type="number" placeholder="Price" className="w-full outline-none font-bold text-sm text-[#0A1628]" value={item.price} onChange={e => updateItem(idx, 'price', parseFloat(e.target.value))} />
                        </div>
                        <div className="w-32 text-right font-black text-[#F97316]">₹{(item.quantity * item.price).toLocaleString()}</div>
                        {items.length > 1 && (
                           <button onClick={() => removeItem(idx)} title="Remove Product Asset" className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <Trash2 size={18} />
                           </button>
                        )}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="xl:col-span-4 space-y-8">
            <div className="bg-[#0A1628] p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
               <div className="relative z-10 space-y-10">
                  <div className="flex flex-wrap gap-3">
                     {[0, 5, 12, 18, 28].map(rate => (
                        <button key={rate} onClick={() => setGstRate(rate)} title={`Set GST to ${rate}%`} className={`px-5 py-3 rounded-xl font-black text-xs transition-all border ${gstRate === rate ? 'bg-[#F97316] text-white border-transparent' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}>
                           {rate}%
                        </button>
                     ))}
                  </div>

                  <div className="space-y-4 text-white/50 font-bold text-sm">
                     <div className="flex justify-between"><span>SUBTOTAL</span><span>₹{subtotal.toLocaleString()}</span></div>
                     <div className="flex justify-between"><span>GST ({gstRate}%)</span><span>₹{gstAmount.toLocaleString()}</span></div>
                     <div className="flex justify-between items-center pt-6"><span className="text-white/30 font-black text-[10px] tracking-widest uppercase">Protocol Total</span><span className="text-4xl font-heading font-black text-[#F97316]">₹{totalAmount.toLocaleString()}</span></div>
                  </div>

                  <button onClick={handleSubmitBill} title="Initialize Final Bill Protocol" disabled={isProcessing || subtotal === 0} className="w-full py-6 bg-white text-[#0A1628] rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs hover:bg-[#F97316] hover:text-white transition-all">
                     {isProcessing ? 'Processing...' : 'INITIALIZE BILL'}
                  </button>
               </div>
            </div>

            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden">
               <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4">Recent Ledger History</h4>
               <div className="space-y-6 max-h-[600px] overflow-y-auto no-scrollbar">
                  {bills.map((bill, i) => (
                     <div key={i} onClick={() => setViewingBillId(bill.id)} className="p-5 rounded-2xl border border-gray-50 hover:border-orange-100 hover:bg-orange-50/20 transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2"><span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{bill.billId}</span><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase ${bill.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>{bill.status}</span></div>
                        <p className="font-bold text-[#0A1628] uppercase text-sm truncate">{bill.customerName}</p>
                        <p className="text-lg font-black text-[#F97316] mt-2 tracking-tighter">₹{Number(bill.totalAmount).toLocaleString()}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <AnimatePresence>
         {viewingBillId && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
               <div className="absolute inset-0 bg-[#0A1628]/95 backdrop-blur-3xl" onClick={() => setViewingBillId(null)} />
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-5xl bg-white rounded-[4rem] shadow-2xl overflow-hidden p-12 md:p-20 grid grid-cols-1 lg:grid-cols-2 gap-20">
                  {(() => {
                     const bill = bills.find(b => b.id === viewingBillId) || bills[0];
                     if (!bill) return null;
                     const itemsParsed = JSON.parse(bill.items || '[]');
                     return (
                        <>
                           <div className="bg-gray-50 p-12 rounded-[3.5rem] border border-gray-100 space-y-10 receipt-print">
                              <div className="text-center space-y-4"><h2 className="text-3xl font-heading font-black text-[#0A1628] uppercase">Satya Computers</h2></div>
                              <div className="py-8 border-y border-dashed border-gray-200 text-xs font-bold space-y-2">
                                 <div className="flex justify-between"><span>ID#</span><span>{bill.billId}</span></div>
                                 <div className="flex justify-between"><span>CLIENT</span><span className="uppercase">{bill.customerName}</span></div>
                              </div>
                              <div className="space-y-4">
                                 {itemsParsed.map((it: any, k: number) => (
                                    <div key={k} className="flex justify-between text-sm"><span className="text-[#0A1628] font-bold uppercase">{it.name} x {it.quantity}</span><span>₹{(it.quantity * it.price).toLocaleString()}</span></div>
                                 ))}
                              </div>
                              <div className="pt-8 border-t border-gray-200 flex justify-between items-center">
                                 <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest uppercase">Total Valuation</span><span className="text-4xl font-heading font-black text-[#F97316]">₹{Number(bill.totalAmount).toLocaleString()}</span>
                              </div>
                              <div className="flex gap-4 pt-4 no-print">
                                 <button onClick={() => window.print()} title="Print Paper Copy" className="flex-1 py-4 bg-[#0A1628] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"><Printer size={16} /> Print Receipt</button>
                                 <button onClick={() => window.open(`https://wa.me/${bill.customerPhone}?text=${bill.billId}`)} title="Push Electronic Bill to WhatsApp" className="px-6 py-4 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"><Send size={16} /></button>
                              </div>
                           </div>
                           <div className="space-y-12">
                              {bill.status === 'Paid' ? (
                                 <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                                    <CheckCircle2 size={64} className="text-emerald-500" />
                                    <button onClick={() => setViewingBillId(null)} title="Finalize Protocol and Return" className="px-10 py-5 bg-gray-50 rounded-2xl text-[10px] font-black uppercase text-gray-400 tracking-widest">Finalize Protocol</button>
                                 </div>
                              ) : (
                                 <div className="space-y-10 text-center">
                                    <img src={getUpiUrl(bill.totalAmount, bill.billId)} alt="UPI QR" className="w-64 h-64 mx-auto" />
                                    <div className="flex gap-4">
                                       <input placeholder="Enter Transaction ID" className="flex-1 bg-gray-50 p-6 rounded-2xl outline-none font-bold text-[#0A1628]" value={utrInput} onChange={e => setUtrInput(e.target.value)} />
                                       <button onClick={() => handleMarkPaid(bill.id)} title="Commit Payment and Sync" className="px-10 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Mark Paid</button>
                                    </div>
                                 </div>
                              )}
                           </div>
                        </>
                     );
                  })()}
               </motion.div>
            </div>
         )}
      </AnimatePresence>
      <style jsx global>{`
         @media print { body * { visibility: hidden; } .receipt-print, .receipt-print * { visibility: visible; } .receipt-print { position: fixed; left: 0; top: 0; width: 100%; padding: 40px; } .no-print { display: none !important; } }
         .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
