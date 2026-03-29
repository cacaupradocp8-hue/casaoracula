import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function PlanosHero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
      {/* Breathing orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gold/[0.03] blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-gradient-to-r from-transparent to-gold/30" />
            <Sparkles className="w-4 h-4 text-gold/30" />
            <div className="w-12 h-px bg-gradient-to-l from-transparent to-gold/30" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-wide mb-6 leading-tight">
            Você já acessou uma parte da sua estrutura.
          </h1>

          <p className="text-lg sm:text-xl text-gold/60 font-display italic leading-relaxed">
            Mas ainda não entrou no nível onde a transformação acontece.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
