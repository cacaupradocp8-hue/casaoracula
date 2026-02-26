import { motion } from 'framer-motion';
import { Clock, Users, Video, Award } from 'lucide-react';

const etapas = [
  { icon: Clock, label: 'Duração', valor: '12 meses de formação contínua' },
  { icon: Users, label: 'Encontros', valor: 'Semanais ao vivo + material assíncrono' },
  { icon: Video, label: 'Supervisão', valor: 'Supervisão clínica mensal em grupo' },
  { icon: Award, label: 'Avaliação', valor: 'Contínua com entrega final prática' },
];

export function EstruturaSection() {
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
            Estrutura da <span className="text-gold-gradient font-semibold">Formação</span>
          </h2>
        </motion.div>

        {/* Timeline horizontal */}
        <div className="relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-primary/15" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {etapas.map((e, i) => (
              <motion.div
                key={e.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full border border-primary/20 bg-background flex items-center justify-center mx-auto mb-4 relative z-10">
                  <e.icon className="w-6 h-6 text-primary/60" strokeWidth={1.5} />
                </div>
                <p className="text-sm uppercase tracking-widest text-primary/70 font-display mb-2">{e.label}</p>
                <p className="text-muted-foreground text-sm leading-relaxed">{e.valor}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
