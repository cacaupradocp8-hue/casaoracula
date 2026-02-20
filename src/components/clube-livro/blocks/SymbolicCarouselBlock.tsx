import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

  // Fallback to plain text if no slides
  if (!slides.length && fallbackText) {
    return (
      <Card className={cn(
        'relative overflow-hidden border-border/20',
        'bg-gradient-to-br from-card via-card to-card/80',
        className
      )}>
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-gold/20 rounded-tl-lg" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-gold/20 rounded-br-lg" />
        
        <CardHeader className="pb-3 relative">
          <CardTitle className="text-xs uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2.5 font-medium">
            <span className="text-gold">{icon}</span>
            {title}
          </CardTitle>
          <div className="h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-2" />
        </CardHeader>
        <CardContent className="relative">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm italic">
            {fallbackText}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <Card className={cn(
      'relative overflow-hidden border-border/20',
      'bg-gradient-to-br from-card via-card to-card/80',
      className
    )}>
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-gold/20 rounded-tl-lg pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-gold/20 rounded-br-lg pointer-events-none z-10" />

      <CardHeader className="pb-3 relative z-10">
        <CardTitle className="text-xs uppercase tracking-[0.2em] text-gold/80 flex items-center gap-2.5 font-medium">
          <span className="text-gold">{icon}</span>
          {title}
        </CardTitle>
        <div className="h-px w-full bg-gradient-to-r from-gold/30 via-gold/10 to-transparent mt-2" />
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Slide area — immersive */}
        <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-gradient-to-br from-background via-muted/30 to-background ring-1 ring-border/10">
          {/* Ambient glow behind slide */}
          <div className="absolute inset-0 bg-gradient-to-t from-gold/5 via-transparent to-transparent pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Background image with sophisticated overlay */}
              {slide.image_url && (
                <>
                  <img
                    src={slide.image_url}
                    alt={slide.titulo || `Slide ${current + 1}`}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/30" />
                  <div className="absolute inset-0 backdrop-blur-[1px]" />
                </>
              )}

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-4 max-w-[85%]">
                {/* Decorative symbol */}
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
                
                {slide.titulo && (
                  <h3 className="font-display text-lg md:text-xl font-semibold text-foreground leading-snug tracking-wide">
                    {slide.titulo}
                  </h3>
                )}
                {slide.frase_simbolica && (
                  <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed max-w-md">
                    "{slide.frase_simbolica}"
                  </p>
                )}

                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation — refined */}
        <div className="flex items-center justify-between px-1">
          <Button
            variant="ghost"
            size="icon"
            disabled={current === 0}
            onClick={() => setCurrent(Math.max(0, current - 1))}
            className="rounded-full h-9 w-9 text-gold/60 hover:text-gold hover:bg-gold/10 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'rounded-full transition-all duration-500 ease-out',
                  i === current
                    ? 'w-7 h-2 bg-gradient-to-r from-gold/80 to-gold/50'
                    : 'w-2 h-2 bg-muted-foreground/20 hover:bg-gold/30'
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={current === total - 1}
            onClick={() => setCurrent(Math.min(total - 1, current + 1))}
            className="rounded-full h-9 w-9 text-gold/60 hover:text-gold hover:bg-gold/10 disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Slide counter */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-muted-foreground/50 tracking-wider">
            {(current + 1).toString().padStart(2, '0')} / {total.toString().padStart(2, '0')}
          </span>
        </div>

        {/* Audio player */}
        {audioUrl && (
          <div className="pt-3 border-t border-gold/10">
            <UnifiedAudioPlayer audioUrl={audioUrl} title={title} size="sm" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
