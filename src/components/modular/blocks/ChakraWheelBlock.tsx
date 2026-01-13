import { useState, useEffect } from 'react';
import { ContentBlock, ChakraWheelContent, ChakraState, ChakraStatus } from '@/types/modular';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface ChakraWheelBlockProps {
  block: ContentBlock;
  onSave?: (data: ChakraState[]) => void;
}

const DEFAULT_CHAKRAS: ChakraState[] = [
  { nome: 'Coronário', cor: '#9333ea', status: 'equilibrado' },
  { nome: 'Frontal', cor: '#4f46e5', status: 'equilibrado' },
  { nome: 'Laríngeo', cor: '#0ea5e9', status: 'equilibrado' },
  { nome: 'Cardíaco', cor: '#22c55e', status: 'equilibrado' },
  { nome: 'Plexo Solar', cor: '#eab308', status: 'equilibrado' },
  { nome: 'Sacral', cor: '#f97316', status: 'equilibrado' },
  { nome: 'Raiz', cor: '#ef4444', status: 'equilibrado' },
];

const STATUS_OPTIONS: { value: ChakraStatus; label: string; color: string }[] = [
  { value: 'equilibrado', label: 'Equilibrado', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'bloqueado', label: 'Bloqueado', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  { value: 'hiperativo', label: 'Hiperativo', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'em_cura', label: 'Em Cura', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
];

export function ChakraWheelBlock({ block, onSave }: ChakraWheelBlockProps) {
  const content = block.content as ChakraWheelContent;
  const [chakras, setChakras] = useState<ChakraState[]>(content.chakras || DEFAULT_CHAKRAS);
  const [selectedChakra, setSelectedChakra] = useState<number | null>(null);

  const updateChakra = (index: number, updates: Partial<ChakraState>) => {
    setChakras(prev => prev.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  const getStatusColor = (status: ChakraStatus) => {
    return STATUS_OPTIONS.find(s => s.value === status)?.color || '';
  };

  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 via-green-500 to-red-500" />
          {block.titulo || 'Roda de Chakras'}
        </CardTitle>
        {block.descricao && (
          <p className="text-sm text-muted-foreground">{block.descricao}</p>
        )}
      </CardHeader>
      <CardContent>
        {/* Chakra Wheel Visualization */}
        <div className="flex justify-center mb-8">
          <div className="relative w-64 h-80">
            {chakras.map((chakra, index) => {
              const yPos = index * 40 + 10;
              const isSelected = selectedChakra === index;
              const size = isSelected ? 48 : 40;
              
              return (
                <button
                  key={chakra.nome}
                  className={cn(
                    "absolute left-1/2 -translate-x-1/2 rounded-full transition-all duration-300",
                    "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gold/50",
                    isSelected && "ring-2 ring-gold scale-110",
                    chakra.status === 'bloqueado' && "opacity-50",
                    chakra.status === 'hiperativo' && "animate-pulse"
                  )}
                  style={{
                    top: yPos,
                    width: size,
                    height: size,
                    backgroundColor: chakra.cor,
                    boxShadow: `0 0 ${isSelected ? 20 : 10}px ${chakra.cor}40`,
                  }}
                  onClick={() => setSelectedChakra(isSelected ? null : index)}
                  title={chakra.nome}
                >
                  {chakra.status === 'em_cura' && (
                    <span className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chakra Details */}
        <div className="space-y-4">
          {chakras.map((chakra, index) => (
            <div
              key={chakra.nome}
              className={cn(
                "p-4 rounded-lg border transition-all",
                selectedChakra === index 
                  ? "border-gold/50 bg-gold/5" 
                  : "border-border/30 bg-background/50"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: chakra.cor }}
                  />
                  <span className="font-medium">{chakra.nome}</span>
                </div>
                <Select
                  value={chakra.status}
                  onValueChange={(value: ChakraStatus) => updateChakra(index, { status: value })}
                >
                  <SelectTrigger className="w-36 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <Badge className={cn("text-xs", option.color)}>
                          {option.label}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {content.showObservations && (
                <Textarea
                  placeholder="Observações sobre este chakra..."
                  value={chakra.observacao || ''}
                  onChange={(e) => updateChakra(index, { observacao: e.target.value })}
                  className="mt-2 text-sm bg-background/50 min-h-[60px]"
                />
              )}
            </div>
          ))}
        </div>

        {content.saveToRegistros && onSave && (
          <div className="mt-6 flex justify-end">
            <Button onClick={() => onSave(chakras)} className="bg-gold hover:bg-gold/90 text-background">
              Salvar Leitura
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
