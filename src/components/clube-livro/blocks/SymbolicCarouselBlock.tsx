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
      <Card className={cn('bg-card/50 border-border/30', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            {icon}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{fallbackText}</p>
        </CardContent>
      </Card>
    );
  }

  if (!slides.length) return null;

  const slide = slides[current];

  return (
    <Card className={cn('bg-card/50 border-border/30 overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm uppercase tracking-widest text-muted-foreground flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Slide area */}
        <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-muted/20">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
              {/* Background image */}
              {slide.image_url && (
                <img
                  src={slide.image_url}
                  alt={slide.titulo || `Slide ${current + 1}`}
                  className="absolute inset-0 w-full h-full object-cover opacity-40"
                />
              )}

              {/* Content overlay */}
              <div className="relative z-10 flex flex-col items-center justify-center gap-3 max-w-[85%]">
                {slide.titulo && (
                  <h3 className="font-display text-lg md:text-xl font-semibold text-foreground leading-snug">
                    {slide.titulo}
                  </h3>
                )}
                {slide.frase_simbolica && (
                  <p className="text-sm md:text-base text-muted-foreground italic leading-relaxed">
                    {slide.frase_simbolica}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots + navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            disabled={current === 0}
            onClick={() => setCurrent(Math.max(0, current - 1))}
            className="rounded-full h-8 w-8"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === current
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                )}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            disabled={current === total - 1}
            onClick={() => setCurrent(Math.min(total - 1, current + 1))}
            className="rounded-full h-8 w-8"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Audio player */}
        {audioUrl && (
          <div className="pt-2 border-t border-border/30">
            <UnifiedAudioPlayer audioUrl={audioUrl} title={title} size="sm" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
