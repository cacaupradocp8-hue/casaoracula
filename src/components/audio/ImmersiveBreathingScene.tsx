import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * ImmersiveBreathingScene — Full-screen hypnotic background
 * 
 * Creates a living, breathing visual field with:
 * - Deep dark gradient background
 * - Slowly breathing mandala (SVG flower)
 * - Soft golden glow
 * - Ultra-subtle floating particles
 * 
 * Breath cycle: 7s inhale, 7s exhale (14s total)
 */

const BREATH_DURATION = 7; // seconds per phase

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1.5 + Math.random() * 2,
    delay: Math.random() * 12,
    duration: 16 + Math.random() * 12,
  }));
}

interface ImmersiveBreathingSceneProps {
  isPlaying?: boolean;
}

export function ImmersiveBreathingScene({ isPlaying = false }: ImmersiveBreathingSceneProps) {
  const particles = useMemo(() => generateParticles(18), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Deep gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 45%, hsl(var(--gold) / 0.04) 0%, transparent 70%),
            radial-gradient(ellipse 80% 60% at 50% 50%, hsl(260 30% 8% / 0.5) 0%, transparent 80%),
            hsl(var(--background))
          `,
        }}
      />

      {/* Outer glow — very slow breathing */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: isPlaying ? [0.12, 0.22, 0.12] : [0.05, 0.08, 0.05],
        }}
        transition={{
          duration: BREATH_DURATION * 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] md:w-[44rem] md:h-[44rem] rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, hsl(var(--gold) / 0.12) 0%, hsl(var(--mystic) / 0.04) 50%, transparent 100%)',
        }}
      />

      {/* Breathing mandala */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: isPlaying ? [0.4, 0.7, 0.4] : [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: BREATH_DURATION * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            filter: `drop-shadow(0 0 40px hsl(var(--gold) / ${isPlaying ? '0.15' : '0.06'}))`,
          }}
        >
          <svg
            width="200"
            height="200"
            viewBox="0 0 120 120"
            fill="none"
            className="text-gold w-40 h-40 md:w-52 md:h-52"
            aria-hidden="true"
          >
            {/* Centro */}
            <circle cx="60" cy="60" r="5" fill="currentColor" opacity="0.7" />

            {/* Anéis concêntricos */}
            <circle cx="60" cy="60" r="16" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="30" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.6" />
            <circle cx="60" cy="60" r="46" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />

            {/* Pétalas internas — 8 */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <ellipse
                key={`inner-${angle}`}
                cx="60"
                cy="38"
                rx="5"
                ry="14"
                fill="currentColor"
                opacity="0.35"
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
                opacity="0.2"
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
                  r="1.5"
                  fill="currentColor"
                  opacity="0.25"
                />
              );
            })}
          </svg>
        </motion.div>
      </div>

      {/* Concentric breathing rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            scale: [1, 1.04, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: BREATH_DURATION * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-gold/8"
        />
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.04, 0.08, 0.04],
          }}
          transition={{
            duration: BREATH_DURATION * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2.5,
          }}
          className="w-96 h-96 md:w-[28rem] md:h-[28rem] rounded-full border border-mystic/5"
        />
      </div>

      {/* Ultra-subtle floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() > 0.5 ? 8 : -8, 0],
            opacity: [0, 0.35, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
