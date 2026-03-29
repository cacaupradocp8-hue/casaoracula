import { motion } from 'framer-motion';

const pontos = [
  {
    titulo: 'Não é falta de esforço.',
    desc: 'Você já tentou de muitas formas. Mas sem estrutura interna, o esforço se dissipa.',
  },
  {
    titulo: 'É falta de mapa.',
    desc: 'Sem clareza sobre sua própria arquitetura psíquica, os mesmos padrões se repetem.',
  },
  {
    titulo: 'Repetição inconsciente.',
    desc: 'Os ciclos que mais incomodam não se resolvem com informação — se resolvem com profundidade.',
  },
];

export function PlanosProblema() {
  return (
    <section className="py-16 md:py-24 border-t border-border/10">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-2xl md:text-3xl text-foreground tracking-wide mb-3">
            O que te trouxe até aqui?
          </h2>
          <div className="w-10 h-px bg-gold/20 mx-auto" />
        </motion.div>

        <div className="space-y-10">
          {pontos.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="border-l-2 border-gold/15 pl-6"
            >
              <h3 className="font-display text-lg text-foreground mb-1">{p.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
