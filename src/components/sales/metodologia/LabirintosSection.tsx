import { motion } from 'framer-motion';

export function LabirintosSection() {
  return (
    <section className="py-20 sm:py-28 overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold/60 text-sm tracking-widest uppercase mb-12 text-right"
        >
          LABIRINTOS — Como a psique se move
        </motion.p>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 order-2 md:order-1"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              O Labirinto não é confusão.
              <br />
              É inteligência simbólica em movimento.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Quem apressa a saída,
              <br />
              viola o percurso.
            </p>
          </motion.div>

          {/* Visual - Organic labyrinth pattern */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="order-1 md:order-2 flex justify-center"
          >
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              fill="none"
              className="opacity-40"
            >
              {/* Organic labyrinth paths */}
              <motion.path
                d="M90 20 C 140 20, 160 60, 160 90 C 160 120, 140 160, 90 160 C 40 160, 20 120, 20 90 C 20 60, 40 20, 90 20"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gold"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.3 }}
              />
              <motion.path
                d="M90 35 C 130 35, 145 65, 145 90 C 145 115, 130 145, 90 145 C 50 145, 35 115, 35 90 C 35 65, 50 35, 90 35"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gold"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.5 }}
              />
              <motion.path
                d="M90 50 C 120 50, 130 70, 130 90 C 130 110, 120 130, 90 130 C 60 130, 50 110, 50 90 C 50 70, 60 50, 90 50"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gold"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.7 }}
              />
              <motion.path
                d="M90 65 C 110 65, 115 80, 115 90 C 115 100, 110 115, 90 115 C 70 115, 65 100, 65 90 C 65 80, 70 65, 90 65"
                stroke="currentColor"
                strokeWidth="1"
                className="text-gold"
                fill="none"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 0.9 }}
              />
              <motion.circle
                cx="90"
                cy="90"
                r="8"
                className="fill-gold/30"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.5 }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
