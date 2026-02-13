import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';
import haloImg from '@/assets/ritual-halo-ring.png';
import raysImg from '@/assets/ritual-rays-soft.png';

interface Props {
  className?: string;
}

function MilkyWayBackgroundRaw({ className = '' }: Props) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} style={{ zIndex: 0, backgroundColor: '#0F2A33' }}>
      {/* A) RAYS — ambient drift, NOT synced with breathing */}
      <div
        className="absolute inset-0 flex items-center justify-center animate-ritual-rays"
        style={{ zIndex: 0, top: '0', height: '60%' }}
        aria-hidden="true"
      >
        <img
          src={raysImg}
          alt=""
          style={{
            width: '90vmin',
            height: '90vmin',
            objectFit: 'contain',
            willChange: 'transform, opacity',
          }}
        />
      </div>

      {/* B) HALO — breathing with larger scale & opacity shift */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 1, top: '0', height: '60%' }}
        aria-hidden="true"
      >
        <img
          src={haloImg}
          alt=""
          className="animate-ritual-halo"
          style={{
            width: '80vmin',
            height: '80vmin',
            objectFit: 'contain',
            willChange: 'transform, opacity',
            transformOrigin: 'center center',
          }}
        />
      </div>

      {/* C) MANDALA — main breathing (4s in, 6s out) */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 2, top: '0', height: '60%' }}
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
          }}
        />
      </div>
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
