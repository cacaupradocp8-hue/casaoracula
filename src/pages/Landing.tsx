import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';
import { useCopy } from '@/hooks/useCopy';
import { PageAmbientAudio } from '@/components/audio/PageAmbientAudio';
import { motion } from 'framer-motion';
import heroPortal from '@/assets/hero-portal.jpg';
import portalMandala from '@/assets/portal-auth-mandala.jpg';

/* ─── Flower of Life SVG (seamless, faded edges) ─── */
const FlowerOfLifePattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="fol-landing" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
        <circle cx="60" cy="52" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
        <circle cx="60" cy="22" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
        <circle cx="60" cy="82" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
        <circle cx="34" cy="37" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
        <circle cx="86" cy="37" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
        <circle cx="34" cy="67" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
        <circle cx="86" cy="67" r="30" fill="none" stroke="hsl(42, 49%, 58%)" strokeWidth="0.5" />
      </pattern>
      <radialGradient id="fol-fade-landing" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="white" stopOpacity="1" />
        <stop offset="60%" stopColor="white" stopOpacity="0.7" />
        <stop offset="100%" stopColor="white" stopOpacity="0" />
      </radialGradient>
      <mask id="fol-mask-landing">
        <rect width="100%" height="100%" fill="url(#fol-fade-landing)" />
      </mask>
    </defs>
    <rect width="100%" height="100%" fill="url(#fol-landing)" mask="url(#fol-mask-landing)" />
  </svg>
);

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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.7)_100%)]" />
      </div>

      {/* Mandala glow (opacity only — no layout shift) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.06, 0.16, 0.06] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
        >
          <img src={portalMandala} alt="" className="w-full h-full object-cover rounded-full blur-[2px] opacity-40" />
        </motion.div>
      </div>

      {/* Sacred geometry overlay */}
      <FlowerOfLifePattern />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-primary/8 blur-[100px]"
        />
        <motion.div
          animate={{ opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[20%] right-[15%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-accent/6 blur-[80px]"
        />
      </div>

      {/* Golden dust particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { top: '18%', left: '25%', size: 'w-1 h-1', delay: '0s' },
          { top: '35%', left: '70%', size: 'w-0.5 h-0.5', delay: '1s' },
          { top: '55%', left: '15%', size: 'w-1 h-1', delay: '2s' },
          { top: '70%', left: '80%', size: 'w-0.5 h-0.5', delay: '0.5s' },
          { top: '25%', left: '55%', size: 'w-0.5 h-0.5', delay: '3s' },
          { top: '80%', left: '40%', size: 'w-1 h-1', delay: '1.5s' },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute ${p.size} rounded-full bg-primary/40 animate-pulse`}
            style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: '4s' }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-12 md:pb-16 px-6">
        {/* Logo at the top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <Logo size="xl" variant="vertical" className="justify-center" />
        </motion.div>

        {/* Main content block */}
        <div className="max-w-2xl mx-auto text-center space-y-8">
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
            className="relative"
          >
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/15 via-primary/5 to-transparent" />
            <div className="relative rounded-2xl bg-card/50 backdrop-blur-xl border border-border/20 p-6 md:p-8 space-y-3">
              <p className="text-foreground text-lg md:text-xl leading-relaxed">
                {getCopyByKey('landing_texto_1', 'A Casa ORÁCULA não é um curso.')}
              </p>
              <p className="text-foreground/80 text-base md:text-lg leading-relaxed">
                {getCopyByKey('landing_texto_2', 'É um espaço de formação simbólica, clínica e ética para mulheres que conduzem outras mulheres.')}
              </p>
              <div className="h-px w-16 mx-auto my-4 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <p className="text-primary italic font-display text-xl md:text-2xl">
                {getCopyByKey('landing_convite', 'Sente-se. A Casa se revela passo a passo.')}
              </p>
            </div>
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
    </div>
  );
}
