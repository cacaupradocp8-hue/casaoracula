import { motion } from "framer-motion";

export function SectionNarroterapia() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center">
            <span className="text-gold/50 text-2xl">🌑</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-4 tracking-wide">
              Narroterapia com Rigor
            </h2>
          </div>

          {/* Main content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="font-display text-xl md:text-2xl text-foreground/90 leading-relaxed">
                Aqui, narrativa não inspira.
                <br />
                <span className="text-gold/80">Estrutura.</span>
              </p>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-4"
            >
              <p className="font-display text-xl md:text-2xl text-muted-foreground leading-relaxed">
                O conto não cura.
                <br />
                Ele abre um campo.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="pt-8"
            >
              <p className="font-body text-lg text-foreground/80 leading-relaxed">
                E só quem sustenta Portas,
                <br />
                Labirintos e Torres
                <br />
                <span className="text-gold/80">pode conduzir sem violar.</span>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
