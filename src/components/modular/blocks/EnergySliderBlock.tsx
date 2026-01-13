import { useState, useMemo } from 'react';
import { ContentBlock, EnergySliderContent } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface EnergySliderBlockProps {
  block: ContentBlock;
  onSave?: (value: number) => void;
}

const HAWKINS_LEVELS = [
  { level: 20, name: 'Vergonha', color: 'hsl(0, 60%, 30%)' },
  { level: 30, name: 'Culpa', color: 'hsl(0, 60%, 35%)' },
  { level: 50, name: 'Apatia', color: 'hsl(0, 50%, 40%)' },
  { level: 75, name: 'Dor', color: 'hsl(15, 50%, 45%)' },
  { level: 100, name: 'Medo', color: 'hsl(30, 50%, 45%)' },
  { level: 125, name: 'Desejo', color: 'hsl(35, 55%, 50%)' },
  { level: 150, name: 'Raiva', color: 'hsl(40, 60%, 50%)' },
  { level: 175, name: 'Orgulho', color: 'hsl(45, 65%, 50%)' },
  { level: 200, name: 'Coragem', color: 'hsl(50, 70%, 50%)' },
  { level: 250, name: 'Neutralidade', color: 'hsl(80, 50%, 50%)' },
  { level: 310, name: 'Disposição', color: 'hsl(100, 55%, 45%)' },
  { level: 350, name: 'Aceitação', color: 'hsl(120, 50%, 45%)' },
  { level: 400, name: 'Razão', color: 'hsl(150, 55%, 45%)' },
  { level: 500, name: 'Amor', color: 'hsl(180, 60%, 45%)' },
  { level: 540, name: 'Alegria', color: 'hsl(200, 65%, 50%)' },
  { level: 600, name: 'Paz', color: 'hsl(220, 70%, 55%)' },
  { level: 700, name: 'Iluminação', color: 'hsl(270, 70%, 60%)' },
  { level: 1000, name: 'Consciência Pura', color: 'hsl(300, 80%, 70%)' },
];

function getNivelInfo(value: number) {
  for (let i = HAWKINS_LEVELS.length - 1; i >= 0; i--) {
    if (value >= HAWKINS_LEVELS[i].level) {
      return HAWKINS_LEVELS[i];
    }
  }
  return HAWKINS_LEVELS[0];
}

function getFeedbackText(value: number): string {
  if (value < 200) {
    return 'Este nível indica campos de força destrutivos. A consciência está operando em padrões que drenam energia vital.';
  } else if (value < 350) {
    return 'Você está transitando para campos de força construtivos. A energia vital começa a fluir de forma mais harmoniosa.';
  } else if (value < 500) {
    return 'Campo de força altamente construtivo. Há clareza mental e capacidade de resolver problemas complexos.';
  } else if (value < 600) {
    return 'O amor incondicional permeia a consciência. Há profunda conexão com a essência da vida.';
  } else {
    return 'Estados elevados de consciência caracterizados por paz profunda, êxtase e experiências transcendentes.';
  }
}

export function EnergySliderBlock({ block, onSave }: EnergySliderBlockProps) {
  const content = block.content as EnergySliderContent;
  const minValue = content.minValue ?? 20;
  const maxValue = content.maxValue ?? 1000;
  const [value, setValue] = useState(content.defaultValue ?? 200);

  const nivelInfo = useMemo(() => getNivelInfo(value), [value]);
  const feedback = useMemo(() => getFeedbackText(value), [value]);

  const progressPercent = ((value - minValue) / (maxValue - minValue)) * 100;

  return (
    <Card className="bg-card/50 border-border/50 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full transition-colors duration-300"
            style={{ backgroundColor: nivelInfo.color }}
          />
          {block.titulo || 'Escala de Consciência'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Value Display */}
        <div className="text-center py-6">
          <div 
            className="text-6xl font-bold transition-colors duration-300"
            style={{ color: nivelInfo.color }}
          >
            {value}
          </div>
          <div 
            className="text-2xl font-medium mt-2 transition-colors duration-300"
            style={{ color: nivelInfo.color }}
          >
            {nivelInfo.name}
          </div>
        </div>

        {/* Slider */}
        <div className="px-4 py-2">
          <div 
            className="h-2 rounded-full mb-4 relative overflow-hidden bg-muted"
          >
            <div
              className="absolute left-0 top-0 h-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, hsl(0, 60%, 30%), hsl(50, 70%, 50%), hsl(270, 70%, 60%))`,
              }}
            />
          </div>
          <Slider
            value={[value]}
            onValueChange={([v]) => setValue(v)}
            min={minValue}
            max={maxValue}
            step={5}
            className="w-full"
          />
          {content.showLabels && (
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{minValue}</span>
              <span>200 (Limiar)</span>
              <span>{maxValue}</span>
            </div>
          )}
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          {HAWKINS_LEVELS.filter((_, i) => i % 3 === 0).map(level => (
            <Button
              key={level.level}
              variant="outline"
              size="sm"
              onClick={() => setValue(level.level)}
              className={cn(
                "text-xs transition-all",
                value === level.level && "ring-2 ring-gold"
              )}
              style={{ 
                borderColor: level.color,
                color: value === level.level ? level.color : undefined
              }}
            >
              {level.level} - {level.name}
            </Button>
          ))}
        </div>

        {/* Feedback */}
        {content.showFeedback && (
          <div 
            className="p-4 rounded-lg border transition-all duration-300"
            style={{ 
              borderColor: `${nivelInfo.color}40`,
              backgroundColor: `${nivelInfo.color}10`
            }}
          >
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feedback}
            </p>
          </div>
        )}

        {content.saveToRegistros && onSave && (
          <div className="flex justify-end">
            <Button onClick={() => onSave(value)} className="bg-gold hover:bg-gold/90 text-background">
              Registrar Nível
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
