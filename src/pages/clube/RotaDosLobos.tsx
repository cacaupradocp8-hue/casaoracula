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
      <div className="relative bg-[#020617] text-white min-h-screen overflow-x-hidden font-sans selection:bg-gold/30">
        <ResponsiveContainer size="wide" className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full pt-8 pb-32">
          
          {/* HERO GRID CONTROLADO — IGUAL À REFERÊNCIA */}
          <section className="relative overflow-hidden rounded-[40px] bg-black/40 border border-white/5">
            <div className="flex flex-col lg:flex-row items-stretch">
              
              {/* Lado Esquerdo: Conteúdo (Hierarquia Vertical) */}
              <div className="relative z-20 w-full lg:w-[48%] p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-10">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-fit"
                  >
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold uppercase">Travessia Ativa</span>
                  </motion.div>

                  <div className="space-y-4">
                    <motion.h1
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tight"
                    >
                      Rota dos <br />
                      <span className="text-gold italic font-light">Lobos</span>
                    </motion.h1>

                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl md:text-2xl text-gold/80 font-serif italic max-w-md leading-relaxed"
                    >
                      "Onde a voz silenciada volta a encontrar o corpo."
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm md:text-base text-white/50 max-w-sm leading-relaxed"
                    >
                      Uma jornada em 6 estações para reconhecer silenciamentos, domesticações e o retorno do instinto.
                    </motion.p>
                  </div>
                </div>

                {/* Card de Áudio: A Voz da Floresta */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="group relative flex items-center gap-6 p-6 rounded-3xl bg-black/60 border border-white/10 backdrop-blur-xl max-w-md hover:bg-black/80 transition-all cursor-pointer shadow-2xl"
                  onClick={togglePlay}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:scale-110 transition-transform">
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-gold fill-gold" />
                      ) : (
                        <Play className="w-6 h-6 text-gold fill-gold ml-1" />
                      )}
                    </div>
                    <div className="absolute inset-[-4px] border border-gold/10 rounded-full animate-pulse" />
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-serif text-white group-hover:text-gold transition-colors">A Voz da Floresta</h3>
                    <p className="text-xs text-white/40 leading-relaxed">
                      Escute a abertura da travessia e prepare o campo para sua jornada.
                    </p>
                    <button className="text-gold text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2 hover:translate-x-1 transition-transform">
                      {isPlaying ? 'Pausar acolhimento' : 'Ouvir acolhimento'} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>

                {/* CTA Principal */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    variant="gold"
                    size="xl"
                    className="rounded-full px-10 h-16 shadow-2xl text-base font-bold bg-[#E9A758] hover:bg-[#D48F3D] text-black border-none"
                    onClick={irParaEstacao1}
                  >
                    <TreePine className="mr-3 w-6 h-6" />
                    Entrar na Clareira do Chamado
                    <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </motion.div>
              </div>

              {/* Lado Direito: Lobo Imponente (Fiel à Referência) */}
              <div className="relative w-full lg:w-[52%] min-h-[450px] lg:min-h-full overflow-hidden bg-black/20">
                <img
                  src={rotaLobosBg}
                  className="absolute inset-0 w-full h-full object-contain lg:object-right-top scale-[1.1] lg:scale-[1.3] pointer-events-none"
                  style={{ objectPosition: 'center center' }}
                  alt="Lobo em Destaque"
                />
                
                {/* Gradientes internos para simular a iluminação da referência */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent lg:hidden" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/40 via-transparent to-transparent hidden lg:block" />
                
                {/* Overlay quente para atmosfera */}
                <div className="absolute inset-0 bg-orange-900/5 mix-blend-color-dodge pointer-events-none" />
              </div>

            </div>
          </section>

          {/* AS 6 ESTAÇÕES (Horizontal conforme referência) */}
          <div className="mt-20 space-y-10">
            <div className="flex flex-col items-center md:items-start gap-4">
               <h2 className="text-xl md:text-2xl font-serif italic text-gold/60">
                As 6 estações da Rota dos Lobos
              </h2>
              <div className="h-px w-24 bg-gold/30" />
            </div>

            <div className="flex flex-nowrap md:flex-wrap items-start justify-center md:justify-between gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {displayEstacoes.map((estacao, i) => {
                const isLocked = estacao.status === 'locked';
                const isActive = i === 0 && !isLocked;

                return (
                  <motion.div
                    key={estacao.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + (i * 0.1) }}
                    className="flex flex-col items-center gap-4 min-w-[140px] group"
                  >
                    <button
                      disabled={isLocked}
                      onClick={() => !isLocked && estacao.primeiro_slug && navigate(`/clube/rota/${estacao.primeiro_slug}`)}
                      className={cn(
                        "relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500",
                        isActive 
                          ? "bg-gold/20 border-2 border-gold shadow-[0_0_30px_rgba(233,167,88,0.3)] scale-110" 
                          : "bg-white/5 border border-white/10 hover:bg-white/10"
                      )}
                    >
                      <div className={cn(
                        "absolute -top-1 -left-1 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-30",
                        isActive ? "bg-gold text-black" : "bg-white/10 text-white/40"
                      )}>
                        {i + 1}
                      </div>

                      {isActive ? (
                        <div className="relative z-20">
                          <TreePine className="w-10 h-10 text-gold" />
                          <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                        </div>
                      ) : (
                        <Lock className="w-7 h-7 text-white/20 z-20" />
                      )}

                      {isActive && (
                        <div className="absolute inset-0 rounded-full overflow-hidden z-10 opacity-60">
                          <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80" alt="" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                        </div>
                      )}
                    </button>

                    <span className={cn(
                      "text-[12px] text-center max-w-[120px] leading-tight font-medium uppercase tracking-wider",
                      isActive ? "text-white" : "text-white/30"
                    )}>
                      {estacao.titulo}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}
