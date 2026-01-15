// ============================================
// JOURNEY SPIRAL — Circular visualization of phases
// ============================================

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Fase {
  id: string;
  numero: number;
  nome: string;
  subtitulo: string;
  cor_primaria: string;
}

interface FaseResposta {
  fase_numero: number;
  data_conclusao?: string | null;
}

interface JourneySpiralProps {
  fases: Fase[];
  currentFase: number;
  respostas: Record<number, FaseResposta>;
  onSelect: (numero: number) => void;
  selected: number;
  readOnly?: boolean;
}

export function JourneySpiral({ 
  fases, 
  currentFase, 
  respostas, 
  onSelect, 
  selected,
  readOnly = false 
}: JourneySpiralProps) {
  const size = 320;
  const center = size / 2;
  const baseRadius = 120;
  
  // Calculate positions in a spiral/circle
  const getPosition = (index: number, total: number) => {
    const angle = ((index / total) * 2 * Math.PI) - (Math.PI / 2); // Start from top
    const radius = baseRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  const isCompleted = (numero: number) => {
    return respostas[numero]?.data_conclusao != null;
  };

  const hasContent = (numero: number) => {
    return !!respostas[numero];
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Center element */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.1) 0%, transparent 70%)'
        }}
      >
        <div className="text-center">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Fase</p>
          <p className="text-3xl font-display text-primary">{selected}</p>
        </div>
      </div>

      {/* Connecting lines */}
      <svg 
        className="absolute inset-0 pointer-events-none" 
        width={size} 
        height={size}
      >
        {fases.map((fase, i) => {
          const pos1 = getPosition(i, fases.length);
          const pos2 = getPosition((i + 1) % fases.length, fases.length);
          return (
            <line
              key={`line-${i}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          );
        })}
        
        {/* Spiral to center */}
        {fases.map((fase, i) => {
          const pos = getPosition(i, fases.length);
          return (
            <line
              key={`center-line-${i}`}
              x1={pos.x}
              y1={pos.y}
              x2={center}
              y2={center}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.2"
            />
          );
        })}
      </svg>

      {/* Phase nodes */}
      {fases.map((fase, i) => {
        const pos = getPosition(i, fases.length);
        const isSelected = selected === fase.numero;
        const completed = isCompleted(fase.numero);
        const hasData = hasContent(fase.numero);
        
        return (
          <button
            key={fase.numero}
            onClick={() => !readOnly && onSelect(fase.numero)}
            disabled={readOnly}
            className={cn(
              "absolute w-12 h-12 rounded-full flex items-center justify-center",
              "transition-all duration-300 transform",
              "-translate-x-1/2 -translate-y-1/2",
              "border-2",
              isSelected && "scale-125 ring-4 ring-primary/30",
              !readOnly && "cursor-pointer hover:scale-110",
              readOnly && "cursor-default"
            )}
            style={{
              left: pos.x,
              top: pos.y,
              backgroundColor: isSelected || completed || hasData 
                ? `${fase.cor_primaria}20` 
                : 'hsl(var(--muted))',
              borderColor: isSelected 
                ? fase.cor_primaria 
                : completed 
                  ? fase.cor_primaria 
                  : hasData 
                    ? `${fase.cor_primaria}60`
                    : 'hsl(var(--border))',
              color: fase.cor_primaria,
            }}
            title={`${fase.nome} — ${fase.subtitulo}`}
          >
            {completed ? (
              <Check className="w-5 h-5" />
            ) : (
              <span className="text-sm font-bold">{fase.numero}</span>
            )}
          </button>
        );
      })}

      {/* Phase labels (visible on hover/selection) */}
      {fases.map((fase, i) => {
        const pos = getPosition(i, fases.length);
        const isSelected = selected === fase.numero;
        const labelOffset = 35;
        const angle = ((i / fases.length) * 2 * Math.PI) - (Math.PI / 2);
        const labelX = pos.x + labelOffset * Math.cos(angle);
        const labelY = pos.y + labelOffset * Math.sin(angle);
        
        if (!isSelected) return null;
        
        return (
          <div
            key={`label-${fase.numero}`}
            className="absolute text-center pointer-events-none z-10"
            style={{
              left: labelX,
              top: labelY,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <p 
              className="text-xs font-semibold whitespace-nowrap"
              style={{ color: fase.cor_primaria }}
            >
              {fase.nome}
            </p>
          </div>
        );
      })}
    </div>
  );
}
