import { motion } from "framer-motion";

export function SectionEspelho() {
  return (
    <section className="py-32 md:py-48 px-6 bg-gradient-to-b from-transparent via-card/20 to-transparent">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="space-y-16"
        >
          {/* Recognition block */}
          <div className="space-y-4">
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              Você sente antes de falar.
            </p>
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              Percebe quando algo se abre.
            </p>
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              E quando algo pode se romper.
            </p>
          </div>

          {/* Shadow block */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-4"
          >
            <p className="font-display text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Às vezes sustenta demais.
            </p>
            <p className="font-display text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Às vezes avança cedo demais.
            </p>
          </motion.div>

          {/* Resolution */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="space-y-6"
          >
            <p className="font-body text-lg text-foreground/70 tracking-wide">
              Não por erro.
              <br />
              <span className="text-foreground/90">Por falta de contorno.</span>
            </p>
            
            <p className="font-display text-xl md:text-2xl text-foreground pt-8 leading-relaxed">
              Você não precisa de mais conteúdo.
              <br />
              <span className="text-gold/80">Precisa de onde pisar.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
