import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info, Quote } from 'lucide-react';
import { AudioOracular } from '@/components/audio/AudioOracular';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useClubeCarrosselSlides } from '@/hooks/useClubeCarrosselSlides';

export interface CarouselSlide {
  titulo?: string;
  frase_simbolica?: string;
  image_url?: string;
  legenda?: string;
}

interface SymbolicCarouselBlockProps {
  title: string;
  icon: React.ReactNode;
  slides?: CarouselSlide[];
  rotaSlug?: string;
  estacaoId?: string;
  audioUrl?: string | null;
  fallbackText?: string;
  className?: string;
}

/**
 * CarouselParticles - Subcomponente para o fundo "respirando"
 */
function CarouselParticles() {
  const shouldReduceMotion = useReducedMotion();
  
  const particles = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: Math.random() * 6 + 8,
      delay: Math.random() * 5
    }));
  }, []);

  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size,
              left: p.left,
              top: p.top,
              backgroundColor: 'rgb(212, 175, 55)',
              opacity: 0.1,
              borderRadius: '50%',
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0.1 }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.1, 0.4, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            backgroundColor: 'rgb(212, 175, 55)',
            borderRadius: '50%',
            filter: 'blur(0.5px)'
          }}
        />
      ))}
    </div>
  );
}

export function SymbolicCarouselBlock({
  title,
  icon,
  slides: initialSlides = [],
  rotaSlug,
  estacaoId,
  audioUrl,
  fallbackText,
  className,
}: SymbolicCarouselBlockProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);
  const shouldReduceMotion = useReducedMotion();
  
  const { data: dbSlides, isLoading } = useClubeCarrosselSlides({ 
    rota_slug: rotaSlug, 
    estacao_id: estacaoId 
  });

  const slides = (dbSlides && dbSlides.length > 0) 
    ? dbSlides.map(s => ({
        titulo: s.titulo || undefined,
        frase_simbolica: s.texto || undefined,
        image_url: s.icone || undefined,
        legenda: s.subtitulo || undefined
      }))
    : initialSlides;

  const total = slides.length;

  const paginate = useCallback((newDirection: number) => {
    if (total <= 1) return;
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + total) % total);
  }, [total]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!isPaused && total > 1) {
      timerRef.current = setInterval(() => paginate(1), 5000);
    }
  }, [isPaused, paginate, total]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer, current]);

  if (isLoading) {
    return (
      <div className={cn("h-[400px] flex items-center justify-center bg-card/10 rounded-3xl border border-white/5", className)}>
        <Info className="w-5 h-5 text-gold/40 animate-pulse" />
      </div>
    );
  }

  if (!slides.length && fallbackText) {
    return (
      <div className={cn(
        'relative rounded-3xl overflow-hidden',
        'bg-gradient-to-br from-card/80 via-card to-background',
        'border border-white/10 p-10 md:p-16 min-h-[400px] flex flex-col justify-center',
        className
      )}>
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gold/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-gold/60">{icon}</span>
            <h3 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold/50 font-medium">{title}</h3>
          </div>
          <div className="h-px w-24 bg-gradient-to-r from-gold/40 to-transparent mb-8" />
          <p className="text-foreground/70 leading-relaxed text-xl font-serif italic max-w-2xl">
            {fallbackText}
          </p>
          {audioUrl && (
            <div className="mt-12 pt-8 border-t border-white/5">
              <AudioOracular audioUrl={audioUrl} titulo={title} compact />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!slides.length) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      filter: 'blur(4px)'
    })
  };

  return (
    <div 
      className={cn('group relative w-full overflow-hidden flex flex-col gap-6', className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Block Header */}
      <div className="flex items-center gap-3 px-4">
        <span className="text-gold/60">{icon}</span>
        <span className="text-[10px] uppercase tracking-[0.4em] text-gold/40 font-medium">
          {title}
        </span>
      </div>

      {/* Carousel Main Container */}
      <div className="relative min-h-[420px] md:min-h-[480px] w-full flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 },
              scale: { duration: 0.4 },
              filter: { duration: 0.4 }
            }}
            className={cn(
              "absolute inset-0 mx-auto max-w-5xl rounded-3xl overflow-hidden",
              "bg-card/30 backdrop-blur-xl border border-white/10",
              "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
              "flex flex-col items-center justify-center text-center p-8 md:p-16"
            )}
          >
            {/* Background Decoration */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/20" />
              {slides[current].image_url && (
                <img 
                  src={slides[current].image_url} 
                  className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay scale-110" 
                  alt="" 
                />
              )}
              <CarouselParticles />
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full flex flex-col items-center gap-8">
              {slides[current].titulo && (
                <motion.h4 
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{ 
                    duration: 0.8,
                    delay: 0.15,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="font-display text-2xl md:text-5xl font-semibold text-white tracking-tight leading-tight max-w-3xl"
                >
                  {slides[current].titulo}
                </motion.h4>
              )}

              {slides[current].frase_simbolica && (
                <div className="relative flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <Quote className="w-6 h-6 text-gold/20 mb-2" />
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10, filter: shouldReduceMotion ? 'blur(0px)' : 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ 
                      duration: 0.9,
                      delay: 0.4,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    className="flex items-center gap-4 max-w-2xl px-4"
                  >
                    <div className="hidden md:block w-[1px] h-12 bg-gold/30 self-start mt-1" />
                    <p className="text-lg md:text-2xl text-white/80 font-serif italic leading-relaxed">
                      {slides[current].frase_simbolica}
                    </p>
                  </motion.div>
                  
                  {slides[current].legenda && (
                    <motion.span 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="mt-4 text-[11px] uppercase tracking-[0.25em] text-white/30 font-medium"
                    >
                      — {slides[current].legenda}
                    </motion.span>
                  )}
                </div>
              )}

              {/* Action Button - Subtle and Elegant */}
              <motion.div
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.6 }}
                className="mt-4"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => paginate(1)}
                  className={cn(
                    "h-9 px-8 rounded-full border-white/10 bg-white/5 text-white/60 text-[10px] uppercase tracking-[0.2em]",
                    "hover:bg-gold/10 hover:border-gold/30 hover:text-gold hover:shadow-[0_0_15px_rgba(212,175,55,0.15)]",
                    "transition-all duration-500"
                  )}
                >
                  Continuar
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Desktop Peek Effects (pseudo-elements) */}
        <div className="hidden lg:block absolute left-0 w-32 h-[80%] bg-gradient-to-r from-background to-transparent z-10 pointer-events-none opacity-50" />
        <div className="hidden lg:block absolute right-0 w-32 h-[80%] bg-gradient-to-l from-background to-transparent z-10 pointer-events-none opacity-50" />

        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-4 z-20 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paginate(-1)}
            className={cn(
              "w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/60",
              "hover:bg-gold/10 hover:border-gold/30 hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]",
              "transition-all duration-300 pointer-events-auto backdrop-blur-md opacity-0 group-hover:opacity-100"
            )}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => paginate(1)}
            className={cn(
              "w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/60",
              "hover:bg-gold/10 hover:border-gold/30 hover:text-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.2)]",
              "transition-all duration-300 pointer-events-auto backdrop-blur-md opacity-0 group-hover:opacity-100"
            )}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Indicators & Audio Controls */}
      <div className="px-4 flex flex-col md:flex-row items-center justify-between gap-8 pt-4">
        {/* Pagination Dots */}
        <div className="flex items-center gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                i === current 
                  ? "w-6 bg-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]" 
                  : "w-1.5 bg-white/10 hover:bg-white/30"
              )}
            />
          ))}
          <span className="ml-4 text-[10px] font-mono text-white/20 tracking-widest uppercase tabular-nums">
            {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Audio Footer */}
        {audioUrl && (
          <div className="w-full md:w-auto md:min-w-[340px] bg-black/20 rounded-2xl p-2 border border-white/5">
            <AudioOracular audioUrl={audioUrl} titulo={title} compact />
          </div>
        )}
      </div>
    </div>
  );
}
