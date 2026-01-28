import { motion } from "framer-motion";

export function SectionOrigem() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="space-y-12"
        >
          {/* First block */}
          <div className="space-y-6">
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              Esta formação nasce da responsabilidade
              <br />
              <span className="text-foreground">de quem não pode mais improvisar</span>
              <br />
              diante da psique de outra mulher.
            </p>
          </div>

          {/* Second block */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-6 pt-8"
          >
            <p className="font-display text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Sensibilidade sem estrutura
              <br />
              invade — mesmo quando cuida.
            </p>
          </motion.div>

          {/* Closing statement */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 border-t border-border/30"
          >
            <p className="font-body text-lg text-foreground/80 tracking-wide">
              A ORÁCULA não é um curso.
              <br />
              <span className="text-gold/80">É território.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
