'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import BrutalButton from '@/components/ui/BrutalButton';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { Check, MapPin, X, ShieldCheck, Loader2, Smartphone, Download, Share2, Info, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
].sort();

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false);
  const { cartTotal, clearCart, items } = useCart();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<{ id: string } | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    houseNo: '',
    village: '',
    mandal: '',
    post: '',
    area: '',
    landmark: '',
    city: '',
    stateRaw: 'Telangana',
    pincode: ''
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isPincodeLoading, setIsPincodeLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('satya_user');
    setIsLoggedIn(!!savedUser);
    setAuthLoading(false);
  }, []);

  const adminUpi = "9133772323-2@ybl";

  useEffect(() => {
    setMounted(true);
  }, []);

  const rawUpiLink = useMemo(() => {
    const amount = cartTotal.toFixed(2);
    const orderId = 'SATYA' + Date.now();
    return `upi://pay?pa=${adminUpi}&pn=Satya%20Computers&am=${amount}&cu=INR&tn=SatyaOrder&tr=${orderId}`;
  }, [cartTotal]);

  useEffect(() => {
    if (orderSuccess) {
      const steps = [
        "[sys] Securing hardware allocation... OK",
        "[sys] Establishing encrypted payment handshake... OK",
        "[net] Transmitting UTR to Ameerpet dispatch terminal... ACK",
        `[net] Notification transmitted to +91${formData.whatsapp}.`,
        `[ok] DEPLOYMENT ID: ${orderSuccess.id} AUTHORIZED. Redirecting...`
      ];
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < steps.length) {
          setTerminalLogs(prev => [...prev, steps[currentStep]]);
          currentStep++;
        } else {
          clearInterval(interval);
          setTimeout(() => { router.push(`/order-status?id=${orderSuccess.id}`); }, 1500);
        }
      }, 700);
      return () => clearInterval(interval);
    }
  }, [orderSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));

    if (id === 'pincode' && value.length === 6 && /^[0-9]+$/.test(value)) {
      lookupPincode(value);
    }
  };

  const lookupPincode = async (pincode: string) => {
    setIsPincodeLoading(true);
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();
      if (data[0].Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        setFormData(prev => ({ 
          ...prev, 
          city: postOffice.District || prev.city, 
          stateRaw: postOffice.State || prev.stateRaw,
          mandal: postOffice.Block && postOffice.Block !== 'NA' ? postOffice.Block : prev.mandal,
          post: postOffice.Name || prev.post
        }));
      }
    } catch (err) { console.error("Pincode lookup failure"); }
    finally { setIsPincodeLoading(false); }
  };

  const toggleReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setIsReviewing(!isReviewing);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadQr = () => {
    try {
      const canvas = document.querySelector('canvas');
      if (!canvas) return;
      const url = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = url;
      link.download = `Satya-Pay-QR.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) { alert("Encryption Error."); }
  };

  const sharePayment = () => {
    if (navigator.share) {
      navigator.share({ title: 'Pay Satya Computers', text: `Authorize deployment of ₹${cartTotal.toLocaleString()} to Satya Computers.`, url: rawUpiLink }).catch(() => {});
    } else {
      navigator.clipboard.writeText(rawUpiLink);
      alert('Protocol Copied');
    }
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) return;
    if (paymentMethod === 'UPI' && !showUpiModal) { setShowUpiModal(true); return; }
    
    setIsSubmitting(true);
    const professionalAddress = `${formData.houseNo}, ${formData.village}, ${formData.mandal}, ${formData.post}, ${formData.area}, Landmark: ${formData.landmark || 'N/A'}, ${formData.city}, ${formData.stateRaw} - ${formData.pincode}. Email: ${formData.email}${paymentMethod === 'COD' ? ' [COD ORDER]' : ''}`;
    
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email || '',
          whatsapp: formData.whatsapp,
          address: professionalAddress,
          city: formData.city,
          state: formData.stateRaw,
          pincode: formData.pincode,
          cartItems: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, image: i.image })),
          totalPrice: cartTotal,
          paymentMethod: paymentMethod,
          transactionId: transactionId || null,
          paymentStatus: paymentMethod === 'UPI' ? 'Paid (Pending Verification)' : 'Unpaid'
        })
      });

      if (!res.ok) throw new Error('Registry rejection');
      clearCart();
      const data = await res.json();
      setOrderSuccess({ id: data.orderId });
    } catch (err: any) { alert('Sync Failure: ' + err.message); setIsSubmitting(false); }
  };

  if (!mounted || authLoading) return null;

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <GrainOverlay opacity={30} />
        <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0_rgba(241,90,36,1)] max-w-lg w-full text-center relative z-10">
          <div className="w-20 h-20 bg-[var(--color-brand-primary)] border-4 border-black flex items-center justify-center mx-auto mb-8 text-white shadow-xl">
             <ShieldCheck size={40} />
          </div>
          <h1 className="font-heading text-4xl text-brand-text mb-4 uppercase tracking-tighter">AUTHENTICATION <span className="text-[var(--color-brand-primary)]">REQUIRED</span></h1>
          <p className="font-body text-brand-text/60 mb-10 uppercase text-[10px] tracking-[0.25em] font-bold text-black/50">To proceed with hardware deployment, you must first access your Satya Computers account.</p>
          <Link href="/account" className="w-full"><BrutalButton className="w-full !h-16 text-lg uppercase">SIGN IN / CREATE ACCOUNT</BrutalButton></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg relative pb-24 font-body overflow-x-hidden">
      <GrainOverlay opacity={30} />
      
      <section className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative border-b border-white/10">
        <h1 className="font-heading text-5xl md:text-8xl text-brand-text tracking-tight mb-4 uppercase">
          {isReviewing ? 'VERIFY' : 'SECURE'} <span className="text-[var(--color-gold)]">{isReviewing ? 'DEPOSIT' : 'CHECKOUT'}</span>
        </h1>
        <p className="text-sm md:text-lg text-brand-text/50 uppercase tracking-[0.3em] font-black underline decoration-[var(--color-gold)] decoration-4 underline-offset-8">AUTHORIZED DEPLOYMENT PROTOCOL</p>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-16">
        <div className="w-full lg:w-2/3 order-2 lg:order-1">
          {!isReviewing ? (
            <div className="bg-white border-4 border-black p-6 md:p-12 shadow-[20px_20px_0_0_rgba(0,0,0,0.05)]">
              <form onSubmit={toggleReview} className="space-y-12">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b-2 border-black pb-4">
                    <Smartphone className="text-[var(--color-gold)]" />
                    <h3 className="font-heading text-2xl uppercase tracking-tighter">CLIENT IDENTIFIER</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input id="fullName" required value={formData.fullName} onChange={handleChange} title="Legal Name" className="w-full bg-gray-50 p-6 border-2 border-black focus:bg-white outline-none font-bold uppercase transition-all" placeholder="Legal Name" />
                    <input id="email" type="email" required value={formData.email} onChange={handleChange} title="Email Address" className="w-full bg-gray-50 p-6 border-2 border-black focus:bg-white outline-none font-bold transition-all" placeholder="Email Address" />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 border-b-2 border-black pb-4">
                    <MapPin className="text-[var(--color-brand-primary)]" />
                    <h3 className="font-heading text-2xl uppercase tracking-tighter">SURFACE DOMAIN (ADDRESS)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Phone Number</label>
                      <input id="whatsapp" required pattern="[0-9]{10}" value={formData.whatsapp} onChange={handleChange} title="Phone" className="w-full bg-gray-50 p-6 border-2 border-black font-bold" placeholder="WhatsApp Number" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Pincode</label>
                      <div className="relative">
                        <input id="pincode" required maxLength={6} pattern="[0-9]{6}" value={formData.pincode} onChange={handleChange} title="Pincode" className="w-full bg-gray-50 p-6 border-2 border-black font-bold" placeholder="6-Digit Pincode" />
                        {isPincodeLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><Loader2 className="animate-spin text-[var(--color-brand-primary)]" size={20} /></div>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">City / District</label>
                    <input id="city" required value={formData.city} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold uppercase" placeholder="City / District" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">House/Building/Floor</label>
                    <input id="houseNo" required value={formData.houseNo} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold capitalize" placeholder="House No., Building Name" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Village / Town</label>
                      <input id="village" required value={formData.village} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold capitalize" placeholder="Village / Town" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Mandal / Tehsil</label>
                      <input id="mandal" required value={formData.mandal} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold capitalize" placeholder="Mandal / Tehsil" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Post Office</label>
                      <input id="post" required value={formData.post} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold capitalize" placeholder="Post Office" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Road/Area/Colony</label>
                      <input id="area" required value={formData.area} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold capitalize" placeholder="Road, Area, Colony" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">Landmark (Optional)</label>
                      <input id="landmark" value={formData.landmark} onChange={handleChange} className="w-full bg-gray-50 p-6 border-2 border-black font-bold capitalize" placeholder="Landmark" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-black/40 uppercase tracking-widest pl-2 font-bold">State</label>
                      <div className="relative">
                        <select id="stateRaw" required value={formData.stateRaw} onChange={handleChange} title="Select Deployment State" className="w-full bg-gray-50 p-6 border-2 border-black font-bold uppercase cursor-pointer appearance-none">
                          <option value="">Select State</option>
                          {INDIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                        </select>
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"><ChevronDown size={24} /></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="font-heading text-2xl uppercase border-b-2 border-black pb-4">FINANCIAL PROTOCOL</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPaymentMethod('COD')} title="Select Cash on Delivery" className={`p-5 border-4 transition-all text-center ${paymentMethod === 'COD' ? 'border-orange-500 bg-orange-50 font-black' : 'border-black/5 bg-gray-50 hover:border-black'}`}><span className="font-heading text-xl uppercase">COD</span></button>
                    <button type="button" onClick={() => setPaymentMethod('UPI')} title="Select UPI Payment" className={`p-5 border-4 transition-all text-center ${paymentMethod === 'UPI' ? 'border-[var(--color-gold)] bg-orange-50 font-black' : 'border-black/5 bg-gray-50 hover:border-black'}`}><span className="font-heading text-xl uppercase">UPI Pay</span></button>
                  </div>
                </div>
                <BrutalButton type="submit" disabled={items.length === 0} className="w-full !h-24 text-2xl font-heading shadow-none uppercase">PROCEED TO AUTHORIZE</BrutalButton>
              </form>
            </div>
          ) : (
            <div className="bg-white border-4 border-black p-8 md:p-16 shadow-[20px_20px_0_0_rgba(0,0,0,0.05)] space-y-12">
               <div className="flex justify-between items-end border-b-4 border-black pb-8">
                  <h3 className="font-heading text-4xl uppercase leading-none tracking-tighter">CONFIRM MANIFEST</h3>
                  <button onClick={() => setIsReviewing(false)} title="Return to Coordinates Input" className="text-black font-black text-xs uppercase underline decoration-4 decoration-[var(--color-gold)] hover:text-[var(--color-gold)] underline-offset-8">EDIT</button>
               </div>
               <div className="space-y-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Authorized Consignee</span>
                    <p className="text-3xl font-heading uppercase">{formData.fullName}</p>
                    <p className="text-sm font-bold text-gray-500 uppercase">+91 {formData.whatsapp} | {formData.email}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em]">Deployment Domain</span>
                    <p className="text-xl font-bold uppercase leading-relaxed max-w-lg">
                      {formData.houseNo}, {formData.village}, {formData.mandal}, {formData.post}, {formData.area}, {formData.landmark && `Landmark: ${formData.landmark}, `} {formData.city}, {formData.stateRaw} - {formData.pincode}
                    </p>
                  </div>
               </div>
               <BrutalButton onClick={handleSubmitOrder} disabled={isSubmitting} title="Commit to Registry" className="w-full !h-28 text-3xl font-heading uppercase">{isSubmitting ? 'SYNCHRONIZING...' : 'AUTHORIZE DEPLOY'}</BrutalButton>
            </div>
          )}
        </div>

        <div className="w-full lg:w-1/3 order-1 lg:order-2">
          <div className="bg-[#0A1628] text-white p-8 md:p-10 sticky top-28 border-4 border-black shadow-[15px_15px_0_0_#F15A24]">
             <h3 className="font-heading text-2xl mb-8 tracking-widest border-b border-white/10 pb-6 uppercase">MANIFEST SUMMARY</h3>
             <div className="space-y-6 mb-12 max-h-60 overflow-y-auto no-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                     <span className="text-lg font-bold uppercase">{item.name}</span>
                     <span className="font-black text-sm text-[var(--color-gold)]">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
             </div>
             <div className="pt-8 border-t-2 border-dashed border-white/20">
                <span className="font-heading text-5xl md:text-6xl text-white tracking-tighter">₹{cartTotal.toLocaleString()}</span>
             </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showUpiModal && (
          <div className="fixed inset-0 z-[5000] flex flex-col items-center justify-start p-4 md:p-6 overflow-y-auto bg-black/90 backdrop-blur-md">
             <div className="hidden md:block absolute inset-0" onClick={() => setShowUpiModal(false)} />
             <motion.div initial={{y: "100%", opacity: 0}} animate={{y: 0, opacity: 1}} exit={{y: "100%", opacity: 0}} className="relative w-full max-w-sm bg-[#121212] rounded-[2.5rem] shadow-2xl p-6 md:p-10 space-y-6 text-center mt-10 mb-20">
                <div className="flex justify-between items-center"><h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.3em]">Hardware Deposit</h3><button onClick={() => setShowUpiModal(false)} title="Dismiss Payment Portal" className="text-white/20 hover:text-white"><X size={20} /></button></div>
                <div className="bg-white p-6 rounded-[2rem] mx-auto w-[220px] border-t-4 border-emerald-500 shadow-2xl relative">
                   <div className="mb-4"><p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em]">Payload</p><p className="font-heading text-2xl text-black">₹{cartTotal.toLocaleString()}</p></div>
                   <div className="bg-white p-2 border border-gray-100 rounded-xl mb-4 flex justify-center">
                     <QRCodeCanvas 
                        value={rawUpiLink} 
                        size={170} 
                        level="H" 
                        includeMargin={true}
                        imageSettings={{
                          src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="48" fill="#1b1b1b" stroke="white" stroke-width="4"/><text x="50" y="65" font-family="sans-serif" font-size="45" font-weight="bold" fill="white" text-anchor="middle">पे</text></svg>'),
                          x: undefined,
                          y: undefined,
                          height: 40,
                          width: 40,
                          excavate: true,
                        }}
                     />
                   </div>
                   <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-[8px] font-bold text-black break-all">{adminUpi}</div>
                   {isSubmitting && <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center z-10"><Loader2 className="animate-spin text-emerald-500 mb-2" size={32} /></div>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <button onClick={downloadQr} title="Download Secure QR Payload" className="py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[8px] uppercase tracking-widest"><Download size={14} className="mx-auto mb-1" /> DOWNLOAD</button>
                   <button onClick={sharePayment} title="Share Encrypted Payment Link" className="py-3 bg-white/5 border border-white/10 rounded-xl text-white font-black text-[8px] uppercase tracking-widest"><Share2 size={14} className="mx-auto mb-1" /> SHARE</button>
                </div>
                <div className="space-y-3 pt-4 border-t border-white/5">
                   <p className="text-[10px] font-black text-emerald-500 uppercase text-left pl-1">Input 12-Digit Transaction ID (UTR)</p>
                   <input type="text" maxLength={12} value={transactionId} onChange={(e) => setTransactionId(e.target.value.replace(/[^0-9]/g, ''))} className="w-full bg-white/5 border border-white/20 p-5 rounded-2xl text-white font-bold tracking-[0.2em] outline-none text-center" placeholder="12-DIGIT UTR" />
                </div>
                <button onClick={() => { if (transactionId.length < 12) { alert('Protocol Error: 12-digit UTR Required'); return; } handleSubmitOrder(); }} disabled={isSubmitting} title="Authorize Final Handshake" className="w-full !h-20 text-xl font-heading bg-emerald-500 text-white uppercase rounded-2xl transition-all">{isSubmitting ? 'VERIFYING...' : 'FINALIZE DEPLOY'}</button>
                <a href={rawUpiLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white rounded-xl font-black text-[8px] uppercase border border-white/5 transition-all"><Smartphone size={14} className="text-emerald-400" /> OPEN IN APP</a>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-black font-mono">
            <div className="w-full max-w-3xl bg-black border border-[var(--color-brand-primary)]/30 p-8 shadow-[0_0_40px_rgba(241,90,36,0.1)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--color-brand-primary)]/50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,_#F15A24_1px,_transparent_1px)] bg-[size:10px_10px] opacity-10 pointer-events-none" />
              <h2 className="text-[var(--color-brand-primary)] text-sm md:text-xl mb-8 flex items-center gap-3 uppercase tracking-[0.3em] font-black">
                <Terminal size={24} />
                DEPLOYMENT INITIALIZATION
              </h2>
              <div className="space-y-4 text-[var(--color-brand-primary)] text-xs md:text-sm tracking-widest min-h-[200px]">
                {terminalLogs.map((log, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    {log}
                  </motion.div>
                ))}
                {terminalLogs.length < 5 && (
                  <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                    _
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
