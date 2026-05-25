import { supabase } from "@/integrations/supabase/client";
import { Course, CourseModule, CourseLesson } from "@/types/course";

/**
 * Lista todos os cursos para o Admin, ordenados por ordem de exibição.
 * @returns Promessa com a lista de cursos.
 */
export async function listAdminCourses(): Promise<Course[]> {
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .order('ordem');

  if (error) throw error;
  return data as Course[];
}

/**
 * Lista todos os módulos de cursos para o Admin, ordenados por ordem.
 * @returns Promessa com a lista de módulos.
 */
export async function listAdminCourseModules(): Promise<CourseModule[]> {
  const { data, error } = await supabase
    .from('course_modules')
    .select('*')
    .order('ordem');

  if (error) throw error;
  return data as CourseModule[];
}

/**
 * Lista todas as aulas de cursos para o Admin, ordenadas por ordem.
 * @returns Promessa com a lista de aulas.
 */
export async function listAdminCourseLessons(): Promise<CourseLesson[]> {
  const { data, error } = await supabase
    .from('course_lessons')
    .select('*')
    .order('ordem');

  if (error) throw error;
  return data as CourseLesson[];
}
