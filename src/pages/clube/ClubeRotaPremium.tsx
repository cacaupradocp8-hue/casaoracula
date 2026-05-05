import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Play,
  ArrowRight,
  ChevronRight,
  Compass,
  Clock,
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
  ArrowDown,
  Lock,
  Check,
  FlaskConical,
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


/**
 * ClubeRotaPremium — Página de Rota nível Netflix + Apple + Jung
 * Paleta: midnight (azul profundo) + gold (luxo silencioso)
 * 8 seções verticais cinemáticas, mobile-first.
 */
export default function ClubeRotaPremium() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { pontos, estacaoAtual, isLoading, marcarEmAndamento } = useRotaOracular();
  const { data: allBooks = [] } = useAllBooks();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 400], [1, 1.08]);
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);

  const ponto = useMemo(() => pontos.find(p => p.slug === slug), [pontos, slug]);
  const proximoPonto = useMemo(
    () => (ponto ? pontos.find(p => p.ordem > ponto.ordem) : null),
    [pontos, ponto]
  );

  const matchedBook = useMemo(() => {
    if (!estacaoAtual?.livro_titulo) return null;
    return allBooks.find(b => b.title.toLowerCase().includes(estacaoAtual.livro_titulo.toLowerCase()));
  }, [allBooks, estacaoAtual?.livro_titulo]);

  const [pergunta, setPergunta] = useState('');


  // Marca o ponto como em_andamento ao entrar (se ainda não tem registro)
  useEffect(() => {
    if (ponto && ponto.estado === 'available') {
      marcarEmAndamento.mutate(ponto.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ponto?.id]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-midnight flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        >
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
          <Button onClick={() => navigate('/clube')} variant="outline">
            Voltar para o Clube
          </Button>
        </div>
      </AppLayout>
    );
  }

  // ─── Conteúdo 100% DB-driven (sem fallbacks mock) ───
  const audios: Array<{ titulo?: string; url?: string; tipo?: string; duracao?: string }> =
    Array.isArray(ponto.metadata?.audios) ? ponto.metadata.audios : [];

  const jardimPrompt: string | null =
    ponto.jardim_prompt || ponto.metadata?.jardim_prompt || null;

  const simulacaoTexto: string | null =
    ponto.cenario_treinamento || ponto.metadata?.simulacao_texto || null;

  const perguntasSugeridas: string[] = Array.isArray(ponto.metadata?.perguntas_sugeridas)
    ? ponto.metadata.perguntas_sugeridas.filter((p: any) => typeof p === 'string' && p.trim())
    : [];

  const temChatLivro = ponto.tipo === 'chat_livro' || perguntasSugeridas.length > 0;

  // Cartografia: só mostra cards que têm valor real
  const cartografia = [
    { label: 'Estação', value: estacaoAtual?.titulo, icon: MapPin },
    { label: 'Porta', value: ponto.porta, icon: DoorOpen },
    { label: 'Campo', value: ponto.campo, icon: Layers },
    { label: 'Torre', value: ponto.torre, icon: Layout },
    { label: 'Labirinto', value: ponto.labirinto, icon: ShieldAlert },
  ].filter(c => c.value && c.value.trim());


  return (
    <AppLayout>
      {/* Wrapper de fundo cinematográfico */}
      <div className="relative bg-midnight text-foreground overflow-x-hidden min-h-screen">
        {/* Gradiente atmosférico fixo de fundo */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(206_60%_18%/0.6),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,hsl(206_70%_8%/0.9),transparent_70%)]" />
        </div>

        {/* ═══════════ 1. HERO FULL SCREEN ═══════════ */}
        <section className="relative min-h-[100svh] flex items-center justify-center px-4 sm:px-6 z-10 overflow-hidden">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
            className="absolute inset-0 pointer-events-none"
          >
            {ponto.image_url ? (
              <img
                src={ponto.image_url}
                alt=""
                className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
              />
            ) : estacaoAtual?.banner_url ? (
              <img
                src={estacaoAtual.banner_url}
                alt=""
                className="w-full h-full object-cover opacity-20"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-b from-midnight/20 via-midnight/60 to-midnight" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[140vw] h-[100vh] bg-gold/[0.04] rounded-full blur-[100px] sm:blur-[160px]" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 text-center w-full max-w-4xl mx-auto space-y-6 sm:space-y-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.2 }}
              className="flex flex-col items-center justify-center gap-4 sm:gap-5"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="h-[px] w-8 sm:w-12 bg-gradient-to-r from-transparent to-gold/40" />
                <span className="text-[8px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.6em] uppercase text-gold/60 font-medium">
                  {estacaoAtual?.livro_titulo || 'Estação Oracular'}
                </span>
                <span className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent to-gold/40" />
              </div>

              {matchedBook && (
                <Laboratorio8020Modal
                  bookId={matchedBook.id}
                  bookTitle={matchedBook.title}
                  trigger={
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(212, 175, 55, 0.15)' }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gold/5 border border-gold/20 text-gold/80 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] transition-all min-h-[44px]"
                    >
                      <FlaskConical className="w-3 h-3" />
                      Módulo 80/20
                    </motion.button>
                  }
                />
              )}
            </motion.div>

            <div className="space-y-4 px-2 sm:px-0">
              <h1
                className="font-display font-light leading-[0.95] tracking-tighter"
                style={{ fontSize: 'clamp(2.5rem, 12vw, 8rem)' }}
              >
                <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent block">
                  {ponto.nome}
                </span>
              </h1>
              
              {ponto.subtitulo && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="font-serif italic text-lg sm:text-2xl md:text-3xl text-white/40 max-w-2xl mx-auto leading-relaxed"
                >
                  "{ponto.subtitulo}"
                </motion.p>
              )}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 sm:pt-10 px-4 sm:px-0"
            >
              <Button
                size="lg"
                variant="gold"
                className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-sm sm:text-base gap-3 rounded-full shadow-[0_20px_50px_-10px_rgba(212,175,55,0.3)] hover:shadow-[0_25px_60px_-10px_rgba(212,175,55,0.4)] transition-all duration-500"
                onClick={() => {
                  const el = document.getElementById('mapa-vivo');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Play className="w-4 h-4 fill-current" /> Iniciar Travessia
              </Button>
              {audios.length > 0 && (
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-10 text-sm sm:text-base gap-3 rounded-full border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.08] transition-all"
                >
                  <Headphones className="w-4 h-4 text-gold/80" /> Ouvir Áudio
                </Button>
              )}
            </motion.div>
          </motion.div>

          {/* Indicador de scroll */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1.5 }}
            className="absolute bottom-8 sm:bottom-12 left-1/2 -translate-x-1/2 z-10"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 sm:gap-3 text-white/20"
            >
              <span className="text-[7px] sm:text-[8px] tracking-[0.5em] uppercase font-bold">Scroll</span>
              <div className="w-[1px] h-8 sm:h-12 bg-gradient-to-b from-gold/40 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Conteúdo principal */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-12 space-y-24 sm:space-y-32 md:space-y-48 pb-24 sm:pb-48 pt-10 sm:pt-20">

          {/* ═══════════ 2. MAPA VIVO ═══════════ */}
          <Section id="mapa-vivo" icon={Compass} kicker="O Olhar Interior" titulo="Mapa da Travessia">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-16 items-start">
              {/* Coluna de Cards de Cartografia — Bento Style */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {cartografia.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.1, duration: 0.8 }}
                    className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-5 sm:p-6 transition-all hover:border-gold/20 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border border-gold/10 bg-gold/[0.03] flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                        <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gold/60" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-[7px] sm:text-[8px] tracking-[0.4em] uppercase text-white/30 font-bold">
                          {item.label}
                        </p>
                        <p className="font-display text-base sm:text-lg text-white/90 leading-tight truncate">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Coluna da Timeline — Direita */}
              <div className="lg:col-span-7">
                <div className="relative pl-6 sm:pl-8 md:pl-12">
                  <div className="absolute left-[6px] sm:left-[7px] md:left-[11px] top-1 bottom-1 w-[1px] bg-gradient-to-b from-gold/30 via-gold/10 to-transparent" />
                  {pontos.map((item, idx) => {
                    const isCurrent = item.id === ponto.id;
                    const isCompleted = item.estado === 'completed';
                    const isLocked = item.estado === 'locked';
                    const isInteractive = !isLocked && !isCurrent;
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.05, duration: 0.6 }}
                        disabled={isLocked}
                        onClick={() => !isLocked && navigate(`/clube/rota/${item.slug}`)}
                        className={cn(
                          'relative block w-full text-left group py-5 transition-all',
                          isLocked && 'cursor-not-allowed grayscale-[0.8]'
                        )}
                      >
                        <div
                          className={cn(
                            'absolute -left-[19px] sm:-left-[24px] md:-left-[28px] top-6 sm:top-7 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-[1px] transition-all flex items-center justify-center',
                            isCurrent &&
                              'bg-gold border-gold shadow-[0_0_20px_rgba(212,175,55,0.5)] scale-125 z-10',
                            !isCurrent && isCompleted && 'bg-gold/20 border-gold/40',
                            !isCurrent && !isCompleted && !isLocked &&
                              'bg-midnight border-white/20 group-hover:border-gold group-hover:scale-110',
                            !isCurrent && isLocked && 'bg-midnight border-white/5'
                          )}
                        >
                          {isCompleted && !isCurrent && (
                            <Check className="w-2 h-2 text-gold/80" strokeWidth={3} />
                          )}
                        </div>
                        <div className={cn(
                          "flex items-center justify-between gap-4 sm:gap-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-500 min-h-[44px]",
                          isCurrent ? "bg-white/[0.04] border border-white/10" : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                        )}>
                          <div className="min-w-0 space-y-0.5 sm:space-y-1">
                            <p
                              className={cn(
                                'text-[7px] sm:text-[8px] tracking-[0.4em] uppercase font-bold flex items-center gap-2',
                                isLocked ? 'text-white/10' : 'text-white/30'
                              )}
                            >
                              Fase 0{idx + 1}
                              {isCurrent && <span className="text-gold/60">· Presença</span>}
                              {isCompleted && !isCurrent && <span className="text-gold/40">· Passagem</span>}
                            </p>
                            <p
                              className={cn(
                                'font-display text-base sm:text-lg md:text-xl transition-colors truncate tracking-tight',
                                isCurrent && 'text-white',
                                !isCurrent && isCompleted && 'text-white/60',
                                !isCurrent && !isCompleted && !isLocked &&
                                  'text-white/40 group-hover:text-white/80',
                                isLocked && 'text-white/20'
                              )}
                            >
                              {item.nome}
                            </p>
                          </div>
                          {isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-white/10 shrink-0" />
                          ) : isInteractive ? (
                            <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-gold/60 transition-colors shrink-0" />
                          ) : null}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Section>


          {/* ═══════════ 3. ÁUDIOS ═══════════ */}
          {audios.length > 0 && (
            <Section icon={Headphones} kicker="Escutas de poder" titulo="Áudios da travessia">
              <div className="space-y-3">
                {audios.map((audio: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <button
                      onClick={() => audio.url && window.open(audio.url, '_blank')}
                      className="w-full text-left group flex items-center gap-4 p-4 rounded-2xl border border-foreground/[0.06] bg-foreground/[0.02] hover:bg-foreground/[0.05] hover:border-gold/20 transition-all min-h-[44px]"
                    >
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gold fill-gold/80 ml-0.5" />
                        <span className="absolute inset-0 rounded-full ring-1 ring-gold/0 group-hover:ring-gold/30 group-hover:scale-110 transition-all" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[8px] sm:text-[9px] tracking-[0.3em] uppercase text-gold/60 mb-0.5 sm:mb-1">
                          {audio.tipo || 'Áudio de integração'}
                        </p>
                        <h4 className="font-display text-sm sm:text-base md:text-lg text-foreground/90 group-hover:text-foreground transition-colors truncate">
                          {audio.titulo}
                        </h4>
                        <span className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-foreground/70 mt-0.5 sm:mt-1">
                          <Clock className="w-3 h-3" /> {audio.duracao || '—'}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-gold transition-colors shrink-0" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {/* ═══════════ 4. CONVERSE COM O LIVRO ═══════════ */}
          {temChatLivro && (
            <Section icon={MessageSquare} kicker="Sussurros da obra" titulo="Converse com o livro">
              <Card className="bg-gradient-to-br from-gold/[0.08] via-foreground/[0.02] to-transparent border-foreground/[0.06] overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {estacaoAtual?.livro_capa_url && (
                      <motion.div
                        whileHover={{ scale: 1.03, rotate: -1 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-32 md:w-40 shrink-0"
                      >
                        <img
                          src={estacaoAtual.livro_capa_url}
                          alt={estacaoAtual?.livro_titulo || ''}
                          className="w-full aspect-[2/3] object-cover rounded shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]"
                        />
                        <div className="absolute inset-0 ring-1 ring-inset ring-foreground/15 rounded" />
                      </motion.div>
                    )}

                    <div className="flex-1 w-full space-y-5">
                      <div className="space-y-2 text-center md:text-left">
                        <h4 className="font-display text-xl md:text-2xl text-foreground">
                          Diálogo com o inconsciente
                        </h4>
                        <p className="text-sm text-foreground/55 italic font-serif leading-relaxed">
                          Pergunte ao livro sobre as tensões deste capítulo ou peça uma orientação simbólica.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="relative">
                          <Input
                            value={pergunta}
                            onChange={e => setPergunta(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' && pergunta.trim()) {
                                navigate(`/clube/chat-livro?q=${encodeURIComponent(pergunta)}`);
                              }
                            }}
                            placeholder="Escreva sua inquietação..."
                            className="bg-midnight/60 border-foreground/10 h-12 sm:h-13 pl-4 sm:pl-5 pr-12 sm:pr-14 rounded-full focus-visible:border-gold/40 focus-visible:ring-gold/10 transition-all text-sm sm:text-base"
                          />
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute right-1 sm:right-1.5 top-1/2 -translate-y-1/2 rounded-full text-gold/70 hover:text-gold hover:bg-gold/10 h-10 w-10 sm:h-11 sm:w-11"
                            onClick={() =>
                              navigate(
                                pergunta.trim()
                                  ? `/clube/chat-livro?q=${encodeURIComponent(pergunta)}`
                                  : '/clube/chat-livro'
                               )
                            }
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>

                        {perguntasSugeridas.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {perguntasSugeridas.map((tag: string) => (
                              <button
                                key={tag}
                                onClick={() => setPergunta(tag)}
                                className="text-[11px] px-3 py-1.5 rounded-full border border-foreground/10 bg-foreground/[0.03] text-foreground/55 hover:border-gold/30 hover:text-gold hover:bg-gold/5 transition-all"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Section>
          )}

          {/* ═══════════ 4.5 LABORATÓRIO 80/20 ═══════════ */}
          {matchedBook && (
            <Section icon={FlaskConical} kicker="A essência destilada" titulo="Laboratório 80/20">
              <Laboratorio8020Modal
                bookId={matchedBook.id}
                bookTitle={matchedBook.title}
                trigger={
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="cursor-pointer group relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] border border-gold/20 bg-[#0F0D15] p-6 sm:p-8 md:p-14 shadow-2xl transition-all duration-500 min-h-[44px]"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                      <FlaskConical className="w-60 h-60 text-gold" />
                    </div>
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10 space-y-8 max-w-3xl">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-gold/10 text-gold border-gold/30 uppercase tracking-[0.2em] text-[10px] py-1 px-4 rounded-full font-bold">
                          Módulo Oficial
                        </Badge>
                        <div className="flex items-center gap-1.5 text-white/40">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Caminho Crítico</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-2xl sm:text-3xl md:text-5xl font-display text-white leading-[1.1] tracking-tight">
                          Acesse o núcleo simbólico e clínico desta obra.
                        </h3>
                        <p className="text-white/50 text-base sm:text-lg md:text-xl font-serif italic leading-relaxed">
                          Não é um resumo. É a estrutura 80/20 que organiza seu atendimento e destila a sabedoria da alma para a prática.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 pt-2">
                        <Button variant="gold" size="lg" className="w-full sm:w-auto rounded-full px-8 sm:px-10 h-12 sm:h-14 font-bold text-sm sm:text-base shadow-[0_10px_30px_rgba(234,179,8,0.2)] group-hover:shadow-[0_15px_40px_rgba(234,179,8,0.3)] transition-all duration-500">
                          Abrir Laboratório 80/20
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <div className="flex items-center gap-2 text-white/30 text-xs font-medium uppercase tracking-widest">
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          Disponível nesta rota
                        </div>
                      </div>
                    </div>
                  </motion.div>
                }
              />
            </Section>
          )}

          {/* ═══════════ 5. TREINAMENTO ═══════════ */}
          {simulacaoTexto && (
            <Section icon={Zap} kicker="Câmara de simulação" titulo="Treinamento">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-2xl border border-foreground/[0.06] bg-gradient-to-br from-foreground/[0.04] to-transparent p-6 md:p-8"
              >
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold/0 via-gold/60 to-gold/0" />
                <div className="space-y-5">
                  <div>
                    <p className="text-[9px] tracking-[0.3em] uppercase text-gold/60 mb-1">
                      Situação de campo
                    </p>
                    <h4 className="font-display text-xl md:text-2xl">Simulação contextual</h4>
                  </div>
                  <p className="text-foreground/65 text-[15px] leading-relaxed font-serif italic">
                    {simulacaoTexto}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-12 rounded-full border-gold/30 text-gold hover:bg-gold hover:text-midnight gap-2 uppercase tracking-[0.25em] text-[11px] font-semibold transition-all duration-500"
                    onClick={() => navigate('/clube/treinamento')}
                  >
                    Iniciar simulação <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            </Section>
          )}

          {/* ═══════════ 6. JARDIM ═══════════ */}
          {jardimPrompt && (
            <Section icon={Flower2} kicker="Sementeira interna" titulo="Jardim da psique">
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold/[0.06] via-midnight to-midnight border border-foreground/[0.06] p-8 md:p-12"
              >
                <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative space-y-8 text-center">
                  <Flower2 className="w-7 h-7 text-gold/60 mx-auto" />
                  <p className="font-serif italic text-lg md:text-2xl text-foreground/85 leading-relaxed max-w-xl mx-auto">
                    "{jardimPrompt}"
                  </p>
                  <Button
                    variant="ghost"
                    className="text-gold hover:text-gold hover:bg-gold/10 gap-2 rounded-full"
                    onClick={() => navigate('/jardim-heroina')}
                  >
                    <MapPin className="w-4 h-4" /> Registrar no Jardim
                  </Button>
                </div>
              </motion.div>
            </Section>
          )}

          {/* ═══════════ 7. CTA FORMAÇÃO ═══════════ */}
          <Section>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gold/15 bg-[radial-gradient(ellipse_at_top_right,hsl(43_47%_56%/0.18),transparent_60%),linear-gradient(135deg,hsl(206_44%_8%),hsl(206_44%_12%))] p-6 sm:p-8 md:p-14"
            >
              <Sparkles className="absolute top-6 right-6 w-16 h-16 text-gold/15" />
              <div className="relative space-y-6 max-w-xl">
                <Badge className="bg-gold/15 text-gold border-gold/20 hover:bg-gold/15 font-medium tracking-[0.2em] text-[10px] uppercase">
                  Próximo nível
                </Badge>
                <h3 className="font-display text-3xl md:text-5xl leading-[1.05]">
                  Você percebe os padrões.
                  <br />
                  <span className="bg-gradient-to-r from-gold via-gold to-gold/70 bg-clip-text text-transparent">
                    Aprenda a conduzir.
                  </span>
                </h3>
                <p className="font-serif italic text-foreground/55 text-base md:text-lg">
                  "Seu olhar existe. Falta método."
                </p>
                <p className="text-foreground/55 text-[15px] leading-relaxed">
                  A travessia que você acabou de viver é apenas a superfície. A Formação Orácula é o
                  oceano onde se domina a arte da escuta clínica e da condução simbólica.
                </p>
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full bg-gold text-midnight hover:bg-gold/90 gap-2 font-semibold tracking-wide shadow-[0_0_50px_-15px_hsl(43_47%_56%/0.6)]"
                  onClick={() => navigate('/formacao')}
                >
                  Conhecer a Formação Orácula <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            {ponto.metadata?.cta_label && ponto.metadata?.cta_url && (
              <div className="flex justify-center mt-10">
                <Button
                  variant="ghost"
                  className="text-gold/70 hover:text-gold gap-2"
                  onClick={() => window.open(ponto.metadata.cta_url, '_blank')}
                >
                  <Star className="w-3 h-3" /> {ponto.metadata.cta_label}
                </Button>
              </div>
            )}
          </Section>

          {/* ═══════════ 8. PRÓXIMA ROTA ═══════════ */}
          {proximoPonto && (() => {
            const proxLocked = proximoPonto.estado === 'locked';
            return (
              <Section>
                <motion.button
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  disabled={proxLocked}
                  onClick={() => !proxLocked && navigate(`/clube/rota/${proximoPonto.slug}`)}
                  className={cn(
                    'group w-full text-left relative overflow-hidden rounded-2xl sm:rounded-3xl border p-6 sm:p-8 md:p-12 transition-all duration-700 min-h-[44px]',
                    proxLocked
                      ? 'border-foreground/[0.06] bg-foreground/[0.02] cursor-not-allowed'
                      : 'border-foreground/[0.06] hover:border-gold/30 bg-foreground/[0.02] hover:bg-foreground/[0.04]'
                  )}
                >
                  <p className="text-[10px] tracking-[0.4em] uppercase text-foreground/70 mb-4 flex items-center gap-2">
                    {proxLocked ? 'Em breve' : 'Próxima travessia'}
                    {proxLocked && <Lock className="w-3 h-3" />}
                  </p>
                  <div className="flex items-center justify-between gap-6">
                    <div className="min-w-0 flex-1">
                      <h2
                        className={cn(
                          'font-display text-3xl md:text-5xl transition-colors duration-700 leading-[1.1]',
                          proxLocked
                            ? 'text-foreground/35'
                            : 'text-foreground/70 group-hover:text-foreground'
                        )}
                      >
                        {proximoPonto.nome}
                      </h2>
                      {proximoPonto.subtitulo && !proxLocked && (
                        <p className="font-serif italic text-foreground/70 mt-3 text-sm md:text-base">
                          {proximoPonto.subtitulo}
                        </p>
                      )}
                      {proxLocked && (
                        <p className="text-foreground/35 mt-3 text-sm">
                          Conclua esta rota para revelar a próxima travessia.
                        </p>
                      )}
                    </div>
                    <div
                      className={cn(
                        'w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-full border flex items-center justify-center transition-all duration-700',
                        proxLocked
                          ? 'border-foreground/10 bg-foreground/[0.02]'
                          : 'border-foreground/15 group-hover:border-gold group-hover:bg-gold'
                      )}
                    >
                      {proxLocked ? (
                        <Lock className="w-5 h-5 text-foreground/30" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-foreground/70 group-hover:text-midnight transition-colors duration-700" />
                      )}
                    </div>
                  </div>
                </motion.button>
              </Section>
            );
          })()}
        </div>
      </div>
    </AppLayout>
  );
}

/* ─── Section helper ─── */
function Section({
  id,
  icon: Icon,
  kicker,
  titulo,
  children,
}: {
  id?: string;
  icon?: React.ComponentType<{ className?: string }>;
  kicker?: string;
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      {(kicker || titulo) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mb-8 md:mb-10 space-y-3"
        >
          {kicker && (
            <div className="flex items-center gap-3">
              {Icon && <Icon className="w-4 h-4 text-gold" />}
              <span className="text-[10px] tracking-[0.4em] uppercase text-gold/70">{kicker}</span>
            </div>
          )}
          {titulo && (
            <h2 className="font-display text-3xl md:text-4xl text-foreground leading-tight">
              {titulo}
            </h2>
          )}
        </motion.div>
      )}
      {children}
    </section>
  );
}
