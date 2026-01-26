import { useParams, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '@/hooks/useCourseDetail';
import { useCourseAccess } from '@/hooks/useCourseAccess';
import { CourseSidebar } from '@/components/courses/CourseSidebar';
import { LessonContent } from '@/components/courses/LessonContent';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Lock, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseLesson, CourseModuleWithLessons } from '@/types/course';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

export default function CursoAula() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    course,
    modules,
    enrollment,
    progress,
    isLoading: courseLoading,
    totalLessons,
    completedLessons,
    progressPercent,
    markLessonComplete,
    refetch
  } = useCourseDetail(courseId);
  const { hasAccess } = useCourseAccess();

  const [currentLesson, setCurrentLesson] = useState<CourseLesson | null>(null);
  const [currentModule, setCurrentModule] = useState<CourseModuleWithLessons | null>(null);
  const [isLoadingLesson, setIsLoadingLesson] = useState(true);

  // Flatten all lessons for navigation
  const allLessons = modules.flatMap(m => m.lessons);
  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) return;

      setIsLoadingLesson(true);
      try {
        const { data, error } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('id', lessonId)
          .single();

        if (error) throw error;
        setCurrentLesson(data as CourseLesson);
        
        // Find the module this lesson belongs to
        const parentModule = modules.find(m => 
          m.lessons.some(l => l.id === lessonId)
        );
        setCurrentModule(parentModule || null);
      } catch (error) {
        console.error('Error fetching lesson:', error);
        navigate(`/cursos/${courseId}`);
      } finally {
        setIsLoadingLesson(false);
      }
    };

    fetchLesson();
  }, [lessonId, courseId, navigate, modules]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [lessonId, isMobile]);

  if (courseLoading || isLoadingLesson) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="hidden lg:block w-80 bg-card border-r border-border p-4 space-y-4">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-2 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4 lg:p-8">
          <Skeleton className="aspect-video rounded-lg mb-4" />
          <Skeleton className="h-8 w-1/2 mb-2" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-display font-semibold mb-4">Aula não encontrada</h1>
          <Button onClick={() => navigate(`/cursos/${courseId}`)}>
            Voltar ao Curso
          </Button>
        </div>
      </div>
    );
  }

  const userHasAccess = hasAccess(course, enrollment);
  const lessonIsAccessible = userHasAccess || currentLesson.is_preview;

  if (!lessonIsAccessible) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center p-8 max-w-md">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-display font-semibold mb-2">
            Conteúdo Bloqueado
          </h1>
          <p className="text-muted-foreground mb-6">
            Você precisa ter acesso ao curso para visualizar esta aula.
          </p>
          <div className="space-y-2">
            <Button onClick={() => navigate(`/cursos/${courseId}`)} className="w-full">
              Ver Detalhes do Curso
            </Button>
            <Button variant="outline" onClick={() => navigate('/cursos')} className="w-full">
              Explorar Cursos
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleNavigate = (direction: 'prev' | 'next') => {
    const targetLesson = direction === 'prev' ? prevLesson : nextLesson;
    if (targetLesson) {
      navigate(`/cursos/${courseId}/aula/${targetLesson.id}`);
    }
  };

  const handleMarkComplete = async () => {
    if (lessonId) {
      await markLessonComplete(lessonId);
    }
  };

  const isCompleted = lessonId ? progress.get(lessonId)?.completed ?? false : false;

  const SidebarContent = (
    <CourseSidebar
      courseId={courseId!}
      courseTitle={course.titulo}
      modules={modules}
      progress={progress}
      hasAccess={userHasAccess}
      currentLessonId={lessonId}
      totalLessons={totalLessons}
      completedLessons={completedLessons}
      progressPercent={progressPercent}
    />
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Mobile Header with Menu */}
      {isMobile && (
        <div className="sticky top-0 z-40 bg-card border-b border-border p-3 flex items-center gap-3">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
              {SidebarContent}
            </SheetContent>
          </Sheet>
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-sm truncate">{course.titulo}</h2>
            <p className="text-xs text-muted-foreground truncate">{currentLesson.titulo}</p>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden lg:block">
          {SidebarContent}
        </div>
      )}

      {/* Content */}
      <LessonContent
        lesson={currentLesson}
        module={currentModule}
        courseId={courseId!}
        isCompleted={isCompleted}
        onMarkComplete={handleMarkComplete}
        onNavigate={handleNavigate}
        hasPrev={!!prevLesson}
        hasNext={!!nextLesson}
      />
    </div>
  );
}