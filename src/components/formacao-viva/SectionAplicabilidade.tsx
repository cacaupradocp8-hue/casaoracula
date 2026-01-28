import { motion } from "framer-motion";

const APLICACOES = [
  "conduzir atendimentos individuais e grupos",
  "usar narrativas como estrutura terapêutica",
  "sustentar profundidade com ética",
  "diferenciar-se com método próprio"
];

export function SectionAplicabilidade() {
  return (
    <section className="py-32 md:py-48 px-6 bg-gradient-to-b from-transparent via-card/20 to-transparent">
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
            <span className="text-gold/50 text-2xl">🌘</span>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mt-4 tracking-wide">
              Aplicabilidade
            </h2>
          </div>

          {/* Intro */}
          <p className="font-display text-xl text-muted-foreground text-center">
            Você aprende a:
          </p>

          {/* Applications list */}
          <div className="space-y-4">
            {APLICACOES.map((aplicacao, index) => (
              <motion.div
                key={aplicacao}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4"
              >
                <span className="text-gold/40 mt-1">—</span>
                <p className="font-body text-lg text-foreground/80">{aplicacao}</p>
              </motion.div>
            ))}
          </div>

          {/* Closing statement */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="pt-12 text-center"
          >
            <p className="font-display text-xl text-muted-foreground">
              Inspiração sem estrutura não permanece.
            </p>
            <p className="font-display text-xl text-gold/80 mt-2">
              Aqui, ela se sustenta.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
