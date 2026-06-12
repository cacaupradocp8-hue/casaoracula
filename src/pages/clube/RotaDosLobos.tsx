import React from 'react'; // REBUILD_FORCE_V2
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TreePine, Play, Pause, Lock, Ghost, Compass } from 'lucide-react';
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
                  src="/lobo-fundo-800.webp"
                  srcSet="/lobo-fundo-800.webp 800w, /lobo-fundo-1600.webp 1600w"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Rota dos Lobos"
                  width={800}
                  height={1000}
                  fetchPriority="high"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ willChange: 'transform' }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0B] to-[#020617] -z-10" />
                
                {/* Overlays de Gradiente e Blur para Fusão Perfeita */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#020617]" />
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent" />
                
                {/* Camada Extra para Esconder Linha Final da Imagem com sombra suave */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#020617] to-transparent z-[5]" />

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
              <div className="px-6 pb-10 space-y-8 bg-[#020617]">
                {/* CTA Principal Mobile */}
                <button
                  type="button"
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold text-[13px] font-bold uppercase tracking-widest text-[#08090B] shadow-[0_12px_24px_rgba(212,175,55,0.2)] transition-all active:scale-[0.97] hover:bg-gold/90"
                  onClick={irParaEstacao1}
                >
                  <TreePine className="h-4 w-4" />
                  <span>Entrar na Clareira</span>
                </button>

                {/* Obra Regente Mobile - Movida para baixo do CTA na próxima dobra */}
                <div className="relative group overflow-hidden rounded-2xl border border-gold/20 bg-midnight/40 p-5 flex items-center gap-4">
                  <div className="w-16 h-24 shrink-0 shadow-lg rounded border border-white/10 overflow-hidden">
                    <img 
                      src="/capa-mulheres-lobos.webp" 
                      alt="Mulheres que Correm com os Lobos" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-[8px] tracking-[0.3em] uppercase text-gold font-bold">Obra Regente</p>
                    <h3 className="text-sm font-serif text-white leading-tight">Mulheres que Correm com os Lobos</h3>
                    <button 
                      onClick={irParaEstacao1}
                      className="text-[9px] text-gold uppercase tracking-widest font-bold flex items-center gap-1 mt-2 text-left"
                    >
                      Ver Áudio de Abertura
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Cartografia da Loba - Quick View Mobile */}
                <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-gold" />
                      <span className="text-[10px] text-gold font-bold uppercase tracking-widest">Cartografia da Loba</span>
                    </div>
                    <span className="text-[10px] text-white/40">Progresso: 16%</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] text-white/60">Ferramenta: <span className="text-white">Mapa do Instinto Soterrado</span></p>
                    <p className="text-[11px] text-white/60">Impacto: <span className="text-white">Portão da Chegada</span></p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate('/cidadela')}
                    className="w-full h-8 text-[10px] uppercase tracking-widest text-gold hover:bg-gold/10 border border-gold/20"
                  >
                    Ver reflexo na CidadELA
                  </Button>
                </div>
              </div>
            </div>

            {/* DESKTOP LAYOUT (Ajustado para segunda dobra e hierarquia visual) */}
            <div className="hidden md:grid md:grid-cols-2 min-h-[680px]">
              {/* Coluna Esquerda: Conteúdo */}
              <div className="relative z-20 flex flex-col justify-center p-14 lg:p-20">
                <div className="max-w-xl space-y-12">
                  <div className="space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm w-fit">
                      <span className="text-xs font-bold tracking-[0.3em] text-gold uppercase">Travessia Ativa</span>
                    </div>

                    <h1 className="text-6xl lg:text-8xl font-serif text-white leading-[0.9] tracking-tight">
                      Rota dos <br />
                      <span className="text-gold italic font-light">Lobos</span>
                    </h1>

                    <div className="space-y-4">
                      <p className="text-2xl text-gold/90 font-serif italic leading-tight border-l-2 border-gold/30 pl-6">
                        "Onde a voz silenciada volta a encontrar o corpo."
                      </p>
                      <p className="text-base text-white/60 leading-relaxed max-w-sm">
                        Uma jornada profunda em 6 estações para reconhecer silenciamentos e despertar o instinto selvagem.
                      </p>
                    </div>
                  </div>

                  <div className="pt-8">
                    <Button
                      variant="gold"
                      className="w-full sm:w-fit px-12 rounded-full h-16 text-base font-bold bg-gold hover:bg-gold/90 text-[#08090B] border border-white/20 group shadow-[0_0_30px_rgba(212,175,55,0.25)] transition-all active:scale-95 uppercase tracking-widest"
                      onClick={irParaEstacao1}
                    >
                      <TreePine className="mr-3 w-6 h-6 flex-shrink-0" />
                      <span>Entrar na Clareira</span>
                      <ArrowRight className="ml-3 w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Imagem Desktop (Hero) */}
              <div className="relative flex items-center justify-center bg-[#0A0A0B] min-h-full overflow-hidden">
                <img 
                  src="/lobo-fundo-1600.webp" 
                  srcSet="/lobo-fundo-800.webp 800w, /lobo-fundo-1600.webp 1600w"
                  sizes="50vw"
                  alt="Lobo da Rota dos Lobos" 
                  width={1600}
                  height={2000}
                  fetchPriority="high"
                  decoding="async"
                  loading="eager"
                  className="w-full h-full object-cover object-center lg:object-right"
                  style={{ willChange: 'transform' }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#0A0A0B]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </section>

          {/* SEGUNDA DOBRA DESKTOP: Obra Regente e Cartografia Agrupados */}
          <section className="hidden md:grid md:grid-cols-2 gap-12 pt-12 items-start">
            {/* Obra Regente Desktop */}
            <div className="relative group overflow-hidden rounded-[40px] border border-gold/20 bg-midnight/40 p-10 flex items-center gap-10">
              <div className="w-32 h-48 shrink-0 shadow-[0_20px_50px_rgba(0,0,0,0.6)] rounded-xl border border-white/10 overflow-hidden group-hover:rotate-2 transition-transform duration-500">
                <img 
                  src="/capa-mulheres-lobos.webp" 
                  alt="Mulheres que Correm com os Lobos" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold/40" />
                  <p className="text-xs tracking-[0.4em] uppercase text-gold font-bold">Obra Regente</p>
                </div>
                <h3 className="text-3xl font-serif text-white leading-tight">Mulheres que Correm com os Lobos</h3>
                <p className="text-white/50 text-sm font-serif italic leading-relaxed">"Dentro de toda mulher existe uma vida secreta, uma força poderosa feita de bons instintos e criatividade..."</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={irParaEstacao1}
                  className="h-10 text-xs uppercase tracking-widest text-gold hover:bg-gold/10 p-0 flex items-center gap-2 group/btn"
                >
                  Ver Áudio de Abertura
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Cartografia da Loba Desktop */}
            <div className="p-10 rounded-[40px] bg-gold/5 border border-gold/10 space-y-8 h-full flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-gold/10 border border-gold/20">
                    <Compass className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <span className="text-sm text-gold font-bold uppercase tracking-[0.3em] block">Cartografia da Loba</span>
                    <span className="text-xs text-white/30 italic">O reflexo do seu progresso</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-serif text-gold">16%</span>
                  <p className="text-[10px] text-white/20 uppercase tracking-widest">Concluído</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8 py-4 border-y border-white/5">
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Ferramenta Ativa</p>
                  <p className="text-base text-white font-serif italic">Mapa do Instinto</p>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/cidadela')}
                variant="outline"
                className="w-full h-14 border-gold/20 text-gold hover:bg-gold/10 text-xs uppercase tracking-[0.2em] font-bold rounded-full transition-all"
              >
                Ver reflexo na CidadELA Interior
              </Button>
            </div>
          </section>


          {/* AS 6 ESTAÇÕES (Fluxo contínuo) */}
          <div className="space-y-12 pt-8 pb-32">
            <div className="flex flex-col items-center md:items-start gap-3">
               <h2 className="text-2xl md:text-3xl font-serif italic text-gold/70 tracking-wide">
                As 6 estações da Rota dos Lobos
              </h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-gold/60 to-transparent" />
            </div>

            <div className="grid grid-cols-3 md:flex md:flex-wrap items-start justify-items-center md:justify-items-start md:justify-between gap-x-2 gap-y-6 md:gap-6 overflow-visible pb-8">
              {displayEstacoes.map((estacao, i) => {
                const isLocked = estacao.status === 'locked' && i !== 0;
                const isActive = (i === 0) || (estacao.banner_url !== null) || (estacao.status && estacao.status !== 'locked');
                const slug = slugsReais[i];

                return (
                  <motion.div
                    key={estacao.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="flex w-full min-w-0 flex-col items-center gap-2 md:gap-3 md:min-w-[130px] md:w-auto group"
                  >
                    <button
                      disabled={isLocked}
                      onClick={() => !isLocked && navigate(`/clube/rota/${slug}`)}
                      className={cn(
                        "relative w-12 h-12 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-700",
                        isActive 
                          ? "bg-gold/10 border border-gold/80 shadow-[0_0_12px_rgba(233,167,88,0.16)] md:scale-110" 
                          : "bg-white/[0.03] border border-white/10 hover:border-gold/30",
                        isLocked ? "cursor-not-allowed opacity-40 grayscale" : "cursor-pointer"
                      )}
                    >
                      <div className={cn(
                        "absolute -top-0.5 -left-0.5 w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center text-[7px] md:text-[10px] font-bold z-30 shadow-lg",
                        isActive ? "bg-gold text-black" : "bg-white/10 text-white/40 border border-white/5"
                      )}>
                        {i + 1}
                      </div>

                      {isActive ? (
                        <div className="relative z-20">
                          <TreePine className="w-4 h-4 md:w-8 md:h-8 text-gold" />
                          <div className="absolute inset-0 bg-gold/20 blur-lg rounded-full" />
                        </div>
                      ) : (
                        <Lock className={cn("w-3 h-3 md:w-5 md:h-5 z-20", isLocked ? "text-white/20" : "text-gold/40")} />
                      )}

                        <div className="absolute inset-0 rounded-full overflow-hidden z-10 opacity-100">
                          <img 
                            src={estacao.banner_url || "https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781036067341-z7r4tq.jpg"} 
                            alt="" 
                            className="w-full h-full object-cover scale-110" 
                          />
                        </div>
                    </button>

                    <span className={cn(
                      "text-[8px] md:text-[10px] text-center w-full max-w-[86px] md:max-w-[100px] leading-[1.15] font-medium uppercase tracking-[0.02em] break-words px-0.5",
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
