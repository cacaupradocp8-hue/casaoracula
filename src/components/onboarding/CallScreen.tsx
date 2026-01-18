import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Flame, Moon } from 'lucide-react';
import { ArchetypeType } from '@/hooks/useOnboarding';

interface CallScreenProps {
  onSelectArchetype: (archetype: ArchetypeType) => void;
  isLoading: boolean;
}

const ARCHETYPES = [
  {
    type: 'therapist' as ArchetypeType,
    title: 'Terapeuta / Psicóloga',
    phrase: 'Escuto o outro, mas busco escutar a mim mesma.',
    icon: Eye,
    gradient: 'from-indigo-900/40 to-purple-900/20',
  },
  {
    type: 'mentor' as ArchetypeType,
    title: 'Mentora / Facilitadora',
    phrase: 'Guio caminhos, mas quero decodificar o meu próprio.',
    icon: Flame,
    gradient: 'from-amber-900/40 to-orange-900/20',
  },
  {
    type: 'seeker' as ArchetypeType,
    title: 'Buscadora',
    phrase: 'Algo está despertando, mas ainda não sei seu nome.',
    icon: Moon,
    gradient: 'from-slate-800/40 to-zinc-900/20',
  },
];

export function CallScreen({ onSelectArchetype, isLoading }: CallScreenProps) {
  const [hoveredArchetype, setHoveredArchetype] = useState<ArchetypeType | null>(null);
  const [selectedArchetype, setSelectedArchetype] = useState<ArchetypeType | null>(null);

  const handleSelect = (archetype: ArchetypeType) => {
    setSelectedArchetype(archetype);
    setTimeout(() => {
      onSelectArchetype(archetype);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/95" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="relative z-10 max-w-3xl w-full text-center space-y-12"
      >
        {/* Title */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full border border-gold/20"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold/80 font-medium tracking-wide">O Chamado</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-display text-2xl md:text-4xl font-light text-foreground leading-relaxed"
          >
            Qual é o chamado que te trouxe <br />
            <span className="text-gold-gradient font-medium">a esta Casa?</span>
          </motion.h1>
        </div>

        {/* Archetype Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="grid md:grid-cols-3 gap-4 md:gap-6"
        >
          {ARCHETYPES.map((archetype, index) => {
            const Icon = archetype.icon;
            const isHovered = hoveredArchetype === archetype.type;
            const isSelected = selectedArchetype === archetype.type;

            return (
              <motion.button
                key={archetype.type}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.15, duration: 0.6 }}
                onClick={() => !isLoading && handleSelect(archetype.type)}
                onMouseEnter={() => setHoveredArchetype(archetype.type)}
                onMouseLeave={() => setHoveredArchetype(null)}
                disabled={isLoading || !!selectedArchetype}
                className={`
                  relative group p-6 md:p-8 rounded-2xl border transition-all duration-500
                  bg-gradient-to-br ${archetype.gradient}
                  ${isSelected 
                    ? 'border-gold/60 shadow-lg shadow-gold/20 scale-105' 
                    : 'border-border/30 hover:border-gold/40'
                  }
                  ${isLoading || selectedArchetype ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 rounded-2xl bg-gold/10"
                    />
                  )}
                </AnimatePresence>

                <div className="relative z-10 space-y-4">
                  <motion.div
                    animate={{ scale: isHovered || isSelected ? 1.1 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`
                      w-12 h-12 mx-auto rounded-full flex items-center justify-center
                      ${isSelected ? 'bg-gold/20' : 'bg-muted/50'}
                      transition-colors duration-300
                    `}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-gold' : 'text-foreground/70'}`} />
                  </motion.div>

                  <h3 className={`font-display text-lg font-medium ${isSelected ? 'text-gold' : 'text-foreground'}`}>
                    {archetype.title}
                  </h3>

                  <p className="text-sm text-muted-foreground italic leading-relaxed">
                    "{archetype.phrase}"
                  </p>
                </div>

                {/* Glow effect on hover */}
                <div className={`
                  absolute inset-0 rounded-2xl transition-opacity duration-500
                  bg-gradient-to-t from-gold/5 to-transparent
                  ${isHovered ? 'opacity-100' : 'opacity-0'}
                `} />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading indicator */}
        {isLoading && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-muted-foreground text-sm"
          >
            Preparando sua entrada...
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
