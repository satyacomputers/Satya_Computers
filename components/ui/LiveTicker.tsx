'use client';

import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface LiveTickerProps {
  activities: string[];
}

export default function LiveTicker({ activities = [] }: LiveTickerProps) {
  if (activities.length === 0) return null;

  // Duplicate elements for seamless loop
  const displayItems = [...activities, ...activities, ...activities];

  return (
    <div className="bg-[#0A1628] py-2 overflow-hidden border-y border-white/5 relative z-50">
      <div className="flex items-center">
        <div className="px-6 bg-[#0A1628] z-10 flex items-center gap-2 border-r border-white/10 shrink-0">
          <Activity size={14} className="text-[#F97316] animate-pulse" />
          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest whitespace-nowrap">Live Network Activity</span>
        </div>
        
        <div className="relative flex overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-33.33%'] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="flex whitespace-nowrap hover:pause"
          >
            {displayItems.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-center px-8 gap-3 group"
              >
                <div className="w-1 h-1 rounded-full bg-[#F97316]/50 group-hover:bg-[#F97316]" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">
                  {item}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
