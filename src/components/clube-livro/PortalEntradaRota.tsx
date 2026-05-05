import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Compass, Flame, Gem, AlertTriangle, Building2, Leaf, Circle, X, BookOpen, Eye, ShieldAlert, FlaskConical, Target, GraduationCap, Sparkles, ArrowRight, ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEssencia8020 } from '@/hooks/useEssencia8020';

export interface PortalSlide {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface PortalEntradaRotaProps {
  slug: string;
  bookId?: string;
  portalNumero?: number | string;
  portalTitulo?: string;
  slides?: PortalSlide[];
  microcopiesCalmas?: string[];
  microcopiesProfundas?: string[];
  ethicalChips?: string[];
  ctaLabel?: string;
  onComplete: () => void;
  onSkip?: () => void;
  storageKey?: string;
}

const DEFAULT_SLIDES: PortalSlide[] = [
  { icon: <Circle className="w-8 h-8" />, title: 'Bem-vinda à Rota', subtitle: 'Esta obra não inicia. Ela desdomestica.' },
  { icon: <Compass className="w-8 h-8" />, title: 'Tour pela Obra', subtitle: 'Um mapa simbólico para atravessar com cuidado.' },
  { icon: <Flame className="w-8 h-8" />, title: 'Eixo da Travessia', subtitle: 'Instinto e Sombra Viva após a ruptura inicial.' },
  { icon: <Gem className="w-8 h-8" />, title: 'Habilidade Central', subtitle: 'Reconstruir confiança no instinto como orientação psíquica.' },
  { icon: <AlertTriangle className="w-8 h-8" />, title: 'O que Não Fazer', subtitle: 'Não transforme "selvagem" em identidade ou impulsividade.' },
  { icon: <Building2 className="w-8 h-8" />, title: 'Como Atravessar', subtitle: 'Leitura não linear, 1 símbolo por semana e prática real.' },
  { icon: <Leaf className="w-8 h-8" />, title: 'Quando Encerrar', subtitle: 'Quando a escuta interna começa a funcionar sem o livro.' },
];

const DEFAULT_CALMAS = [
  'O que você sente não precisa de permissão.',
  'O corpo fala antes da mente justificar.',
  'Quem se adapta demais se perde.',
  'Verdade pequena muda destino.',
];

const DEFAULT_PROFUNDAS = [
  'Instinto ignorado vira ruído interno.',
  'Nem toda paz é saudável.',
  'O predador mora dentro também.',
  'Sua voz não precisa ser aceita — precisa ser dita.',
];

const DEFAULT_CHIPS = ['Nada é demolido', 'Tudo é reconhecido', 'Tempo psíquico'];

export function PortalEntradaRota({
  slug,
  bookId,
  portalNumero,
  portalTitulo,
  slides: propSlides,
  microcopiesCalmas = DEFAULT_CALMAS,
  microcopiesProfundas = DEFAULT_PROFUNDAS,
  ethicalChips = DEFAULT_CHIPS,
  ctaLabel = 'INICIAR TRAVESSIA',
  onComplete,
  onSkip,
  storageKey,
}: PortalEntradaRotaProps) {
  const [current, setCurrent] = useState(0);
  const [swipes, setSwipes] = useState(0);
  const [microIdx, setMicroIdx] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);

  const { data: essencia } = useEssencia8020(bookId);

