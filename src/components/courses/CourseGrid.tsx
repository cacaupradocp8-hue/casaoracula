import { CourseCard } from './CourseCard';
import { CourseWithProgress } from '@/types/course';
import { Skeleton } from '@/components/ui/skeleton';

interface CourseGridProps {
  courses: CourseWithProgress[];
  isLoading?: boolean;
  showProgress?: boolean;
  emptyMessage?: string;
}

export function CourseGrid({ 
  courses, 
  isLoading, 
  showProgress = true,
  emptyMessage = 'Nenhum curso disponível no momento.'
}: CourseGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-video rounded-lg" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => (
        <CourseCard 
          key={course.id} 
          course={course} 
          showProgress={showProgress}
        />
      ))}
    </div>
  );
}
