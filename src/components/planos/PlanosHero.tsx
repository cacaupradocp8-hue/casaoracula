import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import heroPlanos from '@/assets/planos/hero-planos.png';

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 32 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${30 + Math.random() * 70}%`,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 3,
        opacity: Math.random() * 0.5 + 0.2,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -50, 0],
            opacity: [particle.opacity, particle.opacity * 2.5, particle.opacity],
            scale: [1, 1.6, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function PlanosHero() {
  return (
    <section className="relative overflow-hidden min-h-[85vh] sm:min-h-[78vh] md:min-h-[88vh] flex items-end">
      <img
        src={heroPlanos}
        alt="Clube de Leitura Simbólica"
        className="absolute inset-0 h-full w-full object-cover object-[50%_20%] sm:object-[68%_top] md:object-right"
      />

      {/* Mobile: stronger bottom gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20 sm:bg-gradient-to-r sm:from-background sm:via-background/78 sm:to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 sm:via-background/24 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,hsl(var(--gold)/0.16),transparent_30%)] z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background/30 to-transparent z-[1]" />

      <HeroParticles />

      <div className="w-full relative z-20 pb-8 pt-20 px-5 sm:pb-14 sm:pt-28 sm:px-6 md:pb-24 md:pt-36">
        <div className="max-w-2xl mx-auto sm:mx-0 sm:ml-[5%] md:ml-[8%]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="flex items-center gap-3 mb-4 sm:mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.3 }}
            >
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-gold/30" />
              <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gold/40" />
              <div className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-gold/30" />
            </motion.div>

            <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide mb-3 sm:mb-6 leading-[1.1] sm:leading-[0.95] max-w-[90%] sm:max-w-xl">
              Você já acessou uma parte da sua estrutura.
            </h1>

            <motion.p
              className="text-sm sm:text-lg md:text-xl text-gold/70 font-display italic leading-relaxed max-w-[85%] sm:max-w-lg"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Mas ainda não entrou no nível onde a transformação acontece.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
