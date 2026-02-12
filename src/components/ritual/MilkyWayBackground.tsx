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
    <div className={`fixed inset-0 ${className}`} style={{ zIndex: 0 }}>
      {/* Background image layer with breathing animation */}
      <div
        className="absolute inset-0 animate-ritual-breathe"
        style={{
          backgroundImage: `url(${BG_MAP[state]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          height: '100vh',
          willChange: 'transform',
        }}
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'hsl(var(--background) / 0.55)', zIndex: 1 }} />
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
