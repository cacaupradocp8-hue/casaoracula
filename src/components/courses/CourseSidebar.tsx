import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Check, 
  Lock, 
  PlayCircle, 
  FileText, 
  Headphones, 
  File,
  ChevronLeft
} from 'lucide-react';
import { CourseModuleWithLessons, CourseLesson, CourseLessonProgress } from '@/types/course';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  courseId: string;
  courseTitle: string;
  modules: CourseModuleWithLessons[];
  progress: Map<string, CourseLessonProgress>;
  hasAccess: boolean;
  currentLessonId?: string;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
}

export function CourseSidebar({
  courseId,
  courseTitle,
  modules,
  progress,
  hasAccess,
  currentLessonId,
  totalLessons,
  completedLessons,
  progressPercent
}: CourseSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(
    modules.length > 0 ? [modules[0].id] : []
  );

  const getLessonIcon = (lesson: CourseLesson) => {
    switch (lesson.content_type) {
      case 'video':
        return <PlayCircle className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'file':
        return <File className="w-4 h-4" />;
      default:
        return <PlayCircle className="w-4 h-4" />;
    }
  };

  const isLessonAccessible = (lesson: CourseLesson) => {
    return hasAccess || lesson.is_preview;
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.get(lessonId)?.completed ?? false;
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <Link 
          to="/cursos" 
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm">Voltar aos cursos</span>
        </Link>
        <h2 className="font-display text-lg font-semibold text-foreground line-clamp-2">
          {courseTitle}
        </h2>
        
        {hasAccess && totalLessons > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{completedLessons} de {totalLessons} aulas</span>
              <span>{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </div>

      {/* Modules and Lessons */}
      <ScrollArea className="flex-1">
        <Accordion 
          type="multiple" 
          value={expandedModules}
          onValueChange={setExpandedModules}
          className="p-2"
        >
          {modules.map((module, moduleIndex) => {
            const moduleLessons = module.lessons || [];
            const moduleCompleted = moduleLessons.filter(l => isLessonCompleted(l.id)).length;
            const moduleTotal = moduleLessons.length;

            return (
              <AccordionItem 
                key={module.id} 
                value={module.id}
                className="border-b border-border/50"
              >
                <AccordionTrigger className="hover:no-underline py-3 px-2">
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Módulo {moduleIndex + 1}
                      </span>
                      {hasAccess && moduleTotal > 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({moduleCompleted}/{moduleTotal})
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium text-sm mt-1">{module.titulo}</h3>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="space-y-1">
                    {moduleLessons.map((lesson, lessonIndex) => {
                      const isAccessible = isLessonAccessible(lesson);
                      const isCompleted = isLessonCompleted(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;

                      return (
                        <Link
                          key={lesson.id}
                          to={isAccessible ? `/cursos/${courseId}/aula/${lesson.id}` : '#'}
                          className={cn(
                            'flex items-center gap-3 p-2 rounded-md text-sm transition-colors',
                            isCurrent && 'bg-primary/10 text-primary',
                            !isCurrent && isAccessible && 'hover:bg-muted',
                            !isAccessible && 'opacity-50 cursor-not-allowed'
                          )}
                          onClick={e => !isAccessible && e.preventDefault()}
                        >
                          <span className="flex-shrink-0">
                            {isCompleted ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : !isAccessible ? (
                              <Lock className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              getLessonIcon(lesson)
                            )}
                          </span>
                          <span className="flex-1 line-clamp-2">
                            {lessonIndex + 1}. {lesson.titulo}
                          </span>
                          {lesson.is_preview && !hasAccess && (
                            <Badge variant="outline" className="text-xs">
                              Preview
                            </Badge>
                          )}
                          {lesson.duracao_minutos && (
                            <span className="text-xs text-muted-foreground">
                              {lesson.duracao_minutos}min
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
