import { motion } from 'framer-motion';
import { Compass, Sparkles, Heart, ArrowRight, Home, BookOpen, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';

type ProfileTag = 'perfil_profissional_atuante' | 'perfil_terapeuta_integrativa' | 'perfil_buscadora';

interface WelcomeCopy {
  icon: React.ReactNode;
  greeting: string;
  message: string[];
  closing: string;
}

const WELCOME_COPY: Record<string, WelcomeCopy> = {
  default: {
    icon: <Home className="w-8 h-8" />,
    greeting: 'A Casa Orácula é o lugar da sua escuta.',
    message: [
      'Aqui, você organiza sentido, cuidado e travessia.',
    ],
    closing: 'Bem-vinda.',
  },
};

const DEFAULT_COPY: WelcomeCopy = WELCOME_COPY.default;

interface WelcomeCopyByProfileProps {
  profileTag?: string | null;
  userName?: string;
  onContinue: () => void;
}

export function WelcomeCopyByProfile({ profileTag, userName, onContinue }: WelcomeCopyByProfileProps) {
  const copy = DEFAULT_COPY;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 md:p-8">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-hero-radial pointer-events-none" />
      <div className="fixed inset-0 pattern-geometric opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-2xl w-full space-y-10 text-center"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Logo size="lg" variant="vertical" className="justify-center" />
        </motion.div>


        {/* Greeting with name */}
        {userName && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gold font-display text-xl md:text-2xl tracking-wide"
          >
            Olá, {userName.split(' ')[0]}.
          </motion.p>
        )}

        {/* Main greeting */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display text-2xl md:text-4xl text-foreground leading-[1.3] font-semibold tracking-tight"
        >
          {copy.greeting}
        </motion.h1>

        {/* Message paragraphs — improved readability */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-5 max-w-xl mx-auto"
        >
          {copy.message.map((paragraph, index) => (
            <p key={index} className="text-foreground/70 text-base md:text-lg leading-[1.8] tracking-[0.01em] whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </motion.div>

        {/* Decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.65 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold/30" />
          <Sparkles className="w-4 h-4 text-gold/40" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold/30" />
        </motion.div>

        {/* Closing quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center max-w-md mx-auto"
        >
          <p className="font-display text-lg md:text-xl text-gold leading-[1.5]">
            {copy.closing}
          </p>
        </motion.div>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pt-4"
        >
          <Button
            variant="gold"
            size="lg"
            onClick={onContinue}
            className="gap-2 text-lg px-10 py-6 shadow-lg shadow-gold/10"
          >
            Entrar na Casa
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Quick navigation hints */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="pt-6 flex items-center justify-center gap-6 text-xs text-foreground/30"
        >
          <Link to="/sala-de-visita" className="flex items-center gap-1.5 hover:text-gold/60 transition-colors">
            <Home className="w-3 h-3" />
            Sala de Visita
          </Link>
          <span className="w-px h-3 bg-foreground/10" />
          <Link to="/experiencia-gratuita" className="flex items-center gap-1.5 hover:text-gold/60 transition-colors">
            <Sparkles className="w-3 h-3" />
            Experiência
          </Link>
          <span className="w-px h-3 bg-foreground/10" />
          <Link to="/clube-livro" className="flex items-center gap-1.5 hover:text-gold/60 transition-colors">
            <BookOpen className="w-3 h-3" />
            Clube
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
