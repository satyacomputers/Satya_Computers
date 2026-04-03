'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PURCHASES = [
  { name: 'Rajesh', location: 'Ameerpet', item: 'Dell Latitude 7490' },
  { name: 'Srinidhi', location: 'Kukatpally', item: 'Lenovo ThinkPad T480' },
  { name: 'Rahul', location: 'Madhapur', item: 'HP EliteBook 840 G5' },
  { name: 'Priya', location: 'Gachibowli', item: 'Apple MacBook Pro M1' },
  { name: 'Amit', location: 'Secunderabad', item: 'Dell Precision 5530' },
  { name: 'Kiran', location: 'Banjarahills', item: 'Lenovo IdeaPad Slim' },
  { name: 'Tech Solutions Ltd.', location: 'Hitech City', item: 'Bulk Order (15 Units)' }
];

export default function LivePurchaseTicker() {
  const [currentPurchase, setCurrentPurchase] = useState<typeof MOCK_PURCHASES[0] | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show first ticker after 5 seconds
    const initialTimeout = setTimeout(() => {
      showNextPurchase();
    }, 5000);

    return () => clearTimeout(initialTimeout);
  }, []);

  const showNextPurchase = () => {
    const randomPurchase = MOCK_PURCHASES[Math.floor(Math.random() * MOCK_PURCHASES.length)];
    const timeAgo = Math.floor(Math.random() * 10) + 1; // 1 to 10 mins ago

    setCurrentPurchase({ ...randomPurchase, time: `${timeAgo} min${timeAgo > 1 ? 's' : ''} ago` } as any);
    setIsVisible(true);

    // Hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
      
      // Schedule next one between 15 to 35 seconds
      const nextDelay = Math.floor(Math.random() * 20000) + 15000;
      setTimeout(showNextPurchase, nextDelay);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {isVisible && currentPurchase && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed bottom-24 left-4 z-[100] max-w-sm pointer-events-none"
        >
          <div className="bg-white border-2 border-black p-3 shadow-[4px_4px_0_rgba(0,0,0,0.1)] flex items-start gap-3">
            <div className="relative flex-shrink-0 w-8 h-8 bg-[var(--color-brand-primary)] text-white flex items-center justify-center font-heading text-sm">
              SC
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-[11px] text-brand-text truncate leading-tight mb-1">
                <span className="font-bold">{currentPurchase.name}</span> from {currentPurchase.location} just purchased
              </p>
              <p className="font-heading text-xs text-[var(--color-brand-primary)] uppercase tracking-wider truncate">
                {currentPurchase.item}
              </p>
              <p className="font-heading text-[9px] text-black/40 uppercase mt-1">
                {(currentPurchase as any).time} • Verified Order
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
