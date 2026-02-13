import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';

interface Props {
  className?: string;
}

/**
 * Ritual de Respiração background with 3 independent layers:
 * A) Rays — subtle ambient movement (z-0)
 * B) Halo — radial glow behind mandala, breathing at scale 1.06 (z-1)
 * C) Mandala — main breathing animation at scale 1.03 (z-2)
 */
function MilkyWayBackgroundRaw({ className = '' }: Props) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ zIndex: 0 }}>
      {/* Dark base background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0C1825 0%, #0E1420 40%, #0F1A2A 100%)' }}
        aria-hidden="true"
      />

      {/* A) RAYS — ambient, NOT synced with breathing */}
      <div
        className="absolute inset-0 flex items-center justify-center animate-ritual-rays"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <div
          style={{
            width: '90vmin',
            height: '90vmin',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, hsla(36, 40%, 50%, 0.06) 0%, hsla(36, 40%, 50%, 0.02) 40%, transparent 70%)',
            willChange: 'transform, opacity',
          }}
        />
      </div>

      {/* B) HALO — breathing with larger scale & opacity shift */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      >
        <div
          className="animate-ritual-halo"
          style={{
            width: '80vmin',
            height: '80vmin',
            borderRadius: '50%',
            background: 'radial-gradient(circle, transparent 30%, hsla(36, 50%, 48%, 0.18) 50%, hsla(36, 50%, 48%, 0.10) 62%, transparent 75%)',
            willChange: 'transform, opacity',
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* C) MANDALA — main breathing (4s in, 6s out) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2 }}
        aria-hidden="true"
      >
        <img
          src={mandalaImg}
          alt=""
          className="animate-ritual-breathe"
          style={{
            width: '65vmin',
            height: 'auto',
            maxWidth: '70%',
            objectFit: 'contain',
            willChange: 'transform',
            transformOrigin: 'center center',
            filter: 'drop-shadow(0 0 40px hsla(36, 50%, 45%, 0.15))',
          }}
        />
      </div>

      {/* Dark overlay for content readability */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'hsla(210, 40%, 8%, 0.25)', zIndex: 3 }}
      />
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
