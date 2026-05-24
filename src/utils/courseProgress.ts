import { CourseLesson, CourseLessonProgress } from '@/types/course';

interface CourseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
  isComplete: boolean;
}

/**
 * Calculates aggregate course progress based on published lessons and user progress.
 * 
 * Rules for V0.2:
 * 1. Only published lessons are counted in the total.
 * 2. A lesson is completed if it has a progress record with completed = true.
 * 3. Course is 100% complete if all published lessons are completed.
 */
export function calculateCourseProgress(
  lessons: CourseLesson[],
  userProgress: CourseLessonProgress[] | Map<string, CourseLessonProgress>
): CourseProgressResult {
  // Only count published lessons
  const publishedLessons = lessons.filter(lesson => lesson.publicado);
  const totalLessons = publishedLessons.length;
  
  if (totalLessons === 0) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      progressPercent: 0,
      isComplete: false
    };
  }

  let completedLessons = 0;

  if (userProgress instanceof Map) {
    completedLessons = publishedLessons.filter(lesson => 
      userProgress.get(lesson.id)?.completed
    ).length;
  } else {
    const completedIds = new Set(
      userProgress
        .filter(p => p.completed)
        .map(p => p.lesson_id)
    );
    completedLessons = publishedLessons.filter(lesson => 
      completedIds.has(lesson.id)
    ).length;
  }

  const progressPercent = Math.round((completedLessons / totalLessons) * 100);
  const isComplete = progressPercent === 100;

  return {
    totalLessons,
    completedLessons,
    progressPercent,
    isComplete
  };
}
