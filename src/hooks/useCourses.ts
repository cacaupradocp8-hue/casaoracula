import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Course, CourseWithProgress, CourseEnrollment, CourseLessonProgress } from '@/types/course';
import { useToast } from '@/hooks/use-toast';

export function useCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch published courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .order('destaque', { ascending: false })
        .order('ordem', { ascending: true });

      if (coursesError) throw coursesError;

      if (!coursesData) {
        setCourses([]);
        return;
      }

      // If user is logged in, fetch enrollments and progress
      let enrollments: CourseEnrollment[] = [];
      let progress: CourseLessonProgress[] = [];

      if (user) {
        const [enrollmentsResult, progressResult] = await Promise.all([
          supabase
            .from('course_enrollments')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('course_lesson_progress')
            .select('*')
            .eq('user_id', user.id)
        ]);

        if (enrollmentsResult.data) {
          enrollments = enrollmentsResult.data as CourseEnrollment[];
        }
        if (progressResult.data) {
          progress = progressResult.data as CourseLessonProgress[];
        }
      }

      // Fetch lesson counts per course
      const courseIds = coursesData.map(c => c.id);
      const { data: lessonCounts } = await supabase
        .from('course_lessons')
        .select('module_id, id')
        .in('module_id', 
          (await supabase
            .from('course_modules')
            .select('id, course_id')
            .in('course_id', courseIds)
          ).data?.map(m => m.id) || []
        );

      // Get module to course mapping
      const { data: modules } = await supabase
        .from('course_modules')
        .select('id, course_id')
        .in('course_id', courseIds);

      const moduleToCourse = new Map(modules?.map(m => [m.id, m.course_id]) || []);

      // Calculate totals per course
      const courseLessonCounts = new Map<string, string[]>();
      lessonCounts?.forEach(lesson => {
        const courseId = moduleToCourse.get(lesson.module_id);
        if (courseId) {
          const existing = courseLessonCounts.get(courseId) || [];
          existing.push(lesson.id);
          courseLessonCounts.set(courseId, existing);
        }
      });

      // Map courses with progress
      const coursesWithProgress: CourseWithProgress[] = coursesData.map(course => {
        const enrollment = enrollments.find(e => e.course_id === course.id) || null;
        const courseLessons = courseLessonCounts.get(course.id) || [];
        const completedLessons = progress.filter(
          p => p.completed && courseLessons.includes(p.lesson_id)
        ).length;
        const totalLessons = courseLessons.length;
        const progressPercent = totalLessons > 0 
          ? Math.round((completedLessons / totalLessons) * 100) 
          : 0;

        return {
          ...course,
          enrollment,
          totalLessons,
          completedLessons,
          progressPercent
        } as CourseWithProgress;
      });

      setCourses(coursesWithProgress);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os cursos.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    refetch: fetchCourses
  };
}
