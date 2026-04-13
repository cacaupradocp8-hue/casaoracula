/**
 * DAL — Tools / Ferramentas Service
 * Tool results and tool registry access.
 */

import { supabase } from './dbClient';

export async function listTools(filters?: { ambiente?: string; categoria?: string; ativa?: boolean }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = supabase
    .from('tools')
    .select('id, nome, descricao, categoria, rota, ambiente, nivel, ativa, ordem, proximo_passo_id')
    .order('ordem') as any;

  if (filters?.ativa !== undefined) query = query.eq('ativa', filters.ativa);
  if (filters?.ambiente) query = query.eq('ambiente', filters.ambiente);
  if (filters?.categoria) query = query.eq('categoria', filters.categoria);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getToolResults(tableName: string, filters: { userId?: string; clientId?: string; limit?: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any).from(tableName).select('*').order('created_at', { ascending: false });

  if (filters.userId) query = query.eq('user_id', filters.userId);
  if (filters.clientId) query = query.eq('client_id', filters.clientId);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
