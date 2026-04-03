'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import GrainOverlay from '@/components/ui/GrainOverlay';
import Link from 'next/link';
import { ShieldCheck, Package, Clock, Truck, CheckCircle, ExternalLink, AlertTriangle, Wrench } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface WarrantyOrder {
  id: string;
  orderId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  products: string;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

function WarrantyHubContent() {
  const [orders, setOrders] = useState<WarrantyOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');
  const [serviceTicket, setServiceTicket] = useState<{ orderId: string; productName: string } | null>(null);

  useEffect(() => {
    const email = localStorage.getItem('satya_user_email');
    if (!email) { window.location.href = '/account'; return; }
    setUserEmail(email);
    fetch(`/api/user/orders?email=${email}`)
      .then(r => r.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const getWarrantyStatus = (order: WarrantyOrder) => {
    const deliveryDate = new Date(order.updatedAt);
    const warrantyExpiry = new Date(deliveryDate.getTime() + 180 * 24 * 60 * 60 * 1000); // 6 months
    const now = new Date();
    const isDelivered = order.orderStatus === 'Delivered';
    const isActive = isDelivered && now < warrantyExpiry;
    const daysRemaining = Math.max(0, Math.ceil((warrantyExpiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    return { isDelivered, isActive, warrantyExpiry, daysRemaining };
  };

  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered');
  const activeWarranties = deliveredOrders.filter(o => getWarrantyStatus(o).isActive);
  const displayOrders = activeTab === 'active' ? activeWarranties : deliveredOrders;

  if (loading) return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center font-heading tracking-widest text-2xl animate-pulse">
      LOADING WARRANTY REGISTRY...
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-bg relative pt-24 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <GrainOverlay opacity={30} />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12 border-b-4 border-black pb-8">
          <p className="font-heading text-xs tracking-[0.3em] text-[var(--color-brand-primary)] uppercase mb-2">Post-Purchase Protection</p>
          <h1 className="font-heading text-5xl text-brand-text tracking-tighter uppercase mb-4">
            WARRANTY <span className="text-[var(--color-brand-primary)]">HUB</span>
          </h1>
          <p className="font-body text-sm text-brand-text/50 uppercase tracking-widest">Manage your hardware warranties and service requests.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Orders', val: orders.length, icon: Package, color: 'bg-black' },
            { label: 'Active Warranties', val: activeWarranties.length, icon: ShieldCheck, color: 'bg-emerald-600' },
            { label: 'Delivered', val: deliveredOrders.length, icon: CheckCircle, color: 'bg-blue-600' },
          ].map(({ label, val, icon: Icon, color }) => (
            <div key={label} className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)]">
              <div className={`w-10 h-10 ${color} flex items-center justify-center text-white mb-3`}><Icon size={20} /></div>
              <p className="font-heading text-3xl text-brand-text">{val}</p>
              <p className="font-body text-[10px] text-brand-text/40 uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b-4 border-black pb-2 mb-8">
          {([['active', 'Active Warranties'], ['all', 'All Delivered Orders']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`font-heading text-xs tracking-widest uppercase px-6 py-3 border-b-4 transition-all ${
                activeTab === tab ? 'border-[var(--color-brand-primary)] text-[var(--color-brand-primary)]' : 'border-transparent text-black/30 hover:text-black'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Orders / Warranties */}
        {displayOrders.length === 0 ? (
          <div className="bg-white border-4 border-black p-16 text-center shadow-[16px_16px_0_rgba(0,0,0,1)]">
            <ShieldCheck size={64} className="mx-auto text-black/10 mb-6" />
            <h2 className="font-heading text-3xl mb-4 uppercase">No Warranties Found</h2>
            <p className="font-body text-sm text-brand-text/60 mb-8 uppercase tracking-widest">
              {activeTab === 'active' ? 'No active warranties. Orders must be delivered to activate warranty.' : 'No delivered orders found.'}
            </p>
            <Link href="/products" className="inline-block bg-black text-white px-10 py-4 font-heading text-sm tracking-widest hover:bg-[var(--color-brand-primary)] transition-all uppercase">
              EXPLORE PRODUCTS
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {displayOrders.map((order) => {
              let items: OrderItem[] = [];
              try { items = JSON.parse(order.products); } catch {}
              const { isActive, warrantyExpiry, daysRemaining } = getWarrantyStatus(order);

              return (
                <div key={order.id} className="bg-white border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] overflow-hidden">
                  {/* Order Header */}
                  <div className={`p-6 flex flex-wrap justify-between items-center gap-4 ${isActive ? 'bg-emerald-50 border-b-2 border-emerald-200' : 'bg-gray-50 border-b-2 border-gray-200'}`}>
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={24} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
                      <div>
                        <p className="font-heading text-sm uppercase tracking-widest">{order.orderId}</p>
                        <p className={`font-body text-xs font-bold uppercase tracking-widest mt-0.5 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {isActive ? `WARRANTY ACTIVE — ${daysRemaining} days remaining` : 'WARRANTY EXPIRED'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-body text-xs text-brand-text/40 uppercase tracking-widest">Expiry</p>
                      <p className="font-heading text-sm text-brand-text">{warrantyExpiry.toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
                    </div>
                  </div>

                  {/* Order Products */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between bg-gray-50 p-4 border-2 border-black/5">
                          <div>
                            <p className="font-heading text-base text-brand-text">{item.name}</p>
                            <p className="font-body text-[10px] text-brand-text/40 uppercase tracking-widest mt-0.5">Qty: {item.quantity} | 6-Month Satya Warranty</p>
                          </div>
                          <p className="font-heading text-lg text-brand-text">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Invoice download */}
                      <button
                        onClick={async () => {
                          try {
                            const { jsPDF } = await import('jspdf');
                            const doc = new jsPDF();
                            doc.setFont('helvetica', 'bold');
                            doc.setFontSize(20);
                            doc.text('SATYA COMPUTERS', 20, 20);
                            doc.setFontSize(10);
                            doc.setFont('helvetica', 'normal');
                            doc.text('Invoice', 20, 30);
                            doc.text(`Order: ${order.orderId}`, 20, 38);
                            doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN')}`, 20, 46);
                            doc.text(`Customer: ${order.customerName}`, 20, 56);
                            doc.text(`Phone: ${order.phone}`, 20, 64);
                            let y = 80;
                            items.forEach((item, idx) => {
                              doc.text(`${idx + 1}. ${item.name} x${item.quantity} = INR ${(item.price * item.quantity).toLocaleString('en-IN')}`, 20, y);
                              y += 10;
                            });
                            doc.setFont('helvetica', 'bold');
                            doc.text(`TOTAL: INR ${order.totalAmount.toLocaleString('en-IN')}`, 20, y + 6);
                            doc.text('Warranty: 6 Months (Satya Computers)', 20, y + 16);
                            doc.save(`Invoice_${order.orderId}.pdf`);
                          } catch (e) { alert('Could not generate invoice.'); }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-black font-heading text-xs tracking-widest uppercase hover:bg-black hover:text-white transition-all"
                      >
                        <ExternalLink size={14} /> DOWNLOAD INVOICE
                      </button>

                      {/* Service Request */}
                      {isActive && (
                        <button
                          onClick={() => setServiceTicket({ orderId: order.orderId, productName: items[0]?.name || 'Product' })}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-primary)] text-white font-heading text-xs tracking-widest uppercase hover:bg-orange-600 transition-all"
                        >
                          <Wrench size={14} /> REQUEST SERVICE
                        </button>
                      )}

                      <Link
                        href={`/order-status?id=${order.orderId}`}
                        className="flex items-center gap-2 px-5 py-2.5 border-2 border-black/20 font-heading text-xs tracking-widest uppercase hover:border-black transition-all text-black/60"
                      >
                        <Truck size={14} /> TRACK ORDER
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Service Ticket Modal */}
        {serviceTicket && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <div className="bg-white border-4 border-black shadow-[16px_16px_0_rgba(241,90,36,1)] max-w-md w-full p-10 relative">
              <button onClick={() => setServiceTicket(null)} className="absolute top-4 right-4 font-heading text-xs text-black/30 hover:text-black uppercase tracking-widest">CLOSE ×</button>
              <Wrench size={32} className="text-[var(--color-brand-primary)] mb-4" />
              <h3 className="font-heading text-3xl uppercase mb-2">Service Request</h3>
              <p className="font-body text-sm text-brand-text/60 mb-6 uppercase tracking-widest">Order: {serviceTicket.orderId}</p>
              <p className="font-body text-sm text-brand-text/70 leading-relaxed mb-8">
                To raise a warranty service request for <strong>{serviceTicket.productName}</strong>, our team will contact you within 24 hours after you send a WhatsApp message.
              </p>
              <a
                href={`https://wa.me/919640272323?text=Service Request for Order: ${serviceTicket.orderId}. Product: ${serviceTicket.productName}. Issue: `}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-black text-white font-heading text-sm tracking-widest uppercase flex items-center justify-center gap-3 hover:bg-[var(--color-brand-primary)] transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Send WhatsApp Service Request
              </a>
            </div>
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/account" className="font-heading text-xs tracking-[0.3em] text-black/30 hover:text-black transition-all uppercase">
            ← Return to Account Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function WarrantyHubPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-heading tracking-widest">LOADING...</div>}>
      <WarrantyHubContent />
    </Suspense>
  );
}
