import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  Compass, Flame, Gem, AlertTriangle, Building2, Leaf, Circle, X, BookOpen, Eye, ShieldAlert, FlaskConical, Target, GraduationCap, Sparkles, ArrowRight
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
  'radial-gradient(circle at 20% 20%, hsl(270 60% 12%), hsl(280 70% 5%))',
  'radial-gradient(circle at 80% 80%, hsl(250 50% 10%), hsl(260 55% 4%))',
  'radial-gradient(circle at 50% 50%, hsl(240 50% 8%), hsl(220 60% 3%))',
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
  
  const { data: essencia } = useEssencia8020(bookId);

  const slides = useMemo(() => {
    if (propSlides) return propSlides;
    if (!essencia) return DEFAULT_SLIDES;

    return [
      { 
        icon: <BookOpen className="w-12 h-12" />, 
        title: 'Núcleo Vivo', 
        subtitle: essencia?.nucleo_vivo || DEFAULT_SLIDES[0].subtitle 
      },
      { 
        icon: <Eye className="w-12 h-12" />, 
        title: 'Imagem Organizadora', 
        subtitle: essencia?.imagem_organizadora || DEFAULT_SLIDES[1].subtitle 
      },
      { 
        icon: <Flame className="w-12 h-12" />, 
        title: 'Tensão Central', 
        subtitle: essencia?.tensao_central || DEFAULT_SLIDES[2].subtitle 
      },
      { 
        icon: <Target className="w-12 h-12" />, 
        title: 'Habilidade Central', 
        subtitle: essencia?.aplicacao_terapeutica || DEFAULT_SLIDES[3].subtitle 
      },
      { 
        icon: <ShieldAlert className="w-12 h-12" />, 
        title: 'Distorção Comum', 
        subtitle: essencia?.distorcao_comum || DEFAULT_SLIDES[4].subtitle 
      },
      { 
        icon: <FlaskConical className="w-12 h-12" />, 
        title: 'Exercício Integrativo', 
        subtitle: essencia?.exercicio || DEFAULT_SLIDES[5].subtitle 
      },
      { 
        icon: <GraduationCap className="w-12 h-12" />, 
        title: 'Riscos Éticos', 
        subtitle: essencia?.riscos_eticos || DEFAULT_SLIDES[6].subtitle 
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
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-[0.05] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-midnight/90 pointer-events-none" />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Skip button with luxury styling */}
      <button
        onClick={skip}
        className="absolute top-8 right-8 z-[110] flex items-center gap-3 text-white/40 hover:text-gold transition-all duration-500 group"
      >
        <span className="text-[9px] uppercase tracking-[0.4em] font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Sair da Revelação</span>
        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-gold/40 group-hover:rotate-90 transition-all duration-500">
          <X className="w-4 h-4" />
        </div>
      </button>

      <div className="relative z-10 h-full flex flex-col pt-12 pb-8 px-6 md:px-20 lg:px-32">
        {/* Header - Editorial Style */}
        <div className="max-w-4xl mx-auto w-full mb-8 md:mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="flex items-center gap-6 mb-4"
          >
            <span className="text-[10px] tracking-[0.6em] font-black text-gold uppercase">
              Casa Orácula
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/40 to-transparent" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col md:flex-row md:items-end gap-2 md:gap-6"
          >
            <h1 className="font-display text-4xl md:text-7xl text-white font-black leading-[0.8] tracking-tighter">
              {portalTitulo ?? 'O Chamado'}
            </h1>
            {portalNumero && (
              <span className="font-serif italic text-xl md:text-3xl text-gold/30 mb-1 md:mb-2">
                Fase {String(portalNumero).padStart(2, '0')}
              </span>
            )}
          </motion.div>
        </div>

        {/* 3D Carousel Stage */}
        <div className="flex-1 relative perspective-[2000px] flex items-center justify-center">
          <div className="relative w-full h-full max-h-[500px] flex items-center justify-center">
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
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    initial={{ opacity: 0, scale: 0.8, x: diff * 400, rotateY: diff * 60 }}
                    animate={{
                      x: diff * (window.innerWidth < 768 ? 240 : 380),
                      z: isActive ? 0 : -absDiff * 300,
                      rotateY: diff * -35,
                      scale: isActive ? 1 : 0.85,
                      opacity: isActive ? 1 : 0.4 - (absDiff * 0.1),
                      filter: isActive ? 'blur(0px)' : 'blur(2px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 25,
                      mass: 0.8
                    }}
                    className={cn(
                      'absolute w-[280px] md:w-[380px] aspect-[10/14] preserve-3d',
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

        {/* Navigation Bar - Minimalist Luxury */}
        <div className="mt-8 md:mt-12 max-w-4xl mx-auto w-full flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Microcopy - The Whisper */}
          <div className="flex-1 max-w-md order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={microcopy}
                initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-1"
              >
                <span className="text-[8px] tracking-[0.4em] text-gold/40 uppercase font-bold">Frequência Oracular</span>
                <p className="text-white/60 font-serif italic text-base md:text-lg leading-relaxed">
                  "{microcopy}"
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Center */}
          <div className="flex flex-col items-center md:items-end gap-6 order-1 md:order-2 shrink-0">
            {/* Dots */}
            <div className="flex items-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="relative h-6 w-1 flex items-center justify-center group"
                >
                  <motion.div
                    animate={{
                      height: i === current ? 24 : 6,
                      backgroundColor: i === current ? 'hsl(var(--gold))' : 'rgba(255,255,255,0.15)',
                    }}
                    className="w-[2px] transition-all duration-500 rounded-full"
                  />
                </button>
              ))}
            </div>

            <Button
              onClick={current >= total - 1 ? finish : () => goTo(current + 1)}
              className="group relative overflow-hidden bg-white text-midnight h-16 px-10 rounded-full font-bold tracking-[0.25em] text-[10px] transition-all duration-700 shadow-2xl hover:bg-gold hover:text-midnight"
            >
              <div className="absolute inset-0 bg-gold translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center gap-3">
                {current >= total - 1 ? ctaLabel : 'PRÓXIMO PORTAL'}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </Button>
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
        'relative w-full h-full rounded-[2rem] overflow-hidden transition-all duration-700',
        'border border-white/10 bg-white/[0.02] backdrop-blur-3xl',
        'shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]',
        isActive ? 'ring-1 ring-gold/20' : ''
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />
      
      <div className="relative h-full flex flex-col items-center justify-center p-10 md:p-14 text-center">
        {/* Decorative mask */}
        <div className="absolute top-0 left-0 w-24 h-24 bg-gold/5 blur-3xl rounded-full -translate-x-12 -translate-y-12" />
        
        <motion.div
          animate={{ 
            y: isActive ? [0, -12, 0] : 0,
            scale: isActive ? 1.15 : 0.9,
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gold/30 blur-3xl rounded-full" />
          <div className="relative text-gold drop-shadow-[0_0_20px_rgba(234,179,8,0.6)]">
            {slide.icon}
          </div>
        </motion.div>

        <motion.h3 
          className="font-display font-black text-white text-3xl md:text-4xl uppercase tracking-[0.1em] mb-8 leading-[0.9]"
        >
          {slide.title}
        </motion.h3>

        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-8" />

        <p className="text-white/50 text-base md:text-lg leading-relaxed font-body tracking-wide line-clamp-6">
          {slide.subtitle}
        </p>

        {/* Decorative corner element */}
        <div className="absolute bottom-8 right-8 opacity-30">
          <Sparkles className="w-5 h-5 text-gold" />
        </div>
      </div>
    </div>
  );
}

function FloatingParticles() {
  const particles = useRef(
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 0.5 + Math.random() * 2,
      duration: 15 + Math.random() * 25,
      opacity: 0.1 + Math.random() * 0.4,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.current.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 6}px hsl(var(--gold) / 0.4)`,
          }}
          animate={{ 
            y: [0, -150, 0], 
            x: [0, Math.random() * 30 - 15, 0],
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
