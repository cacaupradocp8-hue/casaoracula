import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CarouselSlide {
  titulo?: string;
  frase_simbolica?: string;
  image_url?: string;
}

interface SymbolicCarouselBlockProps {
  title: string;
  icon: React.ReactNode;
  slides: CarouselSlide[];
  audioUrl?: string | null;
  fallbackText?: string;
  className?: string;
}

export function SymbolicCarouselBlock({
  title,
  icon,
  slides,
  audioUrl,
  fallbackText,
  className,
}: SymbolicCarouselBlockProps) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  // Auto-advance every 8s
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, total]);

  // Fallback — elevated card style
  if (!slides.length && fallbackText) {
    return (
      <div className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-card/90 via-card to-secondary/50',
        'border border-border/20 p-8',
        className
      )}>
        {/* Ambient glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold">{icon}</span>
            <h3 className="text-xs uppercase tracking-[0.25em] text-gold/80 font-medium">{title}</h3>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-6" />
          <p className="text-foreground/80 leading-[1.9] whitespace-pre-line text-base font-body italic">
            {fallbackText}
          </p>
        </div>
      </div>
    );
  }

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <div className={cn(
      'relative rounded-2xl overflow-hidden',
      'border border-border/10',
      className
    )}>
      {/* Full-bleed slide area */}
      <div className="relative aspect-[16/9] min-h-[320px] md:min-h-[420px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            {/* Background image — full bleed */}
            {slide.image_url ? (
              <>
                <img
                  src={slide.image_url}
                  alt={slide.titulo || `Slide ${current + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Cinematic overlay layers */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/30 via-transparent to-background/30" />
              </>
            ) : (
              /* Gradient placeholder when no image */
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-card to-background">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--gold)/0.08),transparent_70%)]" />
              </div>
            )}

            {/* Content overlay — positioned at bottom with generous space */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              {/* Title bar with icon */}
              <div className="flex items-center gap-2.5 mb-6">
                <span className="text-gold/70">{icon}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold/60 font-medium">{title}</span>
                <div className="h-px flex-1 bg-gradient-to-r from-gold/20 to-transparent" />
              </div>

              {/* Main content */}
              <div className="space-y-4 max-w-2xl">
                {slide.titulo && (
                  <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground leading-[1.2] tracking-wide">
                    {slide.titulo}
                  </h3>
                )}
                {slide.frase_simbolica && (
                  <p className="text-base md:text-lg text-foreground/80 italic leading-relaxed font-body max-w-xl">
                    "{slide.frase_simbolica}"
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows — floating on sides */}
        {total > 1 && (
          <>
            <button
              onClick={() => setCurrent(Math.max(0, current - 1))}
              disabled={current === 0}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 z-20',
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-background/40 backdrop-blur-md border border-border/20',
                'text-foreground/70 hover:text-gold hover:bg-background/60',
                'transition-all duration-300 disabled:opacity-0'
              )}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrent(Math.min(total - 1, current + 1))}
              disabled={current === total - 1}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 z-20',
                'w-10 h-10 rounded-full flex items-center justify-center',
                'bg-background/40 backdrop-blur-md border border-border/20',
                'text-foreground/70 hover:text-gold hover:bg-background/60',
                'transition-all duration-300 disabled:opacity-0'
              )}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Bottom bar — indicators + audio */}
      <div className="bg-card/80 backdrop-blur-sm border-t border-border/10 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'rounded-full transition-all duration-500 ease-out',
                  i === current
                    ? 'w-8 h-1.5 bg-gradient-to-r from-gold to-gold/60'
                    : 'w-1.5 h-1.5 bg-muted-foreground/25 hover:bg-gold/40'
                )}
              />
            ))}
          </div>

          {/* Counter */}
          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-widest">
            {(current + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Audio player */}
        {audioUrl && (
          <div className="mt-4 pt-4 border-t border-border/10">
            <UnifiedAudioPlayer audioUrl={audioUrl} title={title} size="sm" />
          </div>
        )}
      </div>
    </div>
  );
}
