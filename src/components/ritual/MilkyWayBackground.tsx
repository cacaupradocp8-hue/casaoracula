import { memo } from 'react';

/**
 * Milky Way spiral vortex background with breathing animation.
 * - Inhale: 4s scale up 2-3%
 * - Exhale: 6s scale back
 * - Continuous, calm, no flicker
 */
function MilkyWayBackgroundRaw({ className = '' }: { className?: string }) {
  const size = 900;
  const cx = size / 2;
  const cy = size / 2;

  // Generate spiral arms
  const arms = [0, 72, 144, 216, 288]; // 5 arms
  const spiralPaths = arms.map((offsetDeg, armIdx) => {
    const points: string[] = [];
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const angle = (offsetDeg * Math.PI) / 180 + t * Math.PI * 4;
      const r = 20 + t * (size / 2 - 40);
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return (
      <path
        key={armIdx}
        d={points.join(' ')}
        fill="none"
        stroke={`hsl(42 49% 58% / ${0.06 + armIdx * 0.015})`}
        strokeWidth={2 + armIdx * 0.5}
        strokeLinecap="round"
      />
    );
  });

  // Dust clouds (subtle ellipses along spiral)
  const dustClouds = Array.from({ length: 18 }, (_, i) => {
    const t = (i + 1) / 19;
    const angle = t * Math.PI * 3.5;
    const r = 30 + t * (size / 2 - 60);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    return (
      <ellipse
        key={`dust-${i}`}
        cx={x}
        cy={y}
        rx={12 + i * 2}
        ry={8 + i * 1.5}
        fill={`hsl(216 25% 54% / ${0.04 + (i % 3) * 0.01})`}
        transform={`rotate(${(angle * 180) / Math.PI} ${x} ${y})`}
      />
    );
  });

  // Star dots
  const stars = Array.from({ length: 60 }, (_, i) => {
    const t = (i + 1) / 61;
    const armOffset = (i % 5) * 72;
    const angle = (armOffset * Math.PI) / 180 + t * Math.PI * 3.8;
    const r = 15 + t * (size / 2 - 30) + Math.sin(i * 7) * 15;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    const opacity = 0.15 + (i % 4) * 0.08;
    return (
      <circle
        key={`star-${i}`}
        cx={x}
        cy={y}
        r={0.8 + (i % 3) * 0.4}
        fill={i % 7 === 0 ? 'hsl(42 49% 58%)' : 'hsl(210 29% 94%)'}
        opacity={opacity}
      />
    );
  });

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Breathing vortex */}
      <div
        className="absolute inset-0 flex items-center justify-center animate-ritual-breathe"
        style={{ willChange: 'transform' }}
      >
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-[140%] h-[140%] max-w-none opacity-70"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="vortexCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(42 49% 58%)" stopOpacity="0.12" />
              <stop offset="35%" stopColor="hsl(216 25% 35%)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="hsl(206 44% 10%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Core glow */}
          <circle cx={cx} cy={cy} r={size * 0.35} fill="url(#vortexCore)" />

          {/* Spiral arms */}
          {spiralPaths}

          {/* Dust clouds */}
          {dustClouds}

          {/* Stars */}
          {stars}

          {/* Center bright point */}
          <circle cx={cx} cy={cy} r={4} fill="hsl(42 55% 72%)" opacity={0.3} />
          <circle cx={cx} cy={cy} r={1.5} fill="hsl(42 49% 58%)" opacity={0.5} />
        </svg>
      </div>

      {/* Dark overlay for text legibility */}
      <div className="absolute inset-0 bg-background/55" />
    </div>
  );
}

export const MilkyWayBackground = memo(MilkyWayBackgroundRaw);
