import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function PulsingHero({ bannerSrc }: { bannerSrc: string }) {
  const navigate = useNavigate();

  return (
    <section className="relative w-full min-h-screen flex flex-col">
      {/* Background image with parallax-like feel */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={bannerSrc}
          alt="Formação Orácula — Casa Orácula"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      {/* Pulsing orbs */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/[0.05] blur-[100px] pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Animated rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        {[200, 300, 400].map((size, i) => (
          <motion.div
            key={size}
            className="absolute rounded-full border border-primary/[0.06]"
            style={{
              width: size, height: size,
              top: `calc(50% - ${size / 2}px)`,
              left: `calc(50% - ${size / 2}px)`,
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4 + i * 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, letterSpacing: '0.6em' }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="text-primary/50 text-[10px] md:text-xs uppercase mb-10 font-medium"
          >
            Casa Orácula apresenta
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl text-white tracking-wide leading-[1.05] mb-8"
          >
            <span className="text-gold-gradient">Formação</span>
            <br />
            <span className="text-white/90">Orácula</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 128, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-10"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-white/40 text-lg md:text-xl leading-relaxed max-w-xl mx-auto font-display italic mb-14"
          >
            A única formação que ensina a ler a psique feminina através de um mapa simbólico vivo — e a conduzir processos com método, ética e profundidade.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            <Button
              size="lg"
              onClick={() => navigate('/planos')}
              className="relative bg-transparent border-2 border-primary/40 text-white hover:bg-primary/10 hover:border-primary/70 px-10 py-7 text-base font-display tracking-wider group transition-all duration-500"
            >
              {/* Pulsing glow behind button */}
              <motion.div
                className="absolute inset-0 rounded-md bg-primary/10 blur-xl -z-10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              Conhecer a Formação
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        <div className="w-5 h-9 rounded-full border border-white/15 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1 h-1 rounded-full bg-primary/60"
            animate={{ y: [0, 14, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
