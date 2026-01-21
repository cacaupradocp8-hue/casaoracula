import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Moon, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OnboardingQuiz } from './OnboardingQuiz';
import { OnboardingChat } from './OnboardingChat';

type VisitorExperience = 'hub' | 'quiz' | 'chat' | 'silence';

interface VisitorRoomScreenProps {
  onBecomeResident: () => void;
  onContinueAsVisitor: () => void;
  isLoading?: boolean;
}

const EXPERIENCES = [
  {
    id: 'quiz' as const,
    icon: Sparkles,
    title: 'Quiz Oracular',
    description: 'Uma pergunta simbólica para você contemplar',
    gradient: 'from-gold/20 to-gold/5',
    iconColor: 'text-gold',
  },
  {
    id: 'chat' as const,
    icon: MessageCircle,
    title: 'Voz Revelada',
    description: 'Uma breve conversa com a inteligência da Casa',
    gradient: 'from-purple-500/20 to-purple-500/5',
    iconColor: 'text-purple-400',
  },
  {
    id: 'silence' as const,
    icon: Moon,
    title: 'Espaço de Silêncio',
    description: 'Um momento para contemplar em quietude',
    gradient: 'from-blue-500/20 to-blue-500/5',
    iconColor: 'text-blue-400',
  },
] as const;

export function VisitorRoomScreen({ 
  onBecomeResident, 
  onContinueAsVisitor,
  isLoading 
}: VisitorRoomScreenProps) {
  const [activeExperience, setActiveExperience] = useState<VisitorExperience>('hub');
  const [completedExperiences, setCompletedExperiences] = useState<Set<string>>(new Set());

  const handleExperienceComplete = useCallback((experienceId: string) => {
    setCompletedExperiences(prev => new Set([...prev, experienceId]));
    setActiveExperience('hub');
  }, []);

  const handleBackToHub = useCallback(() => {
    setActiveExperience('hub');
  }, []);

  const handleSelectExperience = useCallback((id: VisitorExperience) => {
    setActiveExperience(id);
  }, []);

  // Silence experience
  if (activeExperience === 'silence') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-background flex flex-col items-center justify-center p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-background to-background" />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1.5 }}
          className="relative z-10 text-center max-w-md"
        >
          <Moon className="w-16 h-16 text-blue-400/60 mx-auto mb-8" />
          
          <p className="text-xl text-muted-foreground/80 font-display italic mb-4">
            "O silêncio também é linguagem."
          </p>
          
          <p className="text-sm text-muted-foreground/60 mb-12">
            Respire. Permita que o que veio até aqui descanse.
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <Button
              variant="ghost"
              onClick={() => handleExperienceComplete('silence')}
              className="text-muted-foreground hover:text-foreground"
            >
              Retornar à Sala
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  // Quiz experience
  if (activeExperience === 'quiz') {
    return (
      <OnboardingQuiz
        onComplete={() => handleExperienceComplete('quiz')}
        onBack={handleBackToHub}
      />
    );
  }

  // Chat experience
  if (activeExperience === 'chat') {
    return (
      <OnboardingChat
        onComplete={() => handleExperienceComplete('chat')}
        onBack={handleBackToHub}
      />
    );
  }

  // Hub view
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-background to-background" />
      <div className="absolute inset-0 pattern-geometric opacity-30" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <Moon className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold">Sala da Visitante</span>
          </div>
          
          <h1 className="text-2xl md:text-3xl font-display text-foreground mb-4">
            Você recebeu a chave.
          </h1>
          <p className="text-muted-foreground">
            Agora, explore livremente este espaço antes de decidir se quer habitar.
          </p>
        </motion.div>

        {/* Experience Cards */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid gap-4 w-full mb-12"
        >
          {EXPERIENCES.map((exp, index) => {
            const isCompleted = completedExperiences.has(exp.id);
            const Icon = exp.icon;
            
            return (
              <motion.button
                key={exp.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => handleSelectExperience(exp.id)}
                className={`
                  relative group p-6 rounded-xl border transition-all duration-300
                  bg-gradient-to-r ${exp.gradient}
                  ${isCompleted 
                    ? 'border-green-500/30 bg-green-500/5' 
                    : 'border-border/50 hover:border-gold/30 hover:shadow-glow'
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isCompleted ? 'bg-green-500/20' : `bg-background/50`}
                  `}>
                    {isCompleted ? (
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <Icon className={`w-6 h-6 ${exp.iconColor}`} />
                    )}
                  </div>
                  
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground mb-1">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">{exp.description}</p>
                  </div>
                  
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" />
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Progress Indicator */}
        {completedExperiences.size > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <p className="text-sm text-muted-foreground">
              {completedExperiences.size === EXPERIENCES.length 
                ? "✨ Você explorou esta sala. Agora, a decisão é sua."
                : `${completedExperiences.size} de ${EXPERIENCES.length} experiências exploradas`
              }
            </p>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 w-full max-w-md"
        >
          <div className="space-y-2">
            <Button
              variant="gold"
              size="lg"
              onClick={onBecomeResident}
              disabled={isLoading}
              className="w-full group"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin mr-2" />
                  Carregando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                  Conhecer os Caminhos para Habitar
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground/70 text-center">
              Você será direcionada para conhecer as opções de entrada na Casa.
            </p>
          </div>
          
          <Button
            variant="ghost"
            onClick={onContinueAsVisitor}
            disabled={isLoading}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            Continuar como visitante por agora
          </Button>
        </motion.div>

        {/* Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-muted-foreground/60 text-center mt-8 max-w-sm"
        >
          Como moradora, você terá acesso às ferramentas simbólicas e à formação completa.
        </motion.p>
      </div>
    </motion.div>
  );
}
