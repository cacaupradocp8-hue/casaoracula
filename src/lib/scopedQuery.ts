/**
 * Query Governance — Casa Orácula
 *
 * Helpers to enforce scoped access on every Supabase query.
 * RLS is the ultimate guard, but frontend must never rely on it alone.
 *
 * RULES:
 * 1. Every query on a sensitive table MUST include an ownership filter
 *    (user_id, therapist_user_id, client_user_id, or admin guard).
 * 2. Never use `select('*')` on clinical tables — pick explicit columns.
 * 3. Always pass the authenticated user context; never assume it.
 */

import { supabase } from '@/lib/dal/dbClient';

/**
 * Returns the current authenticated user id or throws.
 * Use at the top of any hook/service that touches sensitive data.
 */
export async function requireAuthUserId(): Promise<string> {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error('Autenticação necessária');
  return user.id;
}

/**
 * Guard: only proceeds if the current user is an admin.
 * Reads from the local profile cache (AuthContext) — NOT a replacement for RLS.
 */
export function assertAdmin(portal: string | undefined): void {
  if (portal !== 'admin') {
    throw new Error('Acesso restrito a administradores');
  }
}

/**
 * Guard: validates that a therapist id matches the authenticated user.
 */
export function assertOwnership(expectedId: string, actualId: string): void {
  if (expectedId !== actualId) {
    throw new Error('Acesso não autorizado a este recurso');
  }
}
