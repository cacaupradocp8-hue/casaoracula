import { motion } from 'framer-motion';

export function PosturaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold/60 text-sm tracking-widest uppercase mb-12 text-center"
        >
          Postura
        </motion.p>

        <div className="text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-2"
          >
            <p className="text-foreground/90 text-lg">
              No Método ORÁCULA,
            </p>
            <p className="text-foreground/90 text-lg">
              a ferramenta não é o centro.
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-gold text-xl font-display"
          >
            A postura é.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-3 py-6"
          >
            <p className="text-muted-foreground">
              Saber quando falar.
            </p>
            <p className="text-muted-foreground">
              Quando silenciar.
            </p>
            <p className="text-muted-foreground">
              Quando sustentar.
            </p>
            <p className="text-muted-foreground">
              Quando retirar a própria mão.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="pt-8 border-t border-gold/10"
          >
            <p className="text-foreground/80 text-sm">
              Nada aqui é improvisado.
            </p>
            <p className="text-foreground/80 text-sm mt-1">
              Nada é profundo sem limite.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
