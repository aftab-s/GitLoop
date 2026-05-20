'use client';

import React, { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useTransform, animate } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number; // in seconds
  className?: string;
}

export function AnimatedCounter({ value, duration = 2, className }: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 100,
  });
  
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest).toLocaleString());

  useEffect(() => {
    const controls = animate(motionValue, value, { duration });
    return () => controls.stop();
  }, [value, duration, motionValue]);

  useEffect(() => {
    return displayValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest;
      }
    });
  }, [displayValue]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
