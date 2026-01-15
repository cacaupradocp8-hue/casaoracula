// ============================================
// DIRECT READING MODE
// Professional mode to use archetypes without quiz
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SessionGuidancePanel } from './SessionGuidancePanel';
import { 
  Flower2, ChevronRight, Users, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Arquetipo {
  id: string;
  numero: number;
  nome: string;
  nome_en: string | null;
  essencia_simbolica: string;
  icone: string | null;
  cor_primaria: string | null;
  notas_leitura: string | null;
  transferencias_comuns: string | null;
  resistencias_tipicas: string | null;
  linguagem_evitar: string | null;
  linguagem_que_abre: string | null;
  cautelas_eticas: string | null;
}

interface DirectReadingModeProps {
  arquetipos: Arquetipo[];
  onSelectArchetype: (arq: Arquetipo) => void;
  selectedArchetype: Arquetipo | null;
}

export function DirectReadingMode({ 
  arquetipos, 
  onSelectArchetype, 
  selectedArchetype 
}: DirectReadingModeProps) {
  const [showGuidance, setShowGuidance] = useState(false);

  return (
    <div className="space-y-6">
      {/* Mode Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-purple-500/20">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="font-medium">Leitura Direta</h3>
            <p className="text-sm text-muted-foreground">
              Selecione um arquétipo para condução simbólica
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-500/50 text-purple-400">
          <Users className="w-3 h-3 mr-1" />
          Modo Profissional
        </Badge>
      </div>

      {/* Archetype Grid */}
      <div className="grid grid-cols-3 gap-3">
        {arquetipos.map(arq => (
          <button
            key={arq.id}
            onClick={() => {
              onSelectArchetype(arq);
              setShowGuidance(true);
            }}
            className={cn(
              "p-4 rounded-lg border transition-all text-center",
              selectedArchetype?.id === arq.id
                ? "border-gold bg-gold/10"
                : "border-border hover:border-gold/50 hover:bg-muted/30"
            )}
          >
            <div 
              className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2"
              style={{ 
                backgroundColor: `${arq.cor_primaria}20`,
                color: arq.cor_primaria || 'inherit'
              }}
            >
              <span className="text-lg font-bold">{arq.numero}</span>
            </div>
            <p className="text-sm font-medium truncate">{arq.nome}</p>
            <p className="text-xs text-muted-foreground truncate">{arq.nome_en}</p>
          </button>
        ))}
      </div>

      {/* Selected Archetype Details */}
      {selectedArchetype && showGuidance && (
        <div className="space-y-4">
          <Card className="glass">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${selectedArchetype.cor_primaria}20`,
                    color: selectedArchetype.cor_primaria || 'inherit'
                  }}
                >
                  <span className="text-xl font-bold">{selectedArchetype.numero}</span>
                </div>
                <div>
                  <CardTitle>{selectedArchetype.nome}</CardTitle>
                  <CardDescription>{selectedArchetype.nome_en}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm italic text-muted-foreground leading-relaxed">
                {selectedArchetype.essencia_simbolica}
              </p>
            </CardContent>
          </Card>

          {/* Session Guidance */}
          <SessionGuidancePanel arquetipo={selectedArchetype} />
        </div>
      )}

      {!selectedArchetype && (
        <Card className="glass border-dashed">
          <CardContent className="p-8 text-center">
            <Flower2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">
              Selecione um arquétipo acima para ver as orientações de condução
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
