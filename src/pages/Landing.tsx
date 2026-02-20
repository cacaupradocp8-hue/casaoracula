import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { PageAmbientAudio } from '@/components/audio/PageAmbientAudio';
import { motion } from 'framer-motion';
import heroPortal from '@/assets/hero-portal.jpg';

export default function Landing() {
  const { getCopyByKey } = useCopy();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Full-screen hero image */}
      <div className="absolute inset-0">
        <img
          src={heroPortal}
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Overlay gradients for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent" />
      </div>

      {/* Subtle animated glow at portal center */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-pulse-slow pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-12 md:pb-16 px-6">
        {/* Logo at the top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <Logo size="lg" variant="vertical" className="justify-center" />
        </motion.div>

        {/* Main content block — positioned at the bottom */}
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Title */}
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

          {/* Poetic text — condensed for impact */}
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
              {getCopyByKey('landing_convite', 'Sente-se. A Casa se revela passo a passo.')}
            </p>
          </motion.div>

          {/* Ambient Audio */}
          <PageAmbientAudio settingsPrefix="entry" autoPlay />

          {/* CTAs */}
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
    </div>
  );
}
