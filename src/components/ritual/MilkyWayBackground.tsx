import { memo } from 'react';
import type { RitualState } from '@/hooks/useRitualState';
import spiralNeutral from '@/assets/ritual-spiral-bg.jpg';
import spiralArrival from '@/assets/ritual-arrival-bg.jpg';
import spiralDense from '@/assets/ritual-dense-bg.jpg';

const BG_MAP: Record<RitualState, string> = {
  arrival: spiralArrival,
  neutral: spiralNeutral,
  dense: spiralDense,
};

interface Props {
  state?: RitualState;
  className?: string;
}

/**
 * Milky Way spiral background with breathing animation.
 * Inhale 4s → scale 1.03, Exhale 6s → scale 1.
 */
function MilkyWayBackgroundRaw({ state = 'neutral', className = '' }: Props) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute inset-0 animate-ritual-breathe"
        style={{ willChange: 'transform' }}
      >
        <img
          src={BG_MAP[state]}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover scale-110"
          draggable={false}
        />
      </div>
      <div className="absolute inset-0 bg-background/50" />
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