  const slides = useMemo(() => {
    if (propSlides) return propSlides;
    if (!essencia) return DEFAULT_SLIDES;
    return [
      { icon: <BookOpen className="w-8 h-8" />, title: 'Núcleo Vivo', subtitle: essencia?.nucleo_vivo || DEFAULT_SLIDES[0].subtitle },
      { icon: <Eye className="w-8 h-8" />, title: 'Imagem Organizadora', subtitle: essencia?.imagem_organizadora || DEFAULT_SLIDES[1].subtitle },
      { icon: <Flame className="w-8 h-8" />, title: 'Tensão Central', subtitle: essencia?.tensao_central || DEFAULT_SLIDES[2].subtitle },
      { icon: <Target className="w-8 h-8" />, title: 'Habilidade Central', subtitle: essencia?.aplicacao_terapeutica || DEFAULT_SLIDES[3].subtitle },
      { icon: <ShieldAlert className="w-8 h-8" />, title: 'Distorção Comum', subtitle: essencia?.distorcao_comum || DEFAULT_SLIDES[4].subtitle },
      { icon: <FlaskConical className="w-8 h-8" />, title: 'Exercício Integrativo', subtitle: essencia?.exercicio || DEFAULT_SLIDES[5].subtitle },
      { icon: <GraduationCap className="w-8 h-8" />, title: 'Riscos Éticos', subtitle: essencia?.riscos_eticos || DEFAULT_SLIDES[6].subtitle },
    ];
  }, [propSlides, essencia]);

  const total = slides.length;
  const microList = swipes >= 3 ? microcopiesProfundas : microcopiesCalmas;

  useEffect(() => {
    const t = setInterval(() => setMicroIdx(i => i + 1), 5000);
    return () => clearInterval(t);
  }, []);

