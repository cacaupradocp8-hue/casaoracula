// ============================================
// ARCHETYPAL MAPPING BLOCK
// ============================================
// Bloco para mapeamento arquetípico simbólico
// baseado nas deusas gregas

import { useState } from 'react';
import { ContentBlock } from '@/types/modular';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchetypeDimension {
  archetype: string;
  title: string;
  subtitle: string;
  description: string;
  questions: string[];
  positioningPrompt: string;
  keywords: string[];
}

export interface ArchetypalMappingContent {
  dimensions?: ArchetypeDimension[];
  instructionText?: string;
}

interface ArchetypalMappingBlockProps {
  block: ContentBlock;
  onSave?: (data: unknown) => void;
}

// Goddess colors
const ARCHETYPE_COLORS: Record<string, string> = {
  Artemis: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
  Demeter: 'from-amber-500/20 to-amber-600/10 border-amber-500/30',
  Athena: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  Aphrodite: 'from-rose-500/20 to-rose-600/10 border-rose-500/30',
  Persephone: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
};

const ARCHETYPE_ACCENT: Record<string, string> = {
  Artemis: 'text-emerald-400',
  Demeter: 'text-amber-400',
  Athena: 'text-blue-400',
  Aphrodite: 'text-rose-400',
  Persephone: 'text-purple-400',
};

export function ArchetypalMappingBlock({ block, onSave }: ArchetypalMappingBlockProps) {
  const content = block.content as ArchetypalMappingContent;
  const dimensions = content.dimensions || [];
  
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [completedDimensions, setCompletedDimensions] = useState<Set<string>>(new Set());

  const handleResponseChange = (archetype: string, value: string) => {
    setResponses(prev => ({ ...prev, [archetype]: value }));
  };

  const handleComplete = (archetype: string, index: number) => {
    if (responses[archetype]?.trim()) {
      setCompletedDimensions(prev => new Set(prev).add(archetype));
      // Move to next dimension
      if (index < dimensions.length - 1) {
        setExpandedIndex(index + 1);
      } else {
        setExpandedIndex(null);
      }
      // Save progress
      if (onSave) {
        onSave({ responses, completedDimensions: [...completedDimensions, archetype] });
      }
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const progress = Math.round((completedDimensions.size / dimensions.length) * 100);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header with title */}
      {block.titulo && (
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className="w-6 h-6 text-gold" />
          <h3 className="text-2xl font-semibold text-foreground">{block.titulo}</h3>
        </div>
      )}

      {/* Instructions */}
      {content.instructionText && (
        <p className="text-muted-foreground text-center max-w-2xl mx-auto">
          {content.instructionText}
        </p>
      )}

      {/* Progress indicator */}
      <div className="flex items-center gap-3 justify-center">
        <div className="flex gap-2">
          {dimensions.map((dim, idx) => (
            <div
              key={dim.archetype}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                completedDimensions.has(dim.archetype)
                  ? "bg-gold scale-110"
                  : idx === expandedIndex
                  ? "bg-primary/50"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">{progress}%</span>
      </div>

      {/* Dimension cards */}
      <div className="space-y-4">
        {dimensions.map((dimension, index) => {
          const isExpanded = expandedIndex === index;
          const isCompleted = completedDimensions.has(dimension.archetype);
          const colorClass = ARCHETYPE_COLORS[dimension.archetype] || 'from-primary/20 to-primary/10 border-primary/30';
          const accentClass = ARCHETYPE_ACCENT[dimension.archetype] || 'text-primary';

          return (
            <Card 
              key={dimension.archetype}
              className={cn(
                "overflow-hidden transition-all duration-300 border-2",
                `bg-gradient-to-br ${colorClass}`,
                isExpanded && "ring-2 ring-gold/30"
              )}
            >
              <CardHeader 
                className="cursor-pointer select-none"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCompleted && (
                      <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center">
                        <Check className="w-4 h-4 text-gold" />
                      </div>
                    )}
                    <div>
                      <CardTitle className={cn("text-lg", accentClass)}>
                        {dimension.title}
                      </CardTitle>
                      <CardDescription className="text-foreground/70">
                        {dimension.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="space-y-6 animate-fade-in">
                  {/* Description */}
                  <p className="text-foreground/80 leading-relaxed">
                    {dimension.description}
                  </p>

                  {/* Keywords */}
                  <div className="flex flex-wrap gap-2">
                    {dimension.keywords.map((keyword) => (
                      <Badge 
                        key={keyword} 
                        variant="secondary"
                        className="bg-background/50"
                      >
                        {keyword}
                      </Badge>
                    ))}
                  </div>

                  {/* Reflective questions */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                      Perguntas Reflexivas
                    </h4>
                    <ul className="space-y-2">
                      {dimension.questions.map((question, qIdx) => (
                        <li 
                          key={qIdx}
                          className="flex gap-2 text-foreground/90"
                        >
                          <span className={cn("font-semibold", accentClass)}>•</span>
                          <span>{question}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Positioning prompt */}
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    <label className="block text-sm font-medium text-foreground">
                      {dimension.positioningPrompt}
                    </label>
                    <Textarea
                      value={responses[dimension.archetype] || ''}
                      onChange={(e) => handleResponseChange(dimension.archetype, e.target.value)}
                      placeholder="Escreva livremente como você se percebe nessa dimensão..."
                      className="min-h-[120px] bg-background/50 border-border/50"
                    />
                    <Button
                      onClick={() => handleComplete(dimension.archetype, index)}
                      disabled={!responses[dimension.archetype]?.trim()}
                      className="w-full bg-gold hover:bg-gold/90 text-background"
                    >
                      {isCompleted ? 'Atualizar' : 'Concluir esta dimensão'}
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* All completed message */}
      {completedDimensions.size === dimensions.length && dimensions.length > 0 && (
        <div className="text-center p-6 bg-gold/10 border border-gold/20 rounded-lg animate-fade-in">
          <Sparkles className="w-8 h-8 text-gold mx-auto mb-3" />
          <p className="text-lg font-medium text-foreground">
            Você percorreu todas as dimensões arquetípicas.
          </p>
          <p className="text-muted-foreground mt-1">
            Continue para receber sua leitura narrativa.
          </p>
        </div>
      )}
    </div>
  );
}
