'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: 'main' | 'warm' | 'cool';
  animate?: boolean;
}

export function GradientText({
  children,
  className,
  gradient = 'main',
  animate = true,
}: GradientTextProps) {
  const gradientClasses = {
    main: 'from-purple-500 via-blue-500 to-cyan-500',
    warm: 'from-pink-500 via-purple-500 to-indigo-500',
    cool: 'from-blue-500 via-cyan-500 to-teal-500',
  };

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradientClasses[gradient],
        animate && 'animate-gradient bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </span>
  );
}
