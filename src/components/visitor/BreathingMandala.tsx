import { motion } from 'framer-motion';

/**
 * BreathingMandala — Elemento sensorial de presença
 * 
 * Animação suave e contínua que evoca respiração:
 * scale: 1 → 1.04 → 1
 * opacity: 0.7 → 1 → 0.7
 * duration: 6s loop
 */
export function BreathingMandala() {
  return (
    <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-gold/10"
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Middle ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-gold/15"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.3,
        }}
      />

      {/* Inner mandala SVG */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: [1, 1.04, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          className="text-gold/60"
        >
          {/* Center circle */}
          <circle cx="40" cy="40" r="4" fill="currentColor" opacity="0.8" />
          
          {/* Petal ring 1 */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <ellipse
              key={angle}
              cx="40"
              cy="26"
              rx="3"
              ry="8"
              fill="currentColor"
              opacity="0.4"
              transform={`rotate(${angle} 40 40)`}
            />
          ))}

          {/* Petal ring 2 */}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => (
            <ellipse
              key={angle}
              cx="40"
              cy="18"
              rx="2.5"
              ry="10"
              fill="currentColor"
              opacity="0.25"
              transform={`rotate(${angle} 40 40)`}
            />
          ))}

          {/* Outer ring dots */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 40 + Math.cos(rad) * 35;
            const y = 40 + Math.sin(rad) * 35;
            return (
              <circle
                key={angle}
                cx={x}
                cy={y}
                r="1.5"
                fill="currentColor"
                opacity="0.2"
              />
            );
          })}
        </svg>
      </motion.div>

      {/* Soft radial glow behind */}
      <div className="absolute inset-0 rounded-full bg-gold/[0.04] blur-xl pointer-events-none" />
    </div>
  );
}
