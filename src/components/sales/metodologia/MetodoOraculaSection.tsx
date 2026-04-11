import { motion } from 'framer-motion';

const pilares = [
  {
    titulo: 'MAPA',
    texto: 'Reconhecer onde a narrativa está.',
  },
  {
    titulo: 'ESPELHO',
    texto: 'Devolver sentido sem invadir.',
  },
  {
    titulo: 'TRAVESSIA',
    texto: 'Sustentar o processo até o próximo limiar.',
  },
];

export function MetodoOraculaSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold text-sm font-semibold tracking-widest uppercase mb-12 text-center"
        >
          O Método ORÁCULA
        </motion.p>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {pilares.map((pilar, index) => (
            <motion.div
              key={pilar.titulo}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-lg border border-gold/10 bg-card/20 backdrop-blur-sm hover:border-gold/25 transition-colors duration-300">
                <h3 className="text-foreground font-display text-lg font-medium mb-3 tracking-wide">
                  {pilar.titulo}
                </h3>
                <p className="text-foreground/80 text-sm leading-relaxed">
                  {pilar.texto}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-1"
        >
          <p className="text-foreground/80 text-sm">
            Nada é interpretado fora de contexto.
          </p>
          <p className="text-foreground/80 text-sm">
            Nada é conduzido sem contorno.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
