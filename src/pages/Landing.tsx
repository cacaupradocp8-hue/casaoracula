import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { PageAmbientAudio } from '@/components/audio/PageAmbientAudio';
import { motion } from 'framer-motion';
import heroImage from '@/assets/hero-landing.jpg';

export default function Landing() {
  const { getCopyByKey } = useCopy();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* ===== HERO FULLSCREEN ===== */}
      <div className="relative min-h-screen flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Depth gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-transparent" />
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_100%)]" />
        </div>

        {/* Ambient golden particles effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/40"
              style={{
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [-20, -60, -20],
                opacity: [0, 0.8, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 4 + i * 0.8,
                repeat: Infinity,
                delay: i * 1.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Content — positioned at bottom for cinematic feel */}
        <div className="relative z-10 flex-1 flex flex-col justify-end pb-12 md:pb-20 px-6">
          <div className="max-w-3xl mx-auto w-full">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="mb-8 md:mb-10"
            >
              <Logo size="xl" variant="vertical" className="justify-center md:justify-start" />
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-foreground mb-6 leading-[1.1] text-center md:text-left"
            >
              {getCopyByKey('landing_titulo', 'Bem-vinda à')}{' '}
              <span className="text-gold-gradient font-semibold block mt-1">
                {getCopyByKey('landing_destaque', 'Casa ORÁCULA')}
              </span>
            </motion.h1>

            {/* Texto poético — glassmorphism card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="glass rounded-2xl p-6 md:p-8 mb-8 max-w-2xl mx-auto md:mx-0 border border-gold/10"
            >
              <div className="space-y-3 text-foreground/85 text-base md:text-lg leading-relaxed">
                <p>{getCopyByKey('landing_texto_1', 'A Casa ORÁCULA não é um curso.')}</p>
                <p>{getCopyByKey('landing_texto_2', 'É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.')}</p>
                <p className="text-foreground/70 text-sm md:text-base">
                  {getCopyByKey('landing_texto_3', 'Aqui, a técnica não substitui a escuta. O símbolo não é ornamento, é linguagem. E o portal não é metáfora, é prática.')}
                </p>
              </div>
              <p className="text-primary italic mt-6 font-display text-xl md:text-2xl leading-snug">
                {getCopyByKey('landing_convite', 'Sente-se. A Casa se revela passo a passo.')}
              </p>
            </motion.div>

            {/* Audio ambient */}
            <PageAmbientAudio settingsPrefix="entry" autoPlay />

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <Link to="/auth">
                <Button variant="gold" size="xl" className="text-lg px-10 py-6 w-full sm:w-auto rounded-xl shadow-glow">
                  {getCopyByKey('btn_entrar_casa', 'Entrar na Casa ORÁCULA')}
                </Button>
              </Link>
              <Link to="/tour">
                <Button variant="hero" size="xl" className="text-lg px-8 py-6 w-full sm:w-auto rounded-xl">
                  Conhecer a Casa
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade-out line accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      </div>
    </div>
  );
}
