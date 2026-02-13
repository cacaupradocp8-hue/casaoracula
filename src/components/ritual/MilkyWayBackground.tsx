import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';

interface Props {
  className?: string;
}

/**
 * Ritual de Respiração background:
 * - Dark fixed background (#0E1420)
 * - Centered mandala (60-70% width) with breathing animation
 * - Radial amber halo behind the mandala
 * - Overlay for content readability
 */
function MilkyWayBackgroundRaw({ className = '' }: Props) {
  return (
    <div className={`fixed inset-0 ${className}`} style={{ zIndex: 0 }}>
      {/* Dark base background */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, #0C1825 0%, #0E1420 40%, #0F1A2A 100%)' }}
        aria-hidden="true"
      />

      {/* Centered mandala + halo container with breathing animation */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        {/* Amber radial halo — breathes with mandala via parent */}
        <div
          className="absolute animate-ritual-breathe"
          style={{
            width: '75vmin',
            height: '75vmin',
            borderRadius: '50%',
            background: 'radial-gradient(circle, hsla(36, 55%, 50%, 0.25) 0%, hsla(36, 55%, 50%, 0.08) 50%, transparent 70%)',
            willChange: 'transform',
            transformOrigin: 'center center',
          }}
        />

        {/* Mandala image — breathing animation */}
        <img
          src={mandalaImg}
          alt=""
          className="absolute animate-ritual-breathe"
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
        style={{ backgroundColor: 'hsla(210, 40%, 8%, 0.35)', zIndex: 1 }}
      />
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
