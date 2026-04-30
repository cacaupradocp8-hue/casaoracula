import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Sparkles, Lock } from 'lucide-react';
import type { PontoRota } from '@/hooks/useRotaOracular';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  pontos: PontoRota[];
  pontoAtual: PontoRota | undefined;
  concluirPonto?: (id: string) => void;
  isConcluindo?: boolean;
}

export function RotaEstrada({ pontos, pontoAtual, concluirPonto, isConcluindo }: Props) {
  const navigate = useNavigate();

  if (pontos.length === 0) return null;

  return (
    <div className="relative py-20 md:py-32">
      {/* Title / Legend */}
      <div className="flex justify-center mb-20 md:mb-32">
        <div className="relative">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }} 
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-blue-500 blur-3xl rounded-full"
          />
          <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full border border-white/10 bg-[#000814]/80 backdrop-blur-md flex items-center justify-center text-center z-10 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
            <span className="text-[10px] md:text-xs font-serif italic font-light tracking-[0.2em] text-blue-400 uppercase leading-relaxed">
              Rota<br />Oracular
            </span>
          </div>
        </div>
      </div>

      {/* Road container */}
      <div className="relative flex flex-col items-center">
        {/* Signpost items */}
        <div className="relative w-full space-y-40 md:space-y-64">
          {pontos.map((ponto, i) => {
            const isAtual = ponto.id === pontoAtual?.id;
            const isConcluido = ponto.estado === 'completed';
            const isLocked = ponto.estado === 'locked';
            const isEsquerda = i % 2 === 0;

            return (
              <motion.div
                key={ponto.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`
                  relative flex items-center w-full gap-8 md:gap-24
                  ${isEsquerda ? 'flex-row' : 'flex-row-reverse'}
                `}
              >
                {/* Content Side */}
                <div className={`flex-1 ${isEsquerda ? 'text-right' : 'text-left'} space-y-4 md:space-y-6`}>
                  <div className={`space-y-1 ${isEsquerda ? 'flex flex-col items-end' : ''}`}>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-blue-400/60 font-bold">
                      {ponto.ref_tipo || ponto.tipo} • {isConcluido ? 'Atravessado' : isAtual ? 'Ponto Ativo' : 'Aguardando'}
                    </span>
                    <h3 className={`text-2xl md:text-4xl lg:text-5xl font-serif font-light tracking-tighter text-white/95 italic transition-opacity duration-700 ${isLocked ? 'opacity-20' : 'opacity-100'}`}>
                      {ponto.nome}
                    </h3>
                  </div>
                  
                  <p className="text-sm md:text-base text-white/30 max-w-sm inline-block font-light italic leading-relaxed">
                    {ponto.subtitulo || ponto.descricao || 'Uma etapa essencial da sua travessia para integrar novos saberes.'}
                  </p>

                  <div className={`flex items-center gap-4 ${isEsquerda ? 'justify-end' : 'justify-start'}`}>
                    {ponto.impacto_cidadela && ponto.impacto_cidadela.length > 0 && (
                      <div className="flex gap-2">
                        {ponto.impacto_cidadela.map((imp, idx) => (
                          <Badge key={idx} variant="outline" className="text-[8px] bg-white/[0.02] border-blue-900/40 text-blue-400/60 tracking-widest uppercase">
                            {imp.distrito}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {!isLocked && (
                    <div className={`pt-2 flex ${isEsquerda ? 'justify-end' : 'justify-start'}`}>
                      <Button 
                        variant="ghost" 
                        className="h-10 px-0 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400/80 hover:text-white hover:bg-transparent transition-colors group"
                        onClick={() => navigate(ponto.rota)}
                      >
                        {isConcluido ? 'Revisitar' : 'Iniciar agora'}
                        <Sparkles className="w-3.5 h-3.5 ml-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Node Side (The Road) */}
                <div className="relative z-20 flex-shrink-0">
                  <motion.button
                    whileHover={!isLocked ? { scale: 1.1 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    onClick={() => !isLocked && navigate(ponto.rota)}
                    className={`
                      relative w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center border transition-all duration-700
                      ${isConcluido 
                        ? 'bg-blue-600/5 border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.05)]' 
                        : isAtual 
                          ? 'bg-[#000814] border-white/40 scale-110 shadow-[0_0_50px_rgba(255,255,255,0.1)]' 
                          : 'bg-black/60 border-white/5 opacity-40'
                      }
                    `}
                  >
                    {isConcluido ? (
                      <Check className="w-6 h-6 md:w-8 md:h-8 text-blue-400/60 stroke-[1.5]" />
                    ) : isAtual ? (
                      <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse stroke-[1]" />
                    ) : (
                      <Lock className="w-5 h-5 md:w-6 md:h-6 text-white/10 stroke-[1.5]" />
                    )}

                    {/* Animated Pulse for Active Node */}
                    {isAtual && (
                      <motion.div
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border border-white/20"
                      />
                    )}
                  </motion.button>
                </div>

                {/* Empty Spacer Side */}
                <div className="flex-1 hidden md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

