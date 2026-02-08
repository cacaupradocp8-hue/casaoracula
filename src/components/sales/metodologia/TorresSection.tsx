import { motion } from 'framer-motion';

export function TorresSection() {
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
          TORRES — Por que essa forma existe
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Visual - Stacked blocks representing towers */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center gap-6"
          >
            {[
              { height: 'h-24', delay: 0.2 },
              { height: 'h-36', delay: 0.3 },
              { height: 'h-48', delay: 0.4 },
              { height: 'h-32', delay: 0.35 },
            ].map((tower, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: tower.delay }}
                className="flex flex-col justify-end"
              >
                <div
                  className={`w-10 sm:w-14 ${tower.height} border border-gold/20 bg-gradient-to-t from-gold/10 to-transparent rounded-t-sm`}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              Algumas formas atravessam a vida inteira.
              <br />
              Não como erro —
              <br />
              mas como sobrevivência.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nada é demolido.
              <br />
              Tudo é reconhecido.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
