import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  FileText
} from 'lucide-react';
import { CourseLesson, CourseModuleWithLessons } from '@/types/course';
import DOMPurify from 'dompurify';
import { ModularPageRenderer } from '@/components/modular/ModularPageRenderer';
import { PedagogicalModuleView } from './PedagogicalModuleView';

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
  lesson,
  module,
  courseId,
  isCompleted,
  onMarkComplete,
  onNavigate,
  hasPrev,
  hasNext
}: LessonContentProps) {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const getEmbedUrl = (url: string): string => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  // Check if module has pedagogical format enabled
  const isPedagogical = module?.formato_pedagogico === true;
  
  // Build pedagogical data from module if available
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

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-4 lg:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {lesson.content_type}
            </Badge>
            {lesson.duracao_minutos && (
              <span className="text-sm text-muted-foreground">
                {lesson.duracao_minutos} minutos
              </span>
            )}
            {isCompleted && (
              <Badge className="bg-green-500/20 text-green-400 gap-1">
                <Check className="w-3 h-3" /> Concluída
              </Badge>
            )}
          </div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-foreground">
            {lesson.titulo}
          </h1>
          {lesson.descricao_curta && (
            <p className="text-muted-foreground">{lesson.descricao_curta}</p>
          )}
        </div>

        {/* Pedagogical Module View (if enabled) */}
        {pedagogicalData ? (
          <PedagogicalModuleView
            module={pedagogicalData}
            courseId={courseId}
          />
        ) : (
          <>
            {/* Video Content */}
            {lesson.video_url && (
              <Card className="aspect-video overflow-hidden bg-background">
                <iframe
                  src={getEmbedUrl(lesson.video_url)}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsVideoLoaded(true)}
                />
              </Card>
            )}

            {/* Audio Content */}
            {lesson.audio_url && (
              <Card className="p-4">
                <audio controls className="w-full">
                  <source src={lesson.audio_url} />
                  Seu navegador não suporta áudio.
                </audio>
              </Card>
            )}

            {/* Text Content */}
            {lesson.texto_aula && (
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: DOMPurify.sanitize(lesson.texto_aula) 
                }}
              />
            )}

            {/* Modular Blocks for Lesson */}
            <ModularPageRenderer
              contextType="lesson"
              contextId={lesson.id}
              fallback={null}
              blockSpacing="lg"
            />
          </>
        )}

        {/* PDF/Materials */}
        {(lesson.pdf_url || lesson.materiais_url) && (
          <Card className="p-4 space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Materiais de Apoio
            </h3>
            <div className="flex flex-wrap gap-2">
              {lesson.pdf_url && (
                <a href={lesson.pdf_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Baixar PDF
                  </Button>
                </a>
              )}
              {lesson.materiais_url && (
                <a href={lesson.materiais_url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Materiais Extras
                  </Button>
                </a>
              )}
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => onNavigate('prev')}
            disabled={!hasPrev}
            className="gap-2 w-full sm:w-auto"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {!isCompleted && (
            <Button onClick={onMarkComplete} className="gap-2 w-full sm:w-auto order-first sm:order-none">
              <Check className="w-4 h-4" />
              Marcar como Concluída
            </Button>
          )}

          <Button
            variant={hasNext ? 'default' : 'outline'}
            onClick={() => onNavigate('next')}
            disabled={!hasNext}
            className="gap-2 w-full sm:w-auto"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}