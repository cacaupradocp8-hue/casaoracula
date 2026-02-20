import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText,
  Lock
} from 'lucide-react';
import { CourseLesson, CourseModuleWithLessons } from '@/types/course';
import DOMPurify from 'dompurify';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { PedagogicalModuleView } from './PedagogicalModuleView';
import { RitualLessonView } from './RitualLessonView';
import { DiarioBordoAula } from '@/components/shared/DiarioBordoAula';
import { UnifiedAudioPlayer } from '@/components/audio/UnifiedAudioPlayer';
import { CloudflareStreamPlayer } from '@/components/video/CloudflareStreamPlayer';
import { useCloudflareVideo } from '@/hooks/useCloudflareVideo';

interface LessonContentProps {
  lesson: CourseLesson;
  module?: CourseModuleWithLessons | null;
  courseId: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export function LessonContent({
  lesson, module, courseId, isCompleted, onMarkComplete, onNavigate, hasPrev, hasNext
}: LessonContentProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const { extractVideoId, isCloudflareVideoId } = useCloudflareVideo();

  const videoId = useMemo(() => {
    if (!lesson.video_url) return null;
    if (isCloudflareVideoId(lesson.video_url)) return lesson.video_url;
    return extractVideoId(lesson.video_url);
  }, [lesson.video_url, extractVideoId, isCloudflareVideoId]);

  const isRitual = lesson.content_type === 'ritual';
  const isPedagogical = module?.formato_pedagogico === true;
  
  const pedagogicalData = isPedagogical && module ? {
    id: module.id,
    titulo: module.titulo,
    subtitulo: module.subtitulo || undefined,
    descricao: module.descricao || undefined,
    video_principal_url: module.video_principal_url || undefined,
    video_principal_titulo: module.video_principal_titulo || undefined,
    video_principal_duracao: module.video_principal_duracao || undefined,
    cards_leitura: (module.cards_leitura as any[]) || [],
    ferramenta_pratica: module.ferramenta_pratica as any || undefined,
    estudos_caso: (module.estudos_caso as any[]) || [],
    check_maturidade: (module.check_maturidade as any[]) || [],
  } : null;

  if (isRitual) {
    return (
      <RitualLessonView
        lesson={lesson} courseId={courseId} isCompleted={isCompleted}
        onMarkComplete={onMarkComplete} onNavigate={onNavigate} hasPrev={hasPrev} hasNext={hasNext}
      />
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[750px] mx-auto p-5 md:p-8 lg:p-10 space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize text-xs border-border/40 text-foreground/50">
              {lesson.content_type}
            </Badge>
            {lesson.duracao_minutos && (
              <span className="text-sm text-foreground/40">{lesson.duracao_minutos} minutos</span>
            )}
            {isCompleted && (
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 gap-1">
                <Check className="w-3 h-3" /> Concluída
              </Badge>
            )}
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-[1.3] tracking-tight">
            {lesson.titulo}
          </h1>
          {lesson.descricao_curta && (
            <p className="text-foreground/50 text-base leading-[1.7]">{lesson.descricao_curta}</p>
          )}
        </div>

        {/* Pedagogical Module View (if enabled) */}
        {pedagogicalData ? (
          <PedagogicalModuleView module={pedagogicalData} courseId={courseId} />
        ) : (
          <>
            {/* Video Content */}
            {lesson.video_url && (
              videoId ? (
                <CloudflareStreamPlayer
                  videoId={videoId} title={lesson.titulo}
                  contextType="lesson" contextId={lesson.id}
                  requiredPortal="visitante" onLoad={() => setIsVideoLoaded(true)}
                />
              ) : (
                <Card className="aspect-video overflow-hidden bg-muted/20 flex items-center justify-center rounded-xl border-border/30">
                  <div className="text-center p-6">
                    <Lock className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-foreground/40 text-sm">Vídeo não disponível</p>
                  </div>
                </Card>
              )
            )}

            {/* Audio Content */}
            {lesson.audio_url && (
              <UnifiedAudioPlayer audioUrl={lesson.audio_url} title={lesson.titulo} size="lg" />
            )}

            {/* Text Content — improved typography */}
            {lesson.texto_aula && (
              <div 
                className="prose prose-invert max-w-none 
                  prose-p:text-foreground/70 prose-p:leading-[1.8] prose-p:tracking-[0.01em] prose-p:text-base
                  prose-headings:font-display prose-headings:font-semibold prose-headings:text-foreground prose-headings:leading-[1.3]
                  prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                  prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3
                  prose-li:leading-[1.7] prose-li:text-foreground/70
                  prose-strong:text-foreground/90 prose-strong:font-semibold
                  prose-blockquote:border-gold/30 prose-blockquote:text-foreground/60 prose-blockquote:italic
                  prose-a:text-gold prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(lesson.texto_aula) }}
              />
            )}

            {/* Modular Blocks */}
            <ModularPageRenderer contextType="lesson" contextId={lesson.id} fallback={null} blockSpacing="lg" />
          </>
        )}

        {/* PDF/Materials */}
        {(lesson.pdf_url || lesson.materiais_url) && (
          <Card className="p-5 space-y-3 border-border/30 bg-card/60">
            <h3 className="font-display font-semibold flex items-center gap-2 text-foreground/80">
              <FileText className="w-4 h-4 text-gold/60" />
              Materiais de Apoio
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.pdf_url && (
                <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 border-border/40"><Download className="w-4 h-4" />Baixar PDF</Button>
                </a>
              )}
              {lesson.materiais_url && (
                <a href={lesson.materiais_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2 border-border/40"><Download className="w-4 h-4" />Materiais Extras</Button>
                </a>
              )}
            </div>
          </Card>
        )}

        {/* Diário de Bordo */}
        <DiarioBordoAula aulaId={lesson.id} />

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/30">
          <Button variant="outline" onClick={() => onNavigate('prev')} disabled={!hasPrev} className="gap-2 w-full sm:w-auto border-border/40">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </Button>
          {!isCompleted && (
            <Button variant="gold" onClick={onMarkComplete} className="gap-2 w-full sm:w-auto order-first sm:order-none shadow-lg shadow-gold/10">
              <Check className="w-4 h-4" /> Marcar como Concluída
            </Button>
          )}
          <Button variant={hasNext ? 'default' : 'outline'} onClick={() => onNavigate('next')} disabled={!hasNext} className="gap-2 w-full sm:w-auto">
            Próxima <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
