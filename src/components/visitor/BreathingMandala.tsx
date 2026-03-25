import { motion } from 'framer-motion';

/**
 * BreathingMandala — Elemento sensorial de presença
 * 
 * Mandala mais visível, com brilho dourado e contraste melhor no mobile.
 */
export function BreathingMandala() {
  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center">
      <div className="absolute inset-6 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

      <motion.div
        className="absolute inset-0 rounded-full border-2 border-gold/25 shadow-[0_0_40px_hsl(var(--gold)/0.18)]"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.45, 0.9, 0.45],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        className="absolute inset-5 rounded-full border border-gold/35 bg-gold/5"
        animate={{
          scale: [1, 1.035, 1],
          opacity: [0.55, 1, 0.55],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.25,
        }}
      />

      <motion.div
        className="relative z-10 drop-shadow-[0_0_24px_hsl(var(--gold)/0.3)]"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.82, 1, 0.82],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="112"
          height="112"
          viewBox="0 0 112 112"
          fill="none"
          className="text-gold"
          aria-hidden="true"
        >
          <circle cx="56" cy="56" r="8" fill="currentColor" opacity="0.95" />
          <circle cx="56" cy="56" r="20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" />
          <circle cx="56" cy="56" r="34" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={`inner-${angle}`}
              cx="56"
              cy="35"
              rx="5"
              ry="15"
              fill="currentColor"
              opacity="0.6"
              transform={`rotate(${angle} 56 56)`}
            />
          ))}

          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
            <ellipse
              key={`outer-${angle}`}
              cx="56"
              cy="22"
              rx="4"
              ry="16"
              fill="currentColor"
              opacity="0.38"
              transform={`rotate(${angle} 56 56)`}
            />
          ))}

          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 56 + Math.cos(rad) * 48;
            const y = 56 + Math.sin(rad) * 48;
            return (
              <circle
                key={`dot-${angle}`}
                cx={x}
                cy={y}
                r="2.6"
                fill="currentColor"
                opacity="0.5"
              />
            );
          })}
        </svg>
      </motion.div>
    </div>
  );
}
