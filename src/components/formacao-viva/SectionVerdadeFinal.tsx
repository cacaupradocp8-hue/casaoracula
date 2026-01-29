import { motion } from "framer-motion";

export function SectionVerdadeFinal() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.5 }}
          className="space-y-12 text-center"
        >
          {/* Symbol */}
          <span className="text-gold/40 text-2xl block">🌘</span>

          {/* Main statement */}
          <div className="space-y-6">
            <p className="font-display text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Essa página não vende rápido.
            </p>
            <p className="font-display text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              Ela <span className="text-gold/80">seleciona certo</span>.
            </p>
          </div>

          {/* Closing */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-8"
          >
            <p className="font-display text-xl md:text-2xl text-foreground/80 leading-relaxed">
              Quem fica,
              <br />
              <span className="text-foreground">fica inteira.</span>
            </p>
          </motion.div>

          {/* Decorative line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="w-24 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mt-16"
          />
        </motion.div>
      </div>
    </section>
  );
}
