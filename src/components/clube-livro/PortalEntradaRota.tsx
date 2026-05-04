import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Compass, Flame, Gem, AlertTriangle, Building2, Leaf, Circle, X, BookOpen, Quote, Eye, ShieldAlert, FlaskConical, Target, GraduationCap
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
  
  const { data: essencia } = useEssencia8020(bookId);

  const slides = useMemo(() => {
    if (propSlides) return propSlides;
    if (!essencia) return DEFAULT_SLIDES;

    // Gera slides baseados na Essência 80/20 do livro
    return [
      { 
        icon: <BookOpen className="w-12 h-12" />, 
        title: 'Núcleo Vivo', 
        subtitle: essencia.nucleo_vivo || DEFAULT_SLIDES[0].subtitle 
      },
      { 
        icon: <Eye className="w-12 h-12" />, 
        title: 'Imagem Organizadora', 
        subtitle: essencia.imagem_organizadora || DEFAULT_SLIDES[1].subtitle 
      },
      { 
        icon: <Flame className="w-12 h-12" />, 
        title: 'Tensão Central', 
        subtitle: essencia.tensao_central || DEFAULT_SLIDES[2].subtitle 
      },
      { 
        icon: <Target className="w-12 h-12" />, 
        title: 'Habilidade Central', 
        subtitle: essencia.aplicacao_terapeutica || DEFAULT_SLIDES[3].subtitle 
      },
      { 
        icon: <ShieldAlert className="w-12 h-12" />, 
        title: 'Distorção Comum', 
        subtitle: essencia.distorcao_comum || DEFAULT_SLIDES[4].subtitle 
      },
      { 
        icon: <FlaskConical className="w-12 h-12" />, 
        title: 'Exercício Integrativo', 
        subtitle: essencia.exercicio || DEFAULT_SLIDES[5].subtitle 
      },
      { 
        icon: <GraduationCap className="w-12 h-12" />, 
        title: 'Riscos Éticos', 
        subtitle: essencia.riscos_eticos || DEFAULT_SLIDES[6].subtitle 
      },
    ];
  }, [propSlides, essencia]);

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

      <div className="relative z-10 h-full flex flex-col safe-area-inset px-4 py-6 md:py-10">
        {/* Header */}
        <div className="text-center pt-4 md:pt-6">
          <div className="text-[11px] md:text-xs tracking-[0.4em] font-bold text-gold/90">
            CASA ORÁCULA
          </div>
          <div className="mt-2 text-lg md:text-2xl font-display font-black text-white/95">
            {portalNumero ? `Portal ${portalNumero} · ` : ''}{portalTitulo ?? 'O Chamado'}
          </div>
        </div>

        {/* Carousel */}
        <div className="flex-1 flex items-center justify-center my-6 md:my-8 overflow-hidden">
          <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
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
                    x: `${diff * 78}%`,
                    scale: isActive ? 1 : 1 - abs * 0.12,
                    opacity: isActive ? 1 : Math.max(0.35, 1 - abs * 0.4),
                    zIndex: 10 - abs,
                  }}
                  transition={{ type: 'spring', stiffness: 220, damping: 28 }}
                  className={cn(
                    'absolute w-[85%] sm:w-[70%] md:w-[480px] max-w-[480px]',
                    !isActive && 'cursor-pointer'
                  )}
                >
                  <SlideCard slide={slide} isActive={isActive} chips={ethicalChips} />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mb-5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-500',
                i === current ? 'w-8 bg-gold' : 'w-1.5 bg-white/25 hover:bg-white/50'
              )}
            />
          ))}
        </div>

        {/* Microcopy */}
        <div className="px-2 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={microcopy}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.55 }}
              className="rounded-2xl border border-white/15 bg-black/25 backdrop-blur px-5 py-4 text-center"
            >
              <p className="text-gold/95 font-semibold text-sm md:text-base leading-snug">
                "{microcopy}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <div className="px-2 max-w-2xl mx-auto w-full mt-5 pb-2">
          <Button
            onClick={finish}
            className="w-full h-14 rounded-2xl bg-gold text-midnight hover:bg-gold/90 font-black tracking-[0.15em] text-sm shadow-[0_12px_40px_-8px_hsl(var(--gold)/0.6)]"
          >
            {current >= total - 1 ? ctaLabel : 'CONTINUAR'}
          </Button>
          {current < total - 1 && (
            <button
              onClick={() => goTo(current + 1)}
              className="block mx-auto mt-3 text-white/50 hover:text-white/80 text-[11px] uppercase tracking-widest"
            >
              Avançar slide
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function SlideCard({ slide, isActive, chips }: { slide: PortalSlide; isActive: boolean; chips: string[] }) {
  return (
    <div
      className={cn(
        'rounded-[2rem] border border-white/20 bg-white/[0.07] backdrop-blur-xl p-7 md:p-9',
        'shadow-[0_30px_80px_-20px_hsl(var(--gold)/0.25)]',
        'flex flex-col items-center text-center'
      )}
    >
      <motion.div
        animate={{ scale: isActive ? 1 : 0.85, rotate: isActive ? 0 : -8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="text-gold mb-5"
      >
        {slide.icon}
      </motion.div>
      <h3 className="font-display font-black text-white text-xl md:text-2xl uppercase leading-tight tracking-wide">
        {slide.title}
      </h3>
      <p className="mt-4 text-white/75 text-sm md:text-base leading-relaxed font-medium max-w-md line-clamp-4">
        {slide.subtitle}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {chips.map((c) => (
          <span
            key={c}
            className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-[11px] font-semibold"
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
