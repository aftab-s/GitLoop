'use client';

import React, { useRef, useState } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NeonButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  glowColor?: 'purple' | 'blue' | 'cyan'; // Retained for compatibility but redesigned
  magnetic?: boolean;
}

export function NeonButton({
  children,
  className,
  variant = 'primary',
  glowColor = 'purple',
  magnetic = false,
  ...props
}: NeonButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!magnetic || !buttonRef.current) return;
    
    const { clientX, clientY } = e;
    const { height, width, left, top } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    
    // Subtle magnetic pull
    setPosition({ x: x * 0.08, y: y * 0.08 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const baseStyles = "relative px-6 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 select-none text-sm";

  const variantStyles = {
    primary: "bg-accent-lime text-[#0c0714] border border-[#0c0714] shadow-[3px_3px_0px_#8b5cf6] hover:bg-[#b5f242] active:shadow-[1px_1px_0px_#8b5cf6] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100",
    secondary: "bg-accent-lilac/10 text-accent-lilac border border-accent-lilac shadow-[3px_3px_0px_rgba(139,92,246,0.15)] hover:bg-accent-lilac/20 active:shadow-[1px_1px_0px_rgba(139,92,246,0.15)] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-100",
    ghost: "bg-transparent border-transparent text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all duration-200",
  };

  return (
    <motion.button
      ref={buttonRef}
      className={cn(baseStyles, variantStyles[variant], className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={magnetic ? { x: position.x, y: position.y } : undefined}
      transition={magnetic ? { type: 'spring', stiffness: 150, damping: 20, mass: 0.1 } : { duration: 0.2 }}
      whileHover={variant !== 'ghost' ? { scale: 1.015 } : { scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}
