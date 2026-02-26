import { motion } from 'framer-motion';
import { AlertTriangle, Eye, Shield, Heart } from 'lucide-react';
import rupturaImg from '@/assets/section-ruptura.jpg';

const sinais = [
  { icon: AlertTriangle, text: 'Conduzir sem estrutura clínica clara' },
  { icon: Eye, text: 'Confundir intuição com projeção pessoal' },
  { icon: Shield, text: 'Atuar sem limites éticos definidos' },
  { icon: Heart, text: 'Reproduzir padrões sem consciência simbólica' },
];

export function RupturaSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            A <span className="text-gold-gradient font-semibold">Ruptura</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              A maioria das terapeutas do feminino começa a conduzir antes de reorganizar a própria escuta. Isso não é falha — é ausência de estrutura.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              A Certificação ORÁCULA nasce dessa ruptura: entre a vontade de conduzir e a maturidade clínica necessária para sustentar o campo sem projetar, interpretar ou dramatizar.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Antes de conduzir, é preciso reorganizar. Antes de interpretar, é preciso escutar. Antes de nomear, é preciso sustentar o silêncio.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="rounded-2xl border border-primary/10 bg-white/[0.02] backdrop-blur-sm p-8 space-y-5">
              <p className="text-sm uppercase tracking-widest text-primary/70 font-display">Sinais comuns</p>
              {sinais.map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <s.icon className="w-4 h-4 text-primary/70" />
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 rounded-2xl overflow-hidden"
        >
          <img
            src={rupturaImg}
            alt="Passagem simbólica — escada entre sombra e luz"
            className="w-full h-48 md:h-64 object-cover opacity-60 grayscale"
            loading="lazy"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
