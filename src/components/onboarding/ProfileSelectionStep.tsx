import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Sparkles, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ProfileTag = 'perfil_profissional_atuante' | 'perfil_terapeuta_integrativa' | 'perfil_buscadora';

interface ProfileOption {
  id: ProfileTag;
  icon: React.ReactNode;
  title: string;
  description: string;
  pain: string;
}

const PROFILE_OPTIONS: ProfileOption[] = [
  {
    id: 'perfil_profissional_atuante',
    icon: <Compass className="w-6 h-6" />,
    title: 'Já atuo profissionalmente',
    description: 'Atendo outras mulheres há algum tempo.',
    pain: 'Sinto falta de profundidade, sistema ou sustentação simbólica no meu trabalho.',
  },
  {
    id: 'perfil_terapeuta_integrativa',
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Sou terapeuta integrativa ou holística',
    description: 'Atuo de forma intuitiva, com ferramentas diversas.',
    pain: 'Busco linguagem, estrutura e integração para o que já faço.',
  },
  {
    id: 'perfil_buscadora',
    icon: <Heart className="w-6 h-6" />,
    title: 'Ainda não atuo, mas sinto o chamado',
    description: 'Algo me atrai para o cuidado de outras mulheres.',
    pain: 'Não tenho clareza do caminho, mas sinto que ele existe.',
  },
];

interface ProfileSelectionStepProps {
  onSelect: (tag: ProfileTag) => void;
}

export function ProfileSelectionStep({ onSelect }: ProfileSelectionStepProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl md:text-3xl text-foreground">
            Um portal de entrada para diferentes momentos da jornada feminina.
          </h1>
          <p className="text-muted-foreground text-lg">
            Não importa onde você está.<br />
            Importa como você entra.
          </p>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {PROFILE_OPTIONS.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card
                onClick={() => onSelect(option.id)}
                className={cn(
                  "cursor-pointer transition-all duration-300",
                  "hover:border-gold/50 hover:shadow-lg hover:shadow-gold/10",
                  "bg-card/50 border-border/50"
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0 text-gold">
                      {option.icon}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="font-medium text-foreground text-lg">
                        {option.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {option.description}
                      </p>
                      <p className="text-muted-foreground/80 text-sm italic border-l-2 border-gold/30 pl-3">
                        "{option.pain}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Reassurance */}
        <p className="text-center text-xs text-muted-foreground/60">
          Todas as opções levam ao mesmo lugar — apenas nos ajudam a te receber melhor.
        </p>
      </motion.div>
    </div>
  );
}
