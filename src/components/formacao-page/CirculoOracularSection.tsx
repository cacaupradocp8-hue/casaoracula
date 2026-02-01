import { motion } from "framer-motion";

export function CirculoOracularSection() {
  const aprende = [
    "leitura de campo sem projeção",
    "manejo de silêncio",
    "interpretação sem invasão",
    "sustentação de grupo",
    "condução ritual com clareza"
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            🜄
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            O <span className="text-gold">Círculo Oracular</span>
          </h2>
          <p className="font-body text-foreground/50 text-sm">
            (o nível que não se improvisa)
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <p className="font-display text-xl text-foreground/70 text-center italic mb-10">
            O Círculo Oracular é onde a leitura simbólica<br />
            ganha postura, ética e método.
          </p>

          <p className="font-body text-foreground/60 text-center mb-6">
            Aqui você aprende:
          </p>

          <ul className="space-y-3 max-w-md mx-auto">
            {aprende.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-3 font-body text-foreground/70"
              >
                <span className="text-gold/60 text-xs">◆</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center"
        >
          <div className="h-px w-24 bg-gold/20 mx-auto mb-8" />
          
          <p className="font-display text-xl text-foreground/60 italic">
            Não é sobre "ver mais".<br />
            É sobre <span className="text-gold/80">responder pelo que se vê</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
