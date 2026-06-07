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
    navigate('/clube/rota/clareira-do-chamado');
  };

  const irParaSlug = (slug: string | undefined) => {
    if (slug) navigate(`/clube/rota/${slug}`);
  };

  const slugsReais = [
    'clareira-do-chamado',
    'casa-da-boa-menina',
    'porta-proibida',
    'casa-da-boneca-interior',
    'margem-dos-ossos',
    'territorio-da-loba'
  ];

  return (
    <AppLayout>
      <div className="bg-[#020617] text-white min-h-screen overflow-x-hidden font-sans selection:bg-gold/30 selection:text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-12 pb-20">
          
          {/* HERO - LAYOUT MOBILE E DESKTOP DISTINTOS */}
          <section className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-[#0A0A0B] border border-white/10 shadow-2xl">
            
            {/* MOBILE LAYOUT (Inspirado no modelo visual aprovado) */}
            <div className="md:hidden flex flex-col bg-[#020617] rounded-[32px] overflow-hidden border border-white/10">
              {/* Hero com Imagem de Fundo e Texto Sobreposto */}
              <div className="relative min-h-[520px] overflow-hidden">
                <img
                  src={rotaLobosBg}
                  alt="Rota dos Lobos"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                
                {/* Overlays de Gradiente e Blur para Fusão Perfeita */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-[#020617]" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020617] via-[#020617]/90 to-transparent backdrop-blur-[2px]" />
                
                {/* Camada Extra para Esconder Linha Final da Imagem */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#020617] blur-xl opacity-60 translate-y-6" />

                <div className="relative z-10 flex min-h-[520px] flex-col justify-end p-6 pb-4">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm w-fit">
                      <span className="text-[8px] font-bold tracking-[0.2em] text-gold uppercase">Travessia Ativa</span>
                    </div>

                    <h1 className="text-4xl font-serif text-white leading-[0.9] tracking-tight">
                      Rota dos <br />
                      <span className="text-gold italic font-light">Lobos</span>
                    </h1>

                    <div className="space-y-3">
                      <p className="text-sm text-gold/90 font-serif italic border-l-2 border-gold/30 pl-4">
                        "Onde a voz silenciada volta a encontrar o corpo."
                      </p>
                      <p className="text-[11px] text-white/60 leading-relaxed max-w-[280px]">
                        Uma jornada profunda em 6 estações para reconhecer silenciamentos e despertar o instinto selvagem.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botões e Ações Abaixo da Imagem */}
              <div className="px-6 pb-12 space-y-6 bg-[#020617]">
                {/* CTA Principal Mobile */}
                <Button
                  variant="gold"
                  className="w-full h-11 text-sm font-bold bg-[#E9A758] hover:bg-[#D48F3D] text-black border-none rounded-full shadow-[0_0_20px_rgba(233,167,88,0.2)] transition-all active:scale-95 max-w-[340px]"
                  onClick={irParaEstacao1}
                >
                  <TreePine className="mr-2 w-4 h-4" />
                  Entrar na Clareira do Chamado
                </Button>

                {/* Botão de Áudio Estilo Link Premium */}
                <div 
                  className="flex items-center gap-2 cursor-pointer group w-fit"
                  onClick={togglePlay}
                >
                  <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10 flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                    {isPlaying ? <Pause className="w-3 h-3 text-gold fill-gold" /> : <Play className="w-3 h-3 text-gold fill-gold ml-0.5" />}
                  </div>
                  <div className="flex flex-col -space-y-0.5">
                    <span className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-medium">A Voz da Floresta</span>
                    <span className="text-xs text-gold font-semibold uppercase tracking-wider flex items-center">
                      Ouvir Acolhimento
                      <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP LAYOUT (Aprovado anteriormente - Mantido intacto) */}
            <div className="hidden md:grid md:grid-cols-2 min-h-[680px]">
              {/* Coluna Esquerda: Conteúdo */}
              <div className="relative z-20 flex flex-col justify-start p-14 lg:p-20 pt-16">
                <div className="max-w-xl space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm w-fit">
                      <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Travessia Ativa</span>
                    </div>

                    <h1 className="text-6xl lg:text-7xl font-serif text-white leading-[0.9] tracking-tight">
                      Rota dos <br />
                      <span className="text-gold italic font-light">Lobos</span>
                    </h1>

                    <div className="space-y-3">
                      <p className="text-xl text-gold/90 font-serif italic leading-tight border-l-2 border-gold/30 pl-4">
                        "Onde a voz silenciada volta a encontrar o corpo."
                      </p>
                      <p className="text-sm text-white/60 leading-relaxed max-w-sm">
                        Uma jornada profunda em 6 estações para reconhecer silenciamentos e despertar o instinto selvagem.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div 
                      className="flex items-center gap-2 cursor-pointer group w-fit"
                      onClick={togglePlay}
                    >
                      <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10 flex-shrink-0 group-hover:bg-gold/20 transition-colors">
                        {isPlaying ? <Pause className="w-3 h-3 text-gold fill-gold" /> : <Play className="w-3 h-3 text-gold fill-gold ml-0.5" />}
                      </div>
                      <div className="flex flex-col -space-y-0.5">
                        <span className="text-[10px] text-white/50 uppercase tracking-[0.1em] font-medium">A Voz da Floresta</span>
                        <span className="text-xs text-gold font-semibold uppercase tracking-wider flex items-center">
                          Ouvir Acolhimento
                          <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="gold"
                      className="w-auto px-5 rounded-full h-11 text-sm font-bold bg-[#E9A758] hover:bg-[#D48F3D] text-black border-none group shadow-[0_0_40px_rgba(233,167,88,0.3)] transition-all active:scale-95 max-w-[340px]"
                      onClick={irParaEstacao1}
                    >
                      <TreePine className="mr-2 w-4 h-4 flex-shrink-0" />
                      <span>Entrar na Clareira do Chamado</span>
                      <ArrowRight className="ml-2 w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Imagem Desktop */}
              <div className="relative flex items-center justify-center bg-[#0A0A0B] min-h-full overflow-hidden">
                <img 
                  src={rotaLobosBg} 
                  alt="Lobo da Rota dos Lobos" 
                  className="w-full h-full object-contain object-right-bottom"
                />
              </div>
            </div>
          </section>

          {/* AS 6 ESTAÇÕES (Fluxo contínuo) */}
          <div className="space-y-10 pt-4 pb-32">
            <div className="flex flex-col items-center md:items-start gap-4">
               <h2 className="text-xl md:text-2xl font-serif italic text-gold/60 tracking-wide">
                As 6 estações da Rota dos Lobos
              </h2>
              <div className="h-px w-32 bg-gradient-to-r from-gold/50 to-transparent" />
            </div>

            <div className="flex flex-nowrap md:flex-wrap items-start justify-between gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide">
              {displayEstacoes.map((estacao, i) => {
                const isLocked = estacao.status === 'locked';
                const isActive = i === 0 && !isLocked;
                const slug = slugsReais[i];

                return (
                  <motion.div
                    key={estacao.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex flex-col items-center gap-2 md:gap-3 min-w-[100px] md:min-w-[130px] group"
                  >
                    <button
                      disabled={isLocked}
                      onClick={() => !isLocked && navigate(`/clube/rota/${slug}`)}
                      className={cn(
                        "relative w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-700",
                        isActive 
                          ? "bg-gold/10 border-2 border-gold shadow-[0_0_20px_rgba(233,167,88,0.2)] scale-110" 
                          : "bg-white/5 border border-white/10 hover:border-gold/30",
                        isLocked ? "cursor-not-allowed opacity-40 grayscale" : "cursor-pointer"
                      )}
                    >
                      <div className={cn(
                        "absolute -top-1 -left-1 w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[8px] md:text-[10px] font-bold z-30 shadow-lg",
                        isActive ? "bg-gold text-black" : "bg-white/10 text-white/40 border border-white/5"
                      )}>
                        {i + 1}
                      </div>

                      {isActive ? (
                        <div className="relative z-20">
                          <TreePine className="w-8 h-8 text-gold" />
                          <div className="absolute inset-0 bg-gold/20 blur-xl rounded-full" />
                        </div>
                      ) : (
                        <Lock className={cn("w-5 h-5 z-20", isLocked ? "text-white/20" : "text-gold/40")} />
                      )}

                      {isActive && (
                        <div className="absolute inset-0 rounded-full overflow-hidden z-10 opacity-30">
                          <img 
                            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80" 
                            alt="" 
                            className="w-full h-full object-cover scale-110" 
                          />
                        </div>
                      )}
                    </button>

                    <span className={cn(
                      "text-[10px] text-center max-w-[100px] leading-tight font-medium uppercase tracking-[0.05em]",
                      isActive ? "text-white" : isLocked ? "text-white/20" : "text-white/60"
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
