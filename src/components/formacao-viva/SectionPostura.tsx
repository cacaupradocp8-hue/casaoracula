import { motion } from "framer-motion";

export function SectionPostura() {
  return (
    <section className="py-32 md:py-48 px-6 bg-gradient-to-b from-transparent via-card/30 to-transparent">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-gold/50 text-2xl">🜂</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-4 tracking-wide">
              Postura
            </h2>
          </div>

          {/* Main statement */}
          <div className="space-y-6">
            <p className="font-display text-xl md:text-2xl text-foreground/90 leading-relaxed text-center">
              Na ORÁCULA,
              <br />
              a ferramenta não é o centro.
            </p>
            <p className="font-display text-2xl md:text-3xl text-gold/80 leading-relaxed text-center">
              A postura é.
            </p>
          </div>

          {/* Posture elements */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="pt-12"
          >
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-muted-foreground font-body text-lg">
              <span>Saber quando falar.</span>
              <span className="text-gold/30">•</span>
              <span>Quando silenciar.</span>
              <span className="text-gold/30">•</span>
              <span>Quando sustentar.</span>
              <span className="text-gold/30">•</span>
              <span>Quando retirar a mão.</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
