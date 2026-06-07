import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TreePine, Play, Pause, Lock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/button';
import { useTodasRotas, EstacaoCatalogo, EstacaoStatusUI } from '@/hooks/useTodasRotas';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';
import rotaLobosBg from '@/assets/rota-dos-lobos-bg.png';

interface DisplayEstacao extends Partial<EstacaoCatalogo> {
  id: string;
  titulo: string;
  status: EstacaoStatusUI;
  numero: number;
  primeiro_slug?: string;
}

export default function RotaDosLobos() {
  const navigate = useNavigate();
  const { data: estacoes } = useTodasRotas();
  const { getSetting } = useAppSettings();
  
  const audioUrl = getSetting('audio_acolhimento_rota_lobos', '1780702648962.mp3');
  const { isPlaying, togglePlay } = useAudioPlayer({ audioUrl });

  const estacoesAtivas = estacoes?.filter(e => e.ativa) || [];
  
  const totalEstacoes = 6;
  const displayEstacoes: DisplayEstacao[] = Array.from({ length: totalEstacoes }).map((_, i) => {
    const realEstacao = estacoesAtivas[i];
    if (realEstacao) return realEstacao;
    
    return {
      id: `placeholder-${i}`,
      titulo: i === 0 ? "Clareira do Chamado" : 
              i === 1 ? "Casa da Boa Menina" :
              i === 2 ? "Porta Proibida" :
              i === 3 ? "Casa da Boneca Interior" :
              i === 4 ? "Margem dos Ossos" : "Território da Loba",
      status: 'locked' as EstacaoStatusUI,
      numero: i + 1,
      primeiro_slug: undefined
    };
  });

  const irParaEstacao1 = () => {
    const firstSlug = estacoesAtivas[0]?.primeiro_slug;
    if (firstSlug) navigate(`/clube/rota/${firstSlug}`);
  };

  return (
    <AppLayout>
      <div className="bg-[#020617] text-white min-h-screen overflow-x-hidden font-sans selection:bg-gold/30 selection:text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-12">
          
          {/* HERO REFEITO - MODELO OBRIGATÓRIO */}
          <section className="relative overflow-hidden rounded-[32px] bg-[#0A0A0B] border border-white/5 shadow-2xl">
            <div className="flex flex-col lg:grid lg:grid-cols-[45%_55%]">
              
              {/* Direita: Imagem (Topo no mobile) */}
              <div className="relative w-full h-[160px] sm:h-[200px] lg:h-auto order-1 lg:order-2 bg-[#0A0A0B]">
                <img
                  src={rotaLobosBg}
                  className="w-full h-full object-cover lg:object-cover object-[center_20%]"
                  alt="Rota dos Lobos"
                />
                {/* Gradiente de fusão - Transição suave */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0A0A0B] lg:to-transparent lg:from-0% lg:via-20%" />
              </div>

              {/* Esquerda: Conteúdo */}
              <div className="p-6 md:p-8 lg:p-12 pb-20 lg:pb-12 flex flex-col justify-center gap-6 order-2 lg:order-1 relative z-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 border border-gold/20 w-fit">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Travessia Ativa</span>
                  </div>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white leading-tight lg:leading-[0.9]">
                    Rota dos <br />
                    <span className="text-gold italic font-light">Lobos</span>
                  </h1>

                  <p className="text-base md:text-xl text-gold/80 font-serif italic">
                    "Onde a voz silenciada volta a encontrar o corpo."
                  </p>

                  <p className="text-sm text-white/50 leading-relaxed max-w-sm">
                    Uma jornada em 6 estações para reconhecer silenciamentos, domesticações e o retorno do instinto.
                  </p>
                </div>

                {/* Card de Áudio: A Voz da Floresta */}
                <div 
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={togglePlay}
                >
                  <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 flex-shrink-0">
                    {isPlaying ? <Pause className="w-4 h-4 text-gold fill-gold" /> : <Play className="w-4 h-4 text-gold fill-gold ml-0.5" />}
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <h3 className="text-sm font-serif text-white truncate">A Voz da Floresta</h3>
                    <p className="text-[10px] text-white/40 truncate">Prepare o campo para a travessia.</p>
                  </div>
                </div>

                {/* CTA Principal */}
                <Button
                  variant="gold"
                  size="xl"
                  className="w-full rounded-full h-14 md:h-16 text-sm font-bold bg-[#E9A758] hover:bg-[#D48F3D] text-black border-none group whitespace-normal break-words shadow-xl"
                  onClick={irParaEstacao1}
                >
                  <TreePine className="mr-2 w-5 h-5" />
                  Entrar na Clareira do Chamado
                </Button>
              </div>
            </div>
          </section>

          {/* AS 6 ESTAÇÕES (Fluxo contínuo) */}
          <div className="space-y-10 pt-4 pb-20">
            <div className="flex flex-col items-center md:items-start gap-4">
               <h2 className="text-xl md:text-2xl font-serif italic text-gold/60 tracking-wide">
                As 6 estações da Rota dos Lobos
              </h2>
              <div className="h-px w-32 bg-gradient-to-r from-gold/50 to-transparent" />
            </div>

            <div className="flex flex-nowrap md:flex-wrap items-start justify-between gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {displayEstacoes.map((estacao, i) => {
                const isLocked = estacao.status === 'locked';
                const isActive = i === 0 && !isLocked;

                return (
                  <motion.div
                    key={estacao.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + (i * 0.1) }}
                    className="flex flex-col items-center gap-4 min-w-[140px] group"
                  >
                    <button
                      disabled={isLocked}
                      onClick={() => !isLocked && estacao.primeiro_slug && navigate(`/clube/rota/${estacao.primeiro_slug}`)}
                      className={cn(
                        "relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-700",
                        isActive 
                          ? "bg-gold/10 border-2 border-gold shadow-[0_0_40px_rgba(233,167,88,0.2)] scale-110" 
                          : "bg-white/5 border border-white/5 hover:border-white/20"
                      )}
                    >
                      <div className={cn(
                        "absolute -top-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-30 shadow-lg",
                        isActive ? "bg-gold text-black" : "bg-white/10 text-white/40 border border-white/5"
                      )}>
                        {i + 1}
                      </div>

                      {isActive ? (
                        <div className="relative z-20">
                          <TreePine className="w-10 h-10 text-gold" />
                          <div className="absolute inset-0 bg-gold/20 blur-2xl rounded-full" />
                        </div>
                      ) : (
                        <Lock className="w-6 h-6 text-white/10 z-20" />
                      )}

                      {isActive && (
                        <div className="absolute inset-0 rounded-full overflow-hidden z-10 opacity-40">
                          <img 
                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80" 
                            alt="" 
                            className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms]" 
                          />
                        </div>
                      )}
                    </button>

                    <span className={cn(
                      "text-[11px] text-center max-w-[120px] leading-tight font-medium uppercase tracking-[0.1em]",
                      isActive ? "text-white" : "text-white/20"
                    )}>
                      {estacao.titulo}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

