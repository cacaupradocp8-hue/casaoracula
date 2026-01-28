import { motion } from "framer-motion";

interface MecanismoUnicoProps {
  nome?: string;
  oQueE?: string;
  oQueMuda?: string;
  oQueDeixaDeAcontecer?: string;
}

export function MecanismoUnico({ 
  nome = "Território Simbólico Sustentado™",
  oQueE = "Um espaço interno e externo onde a profundidade tem contorno, a escuta tem linguagem e a prática tem método.",
  oQueMuda = "Você deixa de improvisar. Passa a reconhecer padrões, nomear movimentos da psique e conduzir com segurança simbólica.",
  oQueDeixaDeAcontecer = "Deixa de carregar sozinha. Deixa de sentir que falta algo. Deixa de se perder dentro do processo da outra."
}: MecanismoUnicoProps) {
  const items = [
    { label: "O que é", content: oQueE },
    { label: "O que muda quando existe", content: oQueMuda },
    { label: "O que deixa de acontecer", content: oQueDeixaDeAcontecer },
  ];

  return (
    <section className="py-20 md:py-32 px-6 bg-card/30">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4 font-body">
            O Mecanismo
          </p>
          <h2 className="font-display text-2xl md:text-3xl text-gold">
            {nome}
          </h2>
        </motion.div>

        <div className="space-y-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: index * 0.1 }}
              className="border-l-2 border-border pl-6"
            >
              <h3 className="text-sm uppercase tracking-wide text-gold/80 mb-2 font-body">
                {item.label}
              </h3>
              <p className="text-foreground/90 leading-relaxed font-body">
                {item.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
