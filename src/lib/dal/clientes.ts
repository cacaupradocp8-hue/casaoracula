/**
 * DAL — Clientes Service
 * CRUD and queries for therapist clients.
 */

import { supabase } from './dbClient';

const CLIENTE_FIELDS = 'id, nome, email, telefone, status, terapeuta_id, client_user_id, created_at, updated_at' as const;

export interface ClienteFilters {
  therapistId: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export async function listClientes(filters: ClienteFilters) {
  let query = supabase
    .from('clientes')
    .select(CLIENTE_FIELDS)
    .eq('terapeuta_id', filters.therapistId)
    .order('created_at', { ascending: false });

  if (filters.status) {
    query = query.eq('status', filters.status as any);
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

export async function getCliente(clienteId: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', clienteId)
    .single();
  if (error) throw error;
  return data;
}

export async function createCliente(payload: Record<string, unknown>) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(payload as any)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCliente(clienteId: string, updates: Record<string, unknown>) {
  const { error } = await supabase
    .from('clientes')
    .update(updates)
    .eq('id', clienteId);
  if (error) throw error;
}
