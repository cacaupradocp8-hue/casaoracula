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
          
          {/* HERO CINEMATOGRÁFICO - REFERÊNCIA REAL - SUBSTITUIÇÃO COMPLETA */}
          <section className="relative overflow-hidden rounded-[32px] md:rounded-[40px] bg-[#0A0A0B] border border-white/10 shadow-2xl min-h-fit md:min-h-[680px]">
            
            {/* Desktop Background: Lobo visível e dominante à direita */}
            <div 
              className="absolute inset-0 hidden md:block"
              style={{ 
                backgroundImage: `url(${rotaLobosBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            
            {/* Mobile: Imagem no topo do card com altura generosa (320px) */}
            <div className="md:hidden w-full h-[340px] relative overflow-hidden">
              <img 
                src={rotaLobosBg} 
                className="w-full h-full object-cover object-[center_30%]" 
                alt="Rota dos Lobos" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent" />
            </div>

            {/* Overlay Gradiente e Conteúdo Integrado */}
            <div className="relative z-10 flex flex-col justify-center h-full min-h-[inherit] md:bg-gradient-to-r md:from-black/95 md:via-black/70 md:to-transparent p-6 md:p-14 lg:p-20">
              
              <div className="max-w-xl space-y-10 pb-32 md:pb-0">
                {/* Badge e Título */}
                <div className="space-y-6">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm w-fit">
                    <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-gold uppercase">Travessia Ativa</span>
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif text-white leading-[0.85] tracking-tight">
                    Rota dos <br />
                    <span className="text-gold italic font-light">Lobos</span>
                  </h1>

                  <div className="space-y-4">
                    <p className="text-lg md:text-2xl text-gold/90 font-serif italic leading-tight border-l-2 border-gold/30 pl-4">
                      "Onde a voz silenciada volta a encontrar o corpo."
                    </p>
                    <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-sm">
                      Uma jornada profunda em 6 estações para reconhecer silenciamentos e despertar o instinto selvagem.
                    </p>
                  </div>
                </div>

                {/* Card de Áudio e CTA: Integrados no mesmo bloco visual */}
                <div className="space-y-6">
                  {/* Voz da Floresta */}
                  <div 
                    className="group flex items-center gap-5 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold/30 transition-all cursor-pointer backdrop-blur-md max-w-md"
                    onClick={togglePlay}
                  >
                    <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center bg-gold/10 flex-shrink-0 group-hover:scale-110 transition-transform">
                      {isPlaying ? <Pause className="w-5 h-5 text-gold fill-gold" /> : <Play className="w-5 h-5 text-gold fill-gold ml-1" />}
                    </div>
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <h3 className="text-base font-serif text-white tracking-wide">A Voz da Floresta</h3>
                      <p className="text-xs text-white/40 font-light italic">Sintonize com o chamado antes de começar.</p>
                    </div>
                  </div>

                  {/* CTA Principal */}
                  <Button
                    variant="gold"
                    size="xl"
                    className="w-full md:w-auto px-12 rounded-full h-16 text-base font-bold bg-[#E9A758] hover:bg-[#D48F3D] text-black border-none group shadow-[0_0_40px_rgba(233,167,88,0.3)] transition-all active:scale-95"
                    onClick={irParaEstacao1}
                  >
                    <TreePine className="mr-2 w-5 h-5" />
                    Entrar na Clareira do Chamado
                    <ArrowRight className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Button>
                </div>
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
                    transition={{ delay: 0.2 + (i * 0.1) }}
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
