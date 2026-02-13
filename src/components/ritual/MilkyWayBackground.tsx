import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';


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

      {/* SILVER-BLUE ambient glow — soft radial behind everything */}
      <div
        className="absolute animate-ritual-breathe"
        style={{
          inset: '-10%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at 50% 30%, rgba(140,180,220,0.15), rgba(140,180,220,0) 55%),
            radial-gradient(circle at 45% 35%, rgba(180,200,230,0.08), rgba(180,200,230,0) 40%),
            radial-gradient(circle at 55% 25%, rgba(160,190,225,0.06), rgba(160,190,225,0) 35%)
          `,
          willChange: 'transform',
        }}
        aria-hidden="true"
      />

      {/* MANDALA + HALO container — both centered on same point */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center"
        style={{ zIndex: 3, height: '60%', pointerEvents: 'none' }}
      >
        {/* OUTER HALO — large diffuse glow ring */}
        <div
          className="absolute animate-ritual-halo"
          style={{
            width: 'min(100vw, 660px)',
            height: 'min(100vw, 660px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,195,230,0) 45%, rgba(160,195,230,0.08) 65%, rgba(160,195,230,0) 85%)',
            boxShadow: '0 0 80px 30px rgba(150,185,220,0.06), 0 0 160px 60px rgba(140,175,215,0.03)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
            opacity: 0.7,
          }}
        />
        {/* MIDDLE glow ring */}
        <div
          className="absolute animate-ritual-halo"
          style={{
            width: 'min(92vw, 600px)',
            height: 'min(92vw, 600px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(160,195,230,0) 50%, rgba(160,195,230,0.12) 70%, rgba(160,195,230,0) 90%)',
            boxShadow: '0 0 60px 20px rgba(150,185,220,0.08), 0 0 120px 40px rgba(140,175,215,0.04)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        />
        {/* INNER HALO — subtle glow close to mandala */}
        <div
          className="absolute animate-ritual-breathe"
          style={{
            width: 'min(86vw, 570px)',
            height: 'min(86vw, 570px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(200,180,140,0.06) 40%, rgba(180,160,120,0.10) 60%, rgba(160,195,230,0.04) 80%, transparent 90%)',
            boxShadow: '0 0 30px 10px rgba(200,180,140,0.05)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        />
        {/* MANDALA — on top, breathing animation */}
        <img
          src={mandalaImg}
          alt=""
          className="absolute animate-ritual-breathe"
          style={{
            width: 'min(84vw, 560px)',
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
