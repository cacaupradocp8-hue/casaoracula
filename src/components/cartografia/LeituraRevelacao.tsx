import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import type { SaidaCliente } from '@/lib/cartografia/leituraComportamental';

interface LeituraRevelacaoProps {
  saida: SaidaCliente;
  /** Delay in ms before starting the reveal animation */
  delayInicio?: number;
  onAprofundar?: () => void;
  className?: string;
}

/**
 * Bloco reutilizável de leitura comportamental.
 * Exibe Força, Tensão e Convite com revelação progressiva.
 * Preparado para expansão futura (histórico, evolução, comparação).
 */
export function LeituraRevelacao({
  saida,
  delayInicio = 400,
  onAprofundar,
  className = '',
}: LeituraRevelacaoProps) {
  const [visivel, setVisivel] = useState<number>(0);

  useEffect(() => {
    // Progressive reveal: 0 → 1 → 2 → 3
    const timers = [
      setTimeout(() => setVisivel(1), delayInicio),
      setTimeout(() => setVisivel(2), delayInicio + 800),
      setTimeout(() => setVisivel(3), delayInicio + 1600),
    ];
    return () => timers.forEach(clearTimeout);
  }, [delayInicio]);

  const items = [
    {
      icon: '🔹',
      label: 'Força principal',
      text: saida.forca_principal,
    },
    {
      icon: '🔸',
      label: 'Tensão central',
      text: saida.tensao_central,
    },
    {
      icon: '🌱',
      label: 'Convite inicial',
      text: saida.convite_inicial,
    },
  ];

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Título fixo */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/60 mb-1">
          Leitura
        </p>
        <h3 className="text-base sm:text-lg font-display text-foreground">
          Como sua psique tende a se organizar
        </h3>
      </div>

      {/* 3 blocos visíveis simultaneamente, com reveal progressivo */}
      <div className="space-y-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`
              rounded-xl border border-border/15 bg-card/40 px-4 py-4
              transition-all duration-700 ease-out
              ${visivel > idx
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
              }
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-1">
                  {item.label}
                </p>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  {item.text}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      {visivel >= 3 && onAprofundar && (
        <div
          className="transition-all duration-700 ease-out pt-2"
          style={{
            opacity: visivel >= 3 ? 1 : 0,
            transform: visivel >= 3 ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <Button
            onClick={onAprofundar}
            variant="outline"
            className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Quero aprofundar minha travessia
          </Button>
        </div>
      )}
    </div>
  );
}
