import { motion } from "framer-motion";

const FUNDAMENTOS = [
  "Psicologia Analítica",
  "Psicologia Narrativa",
  "Mito, estrutura e cognição simbólica"
];

export function SectionFundamentacao() {
  return (
    <section className="py-32 md:py-48 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="text-center">
            <span className="text-gold/50 text-2xl">🜂</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-4 tracking-wide">
              Fundamentação
            </h2>
          </div>

          {/* Foundations list */}
          <div className="flex flex-col items-center gap-4 py-8">
            {FUNDAMENTOS.map((fundamento, index) => (
              <motion.p
                key={fundamento}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="font-display text-lg md:text-xl text-foreground/80 tracking-wide"
              >
                {fundamento}
              </motion.p>
            ))}
          </div>

          {/* Closing statement */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center pt-8 border-t border-border/30"
          >
            <p className="font-body text-lg text-muted-foreground">
              Nada é improvisado.
              <br />
              <span className="text-foreground/90">Nada é profundo sem limite.</span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
