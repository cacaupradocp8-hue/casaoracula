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
            radial-gradient(circle at 50% 25%, rgba(200,138,61,0.12), rgba(200,138,61,0) 55%),
            conic-gradient(from 0deg at 50% 25%,
              rgba(200,138,61,0.00) 0deg,
              rgba(200,138,61,0.08) 20deg,
              rgba(200,138,61,0.00) 40deg,
              rgba(200,138,61,0.07) 70deg,
              rgba(200,138,61,0.00) 110deg,
              rgba(200,138,61,0.06) 160deg,
              rgba(200,138,61,0.00) 220deg,
              rgba(200,138,61,0.07) 280deg,
              rgba(200,138,61,0.00) 360deg
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
            rgba(200,138,61,0.14) 18%,
            rgba(200,138,61,0.22) 30%,
            rgba(200,138,61,0.12) 45%,
            rgba(200,138,61,0.00) 65%
          )`,
          transformOrigin: '50% 30%',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      {/* MANDALA — PNG with mix-blend-mode to remove white bg */}
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
            mixBlendMode: 'screen',
          }}
        />
      </div>
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
