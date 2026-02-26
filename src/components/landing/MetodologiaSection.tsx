import { motion } from 'framer-motion';
import metodologiaImg from '@/assets/section-metodologia.jpg';

const travessias = [
  {
    numero: 'I',
    titulo: 'Travessia da Escuta',
    descricao: 'Reorganizar a escuta pessoal antes de escutar o campo do outro.',
  },
  {
    numero: 'II',
    titulo: 'Travessia da Leitura',
    descricao: 'Aprender a ler Porta, Torre e Campo sem interpretar literalmente.',
  },
  {
    numero: 'III',
    titulo: 'Travessia da Condução',
    descricao: 'Estruturar sessões, definir limites e sustentar o processo.',
  },
  {
    numero: 'IV',
    titulo: 'Travessia da Integração',
    descricao: 'Consolidar a prática profissional com ética e autonomia.',
  },
];

export function MetodologiaSection() {
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
            Metodologia <span className="text-gold-gradient font-semibold">ORÁCULA</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            A formação é organizada em quatro Travessias progressivas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {travessias.map((t, i) => (
            <motion.div
              key={t.numero}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="rounded-2xl border border-primary/10 bg-white/[0.02] p-8 flex gap-6"
            >
              <span className="font-display text-3xl text-primary/30 font-light flex-shrink-0">{t.numero}</span>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{t.titulo}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{t.descricao}</p>
              </div>
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
            src={metodologiaImg}
            alt="Caderno com anotações e diagrama simbólico"
            className="w-full h-48 md:h-64 object-cover opacity-50 grayscale"
            loading="lazy"
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
