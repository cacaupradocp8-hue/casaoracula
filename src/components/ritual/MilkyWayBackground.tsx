import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';
import haloImg from '@/assets/ritual-halo.png';

function MilkyWayBackgroundRaw() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, backgroundColor: '#0F2A33' }}>
      {/* RAYS — amber conic, synced with breathing */}
      <div
        className="absolute animate-ritual-breathe"
        style={{
          inset: '-20%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 50% 30%, rgba(200,138,61,0.18), rgba(200,138,61,0) 50%),
            conic-gradient(from 0deg at 50% 30%,
              rgba(200,138,61,0.00) 0deg,
              rgba(200,138,61,0.12) 20deg,
              rgba(200,138,61,0.00) 40deg,
              rgba(200,138,61,0.10) 70deg,
              rgba(200,138,61,0.00) 110deg,
              rgba(200,138,61,0.09) 160deg,
              rgba(200,138,61,0.00) 220deg,
              rgba(200,138,61,0.10) 280deg,
              rgba(200,138,61,0.00) 360deg
            )
          `,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* HALO — image-based, synced breathing */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center animate-ritual-halo"
        style={{ zIndex: 2, height: '60%', pointerEvents: 'none' }}
      >
        <img
          src={haloImg}
          alt=""
          style={{
            width: 'min(75vw, 500px)',
            height: 'auto',
            objectFit: 'contain',
            mixBlendMode: 'screen',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        />
      </div>

      {/* MANDALA — top 60%, not overlapping text */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center"
        style={{ zIndex: 3, height: '60%' }}
      >
        <img
          src={mandalaImg}
          alt=""
          className="animate-ritual-breathe"
          style={{
            width: 'min(78vw, 520px)',
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
