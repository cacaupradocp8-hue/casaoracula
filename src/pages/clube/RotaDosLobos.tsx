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
          
          {/* SEÇÃO HERO ÚNICA E COESA */}
          <section className="relative overflow-hidden rounded-[40px] bg-[#030816] border border-white/5 shadow-2xl">
            <div className="flex flex-col lg:grid lg:grid-cols-[42%_58%] min-h-[600px] lg:min-h-[780px]">
              
              {/* CAMADA DE IMAGEM: Aparece no TOPO no Mobile, à DIREITA no Desktop */}
              <div className="relative w-full h-[450px] sm:h-[550px] lg:h-full order-1 lg:order-2 bg-[#030816]">
                <motion.img
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  src={rotaLobosBg}
                  className="absolute inset-0 w-full h-full object-contain lg:object-cover z-10"
                  style={{ objectPosition: 'center 20%' }}
                  alt="Lobo Imponente"
                />
                
                {/* Gradientes de Fusão para evitar recortes visíveis */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#030816] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#030816] lg:via-transparent lg:to-transparent lg:from-0% lg:via-35%" />

                
                {/* Brilho Atmosférico */}
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/5 blur-[120px] rounded-full z-0" />
              </div>

              {/* CAMADA DE CONTEÚDO: Abaixo da imagem no Mobile, à ESQUERDA no Desktop */}
              <div className="relative z-30 w-full p-8 md:p-12 lg:p-16 flex flex-col justify-center gap-10 order-2 lg:order-1 bg-[#030816]">
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
                  className="group relative flex items-center gap-6 p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl max-w-md hover:bg-black/60 transition-all cursor-pointer shadow-xl"
                  onClick={togglePlay}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full border border-gold/30 flex items-center justify-center bg-gold/5 group-hover:scale-110 transition-transform">
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-gold fill-gold" />
                      ) : (
                        <Play className="w-5 h-5 text-gold fill-gold ml-1" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-serif text-white group-hover:text-gold transition-colors">A Voz da Floresta</h3>
                    <p className="text-[11px] text-white/40 leading-tight">
                      Escute a abertura da travessia e prepare o campo.
                    </p>
                    <span className="text-gold text-[9px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                      {isPlaying ? 'Pausar' : 'Ouvir'} <ArrowRight className="w-3 h-3" />
                    </span>
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
                    className="rounded-full px-10 h-16 shadow-2xl text-base font-bold bg-[#E9A758] hover:bg-[#D48F3D] text-black border-none group w-full sm:w-fit"
                    onClick={irParaEstacao1}
                  >
                    <TreePine className="mr-3 w-6 h-6" />
                    Entrar na Clareira do Chamado
                    <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </div>

            </div>
          </section>

          {/* AS 6 ESTAÇÕES (Fluxo contínuo) */}
          <div className="mt-24 space-y-12">
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

        </ResponsiveContainer>
      </div>
    </AppLayout>
  );
}

