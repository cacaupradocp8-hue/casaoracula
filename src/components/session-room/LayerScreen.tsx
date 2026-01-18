import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { LAYERS, EMOTIONS, ARCHETYPES, SessionData } from './types';

interface LayerScreenProps {
  layerIndex: number;
  sessionData: Partial<SessionData>;
  onUpdateData: (updates: Partial<SessionData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  canProceed: boolean;
}

export function LayerScreen({
  layerIndex,
  sessionData,
  onUpdateData,
  onNext,
  onPrevious,
  canProceed,
}: LayerScreenProps) {
  const layer = LAYERS[layerIndex];

  const renderLayerContent = () => {
    switch (layer.id) {
      case 'fact':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Descreva o que aconteceu, sem julgamento ou interpretação..."
              value={sessionData.fact || ''}
              onChange={(e) => onUpdateData({ fact: e.target.value })}
              className="min-h-[120px] bg-secondary/50 border-border/50 resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {(sessionData.fact || '').length}/500
            </p>
          </div>
        );

      case 'emotion':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">Selecione ou escreva a emoção:</label>
              <div className="flex flex-wrap gap-2">
                {EMOTIONS.slice(0, 10).map((emotion) => (
                  <Badge
                    key={emotion}
                    variant={sessionData.emotion === emotion ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:bg-primary/20"
                    onClick={() => onUpdateData({ emotion })}
                  >
                    {emotion}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Ou escreva a emoção..."
                value={sessionData.emotion || ''}
                onChange={(e) => onUpdateData({ emotion: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">
                Intensidade: <span className="text-primary font-medium">{sessionData.emotionIntensity || 5}</span>/10
              </label>
              <Slider
                value={[sessionData.emotionIntensity || 5]}
                onValueChange={([value]) => onUpdateData({ emotionIntensity: value })}
                min={0}
                max={10}
                step={1}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Sutil</span>
                <span>Intenso</span>
              </div>
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Cena ou elemento que surge:</label>
              <Textarea
                placeholder="Descreva a imagem, cena ou símbolo que aparece..."
                value={sessionData.image || ''}
                onChange={(e) => onUpdateData({ image: e.target.value })}
                className="min-h-[80px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Atmosfera da imagem:</label>
              <Input
                placeholder="Fria, densa, luminosa, caótica..."
                value={sessionData.imageAtmosphere || ''}
                onChange={(e) => onUpdateData({ imageAtmosphere: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        );

      case 'archetype':
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">Arquétipo primário:</label>
              <div className="flex flex-wrap gap-2">
                {ARCHETYPES.slice(0, 8).map((arch) => (
                  <Badge
                    key={arch}
                    variant={sessionData.primaryArchetype === arch ? 'default' : 'outline'}
                    className="cursor-pointer transition-all hover:bg-primary/20"
                    onClick={() => onUpdateData({ primaryArchetype: arch })}
                  >
                    {arch}
                  </Badge>
                ))}
              </div>
              <Input
                placeholder="Ou escreva o arquétipo..."
                value={sessionData.primaryArchetype || ''}
                onChange={(e) => onUpdateData({ primaryArchetype: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
            
            <div className="space-y-3">
              <label className="text-sm text-muted-foreground">Arquétipo em conflito (opcional):</label>
              <Input
                placeholder="Há outra força em tensão?"
                value={sessionData.conflictArchetype || ''}
                onChange={(e) => onUpdateData({ conflictArchetype: e.target.value })}
                className="bg-secondary/50 border-border/50"
              />
            </div>
          </div>
        );

      case 'shadow':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Proibição aprendida:</label>
              <Textarea
                placeholder="O que foi interditado, silenciado ou proibido?"
                value={sessionData.learnedProhibition || ''}
                onChange={(e) => onUpdateData({ learnedProhibition: e.target.value })}
                className="min-h-[60px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Estratégia de sobrevivência:</label>
              <Textarea
                placeholder="Como você aprendeu a se proteger disso?"
                value={sessionData.survivalStrategy || ''}
                onChange={(e) => onUpdateData({ survivalStrategy: e.target.value })}
                className="min-h-[60px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Custo atual:</label>
              <Textarea
                placeholder="O que essa estratégia custa hoje?"
                value={sessionData.currentCost || ''}
                onChange={(e) => onUpdateData({ currentCost: e.target.value })}
                className="min-h-[60px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
          </div>
        );

      case 'repetition':
        return (
          <div className="space-y-4">
            <Textarea
              placeholder="Em quais situações, relações ou momentos esse padrão se repete?"
              value={sessionData.repetitionPattern || ''}
              onChange={(e) => onUpdateData({ repetitionPattern: e.target.value })}
              className="min-h-[120px] bg-secondary/50 border-border/50 resize-none"
            />
          </div>
        );

      case 'invitation':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Convite da alma:</label>
              <Textarea
                placeholder="O que parece querer nascer ou ser reconhecido?"
                value={sessionData.soulInvitation || ''}
                onChange={(e) => onUpdateData({ soulInvitation: e.target.value })}
                className="min-h-[60px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Resistência do ego:</label>
              <Textarea
                placeholder="O que em você resiste a esse convite?"
                value={sessionData.egoResistance || ''}
                onChange={(e) => onUpdateData({ egoResistance: e.target.value })}
                className="min-h-[60px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Pequeno gesto possível:</label>
              <Textarea
                placeholder="Qual gesto mínimo poderia honrar esse convite agora?"
                value={sessionData.smallGesture || ''}
                onChange={(e) => onUpdateData({ smallGesture: e.target.value })}
                className="min-h-[60px] bg-secondary/50 border-border/50 resize-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex-1 flex flex-col"
    >
      {/* Layer Header */}
      <div className={`p-6 rounded-xl bg-gradient-to-br ${layer.color} border ${layer.borderColor} mb-6`}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{layer.symbol}</span>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Camada {layer.number} de 7
            </p>
            <h2 className="font-display text-xl text-foreground">{layer.title}</h2>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">{layer.description}</p>
      </div>

      {/* Layer Content */}
      <div className="flex-1">
        {renderLayerContent()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 mt-auto">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={layerIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        
        <div className="flex gap-1">
          {LAYERS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === layerIndex
                  ? 'bg-primary w-6'
                  : i < layerIndex
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="gap-2"
        >
          {layerIndex === LAYERS.length - 1 ? 'Gerar Mapa' : 'Próxima'}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
