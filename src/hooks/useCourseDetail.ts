import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Course, 
  CourseModule, 
  CourseLesson, 
  CourseEnrollment, 
  CourseLessonProgress,
  CourseModuleWithLessons 
} from '@/types/course';
import { useToast } from '@/hooks/use-toast';

interface UseCourseDetailResult {
  course: Course | null;
  modules: CourseModuleWithLessons[];
  enrollment: CourseEnrollment | null;
  progress: Map<string, CourseLessonProgress>;
  isLoading: boolean;
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  markLessonComplete: (lessonId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useCourseDetail(courseId: string | undefined): UseCourseDetailResult {
  const { user } = useAuth();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModuleWithLessons[]>([]);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [progress, setProgress] = useState<Map<string, CourseLessonProgress>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;

    setIsLoading(true);
    try {
      // Fetch course
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData as Course);

      // Fetch modules
      const { data: modulesData, error: modulesError } = await supabase
        .from('course_modules')
        .select('*')
        .eq('course_id', courseId)
        .order('ordem', { ascending: true });

      if (modulesError) throw modulesError;

      // Fetch lessons for all modules
      const moduleIds = (modulesData || []).map(m => m.id);
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('course_lessons')
        .select('*')
        .in('module_id', moduleIds.length > 0 ? moduleIds : ['none'])
        .order('ordem', { ascending: true });

      if (lessonsError) throw lessonsError;

      // Map lessons to modules
      const modulesWithLessons: CourseModuleWithLessons[] = (modulesData || []).map(module => ({
        ...module,
        lessons: (lessonsData || []).filter(l => l.module_id === module.id) as CourseLesson[]
      })) as CourseModuleWithLessons[];

      setModules(modulesWithLessons);

      // Fetch enrollment and progress if user is logged in
      if (user) {
        const [enrollmentResult, progressResult] = await Promise.all([
          supabase
            .from('course_enrollments')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseId)
            .maybeSingle(),
          supabase
            .from('course_lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .in('lesson_id', (lessonsData || []).map(l => l.id))
        ]);

        if (enrollmentResult.data) {
          setEnrollment(enrollmentResult.data as CourseEnrollment);
        }

        if (progressResult.data) {
          const progressMap = new Map<string, CourseLessonProgress>();
          (progressResult.data as CourseLessonProgress[]).forEach(p => {
            progressMap.set(p.lesson_id, p);
          });
          setProgress(progressMap);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar o curso.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [courseId, user, toast]);

  const markLessonComplete = async (lessonId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('course_lesson_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          progress_percent: 100
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      // Update local state
      setProgress(prev => {
        const newMap = new Map(prev);
        newMap.set(lessonId, {
          id: lessonId,
          user_id: user.id,
          lesson_id: lessonId,
          completed: true,
          completed_at: new Date().toISOString(),
          progress_percent: 100,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        return newMap;
      });

      toast({
        title: 'Aula concluída!',
        description: 'Seu progresso foi salvo.'
      });
    } catch (error) {
      console.error('Error marking lesson complete:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível marcar a aula como concluída.',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  // Calculate totals
  const allLessons = modules.flatMap(m => m.lessons);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter(l => progress.get(l.id)?.completed).length;
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    course,
    modules,
    enrollment,
    progress,
    isLoading,
    totalLessons,
    completedLessons,
    progressPercent,
    markLessonComplete,
    refetch: fetchCourse
  };
}
