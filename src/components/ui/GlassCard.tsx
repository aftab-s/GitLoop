import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'subtle' | 'strong';
  hover?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  hover = false,
  ...props
}: GlassCardProps) {
  const variantClasses = {
    default: 'glass',
    subtle: 'glass-subtle',
    strong: 'glass-strong',
  };

  return (
    <motion.div
      className={cn(
        variantClasses[variant],
        hover && 'card-hover',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
