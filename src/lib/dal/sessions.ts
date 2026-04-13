/**
 * DAL — Sessions Service
 * Clinical session reads and writes.
 */

import { supabase } from './dbClient';

export interface SessionFilters {
  userId: string;
  clientId?: string;
  limit?: number;
  offset?: number;
}

export async function listSessions(filters: SessionFilters) {
  let query = supabase
    .from('sessions')
    .select('id, client_id, date, district_id, notes, created_at')
    .eq('user_id', filters.userId)
    .order('date', { ascending: false });

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }
  if (filters.limit) {
    query = query.limit(filters.limit);
  }
  if (filters.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit ?? 20) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function getSession(sessionId: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  if (error) throw error;
  return data;
}

export async function createSession(payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('sessions')
    .insert(payload as any)
    .select()
    .single();
  if (error) throw error;
  return data;
}
