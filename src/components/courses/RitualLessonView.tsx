import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check, Sparkles, BookOpen, Flower2 } from 'lucide-react';
import { CourseLesson } from '@/types/course';
import { AudioOracular } from '@/components/audio/AudioOracular';
import { motion, AnimatePresence } from 'framer-motion';

export interface RitualSlide {
  image_url: string;
  titulo?: string;
  frase_simbolica?: string;
}

interface RitualLessonViewProps {
  lesson: CourseLesson;
  courseId: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function RitualLessonView({
  lesson,
  courseId,
  isCompleted,
  onMarkComplete,
  onNavigate,
  hasPrev,
  hasNext,
}: RitualLessonViewProps) {
  const slides: RitualSlide[] = Array.isArray(lesson.ritual_slides) ? lesson.ritual_slides as RitualSlide[] : [];
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = slides.length;
  const isClosingSlide = currentSlide === totalSlides; // virtual closing slide

  const goTo = (idx: number) => {
    setCurrentSlide(Math.max(0, Math.min(idx, totalSlides)));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      {/* Cover / Header */}
      {lesson.capa_url && currentSlide === 0 && totalSlides > 0 && (
        <div className="relative w-full aspect-[21/9] max-h-[340px] overflow-hidden">
          <img
            src={lesson.capa_url}
            alt={lesson.titulo}
            className="w-full h-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute bottom-6 left-0 right-0 text-center px-4">
            <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground leading-snug">
              {lesson.titulo}
            </h1>
            <div className="flex items-center justify-center gap-3 mt-2">
              {lesson.jornada && (
                <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                  {lesson.jornada}
                </Badge>
              )}
              {lesson.portal && (
                <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                  {lesson.portal}
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Slides Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[850px]">
          <AnimatePresence mode="wait">
            {!isClosingSlide && slides[currentSlide] ? (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="space-y-6"
              >
                {/* Slide Image */}
                <div className="relative rounded-xl overflow-hidden aspect-video shadow-lg shadow-primary/5">
                  <img
                    src={slides[currentSlide].image_url}
                    alt={slides[currentSlide].titulo || `Slide ${currentSlide + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay text on image */}
                  {(slides[currentSlide].titulo || slides[currentSlide].frase_simbolica) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                      {slides[currentSlide].titulo && (
                        <h2 className="font-display text-2xl lg:text-3xl font-semibold text-white text-center px-8 drop-shadow-lg">
                          {slides[currentSlide].titulo}
                        </h2>
                      )}
                      {slides[currentSlide].frase_simbolica && (
                        <p className="text-white/80 text-sm lg:text-base mt-2 italic text-center px-8 max-w-[600px] drop-shadow">
                          {slides[currentSlide].frase_simbolica}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Slide counter */}
                <div className="flex items-center justify-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentSlide
                          ? 'w-8 bg-primary'
                          : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    />
                  ))}
                  {/* Closing dot */}
                  <button
                    onClick={() => goTo(totalSlides)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      isClosingSlide
                        ? 'w-8 bg-primary'
                        : 'w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                </div>
              </motion.div>
            ) : isClosingSlide ? (
              <motion.div
                key="closing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center space-y-8 py-12"
              >
                <Sparkles className="w-12 h-12 mx-auto text-primary/60" />
                <div className="space-y-3">
                  <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                    Momento de Integração
                  </h2>
                  <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Permita que as imagens e sons reverberem em você.
                    Escolha um caminho para continuar sua travessia.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Button
                    variant="mystical"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => window.location.href = '/laboratorio-8020'}
                  >
                    <BookOpen className="w-4 h-4" />
                    Laboratório 80/20
                  </Button>
                  <Button
                    variant="mystical"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => window.location.href = '/jardim-psique'}
                  >
                    <Flower2 className="w-4 h-4" />
                    Jardim da Psique
                  </Button>
                  <Button
                    variant="mystical"
                    size="lg"
                    className="gap-2 w-full sm:w-auto"
                    onClick={() => window.location.href = '/jardim-heroina'}
                  >
                    <Sparkles className="w-4 h-4" />
                    Jardim da Heroína
                  </Button>
                </div>

                {!isCompleted && (
                  <Button onClick={onMarkComplete} className="gap-2 mt-4">
                    <Check className="w-4 h-4" />
                    Marcar como Concluída
                  </Button>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Slide Navigation */}
          {totalSlides > 0 && (
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="ghost"
                size="icon"
                disabled={currentSlide === 0}
                onClick={() => goTo(currentSlide - 1)}
                className="rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {isClosingSlide ? 'Integração' : `${currentSlide + 1} / ${totalSlides}`}
              </span>
              <Button
                variant="ghost"
                size="icon"
                disabled={isClosingSlide}
                onClick={() => goTo(currentSlide + 1)}
                className="rounded-full"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Audio Player */}
      {lesson.audio_url && (
        <div className="sticky bottom-0 w-full bg-card/95 backdrop-blur-md border-t border-border p-3">
          <div className="max-w-[600px] mx-auto">
            <AudioOracular
              audioUrl={lesson.audio_url}
              titulo={lesson.titulo}
              compact
            />
          </div>
        </div>
      )}

      {/* Lesson Navigation (prev/next lesson) */}
      <div className="border-t border-border p-4">
        <div className="max-w-[750px] mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => onNavigate('prev')}
            disabled={!hasPrev}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <Button
            variant={hasNext ? 'default' : 'outline'}
            onClick={() => onNavigate('next')}
            disabled={!hasNext}
            className="gap-2"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
