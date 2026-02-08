import { motion } from 'framer-motion';

export function PortasSection() {
  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold/60 text-sm tracking-widest uppercase mb-12"
        >
          PORTAS — Onde a psique está
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Visual - Abstract doors */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center gap-4"
          >
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 0.15 + i * 0.15, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="w-8 sm:w-12 h-32 sm:h-48 border border-gold/30 rounded-t-full bg-gradient-to-b from-gold/5 to-transparent"
              />
            ))}
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              A psique não caminha em linha reta.
              <br />
              Ela atravessa Portas.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nem toda abertura pede avanço.
              <br />
              Há Portas que pedem presença.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
