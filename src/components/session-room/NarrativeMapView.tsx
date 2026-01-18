import { motion } from 'framer-motion';
import { AlertTriangle, Heart, Eye, Moon, Repeat, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SessionData, NarrativeMap } from './types';

interface NarrativeMapViewProps {
  sessionData: Partial<SessionData>;
  onContinue: () => void;
}

export function NarrativeMapView({ sessionData, onContinue }: NarrativeMapViewProps) {
  const narrativeMap: NarrativeMap = {
    core: {
      fact: sessionData.fact || '',
      emotion: sessionData.emotion || '',
      emotionIntensity: sessionData.emotionIntensity || 5,
      image: sessionData.image || '',
    },
    archetypeShadow: {
      archetype: sessionData.primaryArchetype || '',
      whatProtects: sessionData.survivalStrategy || '',
      whatSilences: sessionData.learnedProhibition || '',
    },
    repetition: sessionData.repetitionPattern || '',
    soulInvitation: {
      invitation: sessionData.soulInvitation || '',
      firstGesture: sessionData.smallGesture || '',
    },
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
          Mapa Narrativo
        </h2>
        <p className="text-sm text-muted-foreground">
          Síntese simbólica organizada — não uma interpretação
        </p>
      </div>

      {/* Core Section */}
      <Card className="bg-gradient-to-br from-card to-secondary/30 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4 text-primary" />
            Núcleo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">O Fato</p>
            <p className="text-sm text-foreground">{narrativeMap.core.fact}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase mb-1">Emoção</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-rose-500/10 border-rose-500/30">
                  {narrativeMap.core.emotion}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Intensidade: {narrativeMap.core.emotionIntensity}/10
                </span>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Imagem</p>
            <p className="text-sm text-foreground italic">"{narrativeMap.core.image}"</p>
          </div>
        </CardContent>
      </Card>

      {/* Archetype & Shadow */}
      <Card className="bg-gradient-to-br from-card to-purple-500/5 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Moon className="h-4 w-4 text-purple-400" />
            Arquétipo & Sombra
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">Arquétipo Ativo</p>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
              {narrativeMap.archetypeShadow.archetype}
            </Badge>
            {sessionData.conflictArchetype && (
              <span className="text-xs text-muted-foreground ml-2">
                em tensão com <span className="text-amber-400">{sessionData.conflictArchetype}</span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">O que protege</p>
              <p className="text-sm text-foreground">{narrativeMap.archetypeShadow.whatProtects}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">O que silencia</p>
              <p className="text-sm text-foreground">{narrativeMap.archetypeShadow.whatSilences}</p>
            </div>
          </div>
          {sessionData.currentCost && (
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Custo Atual</p>
              <p className="text-sm text-amber-300/80">{sessionData.currentCost}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Repetition Pattern */}
      <Card className="bg-gradient-to-br from-card to-teal-500/5 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Repeat className="h-4 w-4 text-teal-400" />
            Padrão de Repetição
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground">{narrativeMap.repetition}</p>
        </CardContent>
      </Card>

      {/* Soul Invitation */}
      <Card className="bg-gradient-to-br from-card to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            Convite da Alma
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase mb-1">O Convite</p>
            <p className="text-sm text-foreground">{narrativeMap.soulInvitation.invitation}</p>
          </div>
          {sessionData.egoResistance && (
            <div>
              <p className="text-xs text-muted-foreground uppercase mb-1">Resistência do Ego</p>
              <p className="text-sm text-muted-foreground">{sessionData.egoResistance}</p>
            </div>
          )}
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary uppercase mb-1">Primeiro Gesto Possível</p>
            <p className="text-sm text-foreground font-medium">{narrativeMap.soulInvitation.firstGesture}</p>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      {/* Ethical Notices */}
      <div className="space-y-3 p-4 rounded-lg bg-muted/30 border border-border/50">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Leitura simbólica não é sentença.</strong> Este mapa organiza, não determina.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Nomear não é resolver.</strong> O símbolo precisa de tempo para trabalhar.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Símbolos requerem tempo.</strong> Permita que a travessia aconteça no seu ritmo.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onContinue}
          className="px-8 py-3 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-all font-medium"
        >
          Gerar Roteiro de Sessão
        </button>
      </div>
    </motion.div>
  );
}
