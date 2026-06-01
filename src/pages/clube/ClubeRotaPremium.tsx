import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  ArrowRight,
  ChevronRight,
  Compass,
  Headphones,
  MessageSquare,
  Zap,
  Flower2,
  MapPin,
  DoorOpen,
  Layers,
  Layout,
  ShieldAlert,
  Sparkles,
  Star,
  Lock,
  Check,
  FlaskConical,
  BookOpen,
  Sword,
  Eye,
  AlertTriangle,
  Crosshair,
  Radar,
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRotaOracular } from '@/hooks/useRotaOracular';
import { cn } from '@/lib/utils';
import { Laboratorio8020Modal } from '@/components/clube/Laboratorio8020Modal';
import { useAllBooks } from '@/hooks/useBooks';
import { AudioRitualPlayer } from '@/components/clube/AudioRitualPlayer';
import { FerramentaOracularPlayer } from '@/components/clube/FerramentaOracularPlayer';
import { ClubeTravessiaProgress } from '@/components/clube/ClubeTravessiaProgress';
import { useClubeTravessiaProgress } from '@/hooks/useClubeTravessiaProgress';
import chamadoSelvagemHero from '@/assets/chamado-selvagem-hero.png';

/**
 * ClubeRotaPremium — Página de Rota em Modo Contenção (Etapa 283)
 * Limpeza total de ruídos técnicos, ocultação de blocos vazios e foco na terapeuta.
 */
