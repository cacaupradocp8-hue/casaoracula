import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { AudioOracular } from '@/components/audio/AudioOracular';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useClubeCarrosselSlides } from '@/hooks/useClubeCarrosselSlides';

export interface CarouselSlide {
  titulo?: string;
  frase_simbolica?: string;
  image_url?: string;
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
  
  const { data: dbSlides, isLoading } = useClubeCarrosselSlides({ 
    rota_slug: rotaSlug, 
    estacao_id: estacaoId 
  });

  const slides = (dbSlides && dbSlides.length > 0) 
    ? dbSlides.map(s => ({
        titulo: s.titulo || undefined,
        frase_simbolica: s.texto || undefined,
        image_url: s.icone || undefined // Using icone as image_url for now if image_url doesn't exist in DB
      }))
    : initialSlides;

  const total = slides.length;

  const next = useCallback(() => {
    if (total > 1) setCurrent((c) => (c + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    if (total > 1) setCurrent((c) => (c - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [next, total]);

  if (isLoading) {
    return (
      <div className={cn("h-[400px] flex items-center justify-center bg-card/20 rounded-2xl border border-white/5", className)}>
        <Info className="w-5 h-5 text-gold/40 animate-pulse" />
      </div>
    );
  }

  if (!slides.length && fallbackText) {
    return (
      <div className={cn(
        'relative rounded-2xl overflow-hidden',
        'bg-gradient-to-br from-card/90 via-card to-secondary/50',
        'border border-border/20 p-8 min-h-[300px]',
        className
      )}>
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-gold/5 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-primary/5 blur-[60px] pointer-events-none" />

        <div className="relative z-10 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-gold">{icon}</span>
            <h3 className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-gold/80 font-medium">{title}</h3>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mb-6" />
          <p className="text-foreground/80 leading-relaxed text-base font-body italic flex-grow">
            {fallbackText}
          </p>
          {audioUrl && (
            <div className="mt-6 pt-4 border-t border-border/10">
              <AudioOracular audioUrl={audioUrl} titulo={title} compact />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <div className={cn(
      'relative rounded-2xl overflow-hidden flex flex-col',
      'border border-border/30 bg-card/20 backdrop-blur-sm shadow-xl',
      className
    )}>
      {/* Content area with fixed aspect ratio for stability */}
      <div className="relative aspect-video md:aspect-[21/9] min-h-[350px] md:min-h-[400px] overflow-hidden bg-black/40">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col"
          >
            {/* Background (Image or Gradient) */}
            {slide.image_url ? (
              <div className="absolute inset-0 z-0">
                <img
                  src={slide.image_url}
                  alt={slide.titulo || ""}
                  className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-primary/5" />
            )}

            {/* Content Overlay */}
            <div className="relative z-10 flex-grow flex flex-col justify-center p-8 md:p-16 max-w-4xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-gold/60">{icon}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold/50 font-medium">{title}</span>
              </div>

              <div className="space-y-6">
                {slide.titulo && (
                  <h3 className="font-display text-2xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                    {slide.titulo}
                  </h3>
                )}
                {slide.frase_simbolica && (
                  <div className="relative">
                    <div className="absolute -left-6 top-0 bottom-0 w-1 bg-gold/30 rounded-full" />
                    <p className="text-base md:text-xl text-white/80 italic leading-relaxed font-serif pl-4">
                      {slide.frase_simbolica}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation - Hidden on mobile, visible on hover/touch on tablet+ */}
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4 z-20 pointer-events-none">
          <Button
            variant="ghost"
            size="icon"
            onClick={prev}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 pointer-events-auto backdrop-blur-sm opacity-0 md:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={next}
            className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 border border-white/10 pointer-events-auto backdrop-blur-sm opacity-0 md:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5 text-white/70" />
          </Button>
        </div>
      </div>

      {/* Footer controls (Desktop-friendly, no overlap) */}
      <div className="p-6 border-t border-white/5 bg-black/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current ? "w-8 bg-gold" : "w-1.5 bg-white/20 hover:bg-white/40"
              )}
            />
          ))}
          <span className="ml-4 text-[10px] font-mono text-white/30 tracking-widest uppercase">
            {current + 1} / {total}
          </span>
        </div>

        {audioUrl && (
          <div className="w-full md:w-auto md:min-w-[300px]">
            <AudioOracular audioUrl={audioUrl} titulo={title} compact />
          </div>
        )}
      </div>
    </div>
  );
}
