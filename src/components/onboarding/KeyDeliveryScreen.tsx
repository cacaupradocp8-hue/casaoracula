import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ArchetypeType } from '@/hooks/useOnboarding';

interface KeyDeliveryScreenProps {
  archetype: ArchetypeType;
  onContinue: () => void;
}

const SYMBOL_DATA: Record<ArchetypeType, {
  name: string;
  phrase: string;
  description: string;
  color: string;
  bgGradient: string;
}> = {
  therapist: {
    name: 'Ouroboros',
    phrase: 'Os ciclos não terminam. Eles se tornam linguagem.',
    description: 'A serpente que devora a própria cauda — símbolo da continuidade transformadora.',
    color: 'text-indigo-400',
    bgGradient: 'from-indigo-900/30 via-purple-900/20 to-background',
  },
  mentor: {
    name: 'Serpente de Fogo',
    phrase: 'Todo guia precisa morrer para renascer.',
    description: 'A kundalini ascendente — o fogo que desperta através da entrega.',
    color: 'text-amber-400',
    bgGradient: 'from-amber-900/30 via-orange-900/20 to-background',
  },
  seeker: {
    name: 'Olho da Noite',
    phrase: 'A alma vê no escuro antes de falar.',
    description: 'A visão interior que precede a palavra — o saber que ainda não tem nome.',
    color: 'text-foreground',
    bgGradient: 'from-slate-800/30 via-zinc-900/20 to-background',
  },
};

// SVG symbol components
const OuroborosSymbol = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="ouroborosGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="70" fill="none" stroke="url(#ouroborosGradient)" strokeWidth="8" opacity="0.3" />
    <path
      d="M100 30 C140 30, 170 60, 170 100 C170 140, 140 170, 100 170 C60 170, 30 140, 30 100 C30 60, 60 30, 100 30"
      fill="none"
      stroke="url(#ouroborosGradient)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="100" cy="30" r="8" fill="#6366f1" />
    <circle cx="100" cy="30" r="4" fill="#a855f7" />
  </svg>
);

const FireSerpentSymbol = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="fireGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#fbbf24" />
      </linearGradient>
    </defs>
    <path
      d="M100 180 C100 180, 60 140, 80 100 C100 60, 60 40, 100 20 C140 40, 100 60, 120 100 C140 140, 100 180, 100 180"
      fill="none"
      stroke="url(#fireGradient)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="100" cy="20" r="6" fill="#fbbf24" />
    <circle cx="80" cy="100" r="4" fill="#f59e0b" opacity="0.6" />
    <circle cx="120" cy="100" r="4" fill="#ef4444" opacity="0.6" />
  </svg>
);

const EyeOfNightSymbol = () => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    <defs>
      <linearGradient id="nightGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <radialGradient id="pupilGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#64748b" />
      </radialGradient>
    </defs>
    <ellipse cx="100" cy="100" rx="70" ry="40" fill="none" stroke="url(#nightGradient)" strokeWidth="3" />
    <circle cx="100" cy="100" r="25" fill="url(#pupilGradient)" opacity="0.8" />
    <circle cx="100" cy="100" r="12" fill="#1e293b" />
    <circle cx="105" cy="95" r="4" fill="#f8fafc" opacity="0.8" />
  </svg>
);

const SYMBOLS: Record<ArchetypeType, React.FC> = {
  therapist: OuroborosSymbol,
  mentor: FireSerpentSymbol,
  seeker: EyeOfNightSymbol,
};

export function KeyDeliveryScreen({ archetype, onContinue }: KeyDeliveryScreenProps) {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const data = SYMBOL_DATA[archetype];
  const SymbolComponent = SYMBOLS[archetype];

  useEffect(() => {
    const contentTimer = setTimeout(() => setShowContent(true), 1000);
    const buttonTimer = setTimeout(() => setShowButton(true), 3000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-gradient-to-b ${data.bgGradient}`}>
      {/* Ambient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 max-w-lg w-full text-center space-y-10"
      >
        {/* Symbol Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="relative mx-auto w-48 h-48 md:w-64 md:h-64"
        >
          {/* Glow ring */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-gold/10 blur-2xl"
          />

          {/* Symbol */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SymbolComponent />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
          transition={{ duration: 1 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full border border-gold/20">
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold/80 font-medium">Sua Chave</span>
          </div>

          <h2 className={`font-display text-3xl md:text-4xl font-light ${data.color}`}>
            {data.name}
          </h2>

          <blockquote className="font-display text-xl md:text-2xl italic text-foreground/80 leading-relaxed">
            "{data.phrase}"
          </blockquote>

          <p className="text-muted-foreground text-sm max-w-sm mx-auto">
            {data.description}
          </p>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showButton ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Button
            variant="gold"
            size="lg"
            onClick={onContinue}
            className="gap-2 text-lg px-8"
          >
            Receber a chave
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
