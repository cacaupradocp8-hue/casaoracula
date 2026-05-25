import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CourseWithProgress, CourseLesson } from '@/types/course';
import { calculateCourseProgress } from '@/utils/courseProgress';

export function useCourses() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async (): Promise<CourseWithProgress[]> => {
      // 1. Fetch courses with ordering
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .is('archived_at', null)
        .order('destaque', { ascending: false })
        .order('ordem', { ascending: true });

      if (coursesError) throw coursesError;
      if (!coursesData) return [];

      // 2. Fetch enrollment and progress in parallel if user exists
      let enrollments: any[] = [];
      let progress: any[] = [];
      let modules: any[] = [];
      let lessons: any[] = [];

      if (user) {
        const [
          enrollmentsResult,
          progressResult,
          modulesResult,
          lessonsResult
        ] = await Promise.all([
          supabase.from('course_enrollments').select('*').eq('user_id', user.id),
          supabase.from('course_lesson_progress').select('*').eq('user_id', user.id).eq('completed', true),
          supabase.from('course_modules').select('id, course_id').is('archived_at', null).in('course_id', coursesData.map(c => c.id)),
          // We fetch all lessons for these modules to calculate totals
          supabase.from('course_lessons').select('id, module_id').is('archived_at', null)
        ]);

        enrollments = enrollmentsResult.data || [];
        progress = progressResult.data || [];
        modules = modulesResult.data || [];
        lessons = lessonsResult.data || [];
      }

      // 3. Optimized mapping logic
      const moduleToCourseMap = new Map(modules.map(m => [m.id, m.course_id]));
      const lessonsByCourseMap = new Map<string, string[]>();
      
      lessons.forEach(lesson => {
        const courseId = moduleToCourseMap.get(lesson.module_id);
        if (courseId) {
          const current = lessonsByCourseMap.get(courseId) || [];
          current.push(lesson.id);
          lessonsByCourseMap.set(courseId, current);
        }
      });

      return coursesData.map(course => {
        const enrollment = enrollments.find(e => e.course_id === course.id) || null;
        const courseLessons = lessons.filter(lesson => {
          const courseId = moduleToCourseMap.get(lesson.module_id);
          return courseId === course.id;
        }) as CourseLesson[];

        const { totalLessons, completedLessons, progressPercent } = calculateCourseProgress(
          courseLessons,
          progress
        );

        return {
          ...course,
          enrollment,
          totalLessons,
          completedLessons,
          progressPercent
        };
      }) as CourseWithProgress[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: true,
  });
}
