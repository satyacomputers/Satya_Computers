'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import BrutalButton from '@/components/ui/BrutalButton';
import { Suspense, useEffect, useState } from 'react';

interface OrderData {
  orderId: string;
  status: string;
  displayStatus: 'placed' | 'processing' | 'transit' | 'delivered' | 'cancelled';
  companyName: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId?: string | null;
}

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [mounted, setMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const savedUser = localStorage.getItem('satya_user');
    setIsLoggedIn(!!savedUser);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/order-status?id=${searchInput.trim().toUpperCase()}`);
    }
  };

  const fetchOrder = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        if (res.status === 404) throw new Error('Order not found');
        throw new Error('Failed to fetch order status');
      }
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Real-time synchronization pulse: Every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-heading tracking-widest text-2xl animate-pulse">
        SYNCHRONIZING TRACKING DATA...
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <GrainOverlay opacity={30} />
        <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0_rgba(241,90,36,1)] max-w-lg w-full text-center relative z-10">
          <div className="w-20 h-20 bg-[var(--color-brand-primary)] border-4 border-black flex items-center justify-center mx-auto mb-8 text-white shadow-xl">
             <Package size={40} />
          </div>
          <h1 className="font-heading text-4xl text-brand-text mb-4 uppercase tracking-tighter leading-none">
            AUTHENTICATION <span className="text-[var(--color-brand-primary)]">REQUIRED</span>
          </h1>
          <p className="font-body text-brand-text/60 mb-10 uppercase text-[10px] tracking-[0.25em] leading-relaxed font-bold">
            To access our professional order tracking system and real-time deployment logs, you must have a registered Satya Computers account.
          </p>
          
          <div className="flex flex-col gap-4">
             <Link href="/account" className="w-full">
               <BrutalButton className="w-full !h-16 text-lg">ACCESS MY ACCOUNT</BrutalButton>
             </Link>
             <p className="font-body text-[9px] text-black/30 tracking-[0.3em] mt-2 uppercase">Your privacy and security are our priority.</p>
          </div>
        </div>
      </main>
    );
  }

  if (!orderId || error || !order) {
    return (
      <main className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
        <GrainOverlay opacity={30} />
        <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0_rgba(0,0,0,1)] max-w-lg w-full text-center relative z-10">
          <AlertCircle className="w-16 h-16 mx-auto mb-6 text-red-500" />
          <h1 className="font-heading text-4xl text-brand-text mb-4 uppercase tracking-tighter">
            {error ? 'ORDER NOT FOUND' : 'TRACK YOUR ORDER'}
          </h1>
          <p className="font-body text-brand-text/60 mb-8 uppercase text-xs tracking-[0.2em] leading-relaxed">
            {error 
              ? `The tracking ID "${orderId}" was not found in our database.` 
              : "Enter your Satya Computers tracking ID (e.g., SATYA-XXXXX) to check your deployment status."}
          </p>
          
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
             <div className="relative group">
               <input 
                 type="text" 
                 placeholder="SATYA-XXXXX" 
                 value={searchInput}
                 onChange={(e) => setSearchInput(e.target.value)}
                 className="w-full bg-[#FAFAFA] border-2 border-black/10 p-5 font-heading text-sm tracking-[0.2em] focus:outline-none focus:border-black focus:bg-white transition-all duration-300 placeholder:opacity-30"
               />
               <div className="absolute inset-0 border border-black/5 pointer-events-none group-hover:border-black/20 transition-all" />
             </div>
             <button type="submit" className="bg-black text-white py-5 font-heading text-xs tracking-[0.3em] font-black uppercase hover:bg-[var(--color-brand-primary)] transition-all shadow-xl shadow-black/10">
               INITIATE TRACKING
             </button>
          </form>

          <div className="mt-10 flex flex-col gap-4 border-t-4 border-black/5 pt-8">
             <Link href="/" className="text-black/40 font-heading text-[10px] tracking-widest hover:text-black transition-all">
               RETURN TO HUB
             </Link>
             <Link href="/contact" className="text-black/40 font-heading text-[10px] tracking-widest hover:text-black transition-all">
               CONTACT ARCHITECTS
             </Link>
          </div>
        </div>
      </main>
    );
  }

  const creationDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getStepStatus = (stepIdx: number) => {
    const statusOrder = ['placed', 'processing', 'transit', 'delivered'];
    const currentIdx = statusOrder.indexOf(order.displayStatus);
    
    if (stepIdx < currentIdx) return 'completed';
    if (stepIdx === currentIdx) return 'current';
    return 'upcoming';
  };

  const steps = [
    { label: 'Order Placed', icon: Clock, status: getStepStatus(0), date: creationDate },
    { label: 'Processing', icon: Package, status: getStepStatus(1), date: order.displayStatus === 'placed' ? 'Estimated: Soon' : 'Active' },
    { label: 'In Transit', icon: Truck, status: getStepStatus(2), date: order.displayStatus === 'transit' ? 'En Route to Destination' : 'TBD' },
    { label: 'Delivered', icon: CheckCircle, status: getStepStatus(3), date: order.displayStatus === 'delivered' ? 'Success' : 'TBD' },
  ];

  return (
    <main className="min-h-screen bg-brand-bg relative pb-24">
      <GrainOverlay opacity={30} />
      
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
        <div className="bg-white border border-black/10 p-8 md:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-black/10 pb-8">
            <div>
              <h1 className="font-heading text-4xl text-brand-text mb-2 tracking-tight">
                TRACK YOUR <span className="text-[var(--color-gold)]">ORDER</span>
              </h1>
              <p className="font-body text-brand-text/60">DEPLOYMENT ID: {order.orderId}</p>
              <p className="font-heading text-[10px] tracking-widest text-[#1A1A1A]/40 uppercase mt-2">ACCOUNT: {order.companyName}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="bg-[#1A1A1A] text-white px-8 py-3 font-heading tracking-[0.2em] text-xs flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                STATUS: {order.status.toUpperCase()}
              </div>
              {order.paymentMethod === 'UPI' && order.paymentStatus !== 'Paid' && (
                <div className="flex flex-col items-end gap-1">
                  <div className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-2 font-heading tracking-widest text-[9px] uppercase animate-pulse shadow-[4px_4px_0_rgba(249,115,22,0.1)]">
                     VERIFICATION IN PROGRESS
                  </div>
                  {order.transactionId && (
                    <span className="text-[8px] font-black text-black/30 uppercase tracking-[0.2em] pr-1">UTR: {order.transactionId}</span>
                  )}
                </div>
              )}
              {order.paymentMethod === 'UPI' && order.paymentStatus === 'Paid' && (
                <div className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-4 py-2 font-heading tracking-widest text-[9px] uppercase shadow-[4px_4px_0_rgba(16,185,129,0.1)]">
                   SECURE HANDSHAKE VERIFIED
                </div>
              )}
            </div>
          </div>

          <div className="mb-16 relative">
            <div className="hidden md:block absolute top-[28px] left-[5%] right-[5%] h-2 bg-gray-100 z-0 overflow-hidden rounded-full">
               <div 
                 className={`h-full bg-[var(--color-brand-primary)] transition-all duration-1000 ease-out ${
                   order.displayStatus === 'placed' ? 'w-0' :
                   order.displayStatus === 'processing' ? 'w-1/3' :
                   order.displayStatus === 'transit' ? 'w-2/3' : 'w-full'
                 }`}
               />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center group">
                  <div className="relative mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-700 bg-white ${
                      step.status === 'completed' ? 'border-[3px] border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] scale-110 shadow-[0_0_20px_rgba(241,90,36,0.2)]' : 
                      step.status === 'current' ? 'border-[3px] border-[var(--color-brand-primary)] text-[var(--color-brand-primary)] scale-125 shadow-[0_0_30px_rgba(241,90,36,0.4)] bg-orange-50' : 
                      'border-2 border-black/10 text-black/20 group-hover:border-black/30 bg-gray-50'
                    }`}>
                      <step.icon size={step.status === 'current' ? 24 : 20} strokeWidth={step.status === 'upcoming' ? 1.5 : 2.5} />
                    </div>
                    {/* Pulse effect for current step */}
                    {step.status === 'current' && (
                      <div className="absolute inset-0 border-2 border-[var(--color-brand-primary)] rounded-full animate-ping opacity-20 pointer-events-none" />
                    )}
                    {/* Completion checkmark */}
                    {step.status === 'completed' && (
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white text-white flex items-center justify-center scale-100 animate-in zoom-in">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                       </div>
                    )}
                  </div>
                  <h3 className={`font-heading text-xs tracking-[0.2em] mb-1 transition-colors ${
                    step.status === 'current' ? 'text-[var(--color-brand-primary)] font-black' : 
                    step.status === 'completed' ? 'text-black font-bold' : 'text-black/30'
                  }`}>
                    {step.label.toUpperCase()}
                  </h3>
                  <p className="font-body text-[9px] text-brand-text/40 uppercase tracking-widest">{step.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-black/10 pt-12">
            <div>
              <h4 className="font-heading text-xl mb-6 tracking-[0.1em] text-brand-text uppercase underline decoration-[var(--color-gold)] decoration-2 underline-offset-8">Lifecycle Details</h4>
              <div className="space-y-6 font-body text-sm text-brand-text/70">
                <div className="border-l-4 border-black pl-6 py-2">
                  <p className="text-black font-bold uppercase tracking-widest text-xs mb-1">Financial State:</p>
                  <p className="leading-relaxed text-xs">
                    METHOD: <span className="font-bold">{order.paymentMethod}</span> 
                    <br />
                    STATUS: <span className={order.paymentStatus === 'Paid' ? 'text-emerald-600 font-bold' : 'text-orange-600 font-bold'}>
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                </div>

                <div className="border-l-4 border-black/5 pl-6 py-2">
                  <p className="text-black/40 font-bold uppercase tracking-widest text-xs mb-1">Logistics Note:</p>
                  <p className="leading-relaxed text-xs">Our deployment team in Hyderabad is currently {order.status.toLowerCase()} your hardware architecture. Professional-grade packaging and static-safe handling are in effect.</p>
                </div>
                
                <div className="flex items-center gap-4 text-xs tracking-widest uppercase text-brand-text/40">
                  <Truck size={14} />
                  <span>Avg Dispatch: 2 to 3 days</span>
                </div>

                <div className="bg-[#1A1A1A] p-6 text-white mt-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_#ffffff_1px,_transparent_1px)] bg-[size:10px_10px]" />
                  <p className="relative z-10 text-[10px] leading-loose italic uppercase tracking-widest">
                    &quot;Hardware isn&apos;t just delivered; it&apos;s deployed. We ensure every transistor reaches you in peak industrial condition.&quot;
                  </p>
                </div>
              </div>
            </div>
            
              <div className="mt-auto">
                <Link 
                  href="/" 
                  className="text-center py-3 font-heading text-[10px] tracking-widest text-brand-text/30 hover:text-black transition-all border border-transparent hover:border-black/5 w-full"
                >
                  RETURN TO CONTROL CENTER
                </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function OrderStatusPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading tracking-widest">LOADING STATUS...</div>}>
      <OrderStatusContent />
    </Suspense>
  );
}
