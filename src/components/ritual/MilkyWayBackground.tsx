import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';

function MilkyWayBackgroundRaw() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, backgroundColor: '#0F2A33' }}>
      {/* RAYS — amber conic gradient, independent drift */}
      <div
        className="absolute animate-ritual-rays"
        style={{
          inset: '-20%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 50% 40%, rgba(200,138,61,0.15), rgba(200,138,61,0) 50%),
            conic-gradient(from 0deg at 50% 40%,
              rgba(200,138,61,0.00) 0deg,
              rgba(200,138,61,0.10) 20deg,
              rgba(200,138,61,0.00) 40deg,
              rgba(200,138,61,0.09) 70deg,
              rgba(200,138,61,0.00) 110deg,
              rgba(200,138,61,0.08) 160deg,
              rgba(200,138,61,0.00) 220deg,
              rgba(200,138,61,0.09) 280deg,
              rgba(200,138,61,0.00) 360deg
            )
          `,
          willChange: 'opacity',
        }}
        aria-hidden="true"
      />

      {/* HALO — amber radial glow, synced breathing */}
      <div
        className="absolute inset-0 animate-ritual-halo"
        style={{
          zIndex: 2,
          pointerEvents: 'none',
          background: `radial-gradient(circle at 50% 40%,
            rgba(200,138,61,0.00) 0%,
            rgba(200,138,61,0.16) 15%,
            rgba(200,138,61,0.25) 28%,
            rgba(200,138,61,0.14) 42%,
            rgba(200,138,61,0.00) 60%
          )`,
          transformOrigin: '50% 40%',
          willChange: 'transform, opacity',
        }}
        aria-hidden="true"
      />

      {/* MANDALA — centered, not cropped, with white bg intact */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 3 }}
      >
        <img
          src={mandalaImg}
          alt=""
          className="animate-ritual-breathe"
          style={{
            width: 'min(65vw, 440px)',
            height: 'auto',
            objectFit: 'contain',
            transformOrigin: 'center center',
            willChange: 'transform',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
