import { useState } from 'react';
import { ContentBlock, PlasticityMapContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Brain, Sparkles, ChevronRight, Save, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlasticityMapBlockProps {
  block: ContentBlock;
  onSave?: (data: PlasticityMapEntry) => void;
}

interface PlasticityMapEntry {
  trigger: string;
  automaticResponse: string;
  perceivedAge: number;
  competencyToDevlop: string;
  newConsciousResponse: string;
  ritual?: string;
}

const DEFAULT_COMPETENCIES = [
  { key: 'autonomia', label: 'Autonomia', description: 'Capacidade de agir por conta própria' },
  { key: 'tolerancia_frustracao', label: 'Tolerância à Frustração', description: 'Lidar com o não e o limite' },
  { key: 'contencao_emocional', label: 'Contenção Emocional', description: 'Acolher emoções sem explodir' },
  { key: 'limites', label: 'Limites Saudáveis', description: 'Dizer não com amor' },
  { key: 'responsabilidade', label: 'Responsabilidade', description: 'Assumir as próprias escolhas' },
  { key: 'espera', label: 'Capacidade de Esperar', description: 'Tolerar o tempo das coisas' },
  { key: 'confianca', label: 'Confiança no Processo', description: 'Entregar-se ao fluxo da vida' },
];

const AGE_LABELS: Record<number, string> = {
  0: 'Bebê (0-1 ano)',
  1: 'Criança pequena (1-3 anos)',
  2: 'Criança (3-7 anos)',
  3: 'Pré-adolescente (7-12 anos)',
  4: 'Adolescente (12-18 anos)',
  5: 'Jovem adulto (18-25 anos)',
  6: 'Adulto presente',
};

export function PlasticityMapBlock({ block, onSave }: PlasticityMapBlockProps) {
  const content = block.content as PlasticityMapContent;
  const competencies = content.competencies || DEFAULT_COMPETENCIES;
  
  const [entry, setEntry] = useState<PlasticityMapEntry>({
    trigger: '',
    automaticResponse: '',
    perceivedAge: 3,
    competencyToDevlop: '',
    newConsciousResponse: '',
    ritual: '',
  });

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'trigger', title: 'Situação Gatilho', icon: '⚡' },
    { id: 'response', title: 'Resposta Automática', icon: '🔄' },
    { id: 'age', title: 'Idade Percebida', icon: '👶' },
    { id: 'competency', title: 'Competência a Desenvolver', icon: '🌱' },
    { id: 'conscious', title: 'Nova Resposta Consciente', icon: '✨' },
  ];

  const updateEntry = (key: keyof PlasticityMapEntry, value: string | number) => {
    setEntry(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (onSave) {
      onSave(entry);
    }
  };

  const handleReset = () => {
    setEntry({
      trigger: '',
      automaticResponse: '',
      perceivedAge: 3,
      competencyToDevlop: '',
      newConsciousResponse: '',
      ritual: '',
    });
    setCurrentStep(0);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return entry.trigger.trim().length > 0;
      case 1: return entry.automaticResponse.trim().length > 0;
      case 2: return true;
      case 3: return entry.competencyToDevlop.length > 0;
      case 4: return entry.newConsciousResponse.trim().length > 0;
      default: return false;
    }
  };

  const isComplete = currentStep >= steps.length;

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-gold" />
          {block.titulo || 'Mapa de Plasticidade Psíquica'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(index)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-lg transition-all min-w-[70px]",
                currentStep === index && "bg-gold/10 ring-1 ring-gold",
                index < currentStep && "opacity-70",
                index > currentStep && "opacity-40"
              )}
            >
              <span className="text-xl">{step.icon}</span>
              <span className="text-xs text-center">{step.title}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        {!isComplete && (
          <div className="min-h-[200px] space-y-4">
            {/* Step 0: Trigger */}
            {currentStep === 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Qual situação disparou uma resposta automática em você?
                </Label>
                <p className="text-sm text-muted-foreground">
                  Descreva o momento, contexto ou interação que ativou um padrão familiar.
                </p>
                <Textarea
                  placeholder="Por exemplo: Quando meu parceiro chegou atrasado..."
                  value={entry.trigger}
                  onChange={(e) => updateEntry('trigger', e.target.value)}
                  className="min-h-[120px] bg-background/50"
                />
              </div>
            )}

            {/* Step 1: Automatic Response */}
            {currentStep === 1 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Como você reagiu automaticamente?
                </Label>
                <p className="text-sm text-muted-foreground">
                  Descreva sua reação: o que sentiu, pensou e fez no momento.
                </p>
                <Textarea
                  placeholder="Senti raiva, comecei a criticar, me fechei..."
                  value={entry.automaticResponse}
                  onChange={(e) => updateEntry('automaticResponse', e.target.value)}
                  className="min-h-[120px] bg-background/50"
                />
              </div>
            )}

            {/* Step 2: Perceived Age */}
            {currentStep === 2 && content.showAgeSlider !== false && (
              <div className="space-y-6">
                <Label className="text-base font-medium">
                  Com qual idade você se sentiu reagindo?
                </Label>
                <p className="text-sm text-muted-foreground">
                  Quando reagimos automaticamente, muitas vezes respondemos a partir de uma 
                  parte nossa que ficou ferida em certa fase da vida.
                </p>
                
                <div className="py-6 px-4 bg-background/30 rounded-lg">
                  <Slider
                    value={[entry.perceivedAge]}
                    onValueChange={([value]) => updateEntry('perceivedAge', value)}
                    max={6}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="mt-4 text-center">
                    <span className="text-lg font-medium text-gold">
                      {AGE_LABELS[entry.perceivedAge]}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Competency to Develop */}
            {currentStep === 3 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Qual competência do ego pode ser desenvolvida aqui?
                </Label>
                <p className="text-sm text-muted-foreground">
                  Escolha a habilidade que, se fortalecida, mudaria sua resposta futura.
                </p>
                
                <Select
                  value={entry.competencyToDevlop}
                  onValueChange={(value) => updateEntry('competencyToDevlop', value)}
                >
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Selecione uma competência..." />
                  </SelectTrigger>
                  <SelectContent>
                    {competencies.map(comp => (
                      <SelectItem key={comp.key} value={comp.key}>
                        <div className="flex flex-col">
                          <span>{comp.label}</span>
                          {comp.description && (
                            <span className="text-xs text-muted-foreground">{comp.description}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {entry.competencyToDevlop && (
                  <div className="p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <p className="text-sm">
                      <span className="font-medium text-gold">
                        {competencies.find(c => c.key === entry.competencyToDevlop)?.label}:
                      </span>{' '}
                      {competencies.find(c => c.key === entry.competencyToDevlop)?.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: New Conscious Response */}
            {currentStep === 4 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Como você gostaria de responder conscientemente?
                </Label>
                <p className="text-sm text-muted-foreground">
                  Descreva a resposta adulta e madura que você quer treinar. Seja específico.
                </p>
                <Textarea
                  placeholder="Na próxima vez, vou respirar, nomear o que sinto..."
                  value={entry.newConsciousResponse}
                  onChange={(e) => updateEntry('newConsciousResponse', e.target.value)}
                  className="min-h-[120px] bg-background/50"
                />
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                Voltar
              </Button>
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
                className="bg-gold hover:bg-gold/90 text-background"
              >
                {currentStep === steps.length - 1 ? 'Concluir' : 'Próximo'}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Summary / Completion */}
        {isComplete && (
          <div className="space-y-6">
            <div className="text-center py-4">
              <Sparkles className="w-8 h-8 text-gold mx-auto mb-2" />
              <h3 className="text-lg font-medium">Mapa Criado</h3>
              <p className="text-sm text-muted-foreground">
                Você acabou de criar um caminho consciente de transformação
              </p>
            </div>

            {/* Visual Summary */}
            {content.showVisualMap !== false && (
              <div className="relative">
                {/* Mandala/Spiral visualization */}
                <div className="flex flex-col gap-3">
                  <div className="p-3 rounded-lg bg-destructive/10 border-l-4 border-destructive">
                    <p className="text-xs text-muted-foreground mb-1">Gatilho</p>
                    <p className="text-sm">{entry.trigger}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                  
                  <div className="p-3 rounded-lg bg-orange-500/10 border-l-4 border-orange-500">
                    <p className="text-xs text-muted-foreground mb-1">
                      Resposta Automática ({AGE_LABELS[entry.perceivedAge]})
                    </p>
                    <p className="text-sm">{entry.automaticResponse}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="text-xs">→</span>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">
                    <p className="text-xs text-muted-foreground mb-1">Competência a Desenvolver</p>
                    <p className="text-sm font-medium">
                      {competencies.find(c => c.key === entry.competencyToDevlop)?.label}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <div className="w-0.5 h-4 bg-border" />
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-500/10 border-l-4 border-green-500">
                    <p className="text-xs text-muted-foreground mb-1">Nova Resposta Consciente</p>
                    <p className="text-sm">{entry.newConsciousResponse}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Ritual */}
            {content.showRitual !== false && (
              <div className="p-4 rounded-lg bg-gold/5 border border-gold/20">
                <h4 className="text-sm font-medium text-gold mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Frase de Reprogramação
                </h4>
                <p className="text-sm text-muted-foreground italic">
                  "Hoje, escolho responder como adulta, mesmo quando a criança interior sente medo. 
                  Eu desenvolvo{' '}
                  <span className="text-foreground font-medium">
                    {competencies.find(c => c.key === entry.competencyToDevlop)?.label?.toLowerCase()}
                  </span>{' '}
                  com gentileza e paciência."
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4">
              <Button
                variant="outline"
                onClick={handleReset}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Novo Mapeamento
              </Button>
              {content.saveToRegistros && onSave && (
                <Button 
                  onClick={handleSave}
                  className="bg-gold hover:bg-gold/90 text-background"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Mapa
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
