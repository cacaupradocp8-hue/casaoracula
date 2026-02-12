import { memo } from 'react';
import spiralBg from '@/assets/ritual-spiral-bg.jpg';

/**
 * Milky Way spiral background with breathing animation.
 * - Inhale: 4s scale up ~2.5%
 * - Exhale: 6s scale back
 * - Continuous, calm, no flicker
 */
function MilkyWayBackgroundRaw({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Breathing spiral image */}
      <div
        className="absolute inset-0 animate-ritual-breathe"
        style={{ willChange: 'transform' }}
      >
        <img
          src={spiralBg}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110"
          draggable={false}
        />
      </div>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-background/50" />
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
