'use client';

import { useState } from 'react';
import { TrendingDown, Package, Users, Building2, Zap } from 'lucide-react';

interface BulkPricingMatrixProps {
  basePrice: number;
  bulkPrice5_10?: number | null;
  bulkPrice11_25?: number | null;
  bulkPrice26Plus?: number | null;
  minOrderQty?: number | null;
  productName: string;
}

export default function BulkPricingMatrix({
  basePrice,
  bulkPrice5_10,
  bulkPrice11_25,
  bulkPrice26Plus,
  minOrderQty = 1,
  productName,
}: BulkPricingMatrixProps) {
  const [activeQty, setActiveQty] = useState<number>(1);

  // Don't render if no bulk pricing is defined
  const hasBulkPricing = bulkPrice5_10 || bulkPrice11_25 || bulkPrice26Plus;
  if (!hasBulkPricing) return null;

  const tiers = [
    {
      label: '1–4 Units',
      icon: Package,
      qty: 1,
      price: basePrice,
      tag: 'Retail',
      color: 'from-gray-50 to-white',
      borderColor: 'border-black/10',
      textColor: 'text-black',
      savings: 0,
    },
    ...(bulkPrice5_10 ? [{
      label: '5–10 Units',
      icon: Users,
      qty: 5,
      price: bulkPrice5_10,
      tag: 'SME Bulk',
      color: 'from-blue-50 to-white',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      savings: Math.round(((basePrice - bulkPrice5_10) / basePrice) * 100),
    }] : []),
    ...(bulkPrice11_25 ? [{
      label: '11–25 Units',
      icon: Building2,
      qty: 11,
      price: bulkPrice11_25,
      tag: 'Corporate',
      color: 'from-orange-50 to-white',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-700',
      savings: Math.round(((basePrice - bulkPrice11_25) / basePrice) * 100),
    }] : []),
    ...(bulkPrice26Plus ? [{
      label: '26+ Units',
      icon: Zap,
      qty: 26,
      price: bulkPrice26Plus,
      tag: 'Enterprise',
      color: 'from-emerald-50 to-white',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      savings: Math.round(((basePrice - bulkPrice26Plus) / basePrice) * 100),
    }] : []),
  ];

  const activeTier = [...tiers].reverse().find(t => activeQty >= t.qty) || tiers[0];
  const totalSaving = (basePrice - activeTier.price) * activeQty;

  return (
    <div className="mt-8 border-t-2 border-black/5 pt-8">
      <div className="flex items-center gap-3 mb-5">
        <TrendingDown size={20} className="text-[var(--color-brand-primary)]" />
        <h3 className="font-heading text-xl uppercase tracking-widest text-brand-text">
          Volume Discount Matrix
        </h3>
        <span className="text-[9px] font-black tracking-widest bg-[var(--color-brand-primary)] text-white px-2 py-0.5 uppercase animate-pulse">
          LIVE
        </span>
      </div>

      {/* Tier Cards */}
      <div className={`grid gap-3 mb-6 ${tiers.length === 4 ? 'grid-cols-2 md:grid-cols-4' : tiers.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {tiers.map((tier) => {
          const TierIcon = tier.icon;
          const isActive = activeTier.qty === tier.qty;
          return (
            <button
              key={tier.label}
              onClick={() => setActiveQty(tier.qty === 26 ? 30 : tier.qty)}
              className={`p-4 border-2 text-left transition-all duration-300 bg-gradient-to-b ${tier.color} relative overflow-hidden ${
                isActive
                  ? `${tier.borderColor} shadow-lg scale-[1.02]`
                  : 'border-black/5 hover:border-black/20 hover:scale-[1.01]'
              }`}
            >
              <TierIcon size={16} className={`mb-2 ${isActive ? tier.textColor : 'text-black/30'}`} />
              <p className={`font-heading text-sm tracking-widest uppercase leading-tight ${isActive ? tier.textColor : 'text-black/50'}`}>
                {tier.label}
              </p>
              <p className={`font-heading text-xl mt-1 ${isActive ? 'text-black' : 'text-black/40'}`}>
                ₹{tier.price.toLocaleString('en-IN')}
              </p>
              {tier.savings > 0 && (
                <span className={`text-[9px] font-black tracking-widest uppercase mt-1 inline-block ${isActive ? tier.textColor : 'text-black/25'}`}>
                  SAVE {tier.savings}%
                </span>
              )}
              {tier.tag && (
                <div className={`absolute top-2 right-2 text-[8px] font-black tracking-widest px-1.5 py-0.5 border ${
                  isActive ? `${tier.borderColor} ${tier.textColor} bg-white/60` : 'border-black/10 text-black/20'
                }`}>
                  {tier.tag}
                </div>
              )}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-brand-primary)] to-transparent" />
              )}
            </button>
          );
        })}
      </div>

      {/* Live quantity calculator */}
      <div className="bg-[#0A1628] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xs tracking-widest text-white/40 uppercase">Live Order Calculator</span>
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Real-time pricing
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="font-heading text-xs text-white/50 uppercase tracking-widest w-20 flex-shrink-0">Units</label>
          <input
            type="number"
            min={minOrderQty || 1}
            value={activeQty}
            title="Order Quantity"
            aria-label="Enter number of units"
            onChange={(e) => setActiveQty(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-24 bg-white/10 border border-white/20 text-white font-heading text-xl text-center p-2 focus:outline-none focus:border-[var(--color-brand-primary)] transition-all"
          />
          <div className="flex-1 h-px bg-white/10" />
          <div className="text-right">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Unit Price</p>
            <p className="font-heading text-2xl text-white">₹{activeTier.price.toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-4 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Total Order Value</p>
            <p className="font-heading text-4xl text-[var(--color-brand-primary)]">
              ₹{(activeTier.price * activeQty).toLocaleString('en-IN')}
            </p>
          </div>
          {totalSaving > 0 && (
            <div className="bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-right">
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Total Savings</p>
              <p className="font-heading text-xl text-emerald-400">₹{totalSaving.toLocaleString('en-IN')}</p>
            </div>
          )}
        </div>
        <a
          href={`https://wa.me/919640272323?text=Hi, I want to order *${activeQty} units* of *${productName}* at bulk pricing. Please confirm availability.`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-4 bg-[var(--color-brand-primary)] text-white font-heading text-sm tracking-widest uppercase text-center flex items-center justify-center gap-3 hover:bg-orange-600 transition-all active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
          Request Bulk Quote ({activeQty} units)
        </a>
      </div>
    </div>
  );
}
