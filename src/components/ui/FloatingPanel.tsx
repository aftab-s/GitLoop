'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Minimize2, Maximize2, X, Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
}

export function FloatingPanel({
  title,
  children,
  className,
  defaultPosition = { x: 0, y: 0 },
  onClose,
}: FloatingPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const dragControls = useDragControls();

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{ opacity: 0, scale: 0.95, x: defaultPosition.x, y: defaultPosition.y }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        'glass-strong fixed z-40 w-[90vw] md:w-[400px] overflow-hidden flex flex-col shadow-2xl border border-purple-500/20',
        isMinimized ? 'h-auto' : 'h-[400px] max-h-[70vh]',
        className
      )}
    >
      {/* Drag Handle / Header */}
      <div 
        onPointerDown={(e) => dragControls.start(e)}
        className="flex items-center justify-between px-4 py-3 bg-purple-950/20 border-b border-purple-500/10 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
          <Move className="w-4 h-4 text-purple-400" />
          <span>{title}</span>
        </div>
        <div className="flex items-center gap-1.5 z-50">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded-md hover:bg-white/10 text-purple-300 transition-colors"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-red-500/20 hover:text-red-300 text-purple-300 transition-colors"
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-1 overflow-y-auto p-4 text-sm text-text-secondary custom-scrollbar"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