export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, estacaoAtual, isLoading, marcarEmAndamento, concluirPonto } = useRotaOracular();
  const { data: allBooks = [] } = useAllBooks();
  
  const ponto = useMemo(() => pontos.find(p => p.slug === slug), [pontos, slug]);
  const isModoGuiado = 
    ponto?.slug === 'chamado-selvagem' || 
    ponto?.metadata?.portal?.numero === 1;

  // Uma travessia é considerada estruturada se tiver conteúdo real nos campos premium
  const isTravessiaEstruturada = Boolean(
    ponto?.metadata?.caso_simbolico ||
    ponto?.metadata?.jardim_psique ||
    ponto?.metadata?.jardim_oficio ||
    ponto?.metadata?.fechamento ||
    ponto?.metadata?.abertura_imersiva
  );
  
  const { steps } = useClubeTravessiaProgress(ponto, estacaoAtual?.id);

  const proximoPonto = useMemo(
    () => (ponto ? pontos.find(p => p.ordem > ponto.ordem) : null),
    [pontos, ponto]
  );

  const matchedBook = useMemo(() => {
    if (!estacaoAtual?.livro_titulo) return null;
    return allBooks.find(b => b.title.toLowerCase().includes(estacaoAtual.livro_titulo.toLowerCase()));
  }, [allBooks, estacaoAtual?.livro_titulo]);

  const [pergunta, setPergunta] = useState('');

  useEffect(() => {
    if (ponto && ponto.estado === 'available') {
      marcarEmAndamento.mutate(ponto.id);
    }
  }, [ponto?.id, ponto?.estado, marcarEmAndamento]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-midnight flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}>
          <Compass className="w-12 h-12 text-gold/40" />
        </motion.div>
      </div>
    );
  }

  if (!ponto) {
    return (
      <AppLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-display text-2xl text-foreground mb-4">Rota não encontrada</h2>
          <Button onClick={() => navigate('/clube')} variant="outline">Voltar às Rotas</Button>
        </div>
      </AppLayout>
    );
  }

  const audios = Array.isArray(ponto.metadata?.audios) 
      ? ponto.metadata.audios
          .map((a: any) => ({ ...a, url: a.audio_url || a.url }))
          .filter((a: any) => a.url && typeof a.url === 'string' && a.url.startsWith('http'))
      : [];

  const renderContent = (content: any) => {
    if (!content) return null;
    if (typeof content === 'string') return content;
    if (typeof content === 'object') {
      return content.text || content.content || content.value || content.relato || content.pergunta_principal || content.palavra || "";
    }
    return String(content);
  };

  const jardimPrompt = renderContent(ponto.jardim_prompt || ponto.metadata?.jardim_prompt);
  const simulacaoTexto = renderContent(ponto.cenario_treinamento || ponto.metadata?.simulacao_texto);

  const perguntasSugeridas: string[] = Array.isArray(ponto.metadata?.perguntas_sugeridas)
    ? ponto.metadata.perguntas_sugeridas.filter((p: any) => typeof p === 'string' && p.trim())
    : [];

  const temChatLivro = ponto.tipo === 'chat_livro' || perguntasSugeridas.length > 0;

  const cartografia = [
    { label: 'Onde você está', value: estacaoAtual?.titulo, icon: MapPin },
    { label: 'A Porta', value: ponto.porta, icon: DoorOpen },
    { label: 'O Campo', value: ponto.campo, icon: Layers },
    { label: 'A Torre', value: ponto.torre, icon: Layout },
    { label: 'O Labirinto', value: ponto.labirinto, icon: ShieldAlert },
  ].filter(c => c.value && typeof c.value === 'string' && c.value.trim());

  return (
    <AppLayout>
      <div className="relative bg-midnight text-foreground overflow-x-hidden min-h-screen">
        {/* Background Fix */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(206_60%_18%/0.6),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(206_70%_8%/0.9),transparent_70%)]" />
        </div>

        {/* HERO */}
        <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 z-10 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            {isModoGuiado ? (
              <img src={chamadoSelvagemHero} alt="" className="w-full h-full object-cover object-top" />
            ) : ponto.image_url ? (
              <img src={ponto.image_url} alt="" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
            ) : estacaoAtual?.banner_url ? (
              <img src={estacaoAtual.banner_url} alt="" className="w-full h-full object-cover opacity-20" />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/60 to-midnight" />
          </div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="relative z-10 text-center w-full max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-3">
                  <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
                  <span className="text-[10px] tracking-[0.4em] uppercase text-gold/60 font-medium">
                    {estacaoAtual?.livro_titulo || 'Estação Oracular'}
                  </span>
                  <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-display font-light leading-tight tracking-tighter text-4xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                  {ponto.nome}
                </span>
              </h1>
              {ponto.subtitulo && (
                <p className="font-serif italic text-lg md:text-2xl text-white/40 max-w-2xl mx-auto">
                  "{ponto.subtitulo}"
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-10">
              <Button
                size="lg"
                variant="gold"
                className="rounded-full px-12 h-16 shadow-glow"
                onClick={() => {
                  const targetId = isTravessiaEstruturada ? 'como-atravessar' : 'mapa-vivo';
                  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="w-4 h-4 fill-current mr-2" /> Iniciar Travessia
              </Button>
            </div>
          </motion.div>
        </section>

        {/* CONTENT */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 space-y-24 pb-24 pt-12">
          
          {/* Progress (Only for free-form traversal) */}
          <ClubeTravessiaProgress steps={steps} isHidden={isTravessiaEstruturada} className="mb-12" />

          {/* 1. COMO ATRAVESSAR (ESTRUTURADA) */}
          <Section id="como-atravessar" icon={Compass} kicker="A Jornada" titulo="A Travessia Guiada" isHidden={!isTravessiaEstruturada}>
            <div className="bg-white/[0.03] border border-gold/20 p-8 md:p-12 rounded-[2.5rem] text-center backdrop-blur-md">
              <p className="text-lg text-white/60 font-serif italic mb-12">Siga o caminho simbólico desenhado para esta estação.</p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {[
                  { icon: Headphones, label: 'Escuta', id: 'audio-travessia', show: audios.length > 0 },
                  { icon: BookOpen, label: 'Leitura', id: 'conteudo-estacao', show: Boolean(ponto.metadata?.abertura_imersiva || ponto.metadata?.abertura) },
                  { icon: Eye, label: 'Caso', id: 'caso-simbolico', show: Boolean(ponto.metadata?.caso_simbolico?.relato || ponto.metadata?.caso_espelho) },
                  { icon: Sword, label: 'Desafio', id: 'desafio-terapeuta', show: Boolean(ponto.metadata?.desafio_terapeuta) },
                  { icon: Sparkles, label: 'Revelação', id: 'revelacao-estacao', show: Boolean(ponto.metadata?.revelacao_estacao) },
                  { icon: Radar, label: 'Método', id: 'ferramenta-oracular', show: Boolean(ponto.metadata?.ferramenta_oracular?.enabled) },
                  { icon: Flower2, label: 'Psique', id: 'jardim-psique', show: Boolean(ponto.metadata?.jardim_psique) },
                  { icon: MapPin, label: 'Ofício', id: 'jardim-oficio', show: Boolean(ponto.metadata?.jardim_oficio) },
                  { icon: Check, label: 'Conclusão', id: 'fechamento-estacao', show: true }
                ].filter(s => s.show).map((step, idx) => (
                  <button key={idx} onClick={() => document.getElementById(step.id)?.scrollIntoView({ behavior: 'smooth' })} className="flex flex-col items-center gap-3 p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-gold/10 transition-all">
                    <div className="w-10 h-10 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center">
                      <step.icon className="w-4 h-4 text-gold" />
                    </div>
                    <span className="text-[10px] font-bold text-gold/60 uppercase">{step.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* 2. MAPA VIVO (LIVRE) */}
          <Section id="mapa-vivo" icon={Compass} kicker="O Olhar Interior" titulo="Abertura do Campo" isHidden={isTravessiaEstruturada}>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 grid gap-4">
                {cartografia.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                    <div className="w-10 h-10 rounded-xl bg-gold/5 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-gold/60" />
                    </div>
                    <div>
                      <p className="text-[8px] tracking-[0.3em] uppercase text-white/30 font-bold">{item.label}</p>
                      <p className="font-display text-lg text-white/90">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-7 pl-6 border-l border-gold/10">
                {pontos.map((item, idx) => (
                  <div key={item.id} className={cn("flex items-center gap-4 py-3", item.id === ponto.id ? "text-white" : "text-white/30")}>
                    <div className={cn("w-2 h-2 rounded-full", item.id === ponto.id ? "bg-gold shadow-glow" : "bg-white/10")} />
                    <span className="text-sm font-display">{item.nome}</span>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* 3. BLOCOS EDITORIAIS */}
          <div id="conteudo-estacao" className="space-y-32">
            {/* Abertura */}
            {(() => {
              const content = renderContent(ponto.metadata?.abertura_imersiva || ponto.metadata?.abertura);
              if (!content) return null;
              return (
                <Section icon={DoorOpen} kicker="Portal" titulo="Abertura Imersiva">
                  <div className="prose prose-invert prose-lg max-w-3xl mx-auto text-foreground/80 font-serif italic whitespace-pre-wrap leading-relaxed">
                    {content}
                  </div>
                </Section>
              );
            })()}

            {/* Conto Espelho (Narrativa Iniciática) */}
            {ponto.conto_espelho && (
              <Section icon={Sparkles} kicker="O Espelho" titulo={ponto.conto_espelho.titulo || "Conto Espelho"}>
                <div className="max-w-3xl mx-auto space-y-8">
                  <div className="prose prose-invert prose-lg text-foreground/80 font-serif italic whitespace-pre-wrap leading-relaxed">
                    {ponto.conto_espelho.texto}
                  </div>
                  {ponto.conto_espelho.moral && (
                    <div className="bg-gold/5 border border-gold/10 p-6 rounded-2xl text-center">
                      <p className="text-gold font-display text-sm uppercase tracking-widest mb-2">A Chave</p>
                      <p className="text-white/80 font-serif italic">{ponto.conto_espelho.moral}</p>
                    </div>
                  )}
                </div>
              </Section>
            )}

            {/* Áudios */}
            {audios.length > 0 && (
              <Section id="audio-travessia" icon={Headphones} kicker="Escuta" titulo="Áudios da Estação">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                  {audios.map((audio: any, i: number) => (
                    <AudioRitualPlayer key={i} audioUrl={audio.url} titulo={audio.titulo} tipo={audio.tipo} funcao={audio.funcao} duracao={audio.duracao} />
                  ))}
                </div>
              </Section>
            )}

            {/* Caso Simbólico */}
            {(() => {
              const relato = renderContent(ponto.metadata?.caso_simbolico?.relato || ponto.metadata?.caso_espelho);
              if (!relato) return null;
              return (
                <Section id="caso-simbolico" icon={Eye} kicker="Reflexo" titulo={ponto.metadata?.caso_simbolico?.titulo || "Caso Simbólico"}>
                  <div className="max-w-3xl mx-auto bg-foreground/[0.03] border-l-4 border-gold/40 p-8 rounded-r-2xl whitespace-pre-wrap font-serif text-lg leading-relaxed italic text-white/80">
                    {relato}
                  </div>
                </Section>
              );
            })()}


            {/* Desafio */}
            {(() => {
              const desafio = renderContent(ponto.metadata?.desafio_terapeuta?.pergunta || ponto.metadata?.desafio_terapeuta);
              if (!desafio) return null;
              return (
                <Section id="desafio-terapeuta" icon={Sword} kicker="Ação" titulo="Desafio da Terapeuta">
                  <div className="max-w-3xl mx-auto border border-gold/20 bg-gold/5 p-10 rounded-3xl text-center">
                    <p className="font-serif text-2xl text-gold leading-relaxed">{desafio}</p>
                  </div>
                </Section>
              );
            })()}

            {/* Revelação */}
            {(() => {
              const rev = ponto.metadata?.revelacao_estacao;
              if (!rev || (!rev.porta && !rev.campo_psiquico && !rev.torre && !rev.labirinto)) return null;
              return (
                <Section id="revelacao-estacao" icon={Sparkles} kicker="Sabedoria" titulo="Revelação da Estação">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem]">
                    {[
                      { key: 'porta', label: 'A Porta', icon: DoorOpen },
                      { key: 'campo_psiquico', label: 'Campo', icon: Layers },
                      { key: 'torre', label: 'A Torre', icon: Layout },
                      { key: 'labirinto', label: 'Labirinto', icon: ShieldAlert }
                    ].map(item => rev[item.key] && (
                      <div key={item.key} className="space-y-1">
                        <div className="flex items-center gap-2 text-white/30 uppercase text-[9px] font-bold">
                          <item.icon className="w-3 h-3 text-gold/40" /> {item.label}
                        </div>
                        <p className="text-white/80 font-serif italic text-lg">{rev[item.key]}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              );
            })()}

            {/* Ferramenta Oracular (Camada 2) */}
            {ponto.metadata?.ferramenta_oracular?.enabled && (
              <Section id="ferramenta-oracular" icon={Radar} kicker="Camada do Método" titulo="Camada do Método">
                <FerramentaOracularPlayer 
                  data={{
                    ...ponto.metadata.ferramenta_oracular,
                    questoes: ponto.metadata.ferramenta_oracular.questoes || ponto.metadata.ferramenta_oracular.indicadores?.map((ind: any) => ({
                      id: ind.id,
                      texto: ind.label,
                      tipo_resposta: ind.tipo_resposta || (ponto.metadata.ferramenta_oracular.tipo_resultado === 'intensidade' ? 'escala_1_5' : 'sim_nao')
                    })) || []
                  }} 
                  onComplete={(respostas) => {
                    console.log('[Camada 2] Respostas rastreamento:', respostas);
                  }}
                />
              </Section>
            )}

            {/* Jardins */}
            {(() => {
              const psique = ponto.metadata?.jardim_psique?.pergunta;
              const oficio = ponto.metadata?.jardim_oficio?.pergunta;
              if (!psique && !oficio) return null;
              return (
                <Section icon={Flower2} kicker="Sementeira" titulo="Os Jardins">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {psique && (
                      <div id="jardim-psique" className="p-8 rounded-[2.5rem] bg-gradient-to-br from-gold/10 to-midnight border border-gold/10">
                        <h4 className="text-gold font-display text-xl mb-4">Jardim da Psique</h4>
                        <p className="text-white/70 font-serif italic mb-8">{psique}</p>
                        
                      </div>
                    )}
                    {oficio && (
                      <div id="jardim-oficio" className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-900/10 to-midnight border border-emerald-900/10">
                        <h4 className="text-emerald-500 font-display text-xl mb-4">Jardim do Ofício</h4>
                        <p className="text-white/70 font-serif italic mb-8">{oficio}</p>
                        
                      </div>
                    )}
                  </div>
                </Section>
              );
            })()}

            {/* Oráculo */}
            {(() => {
              const oraculo = ponto.metadata?.oraculo_estacao;
              const palavra = renderContent(oraculo?.palavra || oraculo);
              if (!palavra) return null;
              return (
                <Section icon={BookOpen} kicker="Palavra Final" titulo="Oráculo da Estação">
                  <div className="max-w-3xl mx-auto text-center p-12 bg-gradient-to-b from-gold/10 to-transparent rounded-[3rem] border border-gold/10">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-gold/60 font-bold mb-4 block">A Palavra</span>
                    <h3 className="font-display text-5xl md:text-7xl text-gold tracking-tighter mb-8">{palavra}</h3>
                    {oraculo?.movimento && <p className="text-xl md:text-2xl font-serif italic text-white/80">{oraculo.movimento}</p>}
                  </div>
                </Section>
              );
            })()}

            {/* Conclusão */}
            {(() => {
              let textoRaw = renderContent(ponto.metadata?.fechamento?.texto || ponto.metadata?.fechamento) || "";
              const textoLimpo = String(textoRaw)
                .replace(/Este registro agora repousa em sua memória instintiva\./g, '')
                .replace(/Estação Concluída no Atlas/g, 'Estação Concluída')
                .replace(/Instrumento Integrado/g, 'Camada do Método')
                .trim();

              if (!textoRaw) return null;
              return (
                <Section id="fechamento-estacao" icon={Check} kicker="Fim" titulo="Travessia Concluída">
                  <div className="max-w-2xl mx-auto text-center space-y-8">
                    <p className="text-xl md:text-2xl text-white/70 font-serif italic leading-relaxed">
                      {textoLimpo || 'Sua travessia foi acolhida.'}
                    </p>
                    <div className="flex flex-col items-center gap-6">
                      {ponto.estado !== 'completed' ? (
                        <Button 
                          variant="gold" 
                          className="rounded-full h-16 px-12 text-lg font-bold shadow-glow" 
                          onClick={() => concluirPonto.mutate(ponto.id)}
                          disabled={concluirPonto.isPending}
                        >
                          {concluirPonto.isPending ? 'Registrando...' : 'Selo de Conclusão'}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="border-gold/40 text-gold bg-gold/5 py-2 px-4 rounded-full">
                          {"Estação Concluída"}
                        </Badge>
                      )}
                      <Button variant="outline" className="rounded-full h-14 px-10 text-sm uppercase tracking-wider" onClick={() => navigate('/clube')}>
                        Voltar ao Mapa das Rotas
                      </Button>
                    </div>
                  </div>
                </Section>
              );
            })()}
          </div>

          {/* Laboratório 80/20 & Chat (Only for unstructured) */}
          {!isTravessiaEstruturada && matchedBook && (
            <Section icon={FlaskConical} kicker="Essência" titulo="Laboratório 80/20">
               <Laboratorio8020Modal bookId={matchedBook.id} bookTitle={matchedBook.title} trigger={
                 <div className="p-10 rounded-[2rem] border border-gold/20 bg-[#0F0D15] text-center cursor-pointer">
                   <h3 className="text-2xl font-display text-white mb-4">O Núcleo Simbólico</h3>
                   <p className="text-white/50 font-serif italic mb-8">Acesse a essência destilada desta obra.</p>
                   <Button variant="gold" className="rounded-full">Abrir Laboratório</Button>
                 </div>
               } />
            </Section>
          )}

          {/* Próximo Passo */}
          {proximoPonto && (
            <Section icon={ArrowRight} kicker="Continuidade" titulo="Próximo Passo">
              <button onClick={() => proximoPonto.estado !== 'locked' && navigate(`/clube/rota/${proximoPonto.slug}`)} className={cn("w-full text-left p-8 rounded-3xl border border-white/5 bg-white/[0.02]", proximoPonto.estado === 'locked' && "opacity-40 cursor-not-allowed")}>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-4">{proximoPonto.estado === 'locked' ? 'Bloqueada' : 'Disponível'}</p>
                <h2 className="font-display text-3xl text-white">{proximoPonto.nome}</h2>
              </button>
            </Section>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

function Section({ id, icon: Icon, kicker, titulo, children, isHidden = false }: any) {
  if (isHidden) return null;
  return (
    <section id={id} className="scroll-mt-24 space-y-8">
      {(kicker || titulo) && (
        <div className="space-y-2">
          {kicker && <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-gold/60">{Icon && <Icon className="w-3 h-3" />} {kicker}</div>}
          {titulo && <h2 className="text-2xl md:text-4xl font-display text-white">{titulo}</h2>}
        </div>
      )}
      {children}
    </section>
  );
}