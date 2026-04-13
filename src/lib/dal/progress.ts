/**
 * DAL — Learning Progress Service
 * Student journey tracking and progress.
 */

import { supabase } from './dbClient';

export async function getStudentProgress(userId: string) {
  const { data, error } = await supabase
    .from('student_learning_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getMatricula(userId: string, cursoId = 'formacao_oracula') {
  const { data, error } = await supabase
    .from('matriculas')
    .select('*')
    .eq('user_id', userId)
    .eq('curso_id', cursoId)
    .eq('ativa', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getAcademyProgress(userId: string) {
  const { data, error } = await supabase
    .from('academy_progress')
    .select('*')
    .eq('user_id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
