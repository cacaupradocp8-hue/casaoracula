import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Compass, Feather, Lock, Edit2, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SessionData, SessionScript } from './types';

interface SessionScriptViewProps {
  sessionData: Partial<SessionData>;
  onUpdateScript: (script: SessionScript) => void;
  onContinue: () => void;
}

const MOVEMENTS = [
  {
    id: 'symbolicOpening',
    title: 'Abertura Simbólica',
    icon: Wand2,
    color: 'text-purple-400',
    bgColor: 'from-purple-500/10 to-purple-600/5',
    borderColor: 'border-purple-500/20',
    description: 'Criar o campo, nomear a intenção, preparar o espaço interno.',
  },
  {
    id: 'coreExploration',
    title: 'Exploração do Núcleo',
    icon: Compass,
    color: 'text-blue-400',
    bgColor: 'from-blue-500/10 to-blue-600/5',
    borderColor: 'border-blue-500/20',
    description: 'Aprofundar o fato, a emoção e a imagem com presença.',
  },
  {
    id: 'narrativeIntervention',
    title: 'Intervenção Narrativa',
    icon: Feather,
    color: 'text-amber-400',
    bgColor: 'from-amber-500/10 to-amber-600/5',
    borderColor: 'border-amber-500/20',
    description: 'Metáfora, escrita guiada ou visualização — opcional.',
  },
  {
    id: 'ritualClosing',
    title: 'Fechamento Ritual',
    icon: Lock,
    color: 'text-primary',
    bgColor: 'from-primary/10 to-gold-dark/5',
    borderColor: 'border-primary/20',
    description: 'Nomear, selar ou deixar aberto — sem catarse forçada.',
  },
];

function generateSuggestions(sessionData: Partial<SessionData>): SessionScript {
  const emotion = sessionData.emotion || 'esta emoção';
  const archetype = sessionData.primaryArchetype || 'o arquétipo ativo';
  const image = sessionData.image || 'a imagem que surgiu';
  const invitation = sessionData.soulInvitation || 'o convite da alma';
  const gesture = sessionData.smallGesture || 'um gesto possível';

  return {
    symbolicOpening: `Convide a cliente a fechar os olhos e respirar três vezes profundamente. Pergunte: "O que você percebe no corpo ao lembrar deste momento?" Sem pressa, deixe o campo se formar. Nomeie a intenção da sessão: explorar ${emotion} com cuidado e presença.`,
    
    coreExploration: `Retome o fato narrado e pergunte: "Se você pudesse dar uma cor ou textura a ${emotion}, qual seria?" Explore ${image} sem interpretar. Pergunte: "O que essa imagem quer mostrar?" Deixe a cliente nomear, não nomeie por ela.`,
    
    narrativeIntervention: `Opção 1: Escrita guiada — "Escreva uma carta curta para ${archetype}, dizendo o que você precisa que ela saiba."\n\nOpção 2: Visualização — "Imagine ${archetype} sentada diante de você. O que ela diria sobre ${invitation}?"\n\nOpção 3: Metáfora corporal — "Se esse padrão morasse no seu corpo, onde estaria? O que ele pede?"`,
    
    ritualClosing: `Pergunte: "O que você quer nomear antes de fechar este campo?" Se a cliente não souber, tudo bem — nem toda sessão precisa de conclusão. Proponha ${gesture} como ancoragem, mas não force. Encerre com: "Este campo permanece trabalhando, mesmo depois que saímos dele."`,
  };
}

export function SessionScriptView({
  sessionData,
  onUpdateScript,
  onContinue,
}: SessionScriptViewProps) {
  const [script, setScript] = useState<SessionScript>(() => 
    sessionData.sessionScript || generateSuggestions(sessionData)
  );
  const [editingMovement, setEditingMovement] = useState<string | null>(null);

  const handleUpdate = (movementId: keyof SessionScript, value: string) => {
    const updated = { ...script, [movementId]: value };
    setScript(updated);
    onUpdateScript(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl text-foreground mb-2">
          Roteiro de Sessão
        </h2>
        <p className="text-sm text-muted-foreground">
          Quatro movimentos sugeridos — você pode editar cada um
        </p>
      </div>

      {/* Movements */}
      <div className="space-y-4">
        {MOVEMENTS.map((movement, index) => {
          const Icon = movement.icon;
          const isEditing = editingMovement === movement.id;
          const value = script[movement.id as keyof SessionScript];

          return (
            <motion.div
              key={movement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`bg-gradient-to-br ${movement.bgColor} ${movement.borderColor} border`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className={`p-1.5 rounded-lg bg-background/50`}>
                        <Icon className={`h-4 w-4 ${movement.color}`} />
                      </div>
                      <span className="text-xs text-muted-foreground mr-2">
                        Movimento {index + 1}
                      </span>
                      {movement.title}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingMovement(isEditing ? null : movement.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isEditing ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Edit2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {movement.description}
                  </p>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <Textarea
                      value={value}
                      onChange={(e) => handleUpdate(movement.id as keyof SessionScript, e.target.value)}
                      className="min-h-[120px] bg-background/50 border-border/50 resize-none text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                      {value}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Ethical Notice */}
      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
        <p className="text-xs text-amber-300/80">
          Este roteiro é uma sugestão proporcional e ética. Não force catarses, respeite o tempo da cliente.
        </p>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium"
        >
          Ir para Fechamento
        </button>
      </div>
    </motion.div>
  );
}
