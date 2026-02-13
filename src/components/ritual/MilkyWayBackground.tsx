import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';

function MilkyWayBackgroundRaw() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, backgroundColor: '#0F2A33' }}>
      {/* RAYS — CSS conic gradient, independent drift */}
      <div
        className="absolute animate-ritual-rays"
        style={{
          inset: '-20%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 50% 25%, rgba(255,255,255,0.10), rgba(255,255,255,0) 55%),
            conic-gradient(from 0deg at 50% 25%,
              rgba(255,255,255,0.00) 0deg,
              rgba(255,255,255,0.06) 20deg,
              rgba(255,255,255,0.00) 40deg,
              rgba(255,255,255,0.05) 70deg,
              rgba(255,255,255,0.00) 110deg,
              rgba(255,255,255,0.04) 160deg,
              rgba(255,255,255,0.00) 220deg,
              rgba(255,255,255,0.05) 280deg,
              rgba(255,255,255,0.00) 360deg
            )
          `,
          willChange: 'opacity',
        }}
        aria-hidden="true"
      />

      {/* HALO — CSS radial gradient, synced breathing */}
      <div
        className="absolute inset-0 animate-ritual-halo"
        style={{
          zIndex: 2,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 30%,
            rgba(200,138,61,0.00) 0%,
            rgba(200,138,61,0.10) 22%,
            rgba(200,138,61,0.18) 34%,
            rgba(200,138,61,0.08) 50%,
            rgba(200,138,61,0.00) 70%
          )`,
          transformOrigin: '50% 30%',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      {/* MANDALA — PNG breathing */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 3, height: '60%' }}
      >
        <img
          src={mandalaImg}
          alt=""
          className="animate-ritual-breathe"
          style={{
            width: 'min(70vw, 520px)',
            height: 'auto',
            objectFit: 'contain',
            transformOrigin: 'center center',
            willChange: 'transform',
            filter: 'saturate(0.85) contrast(0.92)',
          }}
        />
      </div>
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
