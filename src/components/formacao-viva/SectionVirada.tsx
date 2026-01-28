import { motion } from "framer-motion";

export function SectionVirada() {
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
          {/* Main statement */}
          <div className="space-y-4">
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed">
              O que cansa
              <br />
              <span className="text-muted-foreground">não é a profundidade.</span>
            </p>
            <p className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed pt-4">
              É sustentá-la
              <br />
              <span className="text-muted-foreground">sem território.</span>
            </p>
          </div>

          {/* Authority statement */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="pt-8"
          >
            <p className="font-body text-lg md:text-xl text-foreground/80 tracking-wide leading-relaxed">
              Autoridade não nasce da confiança emocional.
              <br />
              <span className="text-gold/80">Nasce de estrutura assumida.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
