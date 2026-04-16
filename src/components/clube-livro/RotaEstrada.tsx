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
    <div className="relative py-8">
      {/* Title */}
      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 font-medium mb-10 text-center">
        Sua estrada
      </p>

      {/* Route 66 badge */}
      <div className="flex justify-center mb-8">
        <div className="w-14 h-14 rounded-full border-2 border-primary/40 bg-card/60 flex items-center justify-center">
          <span className="text-[9px] font-bold uppercase tracking-wider text-primary/70 leading-none text-center">
            Rota<br />Oracular
          </span>
        </div>
      </div>

      {/* Road container */}
      <div className="relative flex flex-col items-center">
        {/* Asphalt road — central vertical line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[52px] rounded-full"
          style={{
            background: 'linear-gradient(180deg, hsl(var(--muted)/0.25) 0%, hsl(var(--muted)/0.1) 100%)',
            border: '1px solid hsl(var(--border)/0.15)',
          }}
        />
        {/* Dashed center line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]"
          style={{
            backgroundImage: 'repeating-linear-gradient(180deg, hsl(var(--primary)/0.3) 0px, hsl(var(--primary)/0.3) 12px, transparent 12px, transparent 28px)',
          }}
        />

        {/* Signpost items */}
        <div className="relative w-full flex flex-col gap-10">
          {pontos.map((ponto, i) => {
            const isAtual = ponto.id === pontoAtual?.id;
            const isConcluido = ponto.estado === 'completed';
            const isLocked = ponto.estado === 'locked';
            const isEsquerda = i % 2 === 0;

            return (
              <motion.div
                key={ponto.id}
                initial={{ opacity: 0, x: isEsquerda ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 120 }}
                className={`
                  relative flex items-center w-full
                  ${isEsquerda ? 'flex-row' : 'flex-row-reverse'}
                `}
              >
                {/* Signpost plaque */}
                <motion.button
                  whileHover={!isLocked ? { scale: 1.03 } : {}}
                  whileTap={!isLocked ? { scale: 0.97 } : {}}
                  onClick={() => {
                    if (ponto.rota.startsWith('#')) return;
                    if (ponto.estado !== 'locked') navigate(ponto.rota);
                  }}
                  className={`
                    relative flex-1 max-w-[calc(50%-40px)]
                    ${isLocked ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <div
                    className={`
                      relative px-4 py-3 rounded-lg border transition-all
                      ${isAtual
                        ? 'bg-primary/10 border-primary/40 shadow-[0_0_24px_hsl(var(--primary)/0.15)]'
                        : isConcluido
                          ? 'bg-card/40 border-primary/20'
                          : 'bg-card/20 border-border/15 opacity-50'
                      }
                    `}
                  >
                    {/* Plaque nail / connector to road */}
                    <div
                      className={`
                        absolute top-1/2 -translate-y-1/2 w-6 h-[2px]
                        ${isEsquerda ? '-right-6' : '-left-6'}
                        ${isConcluido ? 'bg-primary/30' : isAtual ? 'bg-primary/50' : 'bg-border/20'}
                      `}
                    />

                    {/* Content */}
                    <div className={`flex items-center gap-2.5 ${isEsquerda ? '' : 'flex-row-reverse text-right'}`}>
                      {/* Icon */}
                      <div className={`
                        w-9 h-9 rounded-md flex items-center justify-center shrink-0 text-base
                        ${isConcluido
                          ? 'bg-primary/20'
                          : isAtual
                            ? 'bg-primary/15 ring-1 ring-primary/30'
                            : 'bg-muted/20'
                        }
                      `}>
                        {isConcluido ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <span>{ponto.icone}</span>
                        )}
                      </div>

                      {/* Label */}
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold truncate ${
                          isAtual ? 'text-primary' : isConcluido ? 'text-foreground/80' : 'text-muted-foreground/50'
                        }`}>
                          {ponto.nome}
                        </p>
                        <p className={`text-[9px] uppercase tracking-[0.15em] font-medium ${
                          isAtual ? 'text-primary/60' : 'text-muted-foreground/30'
                        }`}>
                          {ponto.estadoUI}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.button>

                {/* Road node (center) */}
                <div className="relative z-10 w-[52px] flex items-center justify-center shrink-0">
                  <div className={`
                    w-5 h-5 rounded-full border-2 transition-all
                    ${isConcluido
                      ? 'bg-primary/80 border-primary/60'
                      : isAtual
                        ? 'bg-primary/40 border-primary/80 shadow-[0_0_16px_hsl(var(--primary)/0.4)]'
                        : 'bg-card/40 border-border/25'
                    }
                  `}>
                    {isAtual && (
                      <motion.div
                        animate={{ scale: [1, 1.6, 1], opacity: [0.8, 0.2, 0.8] }}
                        transition={{ repeat: Infinity, duration: 2.5 }}
                        className="w-full h-full rounded-full bg-primary/50"
                      />
                    )}
                  </div>
                </div>

                {/* Spacer for the other side */}
                <div className="flex-1 max-w-[calc(50%-40px)]" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
