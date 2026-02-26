import { motion } from 'framer-motion';
import { Ear, Compass, Scale } from 'lucide-react';
import circuloImg from '@/assets/section-circulo.jpg';

const competencias = [
  {
    icon: Ear,
    titulo: 'Escuta Simbólica',
    descricao: 'Capacidade de ouvir o que não é dito — o campo, o corpo, o silêncio — sem interpretar prematuramente.',
  },
  {
    icon: Compass,
    titulo: 'Leitura de Campo',
    descricao: 'Identificar Porta, Torre e Campo de cada mulher sem projetar narrativas pessoais.',
  },
  {
    icon: Scale,
    titulo: 'Condução Ética',
    descricao: 'Sustentar o processo terapêutico com limites claros, estrutura clínica e responsabilidade profissional.',
  },
];

export function CertificacaoSection() {
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
            O que é a <span className="text-gold-gradient font-semibold">Certificação</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Três competências centrais sustentam toda a formação.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {competencias.map((c, i) => (
            <motion.div
              key={c.titulo}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="rounded-2xl border border-primary/10 bg-white/[0.02] backdrop-blur-sm p-8 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <c.icon className="w-5 h-5 text-primary/70" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-3">{c.titulo}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.descricao}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 rounded-2xl overflow-hidden"
        >
          <img
            src={circuloImg}
            alt="Espaço de formação — ambiente terapêutico profissional"
            className="w-full h-48 md:h-64 object-cover opacity-50 grayscale"
            loading="lazy"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
