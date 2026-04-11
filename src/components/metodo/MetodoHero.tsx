import { motion } from 'framer-motion';
import { useCopy } from '@/hooks/useCopy';

export function MetodoHero() {
  const { getCopyByKey } = useCopy();

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/90" />

      {/* Breathing orb — ONLY here */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-gradient-to-br from-gold/8 via-mystic/6 to-transparent blur-3xl animate-breathe pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-mystic/5 blur-2xl animate-breathe-subtle pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
      >
        <p className="text-gold uppercase tracking-[0.4em] text-sm mb-8 font-semibold">
          Método Orácula
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-semibold text-foreground mb-6 tracking-wide leading-[1.1] drop-shadow-lg">
          {getCopyByKey('casa_titulo', 'Casa Orácula')}
        </h1>
        <p className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto font-display italic leading-relaxed">
          {getCopyByKey('casa_subtitulo', 'Um espaço de formação simbólica para a psique feminina')}
        </p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1.5">
          <div className="w-1 h-1 rounded-full bg-gold/60" />
        </div>
      </motion.div>
    </section>
  );
}
