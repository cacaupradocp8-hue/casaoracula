import { motion } from 'framer-motion';
import { Compass, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { Button } from '@/components/ui/button';

type ProfileTag = 'perfil_profissional_atuante' | 'perfil_terapeuta_integrativa' | 'perfil_buscadora';

interface WelcomeCopy {
  icon: React.ReactNode;
  greeting: string;
  message: string[];
  closing: string;
}

const WELCOME_COPY: Record<ProfileTag, WelcomeCopy> = {
  perfil_profissional_atuante: {
    icon: <Compass className="w-8 h-8" />,
    greeting: 'Você já sustenta outras mulheres há algum tempo.',
    message: [
      'E sabe que isso exige mais do que técnica.',
      'Exige eixo, escuta profunda e um sistema que não te esgote.',
      'A Casa ORÁCULA foi criada para isso: oferecer estrutura simbólica que organiza sua prática — sem tirar o que você já conquistou.',
      'Aqui, você não começa do zero. Você integra.',
    ],
    closing: 'A Casa reconhece sua caminhada.',
  },
  perfil_terapeuta_integrativa: {
    icon: <Sparkles className="w-8 h-8" />,
    greeting: 'Você trabalha de forma intuitiva — e isso é sua força.',
    message: [
      'Mas talvez sinta que falta algo: uma linguagem que organize o que você já percebe.',
      'A Casa ORÁCULA não substitui seu saber. Ela oferece estrutura para que ele se expresse com mais clareza.',
      'Aqui, intuição e método caminham juntos.',
      'Você não vai perder a alma do seu trabalho. Vai enraizá-la.',
    ],
    closing: 'A Casa honra o que você já sabe.',
  },
  perfil_buscadora: {
    icon: <Heart className="w-8 h-8" />,
    greeting: 'Você ainda não atua — e isso não é um problema.',
    message: [
      'O chamado não exige pressa. Nem comparação. Nem chegar pronta.',
      'A Casa ORÁCULA é um espaço de escuta. Não de exigência.',
      'Você pode explorar, experimentar e descobrir se esse caminho faz sentido — no seu ritmo.',
      'Aqui, você não precisa saber. Precisa estar disponível.',
    ],
    closing: 'A Casa acolhe quem está em busca.',
  },
};

const DEFAULT_COPY: WelcomeCopy = {
  icon: <Heart className="w-8 h-8" />,
  greeting: 'Bem-vinda à Casa ORÁCULA.',
  message: [
    'Um espaço de formação simbólica para mulheres que cuidam de outras mulheres.',
    'Aqui, você não consome conteúdo. Você atravessa processos.',
    'Com estrutura, linguagem e cuidado simbólico.',
  ],
  closing: 'A Casa se revela passo a passo.',
};

interface WelcomeCopyByProfileProps {
  profileTag?: string | null;
  userName?: string;
  onContinue: () => void;
}

export function WelcomeCopyByProfile({ profileTag, userName, onContinue }: WelcomeCopyByProfileProps) {
  const copy = (profileTag && WELCOME_COPY[profileTag as ProfileTag]) || DEFAULT_COPY;

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

        {/* Icon */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center"
        >
          <div className="relative w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
            {copy.icon}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 rounded-full border border-gold/20"
            />
          </div>
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
            <p key={index} className="text-foreground/70 text-base md:text-lg leading-[1.8] tracking-[0.01em]">
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
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="border-l-2 border-gold/30 pl-5 text-left max-w-md mx-auto"
        >
          <p className="font-display text-lg md:text-xl italic text-foreground/90 leading-[1.5]">
            "{copy.closing}"
          </p>
          <p className="text-sm text-foreground/50 mt-3 leading-relaxed">
            Aqui, o caminho se revela passo a passo.
          </p>
        </motion.blockquote>

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
      </motion.div>
    </div>
  );
}
