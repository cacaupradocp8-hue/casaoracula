import { motion } from 'framer-motion';
import dashboardImg from '@/assets/section-dashboard.jpg';

export function CasaMaquinasSection() {
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden bg-white/[0.01]">
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-light text-foreground">
            Casa das <span className="text-gold-gradient font-semibold">Máquinas</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="rounded-2xl overflow-hidden border border-primary/10"
          >
            <img
              src={dashboardImg}
              alt="Sistema de acompanhamento profissional"
              className="w-full h-auto object-cover opacity-70"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="space-y-6"
          >
            <p className="text-foreground/90 text-lg leading-relaxed">
              A Casa das Máquinas é o sistema de sustentação profissional da formação. É onde cada terapeuta organiza sua prática, seus registros e seu acompanhamento clínico.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Um ambiente digital integrado que permite mapear casos, registrar sessões e acompanhar o progresso de cada cliente — com segurança, ética e estrutura.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Não é uma plataforma genérica. É uma ferramenta construída para a prática clínica simbólica.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
