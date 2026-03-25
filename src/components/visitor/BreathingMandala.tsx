import { motion } from 'framer-motion';

/**
 * BreathingMandala — Elemento sensorial de presença
 * 
 * Mandala viva com respiração lenta, brilho dourado profundo.
 * Movimento quase imperceptível — transmite presença, não distração.
 */
export function BreathingMandala() {
  const breathDuration = 6;

  return (
    <div className="relative w-44 h-44 md:w-64 md:h-64 flex items-center justify-center">
      {/* Halo externo difuso */}
      <div className="absolute inset-0 rounded-full bg-primary/[0.08] blur-3xl pointer-events-none" />

      {/* Anel exterior — pulso lento */}
      <motion.div
        className="absolute inset-0 rounded-full border border-primary/20"
        style={{
          boxShadow: '0 0 60px hsl(42 49% 58% / 0.12), inset 0 0 30px hsl(42 49% 58% / 0.05)',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: breathDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Anel interior */}
      <motion.div
        className="absolute inset-6 md:inset-8 rounded-full border border-primary/30 bg-primary/[0.04]"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.4, 0.85, 0.4],
        }}
        transition={{
          duration: breathDuration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />

      {/* Mandala SVG central */}
      <motion.div
        className="relative z-10"
        style={{
          filter: 'drop-shadow(0 0 20px hsl(42 49% 58% / 0.25))',
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: breathDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          className="text-primary w-24 h-24 md:w-[120px] md:h-[120px]"
          aria-hidden="true"
        >
          {/* Centro */}
          <circle cx="60" cy="60" r="6" fill="currentColor" opacity="0.9" />
          
          {/* Anéis concêntricos */}
          <circle cx="60" cy="60" r="18" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1" />
          <circle cx="60" cy="60" r="32" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <circle cx="60" cy="60" r="48" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.8" />

          {/* Pétalas internas — 8 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={`inner-${angle}`}
              cx="60"
              cy="38"
              rx="5"
              ry="14"
              fill="currentColor"
              opacity="0.5"
              transform={`rotate(${angle} 60 60)`}
            />
          ))}

          {/* Pétalas externas — 8 (intercaladas) */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
            <ellipse
              key={`outer-${angle}`}
              cx="60"
              cy="24"
              rx="4"
              ry="15"
              fill="currentColor"
              opacity="0.3"
              transform={`rotate(${angle} 60 60)`}
            />
          ))}

          {/* Pontos orbitais */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 60 + Math.cos(rad) * 52;
            const y = 60 + Math.sin(rad) * 52;
            return (
              <circle
                key={`dot-${angle}`}
                cx={x}
                cy={y}
                r="2"
                fill="currentColor"
                opacity="0.35"
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
