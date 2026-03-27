'use client';

import { useState, useEffect, Suspense } from 'react';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { Package, Truck, CheckCircle, Clock, AlertCircle, ShoppingBag, ChevronRight, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderData {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: string; // JSON string
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

function MyOrdersContent() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('satya_user_email');
    if (!email) {
      window.location.href = '/account';
      return;
    }
    setUserEmail(email);

    async function fetchOrders() {
      try {
        const res = await fetch(`/api/user/orders?email=${email}`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center font-heading tracking-widest text-2xl animate-pulse">
        RETRIVING DEPLOYMENT HISTORY...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brand-bg relative pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <GrainOverlay opacity={30} />
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mb-12 border-b-4 border-black pb-8">
           <h1 className="font-heading text-5xl text-brand-text tracking-tighter uppercase mb-2">
             ORDER <span className="text-[var(--color-brand-primary)]">ARCHIVE</span>
           </h1>
           <p className="font-body text-xs text-brand-text/50 uppercase tracking-[0.2em]">Viewing deployment logs for: {userEmail}</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border-4 border-black p-16 text-center shadow-[16px_16px_0_rgba(0,0,0,1)]">
             <ShoppingBag size={64} className="mx-auto text-black/10 mb-6" />
             <h2 className="font-heading text-3xl mb-4">NO DEPLOYMENTS DETECTED</h2>
             <p className="font-body text-sm text-brand-text/60 mb-8 uppercase tracking-widest">You haven&apos;t initialized any hardware orders yet.</p>
             <Link href="/products" className="inline-block bg-black text-white px-10 py-4 font-heading text-sm tracking-widest hover:bg-[var(--color-brand-primary)] transition-all uppercase">
               INITIALIZE PROCUREMENT
             </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => {
              let items: OrderItem[] = [];
              try { items = JSON.parse(order.products); } catch (e) {}
              
              const statusColor = 
                order.orderStatus === 'Delivered' ? 'bg-green-500' :
                order.orderStatus === 'Processing' ? 'bg-orange-500' :
                order.orderStatus === 'Shipped' ? 'bg-blue-500' : 'bg-red-500';

              return (
                <div key={order.id} className="bg-white border-4 border-black shadow-[12px_12px_0_rgba(0,0,0,1)] overflow-hidden group">
                  {/* Order Header */}
                  <div className="bg-black text-white p-6 flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                       <div className={`w-3 h-3 rounded-full ${statusColor} animate-pulse`} />
                       <span className="font-heading tracking-[0.2em] text-sm uppercase">DEPLOYMENT ID: {order.orderId}</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="font-heading tracking-[0.2em] text-[10px] text-white/50 uppercase">{new Date(order.createdAt).toLocaleDateString()}</span>
                       <Link href={`/order-status?id=${order.orderId}`} className="bg-white text-black px-4 py-1 font-heading text-[10px] tracking-widest hover:bg-[var(--color-brand-primary)] hover:text-white transition-all uppercase">
                         TRACK LIVE
                       </Link>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                       <div className="flex flex-col gap-4">
                         {items.map((item, i) => (
                           <div key={i} className="flex gap-4 items-center bg-gray-50 p-4 border-2 border-black/5 hover:border-black/20 transition-all group/item">
                             <div className="w-16 h-16 bg-white border-2 border-black p-1 flex-shrink-0">
                                {item.image ? (
                                  <img src={item.image.startsWith('http') ? item.image : `/${item.image}`} alt={item.name} className="w-full h-full object-contain" />
                                ) : <div className="w-full h-full bg-gray-100" />}
                             </div>
                             <div className="flex-1">
                               <h4 className="font-heading text-lg text-brand-text leading-tight group-hover/item:text-[var(--color-brand-primary)] transition-colors">{item.name}</h4>
                               <p className="font-body text-[10px] text-brand-text/40 uppercase tracking-widest mt-1">Quantity: {item.quantity} | Unit Price: ₹{item.price.toLocaleString()}</p>
                             </div>
                             <div className="text-right">
                               <p className="font-heading text-lg">₹{(item.price * item.quantity).toLocaleString()}</p>
                             </div>
                           </div>
                         ))}
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 bg-[#FAF9F6] border-2 border-black">
                         <h5 className="font-heading text-xs tracking-widest uppercase mb-4 border-b border-black/5 pb-2">Status Matrix</h5>
                         <div className="space-y-4">
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-heading tracking-widest text-black/40 uppercase">Deployment</span>
                             <span className={`px-3 py-1 text-white text-[10px] font-heading tracking-[0.2em] uppercase ${statusColor}`}>{order.orderStatus}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-heading tracking-widest text-black/40 uppercase">Payment</span>
                             <span className={`px-2 py-0.5 border-2 border-black text-[10px] font-heading tracking-[0.2em] uppercase ${order.paymentStatus === 'Paid' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>{order.paymentStatus}</span>
                           </div>
                           <div className="pt-2 flex justify-between items-end border-t-2 border-black/5">
                             <span className="text-xs font-heading tracking-widest text-black/60 uppercase">VALUATION</span>
                             <span className="text-2xl font-heading text-brand-text">₹{order.totalAmount.toLocaleString()}</span>
                           </div>
                         </div>
                       </div>

                       <div className="text-[10px] space-y-2 opacity-60">
                         <div className="flex gap-2">
                           <MapPin size={12} className="shrink-0" />
                           <p className="uppercase tracking-widest leading-loose">{order.address}</p>
                         </div>
                         <div className="flex gap-2">
                           <CreditCard size={12} className="shrink-0" />
                           <p className="uppercase tracking-widest">{order.paymentMethod} Protocol</p>
                         </div>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
           <Link href="/account" className="font-heading text-xs tracking-[0.3em] text-black/30 hover:text-black transition-all uppercase">
             ← Return to Command Center
           </Link>
        </div>
      </div>
    </main>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading tracking-widest">LOADING ARCHIVE...</div>}>
      <MyOrdersContent />
    </Suspense>
  );
}
