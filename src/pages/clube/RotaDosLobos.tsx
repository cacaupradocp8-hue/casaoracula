import React from 'react'; // REBUILD_FORCE_V2
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, TreePine, Play, Pause, Lock, Ghost, Compass } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Button } from '@/components/ui/button';
import { useTodasRotas, EstacaoCatalogo, EstacaoStatusUI } from '@/hooks/useTodasRotas';
import { useEffectivePortal } from '@/hooks/useEffectivePortal';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';
import rotaLobosBg from '@/assets/rota-dos-lobos-bg.png';
import clareiraCapa from '@/assets/clareira-do-chamado-capa.png.asset.json';

interface DisplayEstacao extends Partial<EstacaoCatalogo> {
  id: string;
  titulo: string;
  status: EstacaoStatusUI;
  numero: number;
  primeiro_slug?: string;
}

export default function RotaDosLobos() {
  const navigate = useNavigate();
  const { isAdmin } = useEffectivePortal();
  const { data: estacoes } = useTodasRotas({ isAdmin });
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
                  className="group relative inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-full border border-gold/40 bg-gold/[0.04] backdrop-blur-sm transition-all active:scale-[0.98] hover:border-gold/70 hover:shadow-[0_0_30px_-8px_rgba(212,175,55,0.5)]"
                  onClick={irParaEstacao1}
                >
                  <span className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <TreePine className="relative h-4 w-4 text-gold" />
                  <span className="relative text-[11px] font-bold uppercase tracking-[0.25em] text-gold">Entrar na Clareira</span>
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
                    <button
                      type="button"
                      onClick={irParaEstacao1}
                      className="group relative inline-flex items-center gap-3 px-12 py-4 rounded-full border border-gold/40 bg-gold/[0.04] backdrop-blur-sm overflow-hidden transition-all duration-500 active:scale-[0.98] hover:border-gold/70 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.55)]"
                    >
                      <span className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <TreePine className="relative w-4 h-4 text-gold" />
                      <span className="relative text-[12px] font-bold tracking-[0.3em] uppercase text-gold">Entrar na Clareira</span>
                      <ArrowRight className="relative w-4 h-4 text-gold opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
                    </button>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 pb-8">
              {displayEstacoes.map((estacao, i) => {
                const isLocked = !isAdmin && estacao.status === 'locked' && i !== 0;
                const slug = slugsReais[i];
                const imgSrc = slug === 'clareira-do-chamado'
                  ? clareiraCapa.url
                  : (estacao.banner_url || "https://pviznbfwtjqmpeiqqzk.supabase.co/storage/v1/object/public/content-images/galeria/1781036067341-z7r4tq.jpg");
                const numero = String(i + 1).padStart(2, '0');
                const roman = ['I','II','III','IV','V','VI'][i] || 'I';

                return (
                  <motion.div
                    key={estacao.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={!isLocked ? { y: -4 } : undefined}
                    onClick={() => !isLocked && navigate(`/clube/rota/${slug}`)}
                    className={cn(
                      "group relative w-full aspect-[4/5] rounded-2xl overflow-hidden border bg-[#070710] transition-all duration-500 flex flex-col",
                      isLocked
                        ? "border-white/5 grayscale pointer-events-none opacity-60"
                        : "border-white/10 hover:border-gold/40 cursor-pointer shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_60px_-20px_rgba(212,175,55,0.25)]"
                    )}
                  >
                    {/* Moldura interna */}
                    <div className="pointer-events-none absolute inset-3 rounded-xl border-[0.5px] border-white/10 group-hover:border-gold/30 transition-colors duration-500 z-20" />
                    <div className="pointer-events-none absolute top-5 left-5 w-3 h-3 border-t border-l border-gold/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />
                    <div className="pointer-events-none absolute bottom-5 right-5 w-3 h-3 border-b border-r border-gold/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

                    {/* Selo no topo */}
                    <div className="absolute top-0 inset-x-0 p-5 flex justify-between items-start z-10">
                      <span className="text-[9px] font-bold tracking-[0.4em] text-gold/70 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                        {roman} · Estação {numero}
                      </span>
                      {isLocked && <Lock className="w-3.5 h-3.5 text-white/40" />}
                    </div>

                    {/* Área da imagem — exibe a arte completa, incluindo texto */}
                    <div className="relative h-[70%] w-full overflow-hidden bg-[#070710] flex items-center justify-center">
                      <img
                        src={imgSrc}
                        alt=""
                        loading="lazy"
                        className="max-w-full max-h-full w-auto h-full object-contain object-center group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                      />
                      {/* Suave desvanecimento apenas na borda inferior, sem cobrir o texto da imagem */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-[#070710]" />
                    </div>

                    {/* Faixa do título — sem concorrer com a imagem */}
                    <div className="relative flex-1 px-6 pb-7 pt-2 flex flex-col items-center justify-center text-center bg-[#070710]">
                      <h3 className="font-serif text-lg md:text-xl leading-snug text-white/90 tracking-wide group-hover:text-gold transition-colors duration-500 line-clamp-2">
                        {estacao.titulo}
                      </h3>
                      <div className="mt-3 h-px w-8 bg-gold/50 group-hover:w-16 transition-all duration-500 ease-out" />
                      <span className="mt-3 text-[9px] tracking-[0.3em] uppercase font-bold text-gold/40 group-hover:text-gold/90 transition-colors duration-500">
                        {isLocked ? 'Selada' : 'Atravessar'}
                      </span>
                    </div>
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
