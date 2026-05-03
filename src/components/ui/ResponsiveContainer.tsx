import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide' | 'full';
}

/**
 * Responsive container with intelligent breakpoint-aware max widths.
 * narrow:  reading-friendly (forms, articles)
 * default: standard product pages — adapts from notebook 13" to desktop
 * wide:    rich dashboards / grids — uses ultrawide on 3xl
 * full:    edge-to-edge (heroes, immersive)
 */
export function ResponsiveContainer({
  children,
  className,
  size = 'default',
}: ResponsiveContainerProps) {
  const sizeClasses = {
    narrow: 'max-w-3xl',
    default: 'max-w-6xl xl:max-w-[1180px] 2xl:max-w-[1280px] 3xl:max-w-[1440px]',
    wide: 'max-w-7xl xl:max-w-[1320px] 2xl:max-w-[1440px] 3xl:max-w-[1680px]',
    full: 'max-w-none',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
