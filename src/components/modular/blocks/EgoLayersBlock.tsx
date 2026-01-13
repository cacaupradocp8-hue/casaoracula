import { useState } from 'react';
import { ContentBlock, EgoLayersContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Layers, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EgoLayersBlockProps {
  block: ContentBlock;
  onSave?: (data: Record<string, string[]>) => void;
}

const DEFAULT_LAYERS = [
  { 
    id: 'fisico', 
    name: 'Corpo Físico', 
    color: 'hsl(0, 70%, 50%)',
    questions: [
      'Como está meu corpo hoje?',
      'Onde sinto tensão ou desconforto?',
      'Estou cuidando da minha saúde física?'
    ]
  },
  { 
    id: 'eterico', 
    name: 'Corpo Etérico', 
    color: 'hsl(30, 70%, 50%)',
    questions: [
      'Qual meu nível de energia vital?',
      'Estou dormindo e me alimentando bem?',
      'Como está minha vitalidade?'
    ]
  },
  { 
    id: 'astral', 
    name: 'Corpo Astral', 
    color: 'hsl(50, 70%, 50%)',
    questions: [
      'Quais emoções estão presentes?',
      'Há alguma emoção sendo evitada?',
      'Como estou me relacionando emocionalmente?'
    ]
  },
  { 
    id: 'mental', 
    name: 'Eu Mental', 
    color: 'hsl(120, 50%, 45%)',
    questions: [
      'Como está minha clareza mental?',
      'Quais pensamentos predominam?',
      'Consigo manter foco?'
    ]
  },
  { 
    id: 'espiritual', 
    name: 'Eu Espiritual', 
    color: 'hsl(270, 70%, 60%)',
    questions: [
      'Sinto conexão com algo maior?',
      'Estou alinhada com meu propósito?',
      'Como está minha vida interior?'
    ]
  },
];

export function EgoLayersBlock({ block, onSave }: EgoLayersBlockProps) {
  const content = block.content as EgoLayersContent;
  const layers = content.layers || DEFAULT_LAYERS;
  
  const [expandedLayer, setExpandedLayer] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {};
    layers.forEach(l => { initial[l.id] = l.questions?.map(() => '') || []; });
    return initial;
  });

  const updateResponse = (layerId: string, questionIndex: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [layerId]: prev[layerId].map((r, i) => i === questionIndex ? value : r)
    }));
  };

  const getLayerProgress = (layerId: string) => {
    const layer = layers.find(l => l.id === layerId);
    if (!layer?.questions?.length) return 0;
    const answered = responses[layerId]?.filter(r => r.trim().length > 0).length || 0;
    return (answered / layer.questions.length) * 100;
  };

  const totalProgress = () => {
    const totalQuestions = layers.reduce((sum, l) => sum + (l.questions?.length || 0), 0);
    const totalAnswered = Object.values(responses).reduce(
      (sum, answers) => sum + answers.filter(a => a.trim().length > 0).length, 0
    );
    return totalQuestions > 0 ? (totalAnswered / totalQuestions) * 100 : 0;
  };

  const handleSave = () => {
    if (onSave) {
      onSave(responses);
    }
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="w-5 h-5 text-gold" />
          {block.titulo || 'Camadas do Ego'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
        {content.showProgress && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso Total</span>
              <span>{Math.round(totalProgress())}%</span>
            </div>
            <Progress value={totalProgress()} className="h-2" />
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Layers Visualization */}
        <div className="relative py-8">
          <div className="flex flex-col items-center gap-2">
            {layers.map((layer, index) => {
              const isExpanded = expandedLayer === layer.id;
              const progress = getLayerProgress(layer.id);
              const width = 100 - (index * 10); // Each layer slightly smaller
              
              return (
                <div 
                  key={layer.id}
                  className="w-full"
                  style={{ maxWidth: `${width}%` }}
                >
                  <button
                    onClick={() => setExpandedLayer(isExpanded ? null : layer.id)}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg border-2 transition-all",
                      "flex items-center justify-between",
                      "hover:scale-[1.02]",
                      isExpanded && "ring-2 ring-gold"
                    )}
                    style={{
                      borderColor: layer.color,
                      backgroundColor: `${layer.color}20`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="font-medium">{layer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {content.showProgress && (
                        <span className="text-xs text-muted-foreground">
                          {Math.round(progress)}%
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Questions */}
                  {isExpanded && layer.questions && (
                    <div 
                      className="mt-2 p-4 rounded-lg space-y-4"
                      style={{ backgroundColor: `${layer.color}10` }}
                    >
                      {layer.questions.map((question, qIndex) => (
                        <div key={qIndex} className="space-y-2">
                          <label className="text-sm font-medium">
                            {question}
                          </label>
                          <Textarea
                            placeholder="Sua reflexão..."
                            value={responses[layer.id]?.[qIndex] || ''}
                            onChange={(e) => updateResponse(layer.id, qIndex, e.target.value)}
                            className="bg-background/50 min-h-[80px]"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Save */}
        {content.saveToRegistros && onSave && (
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSave} 
              className="bg-gold hover:bg-gold/90 text-background"
            >
              Salvar Reflexões
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
