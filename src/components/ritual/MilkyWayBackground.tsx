import { memo } from 'react';
import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────
   Sacred Geometry SVG Mandala — minimal, geometric, clean
   Dourado suave (#E0B36A) sobre fundo escuro
───────────────────────────────────────────────────────── */

function SacredMandala({ size = 320 }: { size?: number }) {
  const c = size / 2;
  const rings = [
    { r: size * 0.42, petals: 12, petalR: size * 0.06 },
    { r: size * 0.32, petals: 8, petalR: size * 0.04 },
    { r: size * 0.22, petals: 6, petalR: size * 0.03 },
  ];

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="select-none"
      style={{ filter: 'drop-shadow(0 0 30px rgba(224,179,106,0.15))' }}
    >
      {/* Outer circle */}
      <circle cx={c} cy={c} r={size * 0.46} fill="none" stroke="#E0B36A" strokeWidth="0.5" opacity="0.2" />
      <circle cx={c} cy={c} r={size * 0.44} fill="none" stroke="#E0B36A" strokeWidth="0.3" opacity="0.15" />

      {/* Petal rings */}
      {rings.map((ring, ri) => (
        <g key={ri} opacity={0.3 - ri * 0.05}>
          <circle cx={c} cy={c} r={ring.r} fill="none" stroke="#E0B36A" strokeWidth="0.4" />
          {Array.from({ length: ring.petals }).map((_, i) => {
            const angle = (i / ring.petals) * Math.PI * 2 - Math.PI / 2;
            const px = c + Math.cos(angle) * ring.r;
            const py = c + Math.sin(angle) * ring.r;
            return (
              <circle
                key={i}
                cx={px}
                cy={py}
                r={ring.petalR}
                fill="none"
                stroke="#E0B36A"
                strokeWidth="0.4"
                opacity={0.35}
              />
            );
          })}
        </g>
      ))}

      {/* Radial lines */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
        const x1 = c + Math.cos(angle) * size * 0.12;
        const y1 = c + Math.sin(angle) * size * 0.12;
        const x2 = c + Math.cos(angle) * size * 0.44;
        const y2 = c + Math.sin(angle) * size * 0.44;
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E0B36A" strokeWidth="0.3" opacity="0.12" />
        );
      })}

      {/* Inner triangles — seed of life hint */}
      {[0, 1, 2].map((i) => {
        const angle1 = (i / 3) * Math.PI * 2 - Math.PI / 2;
        const angle2 = ((i + 1) / 3) * Math.PI * 2 - Math.PI / 2;
        const r = size * 0.15;
        return (
          <line
            key={`tri-${i}`}
            x1={c + Math.cos(angle1) * r}
            y1={c + Math.sin(angle1) * r}
            x2={c + Math.cos(angle2) * r}
            y2={c + Math.sin(angle2) * r}
            stroke="#E0B36A"
            strokeWidth="0.5"
            opacity="0.25"
          />
        );
      })}

      {/* Center dot */}
      <circle cx={c} cy={c} r="2" fill="#E0B36A" opacity="0.4" />
      <circle cx={c} cy={c} r="5" fill="none" stroke="#E0B36A" strokeWidth="0.5" opacity="0.2" />
    </svg>
  );
}

function MilkyWayBackgroundRaw() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 0, backgroundColor: '#0A0E14' }}>
      {/* Ambient glow — warm center */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 50% 38%, rgba(224,179,106,0.06) 0%, transparent 50%),
            radial-gradient(circle at 50% 42%, rgba(224,179,106,0.03) 0%, transparent 60%)
          `,
        }}
      />

      {/* Mandala container — centered in top portion */}
      <div
        className="absolute left-0 right-0 top-0 flex items-center justify-center"
        style={{ zIndex: 3, pointerEvents: 'none', height: '55vh' }}
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 'min(85vw, 500px)',
            height: 'min(85vw, 500px)',
            background: 'radial-gradient(circle, transparent 40%, rgba(224,179,106,0.04) 60%, transparent 80%)',
          }}
          animate={{
            scale: [1, 1.06, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Mandala — ultra slow rotation + breathe */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.03, 1],
          }}
          transition={{
            rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
            scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ width: 'min(70vw, 320px)', height: 'min(70vw, 320px)' }}
          className="flex items-center justify-center"
        >
          <SacredMandala size={320} />
        </motion.div>

        {/* Center glow pulse */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 60,
            height: 60,
            background: 'radial-gradient(circle, rgba(224,179,106,0.2), transparent 70%)',
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
