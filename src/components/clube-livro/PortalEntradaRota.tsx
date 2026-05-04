import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Compass, Flame, Gem, AlertTriangle, Building2, Leaf, Circle, X, BookOpen, Quote, Eye, ShieldAlert, FlaskConical, Target, GraduationCap, Sparkles
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
  'radial-gradient(circle at center, hsl(270 60% 8%), hsl(280 70% 5%))',
  'radial-gradient(circle at center, hsl(250 50% 6%), hsl(260 55% 4%))',
  'radial-gradient(circle at center, hsl(240 50% 5%), hsl(220 60% 3%))',
];

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
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { data: essencia } = useEssencia8020(bookId);

  const slides = useMemo(() => {
    if (propSlides) return propSlides;
    if (!essencia) return DEFAULT_SLIDES;

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
  const bg = useMemo(() => GRADIENTS[current % GRADIENTS.length], [current]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-midnight select-none"
    >
      {/* Cinematic Background */}
      <motion.div
        className="absolute inset-0"
        animate={{ background: bg }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
      
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-midnight/80 pointer-events-none" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Close/Skip */}
      <button
        onClick={skip}
        className="absolute top-8 right-8 z-[110] text-white/30 hover:text-white/90 transition-all flex items-center gap-2 group"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Sair</span>
        <X className="w-5 h-5" />
      </button>

      <div className="relative z-10 h-full flex flex-col pt-16 pb-8 px-6 max-w-lg mx-auto md:max-w-none md:px-12">
        {/* Header - Asymmetric Typography */}
        <div className="mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mb-2"
          >
            <div className="h-[1px] w-8 bg-gold/50" />
            <span className="text-[10px] tracking-[0.5em] font-bold text-gold/80 uppercase">
              Casa Orácula
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-4xl md:text-6xl text-white font-black leading-none"
          >
            {portalTitulo ?? 'O Chamado'}
            {portalNumero && <span className="text-gold/30 ml-4 font-serif italic text-3xl md:text-5xl">#{portalNumero}</span>}
          </motion.h1>
        </div>

        {/* 3D Carousel Stage */}
        <div className="flex-1 relative perspective-[2000px] flex items-center justify-center overflow-visible">
          <div className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center">
            <AnimatePresence mode="popLayout">
              {slides.map((slide, i) => {
                const diff = i - current;
                const absDiff = Math.abs(diff);
                
                // Only render neighbors
                if (absDiff > 2) return null;

                const isActive = diff === 0;

                return (
                  <motion.div
                    key={i}
                    drag={isActive ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.8, x: diff * 300, rotateY: diff * 45 }}
                    animate={{
                      x: diff * (window.innerWidth < 768 ? 260 : 380),
                      z: -absDiff * 250,
                      rotateY: diff * -35,
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : 0.4 - (absDiff * 0.1),
                      filter: isActive ? 'blur(0px)' : 'blur(2px)',
                    }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 32,
                      mass: 1
                    }}
                    className={cn(
                      'absolute w-[280px] md:w-[380px] aspect-[3/4] preserve-3d',
                      !isActive && 'cursor-pointer pointer-events-none'
                    )}
                    onClick={() => !isActive && goTo(i)}
                  >
                    <SlideCard slide={slide} isActive={isActive} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Navigation & Microcopy */}
        <div className="mt-12 space-y-8 max-w-xl mx-auto w-full">
          {/* Progress Indicators */}
          <div className="flex justify-center items-end gap-3 h-4">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="group relative flex flex-col items-center"
              >
                <motion.div
                  animate={{
                    height: i === current ? 16 : 4,
                    backgroundColor: i === current ? 'hsl(var(--gold))' : 'rgba(255,255,255,0.2)',
                  }}
                  className="w-1 rounded-full transition-colors"
                />
                <AnimatePresence>
                  {i === current && (
                    <motion.div
                      layoutId="dot-glow"
                      className="absolute -inset-2 bg-gold/20 blur-md rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>

          {/* Floating Whisper Microcopy */}
          <div className="h-12 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={microcopy}
                initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
                animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                exit={{ opacity: 0, filter: 'blur(8px)', y: -10 }}
                transition={{ duration: 0.8 }}
                className="text-gold/60 font-serif italic text-center text-sm md:text-base tracking-wide"
              >
                "{microcopy}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Main Action */}
          <div className="flex flex-col gap-4">
            <Button
              onClick={current >= total - 1 ? finish : () => goTo(current + 1)}
              className="w-full h-16 rounded-full bg-white text-midnight hover:bg-gold hover:text-midnight transition-all duration-500 font-bold tracking-[0.2em] text-xs shadow-2xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {current >= total - 1 ? ctaLabel : 'PRÓXIMA REVELAÇÃO'}
                <Sparkles className="w-4 h-4" />
              </span>
            </Button>
            
            <motion.div 
              className="flex justify-between items-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-[9px] text-white/20 uppercase tracking-[0.3em]">
                {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
              </span>
              <button 
                onClick={skip}
                className="text-[9px] text-white/40 uppercase tracking-[0.3em] hover:text-gold transition-colors"
              >
                Pular Introdução
              </button>
            </motion.div>
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
        'relative w-full h-full rounded-[2.5rem] overflow-hidden transition-all duration-700',
        'border border-white/10 bg-white/[0.03] backdrop-blur-2xl',
        'shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]',
        isActive ? 'ring-1 ring-gold/20' : ''
      )}
    >
      {/* Card Gloss Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      <div className="relative h-full flex flex-col items-center justify-center p-8 md:p-12 text-center">
        {/* Animated Icon Container */}
        <motion.div
          animate={{ 
            y: isActive ? [0, -10, 0] : 0,
            scale: isActive ? 1.1 : 0.9,
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: 'easeInOut' 
          }}
          className="relative mb-10"
        >
          <div className="absolute inset-0 bg-gold/20 blur-3xl rounded-full" />
          <div className="relative text-gold drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
            {slide.icon}
          </div>
        </motion.div>

        <motion.h3 
          animate={{ opacity: isActive ? 1 : 0.5 }}
          className="font-display font-black text-white text-2xl md:text-3xl uppercase tracking-wider mb-6 leading-tight"
        >
          {slide.title}
        </motion.h3>

        <div className="w-12 h-[1px] bg-gold/30 mb-6" />

        <p className="text-white/60 text-sm md:text-base leading-relaxed font-body tracking-wide line-clamp-6">
          {slide.subtitle}
        </p>

        {/* Decorative corner element */}
        <div className="absolute bottom-6 right-6 opacity-20">
          <Sparkles className="w-4 h-4 text-gold" />
        </div>
      </div>
    </div>
  );
}

function FloatingParticles() {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      duration: 20 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.4,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/40"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 5}px hsl(var(--gold) / 0.5)`,
          }}
          animate={{ 
            y: [0, -100, 0], 
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
        />
      ))}
    </div>
  );
}
