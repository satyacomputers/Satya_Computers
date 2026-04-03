'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductImageGalleryProps {
  images: string[];
  name: string;
  badge?: string;
}

export default function ProductImageGallery({ images, name, badge }: ProductImageGalleryProps) {
  const FALLBACK_IMAGE = '/products/dell_laptop_premium.png';
  const validImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  const [activeImage, setActiveImage] = useState(validImages[0]);

  // Sync state if images array changes
  const [lastImages, setLastImages] = useState(images);
  if (lastImages !== images) {
    setLastImages(images);
    setActiveImage(validImages[0]);
  }

  return (
    <div className="w-full space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/3] w-full bg-[#F7F7F5] border border-black/6 overflow-hidden group">
        {badge && (
          <span className="absolute top-5 left-5 z-10 bg-[var(--color-brand-primary)] text-white px-3 py-1 font-heading text-sm tracking-widest shadow-lg">
            {badge}
          </span>
        )}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={activeImage}
              alt={name}
              fill
              className="object-contain p-6 scale-95 group-hover:scale-100 transition-transform duration-500"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail strip */}
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
          {validImages.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveImage(img)}
              className={`relative w-24 h-24 border-2 transition-all duration-300 bg-[#F7F7F5] overflow-hidden flex-shrink-0 cursor-pointer ${
                activeImage === img 
                ? 'border-[var(--color-brand-primary)] shadow-md' 
                : 'border-black/5 hover:border-black/20'
              }`}
            >
              <Image 
                src={img || FALLBACK_IMAGE} 
                alt={`${name} view ${i + 1}`} 
                fill 
                className={`object-contain p-2 transition-opacity duration-300 ${activeImage === img ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
