import { motion } from "framer-motion";

export function OQueESection() {
  const integra = [
    "neurociência e plasticidade psíquica",
    "competências do ego",
    "linguagem arquetípica",
    "leitura simbólica",
    "mito pessoal",
    "narroterapia oracular",
    "Jornada da Heroína aplicada à formação terapêutica"
  ];

  return (
    <section className="py-20 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-gold/60 text-sm tracking-[0.2em] uppercase font-body mb-4 block">
            🜂
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            O que é a Formação <span className="text-gold">ORÁCULA</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12"
        >
          <p className="font-display text-xl md:text-2xl text-foreground/80 text-center italic mb-12">
            A Formação ORÁCULA é uma tecnologia formativa da psique feminina.
          </p>

          <p className="font-body text-foreground/60 text-center mb-6">
            Ela integra:
          </p>

          <ul className="space-y-3 max-w-lg mx-auto">
            {integra.map((item, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
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
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <p className="font-body text-foreground/60 text-base mb-4">
            Tudo organizado em <span className="text-gold/80">Portais de Aprendizado</span>
            <br />e <span className="text-gold/80">Travessias de Experiência</span>.
          </p>
          
          <div className="h-px w-24 bg-gold/20 mx-auto my-8" />
          
          <p className="font-display text-lg md:text-xl text-foreground/70 italic">
            Você não aprende antes de atravessar.<br />
            Você não aplica o que não integrou.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
