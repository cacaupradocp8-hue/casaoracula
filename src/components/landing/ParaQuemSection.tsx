import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const paraVoce = [
  'Você já conduz ou deseja conduzir mulheres em processos terapêuticos',
  'Sente que precisa de estrutura clínica para sustentar o que faz',
  'Quer diferenciar intuição de projeção',
  'Busca formação com profundidade, não apenas inspiração',
  'Está disposta a reorganizar antes de expandir',
];

const naoParaVoce = [
  'Você busca um curso rápido com certificado automático',
  'Quer apenas conteúdo motivacional ou inspirador',
  'Não tem interesse em prática clínica estruturada',
  'Espera respostas prontas sem processo de maturação',
  'Não quer ser supervisionada ou avaliada',
];

export function ParaQuemSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            Para quem <span className="text-gold-gradient font-semibold">é</span> — e para quem{' '}
            <span className="text-foreground/50">não é</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="p-8 md:pr-12 md:border-r border-primary/10 space-y-5"
          >
            <p className="text-sm uppercase tracking-widest text-primary/70 font-display mb-6">É para você se...</p>
            {paraVoce.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-primary/60 mt-1 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-foreground/80 text-sm leading-relaxed">{t}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="p-8 md:pl-12 space-y-5 border-t md:border-t-0 border-primary/10"
          >
            <p className="text-sm uppercase tracking-widest text-foreground/40 font-display mb-6">Não é para você se...</p>
            {naoParaVoce.map((t, i) => (
              <div key={i} className="flex items-start gap-3">
                <X className="w-4 h-4 text-foreground/30 mt-1 flex-shrink-0" strokeWidth={1.5} />
                <p className="text-foreground/50 text-sm leading-relaxed">{t}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
