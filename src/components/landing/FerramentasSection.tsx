import { motion } from 'framer-motion';
import { Search, BookOpen, Shield, Building2 } from 'lucide-react';

const ferramentas = [
  {
    icon: Search,
    titulo: 'Ferramentas de Leitura de Campo',
    descricao: 'Mapas estruturais para identificar Porta, Campo e Torre.',
  },
  {
    icon: BookOpen,
    titulo: 'Ferramentas Narrativas',
    descricao: 'Protocolos de leitura de mito pessoal, arquétipos e jornada.',
  },
  {
    icon: Shield,
    titulo: 'Ferramentas de Condução',
    descricao: 'Roteiros de sessão, checklists éticos e estrutura de encerramento.',
  },
  {
    icon: Building2,
    titulo: 'Ferramentas de Sustentação Profissional',
    descricao: 'Mapas de acompanhamento, registro simbólico e integração na Casa das Máquinas.',
  },
];

export function FerramentasSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            As Ferramentas do{' '}
            <span className="text-gold-gradient font-semibold">Método ORÁCULA</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-base max-w-2xl mx-auto">
            As ferramentas são organizadas em quatro categorias:
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          {ferramentas.map((f, i) => (
            <motion.div
              key={f.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="group relative rounded-2xl border border-primary/10 bg-white/[0.02] backdrop-blur-sm p-8 hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary/60" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">{f.titulo}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{f.descricao}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-16 text-center space-y-2"
        >
          <p className="text-foreground/70 text-base">
            Cada ferramenta existe para apoiar as competências centrais da formação.
          </p>
          <p className="text-primary italic font-display text-lg mt-4">
            Você não aprende a usar todas.
            <br />
            Aprende quando usar — e quando não usar.
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
