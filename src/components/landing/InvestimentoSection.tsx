import { motion } from 'framer-motion';

export function InvestimentoSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            <span className="text-gold-gradient font-semibold">Investimento</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="rounded-2xl border border-primary/15 bg-white/[0.03] backdrop-blur-sm p-10 md:p-14 text-center"
        >
          <p className="text-sm uppercase tracking-widest text-primary/60 font-display mb-6">Valor da formação completa</p>
          <p className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-3">
            12x de R$ 497
          </p>
          <p className="text-muted-foreground text-sm mb-8">ou R$ 4.970 à vista</p>

          <div className="w-16 h-px bg-primary/20 mx-auto mb-8" />

          <p className="text-foreground/60 text-sm leading-relaxed max-w-md mx-auto italic font-display">
            A certificação não é automática. Ela é conquistada ao longo do processo, mediante avaliação contínua e entrega final.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
