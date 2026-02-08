import { motion } from 'framer-motion';

const fundamentos = [
  {
    titulo: 'Psicologia Analítica (C. G. Jung)',
    texto: 'Compreensão dos arquétipos, do inconsciente simbólico e dos processos de individuação, sem reduções interpretativas.',
  },
  {
    titulo: 'Narrativa e mito (Clarissa Pinkola Estés)',
    texto: 'O conto como estrutura psíquica viva — não como metáfora inspiracional, mas como mapa de atravessamento da experiência feminina.',
  },
  {
    titulo: 'Psicologia narrativa (Dan McAdams)',
    texto: 'A identidade como história em construção, com ruptura, reorganização e sentido.',
  },
  {
    titulo: 'Estrutura narrativa (Robert McKee)',
    texto: 'Rigor de arco, limite e consequência aplicado à escuta simbólica.',
  },
  {
    titulo: 'Processos simbólicos e cognição',
    texto: 'Como a mente organiza sentido por imagens, histórias e padrões simbólicos.',
  },
];

export function FundamentacaoSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-gold/60 text-sm tracking-widest uppercase mb-8"
        >
          Fundamentação
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-foreground/90 text-lg sm:text-xl leading-relaxed mb-16"
        >
          A Formação ORÁCULA se apoia em bases sólidas da psicologia, da narrativa e dos estudos simbólicos —
          <br className="hidden sm:block" />
          integradas em um método próprio, estruturado e ético.
        </motion.p>

        <div className="space-y-12">
          {fundamentos.map((item, index) => (
            <motion.div
              key={item.titulo}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
              className="border-l border-gold/20 pl-6"
            >
              <h3 className="text-foreground font-medium mb-2">
                {item.titulo}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.texto}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
