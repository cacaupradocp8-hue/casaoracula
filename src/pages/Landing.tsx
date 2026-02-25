import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { PageAmbientAudio } from '@/components/audio/PageAmbientAudio';
import { motion } from 'framer-motion';
import heroPortal from '@/assets/hero-portal.jpg';

const ferramentas = [
  {
    emoji: '🔮',
    titulo: 'Ferramentas de Leitura de Campo',
    descricao: 'Mapas estruturais para identificar Porta, Campo e Torre.',
  },
  {
    emoji: '📖',
    titulo: 'Ferramentas Narrativas',
    descricao: 'Protocolos de leitura de mito pessoal, arquétipos e jornada.',
  },
  {
    emoji: '🛡️',
    titulo: 'Ferramentas de Condução',
    descricao: 'Roteiros de sessão, checklists éticos e estrutura de encerramento.',
  },
  {
    emoji: '🏛️',
    titulo: 'Ferramentas de Sustentação Profissional',
    descricao: 'Mapas de acompanhamento, registro simbólico e integração na Casa das Máquinas.',
  },
];

export default function Landing() {
  const { getCopyByKey } = useCopy();

  return (
    <div className="bg-background">
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-end overflow-hidden">
        {/* Full-screen hero image */}
        <div className="absolute inset-0">
          <img
            src={heroPortal}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-transparent" />
        </div>

        {/* Ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-pulse-slow pointer-events-none" />

        {/* Hero content */}
        <div className="relative z-10 pb-12 md:pb-16 px-6 flex flex-col items-center w-full">
          {/* Certification block */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl mx-auto text-center mb-8"
          >
            <div className="relative px-6 py-8 rounded-2xl bg-background/70 backdrop-blur-sm border border-primary/20">
              <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-gold-gradient leading-tight">
                CERTIFICAÇÃO ORÁCULA
              </h2>
              <p className="text-muted-foreground text-base md:text-lg mt-2 italic font-display">
                em Leitura e Condução Simbólica Feminina
              </p>
              <p className="text-foreground/80 text-sm md:text-base mt-4 max-w-xl mx-auto leading-relaxed">
                Formação estruturante para terapeutas que desejam reorganizar o eixo da própria escuta antes de conduzir outras mulheres.
              </p>
            </div>
          </motion.div>

          {/* Welcome + CTA */}
          <div className="max-w-2xl mx-auto text-center space-y-8 relative">
            <div className="absolute -inset-8 rounded-3xl bg-background/60 backdrop-blur-sm -z-10" />

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-tight"
            >
              {getCopyByKey('landing_titulo', 'Bem-vinda à')}{' '}
              <span className="text-gold-gradient font-semibold block mt-1">
                {getCopyByKey('landing_destaque', 'Casa ORÁCULA')}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="space-y-3 text-foreground/90 text-lg md:text-xl leading-relaxed"
            >
              <p>{getCopyByKey('landing_texto_1', 'A Casa ORÁCULA não é um curso.')}</p>
              <p className="text-muted-foreground">
                {getCopyByKey('landing_texto_2', 'É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.')}
              </p>
              <p className="text-primary italic font-display text-xl md:text-2xl mt-6">
                {getCopyByKey('landing_convite', 'Entre. A Casa se revela passo a passo.')}
              </p>
            </motion.div>

            <PageAmbientAudio settingsPrefix="entry" autoPlay />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
            >
              <Link to="/auth">
                <Button variant="gold" size="xl" className="text-lg px-10 py-6 w-full sm:w-auto shadow-gold">
                  {getCopyByKey('btn_entrar_casa', 'Entrar na Casa ORÁCULA')}
                </Button>
              </Link>
              <Link to="/tour">
                <Button variant="outline" size="xl" className="text-lg px-8 py-6 w-full sm:w-auto border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                  Conhecer a Casa
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
          />
        </div>
      </section>

      {/* ═══════════ FERRAMENTAS DO MÉTODO ═══════════ */}
      <section className="relative py-20 md:py-28 px-6 overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-foreground">
              As Ferramentas do{' '}
              <span className="text-gold-gradient font-semibold">Método ORÁCULA</span>
            </h2>
            <p className="text-muted-foreground mt-4 text-base md:text-lg max-w-2xl mx-auto">
              As ferramentas são organizadas em quatro categorias:
            </p>
          </motion.div>

          {/* Cards grid */}
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
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                <span className="text-4xl block mb-4">{f.emoji}</span>
                <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-2">
                  {f.titulo}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                  {f.descricao}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Closing statement */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-16 text-center space-y-2"
          >
            <p className="text-foreground/70 text-base md:text-lg">
              Cada ferramenta existe para apoiar as competências centrais da formação.
            </p>
            <p className="text-primary italic font-display text-lg md:text-xl mt-4">
              Você não aprende a usar todas.
              <br />
              Aprende quando usar — e quando não usar.
            </p>
          </motion.div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </section>
    </div>
  );
}
