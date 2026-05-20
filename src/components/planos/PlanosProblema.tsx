import { motion } from 'framer-motion';

const acumulos = ['mais uma aula', 'mais um livro', 'mais uma prática', 'mais uma técnica'];

const travessias = [
  'Ler de outro jeito.',
  'Escutar de outro jeito.',
  'Reconhecer os padrões que se repetem.',
  'Dar linguagem ao que antes era apenas incômodo, cansaço ou confusão.',
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
          className="space-y-8 text-center"
        >
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            A maioria das pessoas busca transformação acumulando conteúdos:
          </p>

          <ul className="space-y-1.5 text-foreground/80 font-display italic">
            {acumulos.map((a) => (
              <li key={a}>{a},</li>
            ))}
          </ul>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Mas informação sozinha não muda o destino de uma mulher.
          </p>

          <p className="font-display text-2xl md:text-3xl text-gold tracking-wide">
            O que transforma é atravessar.
          </p>

          <div className="w-10 h-px bg-gold/20 mx-auto" />

          <ul className="space-y-3 text-left max-w-xl mx-auto">
            {travessias.map((t, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-l-2 border-gold/20 pl-4 text-foreground/85"
              >
                {t}
              </motion.li>
            ))}
          </ul>

          <p className="text-base md:text-lg text-muted-foreground leading-relaxed pt-2">
            É para isso que existem as{' '}
            <span className="text-gold font-medium">Rotas da Casa Orácula</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
