import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { PageAmbientAudio } from '@/components/audio/PageAmbientAudio';
import { motion } from 'framer-motion';
import heroPortal from '@/assets/hero-portal.jpg';

export function HeroSection() {
  const { getCopyByKey } = useCopy();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-end overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroPortal} alt="" className="w-full h-full object-cover object-center" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-transparent" />
      </div>

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-pulse-slow pointer-events-none" />

      <div className="relative z-10 pb-12 md:pb-16 px-6 flex flex-col items-center w-full">
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

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1.2, ease: 'easeOut' }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        />
      </div>
    </section>
  );
}