  // Track stage width for responsive offsets
  useEffect(() => {
    if (!stageRef.current) return;
    const update = () => setStageWidth(stageRef.current?.offsetWidth ?? 0);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(total - 1, i));
    if (next !== current) setSwipes(s => s + 1);
    setCurrent(next);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goTo(current + 1);
      else if (e.key === 'ArrowLeft') goTo(current - 1);
      else if (e.key === 'Escape') skip();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, total]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) goTo(current + 1);
    else if (info.offset.x > 60) goTo(current - 1);
  };

  const finish = () => {
    if (storageKey) { try { localStorage.setItem(storageKey, '1'); } catch {} }
    onComplete();
  };

  const skip = () => {
    if (storageKey) { try { localStorage.setItem(storageKey, '1'); } catch {} }
    (onSkip ?? onComplete)();
  };

  const microcopy = microList[microIdx % microList.length];

  // Responsive card metrics computed from stage width
  const isCompact = stageWidth > 0 && stageWidth < 560;
  const cardWidth = Math.min(Math.max(stageWidth * 0.62, 200), 300);
  const offsetStep = cardWidth * 0.62;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] overflow-y-auto bg-midnight/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary/[0.05] blur-[120px]" />
      </div>

      {/* Container — contained, not full-screen */}
      <div className="relative w-full max-w-4xl mx-auto rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/[0.03] to-white/[0.01] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden min-h-[640px] md:min-h-[720px] flex flex-col justify-center">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        {/* Skip */}
        <button
          onClick={skip}
          aria-label="Sair"
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-gold hover:border-gold/40 transition-all duration-300"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative px-5 py-8 md:px-12 md:py-12 flex flex-col gap-7 md:gap-9">
          {/* Header */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="flex items-center gap-3 mb-3"
            >
              <span className="text-[9px] tracking-[0.4em] font-bold text-gold uppercase">Casa Orácula</span>
              <div className="h-px flex-1 bg-gradient-to-r from-gold/30 to-transparent" />
              {portalNumero && (
                <span className="font-serif italic text-xs text-gold/40">
                  Fase {String(portalNumero).padStart(2, '0')}
                </span>
              )}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.8 }}
              className="font-display text-3xl md:text-5xl text-white font-black leading-[0.95] tracking-tight"
            >
              {portalTitulo ?? 'O Chamado'}
            </motion.h1>
          </div>

          {/* Carousel stage */}
          <div
            ref={stageRef}
            className="relative w-full h-[360px] md:h-[420px] flex items-center justify-center my-4 md:my-6"
            style={{ perspective: '1600px' }}
          >
            {/* Side hints (desktop only) */}
            {current > 0 && (
              <button
                onClick={() => goTo(current - 1)}
                aria-label="Anterior"
                className="hidden md:flex absolute left-2 z-10 w-10 h-10 rounded-full border border-white/10 items-center justify-center text-white/40 hover:text-gold hover:border-gold/40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            {current < total - 1 && (
              <button
                onClick={() => goTo(current + 1)}
                aria-label="Próximo"
                className="hidden md:flex absolute right-2 z-10 w-10 h-10 rounded-full border border-white/10 items-center justify-center text-white/40 hover:text-gold hover:border-gold/40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <AnimatePresence mode="popLayout">
              {slides.map((slide, i) => {
                const diff = i - current;
                const absDiff = Math.abs(diff);
                if (absDiff > 2) return null;
                const isActive = diff === 0;

                return (
                  <motion.div
                    key={i}
                    drag={isActive ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.12}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{
                      x: diff * offsetStep,
                      rotateY: isCompact ? 0 : diff * -22,
                      scale: isActive ? 1 : 0.82,
                      z: isActive ? 0 : -100,
                      opacity: isActive ? 1 : 0.22,
                      filter: isActive ? 'blur(0px)' : 'blur(4px)',
                      zIndex: 10 - absDiff,
                    }}
                    transition={{ type: 'spring', stiffness: 220, damping: 32, mass: 0.9 }}
                    className={cn(
                      'absolute',
                      !isActive && 'cursor-pointer'
                    )}
                    style={{ width: cardWidth, height: cardWidth * 1.32 }}
                    onClick={() => !isActive && goTo(i)}
                  >
                    <SlideCard slide={slide} isActive={isActive} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Microcopy */}
          <div className="text-center min-h-[44px]">
            <AnimatePresence mode="wait">
              <motion.p
                key={microcopy}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.6 }}
                className="text-white/55 font-serif italic text-sm md:text-base leading-relaxed max-w-md mx-auto"
              >
                "{microcopy}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir para slide ${i + 1}`}
                className="h-1 flex items-center"
              >
                <motion.span
                  animate={{
                    width: i === current ? 24 : 6,
                    opacity: i === current ? 1 : 0.3,
                  }}
                  transition={{ duration: 0.4 }}
                  className="block h-[2px] rounded-full bg-gold"
                />
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="gold"
              size="lg"
              onClick={current >= total - 1 ? finish : () => goTo(current + 1)}
              className="rounded-full px-10 h-12 text-[11px] font-bold tracking-[0.25em] gap-2 shadow-xl"
            >
              {current >= total - 1 ? ctaLabel : 'PRÓXIMO'}
              <ArrowRight className="w-4 h-4" />
            </Button>

            {/* Ethical chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              {ethicalChips.map((chip) => (
                <span
                  key={chip}
                  className="text-[9px] tracking-[0.2em] uppercase text-white/35 px-2.5 py-1 rounded-full border border-white/10"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SlideCard({ slide, isActive }: { slide: PortalSlide; isActive: boolean }) {
  return (
    <div
      className={cn(
        'relative w-full h-full rounded-[1.75rem] overflow-hidden',
        'border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] backdrop-blur-2xl',
        'shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]',
        isActive && 'ring-1 ring-gold/25'
      )}
    >
      {/* corner glow */}
      <div className="absolute -top-12 -left-12 w-32 h-32 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative h-full flex flex-col items-center justify-center px-6 py-8 md:px-8 md:py-10 text-center">
        <motion.div
          animate={{ y: isActive ? [0, -6, 0] : 0 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-6 relative"
        >
          <div className="absolute inset-0 bg-gold/25 blur-2xl rounded-full" />
          <div className="relative w-14 h-14 rounded-full border border-gold/30 bg-gold/[0.06] flex items-center justify-center text-gold">
            {slide.icon}
          </div>
        </motion.div>

        <h3 className="font-display font-bold text-white text-lg md:text-xl uppercase tracking-[0.08em] mb-3 leading-tight">
          {slide.title}
        </h3>

        <div className="w-10 h-px bg-gold/30 mb-4" />

        <p className="text-white/55 text-sm leading-relaxed line-clamp-5">
          {slide.subtitle}
        </p>

        <div className="absolute bottom-4 right-4 opacity-25">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
        </div>
      </div>
    </div>
  );
}
