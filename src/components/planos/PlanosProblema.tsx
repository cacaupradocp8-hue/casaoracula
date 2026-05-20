import { motion } from 'framer-motion';

export function PlanosProblema() {
  return (
    <section className="py-24 md:py-32 border-t border-border/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight tracking-tight">
              O problema não é que você não entendeu.<br />
              <span className="text-gold italic">É que ainda não atravessou com continuidade.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 shrink-0" />
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Informação acumula.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 shrink-0" />
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Padrão repetido permanece.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2.5 shrink-0" />
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Símbolo sem prática vira inspiração passageira.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
