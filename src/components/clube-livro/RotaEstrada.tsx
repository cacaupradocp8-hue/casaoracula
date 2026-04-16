import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import type { PontoRota } from '@/hooks/useRotaOracular';

interface Props {
  pontos: PontoRota[];
  pontoAtual: PontoRota | undefined;
}

export function RotaEstrada({ pontos, pontoAtual }: Props) {
  const navigate = useNavigate();

  if (pontos.length === 0) return null;

  return (
    <div className="relative py-6">
      {/* Title */}
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-8 text-center">
        Sua estrada
      </p>

      {/* Road line */}
      <div className="relative flex flex-col items-center gap-0">
        {pontos.map((ponto, i) => {
          const isAtual = ponto.id === pontoAtual?.id;
          const isConcluido = ponto.estado === 'completed';
          const isDepois = ponto.estado === 'locked' || ponto.estado === 'available';

          return (
            <div key={ponto.id} className="relative flex items-center w-full max-w-sm">
              {/* Vertical connector */}
              {i > 0 && (
                <div className="absolute left-[28px] -top-5 w-[2px] h-5"
                  style={{
                    background: isConcluido
                      ? 'hsl(var(--primary) / 0.5)'
                      : 'hsl(var(--border) / 0.2)',
                  }}
                />
              )}

              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  if (ponto.rota.startsWith('#')) return;
                  if (ponto.estado !== 'locked') navigate(ponto.rota);
                }}
                className={`
                  flex items-center gap-4 w-full p-3 rounded-xl transition-all text-left
                  ${isAtual
                    ? 'bg-primary/10 border border-primary/25'
                    : 'bg-transparent border border-transparent hover:bg-card/40'
                  }
                  ${isDepois && !isAtual ? 'opacity-40' : 'opacity-100'}
                `}
              >
                {/* Node */}
                <div className={`
                  w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0
                  text-lg transition-all
                  ${isConcluido
                    ? 'bg-primary/20 ring-1 ring-primary/30'
                    : isAtual
                      ? 'bg-primary/15 ring-2 ring-primary/50 shadow-[0_0_20px_hsl(var(--primary)/0.25)]'
                      : 'bg-card/30 ring-1 ring-border/20'
                  }
                `}>
                  {isConcluido ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <span>{ponto.icone}</span>
                  )}
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isAtual ? 'text-primary' : 'text-foreground'}`}>
                    {ponto.nome}
                  </p>
                  <p className={`text-[10px] uppercase tracking-wider ${
                    isAtual ? 'text-primary/70' : 'text-muted-foreground/50'
                  }`}>
                    {ponto.estadoUI}
                  </p>
                </div>

                {/* Current indicator */}
                {isAtual && (
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-2 h-2 rounded-full bg-primary shrink-0"
                  />
                )}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
