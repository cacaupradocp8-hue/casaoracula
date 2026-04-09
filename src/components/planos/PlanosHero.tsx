import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useMemo } from 'react';
import heroPlanos from '@/assets/planos/hero-planos.png';

function HeroParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 6,
        duration: Math.random() * 4 + 4,
        opacity: Math.random() * 0.35 + 0.08,
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
            opacity: particle.opacity,
          }}
          animate={{
            y: [0, -36, 0],
            opacity: [particle.opacity, particle.opacity * 2.2, particle.opacity],
            scale: [1, 1.4, 1],
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
    <section className="relative overflow-hidden min-h-[78vh] md:min-h-[88vh] flex items-end">
      <img
        src={heroPlanos}
        alt="Clube de Leitura Simbólica"
        className="absolute inset-0 h-full w-full object-cover object-[68%_top] md:object-right"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/78 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/24 to-transparent z-[1]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,hsl(var(--gold)/0.16),transparent_30%)] z-[1]" />
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-background/30 to-transparent z-[1]" />

      <HeroParticles />

      <div className="container mx-auto px-6 relative z-20 pb-14 pt-28 md:pb-24 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <Sparkles className="w-4 h-4 text-gold/40" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground tracking-wide mb-6 leading-[0.95] max-w-xl">
            Você já acessou uma parte da sua estrutura.
          </h1>

          <p className="text-lg sm:text-xl text-gold/70 font-display italic leading-relaxed max-w-lg">
            Mas ainda não entrou no nível onde a transformação acontece.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
