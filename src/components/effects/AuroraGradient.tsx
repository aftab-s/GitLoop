'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export default function AuroraGradient({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'fixed inset-0 pointer-events-none overflow-hidden select-none z-0 opacity-40',
        className
      )}
      aria-hidden="true"
    >
      {/* Aurora Layer 1 - Cyan/Teal */}
      <div 
        className="absolute -top-[20%] -left-[20%] w-[80%] h-[80%] rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.4) 0%, rgba(20,184,166,0) 70%)',
          animationDuration: '8s',
        }}
      />

      {/* Aurora Layer 2 - Purple/Indigo */}
      <div 
        className="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse-glow delay-200"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(99,102,241,0) 75%)',
          animationDuration: '12s',
        }}
      />

      {/* Aurora Layer 3 - Pink/Magenta */}
      <div 
        className="absolute top-[20%] left-[10%] w-[60%] h-[60%] rounded-full mix-blend-screen filter blur-[120px] opacity-25 animate-pulse-glow delay-500"
        style={{
          background: 'radial-gradient(circle, rgba(236,72,153,0.3) 0%, rgba(168,85,247,0) 70%)',
          animationDuration: '10s',
        }}
      />

      {/* Aurora Layer 4 - Deep Navy Blue */}
      <div 
        className="absolute -bottom-[10%] left-[20%] w-[80%] h-[60%] rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse-glow delay-300"
        style={{
          background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(10,10,26,0) 80%)',
          animationDuration: '15s',
        }}
      />
    </div>
  );
}
