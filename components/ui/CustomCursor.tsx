'use client';

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Main cursor point (fast)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Lagging ring (slow & organic)
  const ringX = useSpring(mouseX, { damping: 20, stiffness: 100 });
  const ringY = useSpring(mouseY, { damping: 20, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (target) {
        setIsPointer(
          window.getComputedStyle(target).cursor === 'pointer' || 
          target.closest('button') !== null || 
          target.closest('a') !== null
        );
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-[99999]">
      <style jsx global>{`
        @media (min-width: 1024px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Lagging Outer Ring */}
      <motion.div
        className="absolute top-0 left-0 w-10 h-10 border border-[var(--color-brand-primary)] rounded-full opacity-30"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isPointer ? 1.5 : (isClicking ? 0.8 : 1),
        }}
      />

      {/* Central Sharp Point */}
      <motion.div
        className="absolute top-0 left-0 w-2.5 h-2.5 bg-[var(--color-brand-primary)] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          scale: isClicking ? 0.5 : 1,
          opacity: isVisible ? 1 : 0,
        }}
      >
        {/* Glow Core */}
        <div className="absolute inset-0 bg-[var(--color-brand-primary)] blur-[4px] opacity-60 rounded-full scale-150" />
      </motion.div>

      {/* Decorative Crosshair when hovering Links */}
      <motion.div
        className="absolute top-0 left-0 flex items-center justify-center opacity-0"
        animate={{ 
          opacity: isPointer ? 1 : 0,
          scale: isPointer ? 1 : 0.5,
          rotate: isPointer ? 45 : 0
        }}
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div className="absolute w-[30px] h-[1px] bg-[var(--color-brand-primary)]/20" />
        <div className="absolute h-[30px] w-[1px] bg-[var(--color-brand-primary)]/20" />
      </motion.div>
    </div>
  );
};

export default CustomCursor;
