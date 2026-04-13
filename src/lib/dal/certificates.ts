/**
 * DAL — Certificates / Certification Service
 * Professional confirmation and certification tracking.
 */

import { supabase } from './dbClient';

export async function getProfessionalConfirmation(userId: string) {
  const { data, error } = await supabase
    .from('confirmacao_profissional')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getMatriculas(userId: string) {
  const { data, error } = await supabase
    .from('matriculas')
    .select('id, user_id, curso_id, ativa, data_inicio, data_fim, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
