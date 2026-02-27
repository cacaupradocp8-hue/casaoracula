import { memo } from 'react';
import mandalaImg from '@/assets/ritual-mandala-breathe.png';


function MilkyWayBackgroundRaw() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, backgroundColor: '#0F2A33' }}>
      {/* RAYS — visible rotating conic beams */}
      <div
        className="absolute animate-ritual-rays"
        style={{
          inset: '-30%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            conic-gradient(from 0deg at 50% 50%,
              rgba(140,185,230,0.00) 0deg,
              rgba(140,185,230,0.18) 8deg,
              rgba(140,185,230,0.00) 16deg,
              rgba(160,200,240,0.00) 45deg,
              rgba(160,200,240,0.14) 53deg,
              rgba(160,200,240,0.00) 61deg,
              rgba(140,185,230,0.00) 90deg,
              rgba(140,185,230,0.16) 98deg,
              rgba(140,185,230,0.00) 106deg,
              rgba(160,200,240,0.00) 135deg,
              rgba(160,200,240,0.12) 143deg,
              rgba(160,200,240,0.00) 151deg,
              rgba(140,185,230,0.00) 180deg,
              rgba(140,185,230,0.18) 188deg,
              rgba(140,185,230,0.00) 196deg,
              rgba(160,200,240,0.00) 225deg,
              rgba(160,200,240,0.14) 233deg,
              rgba(160,200,240,0.00) 241deg,
              rgba(140,185,230,0.00) 270deg,
              rgba(140,185,230,0.16) 278deg,
              rgba(140,185,230,0.00) 286deg,
              rgba(160,200,240,0.00) 315deg,
              rgba(160,200,240,0.12) 323deg,
              rgba(160,200,240,0.00) 331deg,
              rgba(140,185,230,0.00) 360deg
            )
          `,
          willChange: 'transform',
          maskImage: 'radial-gradient(circle, transparent 15%, black 35%, black 70%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 15%, black 35%, black 70%, transparent 95%)',
        }}
        aria-hidden="true"
      />
      {/* Secondary rays — amber warm, counter-rotating */}
      <div
        className="absolute"
        style={{
          inset: '-25%',
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            conic-gradient(from 22deg at 50% 50%,
              rgba(200,150,80,0.00) 0deg,
              rgba(200,150,80,0.10) 12deg,
              rgba(200,150,80,0.00) 24deg,
              rgba(200,150,80,0.00) 90deg,
              rgba(200,150,80,0.08) 102deg,
              rgba(200,150,80,0.00) 114deg,
              rgba(200,150,80,0.00) 180deg,
              rgba(200,150,80,0.10) 192deg,
              rgba(200,150,80,0.00) 204deg,
              rgba(200,150,80,0.00) 270deg,
              rgba(200,150,80,0.08) 282deg,
              rgba(200,150,80,0.00) 294deg,
              rgba(200,150,80,0.00) 360deg
            )
          `,
          animation: 'ritual-rays-rotate 90s linear infinite reverse, ritual-rays-pulse 8s ease-in-out infinite',
          willChange: 'transform',
          maskImage: 'radial-gradient(circle, transparent 20%, black 40%, black 65%, transparent 90%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 20%, black 40%, black 65%, transparent 90%)',
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
        className="absolute inset-0 flex items-center justify-center"
        style={{ zIndex: 3, pointerEvents: 'none' }}
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
        {/* BLUE-SILVER HALO — rich layered glow */}
        <div
          className="absolute animate-ritual-halo"
          style={{
            width: 'min(90vw, 590px)',
            height: 'min(90vw, 590px)',
            borderRadius: '50%',
            background: `
              radial-gradient(circle, 
                rgba(120,160,210,0) 42%,
                rgba(140,175,220,0.10) 52%,
                rgba(170,195,230,0.14) 60%,
                rgba(190,210,240,0.10) 68%,
                rgba(200,215,235,0.06) 76%,
                rgba(180,200,230,0) 88%
              )
            `,
            boxShadow: '0 0 40px 15px rgba(150,185,225,0.07), 0 0 80px 30px rgba(130,170,215,0.04)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        />
        {/* INNER HALO — subtle silver close to mandala */}
        <div
          className="absolute animate-ritual-breathe"
          style={{
            width: 'min(86vw, 570px)',
            height: 'min(86vw, 570px)',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,200,230,0.04) 40%, rgba(160,185,220,0.08) 58%, rgba(140,170,210,0.04) 75%, transparent 88%)',
            boxShadow: '0 0 25px 8px rgba(160,190,225,0.05)',
            transformOrigin: 'center center',
            willChange: 'transform, opacity',
          }}
        />
        {/* WATER RIPPLE — concentric waves */}
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={`ripple-${i}`}
            className="absolute rounded-full"
            style={{
              width: 'min(70vw, 460px)',
              height: 'min(70vw, 460px)',
              border: '1.5px solid rgba(160,200,235,0.12)',
              boxShadow: `
                0 0 8px 2px rgba(140,185,225,0.06),
                inset 0 0 6px 1px rgba(170,205,240,0.04)
              `,
              animation: `ritual-ripple 8s cubic-bezier(0.2,0.6,0.4,1) ${i * 1.6}s infinite`,
              opacity: 0,
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
          />
        ))}
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
