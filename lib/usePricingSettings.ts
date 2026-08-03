/**
 * usePricingSettings — fetches GlobalSettings once and exposes
 * a pure function to compute the selling price from a basePrice.
 *
 * Formula (only active toggles contribute):
 *   selling = (basePrice × (1 + gst/100) + shipping) − flatDiscount
 */

'use client';

import { useState, useEffect } from 'react';

export interface PricingSettings {
  gstPercentage:      number;
  shippingCharges:    number;
  discountPercentage: number;
  gstEnabled:         boolean;
  shippingEnabled:    boolean;
  discountEnabled:    boolean;
}

const DEFAULT: PricingSettings = {
  gstPercentage:      0,
  shippingCharges:    0,
  discountPercentage: 0,
  gstEnabled:         false,
  shippingEnabled:    false,
  discountEnabled:    false,
};

export function computeSellingPrice(base: number, s: PricingSettings): number {
  if (!base || base <= 0) return 0;
  const gst      = s.gstEnabled      ? s.gstPercentage      : 0;
  const shipping = s.shippingEnabled ? s.shippingCharges    : 0;
  const discount = s.discountEnabled ? s.discountPercentage : 0;
  const selling  = (base * (1 + gst / 100) + shipping) - discount;
  return Math.round(selling * 100) / 100;
}

export function usePricingSettings() {
  const [settings, setSettings]   = useState<PricingSettings>(DEFAULT);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) {
          setSettings({
            gstPercentage:      Number(data.gstPercentage)      || 0,
            shippingCharges:    Number(data.shippingCharges)    || 0,
            discountPercentage: Number(data.discountPercentage) || 0,
            gstEnabled:         Boolean(data.gstEnabled),
            shippingEnabled:    Boolean(data.shippingEnabled),
            discountEnabled:    Boolean(data.discountEnabled),
          });
        }
      })
      .catch(() => {}) // graceful — falls back to DEFAULT (no adjustments)
      .finally(() => setLoadingSettings(false));
  }, []);

  return { settings, loadingSettings };
}
