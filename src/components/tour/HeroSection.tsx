import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TourSection {
  titulo: string;
  subtitulo?: string | null;
  descricao?: string | null;
  imagem_url?: string | null;
}

interface HeroSectionProps {
  section?: TourSection;
}

export function HeroSection({ section }: HeroSectionProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-muted/30" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gold/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-primary/10 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-gold" />
            <span className="text-gold font-medium tracking-wider uppercase text-sm">
              Bem-vinda ao Tour
            </span>
            <Sparkles className="w-6 h-6 text-gold" />
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            {section?.titulo || 'Conheça a Casa ORÁCULA'}
          </h1>

          {section?.subtitulo && (
            <p className="text-xl md:text-2xl text-muted-foreground font-light mb-6">
              {section.subtitulo}
            </p>
          )}

          {section?.descricao && (
            <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              {section.descricao}
            </p>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gold"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
