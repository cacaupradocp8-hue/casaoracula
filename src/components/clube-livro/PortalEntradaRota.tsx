import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Compass, Flame, Gem, AlertTriangle, Building2, Leaf, Circle, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface PortalSlide {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

interface PortalEntradaRotaProps {
  slug: string;
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
  { icon: <Circle className="w-12 h-12" />, title: 'Bem-vinda à Rota', subtitle: 'Esta obra não inicia. Ela desdomestica.' },
  { icon: <Compass className="w-12 h-12" />, title: 'Tour pela Obra', subtitle: 'Um mapa simbólico para atravessar com cuidado.' },
  { icon: <Flame className="w-12 h-12" />, title: 'Eixo da Travessia', subtitle: 'Instinto e Sombra Viva após a ruptura inicial.' },
  { icon: <Gem className="w-12 h-12" />, title: 'Habilidade Central', subtitle: 'Reconstruir confiança no instinto como orientação psíquica.' },
  { icon: <AlertTriangle className="w-12 h-12" />, title: 'O que Não Fazer', subtitle: 'Não transforme "selvagem" em identidade ou impulsividade.' },
  { icon: <Building2 className="w-12 h-12" />, title: 'Como Atravessar', subtitle: 'Leitura não linear, 1 símbolo por semana e prática real.' },
  { icon: <Leaf className="w-12 h-12" />, title: 'Quando Encerrar', subtitle: 'Quando a escuta interna começa a funcionar sem o livro.' },
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

const GRADIENTS = [
  'linear-gradient(135deg, hsl(270 60% 8%), hsl(280 70% 25%))',
  'linear-gradient(135deg, hsl(250 50% 6%), hsl(260 55% 22%))',
  'linear-gradient(135deg, hsl(240 50% 5%), hsl(40 60% 18%))',
];

function gradientForIndex(i: number, total: number) {
  if (i <= 1) return GRADIENTS[0];
  if (i <= Math.floor(total * 0.6)) return GRADIENTS[1];
  return GRADIENTS[2];
}

export function PortalEntradaRota({
  slug,
  portalNumero,
  portalTitulo,
  slides = DEFAULT_SLIDES,
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
  const total = slides.length;

  const microList = swipes >= 3 ? microcopiesProfundas : microcopiesCalmas;

  useEffect(() => {
    const t = setInterval(() => setMicroIdx(i => i + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const goTo = (i: number) => {
    const next = Math.max(0, Math.min(total - 1, i));
    if (next !== current) setSwipes(s => s + 1);
    setCurrent(next);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -60) goTo(current + 1);
    else if (info.offset.x > 60) goTo(current - 1);
  };

  const finish = () => {
    if (storageKey) {
      try { localStorage.setItem(storageKey, '1'); } catch {}
    }
    onComplete();
  };

  const skip = () => {
    if (storageKey) {
      try { localStorage.setItem(storageKey, '1'); } catch {}
    }
    (onSkip ?? onComplete)();
  };

  const microcopy = microList[microIdx % microList.length];
  const bg = useMemo(() => gradientForIndex(current, total), [current, total]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        animate={{ background: bg }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        style={{ background: bg }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Skip */}
      <button
        onClick={skip}
        className="absolute top-4 right-4 z-20 text-white/50 hover:text-white/90 transition-colors flex items-center gap-1 text-xs uppercase tracking-widest"
      >
        Pular <X className="w-4 h-4" />
      </button>

      <div className="relative z-10 h-full flex flex-col safe-area-inset px-4 py-8 md:py-12">
        {/* Header — refinado, ar entre as linhas */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center pt-2 md:pt-4 space-y-3"
        >
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold/40" />
            <span className="text-[10px] tracking-[0.5em] font-medium text-gold/80">
              CASA ORÁCULA
            </span>
            <span className="h-px w-8 bg-gold/40" />
          </div>
          <div className="font-display text-xl md:text-3xl font-light text-white/95 tracking-tight">
            {portalNumero ? <span className="text-gold/70 font-serif italic mr-2">{`Portal ${portalNumero}`}</span> : null}
            {portalTitulo ?? 'O Chamado'}
          </div>
        </motion.div>

        {/* Carousel — peek lateral e respiro generoso */}
        <div className="flex-1 flex items-center justify-center my-4 md:my-8 overflow-hidden">
          <div className="relative w-full max-w-6xl h-full flex items-center justify-center">
            {slides.map((slide, i) => {
              const diff = i - current;
              const abs = Math.abs(diff);
              if (abs > 2) return null;
              const isActive = diff === 0;
              return (
                <motion.div
                  key={i}
                  drag={isActive ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  onClick={() => !isActive && goTo(i)}
                  animate={{
                    x: `${diff * 72}%`,
                    scale: isActive ? 1 : 1 - abs * 0.15,
                    opacity: isActive ? 1 : Math.max(0.2, 1 - abs * 0.5),
                    filter: isActive ? 'blur(0px)' : `blur(${abs * 2}px)`,
                    zIndex: 10 - abs,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 30 }}
                  className={cn(
                    'absolute w-[88%] sm:w-[72%] md:w-[520px] max-w-[520px]',
                    !isActive && 'cursor-pointer'
                  )}
                >
                  <SlideCard slide={slide} isActive={isActive} chips={ethicalChips} microcopy={isActive ? microcopy : undefined} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots — minimalistas */}
        <div className="flex justify-center items-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'h-[3px] rounded-full transition-all duration-700 ease-out',
                i === current
                  ? 'w-10 bg-gold shadow-[0_0_12px_hsl(var(--gold)/0.5)]'
                  : 'w-1.5 bg-white/15 hover:bg-white/40'
              )}
            />
          ))}
          <span className="ml-3 text-[9px] font-mono tracking-[0.3em] text-white/30 tabular-nums">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* CTA — sutil e elegante */}
        <div className="px-2 max-w-md mx-auto w-full pb-2">
          <Button
            onClick={current >= total - 1 ? finish : () => goTo(current + 1)}
            variant="outline"
            className={cn(
              'w-full h-12 rounded-full border-gold/30 bg-gold/5 text-gold uppercase tracking-[0.3em] text-[11px] font-semibold',
              'hover:bg-gold hover:text-midnight hover:border-gold transition-all duration-500',
              'hover:shadow-[0_0_30px_-5px_hsl(var(--gold)/0.6)]'
            )}
          >
            {current >= total - 1 ? ctaLabel : 'Continuar'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function SlideCard({ slide, isActive, chips, microcopy }: { slide: PortalSlide; isActive: boolean; chips: string[]; microcopy?: string }) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-white/10 bg-white/[0.04] backdrop-blur-2xl p-8 md:p-12',
        'shadow-[0_40px_100px_-30px_hsl(var(--gold)/0.3)]',
        'flex flex-col items-center text-center min-h-[440px] md:min-h-[480px] justify-center gap-6'
      )}
    >
      <motion.div
        animate={{ scale: isActive ? 1 : 0.85, rotate: isActive ? 0 : -6 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="text-gold/90"
      >
        {slide.icon}
      </motion.div>
      <div className="space-y-3">
        <h3 className="font-display font-light text-white text-2xl md:text-3xl tracking-tight leading-tight">
          {slide.title}
        </h3>
        <div className="h-px w-12 bg-gold/30 mx-auto" />
        <p className="text-white/65 text-sm md:text-base leading-relaxed font-serif italic max-w-md">
          {slide.subtitle}
        </p>
      </div>

      {isActive && microcopy && (
        <AnimatePresence mode="wait">
          <motion.p
            key={microcopy}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            className="text-gold/80 text-xs md:text-sm font-serif italic leading-relaxed max-w-sm pt-2 border-t border-white/5"
          >
            "{microcopy}"
          </motion.p>
        </AnimatePresence>
      )}

      <div className="flex flex-wrap justify-center gap-1.5 pt-2">
        {chips.map((c) => (
          <span
            key={c}
            className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/50 text-[10px] tracking-[0.15em] uppercase"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function FloatingParticles() {
  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 6,
      duration: 14 + Math.random() * 16,
      opacity: 0.1 + Math.random() * 0.3,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px hsl(var(--gold) / ${p.opacity})`,
          }}
          animate={{ y: [-20, -80, -20], x: [0, 10, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
