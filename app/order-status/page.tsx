'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import GrainOverlay from '@/components/ui/GrainOverlay';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Suspense } from 'react';

function OrderStatusContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'SATYA-UNKNOWN';

  const steps = [
    { label: 'Order Placed', icon: Clock, status: 'completed', date: 'Today, 10:30 AM' },
    { label: 'Processing', icon: Package, status: 'current', date: 'Estimated: Today, 2:00 PM' },
    { label: 'In Transit', icon: Truck, status: 'upcoming', date: 'TBD' },
    { label: 'Delivered', icon: CheckCircle, status: 'upcoming', date: 'TBD' },
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
              <p className="font-body text-brand-text/60">ID: {orderId}</p>
            </div>
            <div className="bg-black text-white px-6 py-2 font-heading tracking-widest text-sm">
              STATUS: PROCESSING
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-[22px] left-[5%] right-[5%] h-0.5 bg-black/5 z-0" />
            
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                  step.status === 'completed' ? 'bg-black text-white' : 
                  step.status === 'current' ? 'bg-[var(--color-gold)] text-white animate-pulse' : 
                  'bg-white border border-black/10 text-black/20'
                }`}>
                  <step.icon size={20} />
                </div>
                <h3 className={`font-heading text-xs tracking-widest mb-1 ${
                  step.status === 'upcoming' ? 'text-black/30' : 'text-brand-text'
                }`}>
                  {step.label.toUpperCase()}
                </h3>
                <p className="font-body text-[10px] text-brand-text/40">{step.date}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-black/10 pt-12">
            <div>
              <h4 className="font-heading text-lg mb-4 tracking-widest text-brand-text uppercase underline decoration-[var(--color-gold)] decoration-2">Delivery Details</h4>
              <div className="space-y-4 font-body text-sm text-brand-text/70">
                <p><strong className="text-brand-text">Awaiting Pickup:</strong> Our team is preparing your package for dispatch.</p>
                <p><strong className="text-brand-text">Estimate:</strong> Delivery usually takes 2-4 hours within Hyderabad.</p>
                <div className="bg-[#F9FAFB] p-4 border-l-4 border-black mt-6 italic text-xs">
                  &quot;Thank you for choosing Satya Computers. We prioritize high-speed delivery for all our workstations.&quot;
                </div>
              </div>
            </div>
            
            <div className="bg-[#FFFDF9] border border-[var(--color-gold)]/20 p-8 flex flex-col justify-between">
              <div>
                <h4 className="font-heading text-lg mb-4 tracking-widest text-brand-text uppercase">Need Help?</h4>
                <p className="font-body text-sm text-brand-text/60 mb-6">If you have any questions about your hardware configuration or delivery status, talk to our engineers.</p>
              </div>
              <div className="flex flex-col gap-3">
                <a 
                  href="https://wa.me/918309178589" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black text-white text-center py-4 font-heading text-sm tracking-widest hover:bg-[var(--color-brand-primary)] transition-all"
                >
                  CHAT ON WHATSAPP
                </a>
                <Link 
                  href="/" 
                  className="text-center py-4 font-heading text-xs tracking-widest text-brand-text/40 hover:text-black transition-all"
                >
                  RETURN TO HOME
                </Link>
              </div>
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
