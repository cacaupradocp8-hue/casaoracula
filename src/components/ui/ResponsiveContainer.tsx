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
    narrow: 'max-w-3xl', // Reading friendly (forms, articles)
    default: 'max-w-6xl xl:max-w-[1180px] 2xl:max-w-[1440px]', // Standard product pages
    wide: 'max-w-7xl xl:max-w-[1380px] 2xl:max-w-[1560px] 3xl:max-w-[1800px]', // Rich dashboards / grids
    full: 'max-w-none', // Edge-to-edge
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10',
        // Intelligent fluid width: use viewport units for small screens, limit for large
        'w-[min(100%,var(--container-width))]',
        sizeClasses[size],
        className
      )}
    >
      {children}
    </div>
  );
}
