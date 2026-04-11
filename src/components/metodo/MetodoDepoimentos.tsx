import { motion } from 'framer-motion';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const depoimentos = [
  {
    texto: 'A formação me deu critério. Parei de usar ferramentas sem saber por que, e comecei a sustentar processos com responsabilidade.',
    nome: 'Terapeuta',
    nivel: 'Condutora',
  },
  {
    texto: 'Não é um curso. É uma travessia real. Eu vivi o que agora sustento em outras mulheres.',
    nome: 'Psicóloga',
    nivel: 'Praticante',
  },
  {
    texto: 'O método me ensinou que o limite é parte da ética. Aqui não se improvisa com a psique alheia.',
    nome: 'Facilitadora',
    nivel: 'Guia de Grupos',
  },
];

export function MetodoDepoimentos() {
  return (
    <motion.section {...fadeInUp} transition={{ duration: 0.8 }} className="py-16 md:py-24">
      <h2 className="text-3xl md:text-4xl font-display text-foreground mb-12 text-center tracking-wide">
        Vozes da Casa
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {depoimentos.map((dep, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="border border-border/50 rounded-lg p-6 bg-card/20"
          >
            <p className="text-foreground/80 text-sm leading-relaxed italic mb-5">
              "{dep.texto}"
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-xs font-display">{dep.nome[0]}</span>
              </div>
              <div>
                <p className="text-foreground text-sm">{dep.nome}</p>
                <p className="text-foreground/70 text-xs">{dep.nivel}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
