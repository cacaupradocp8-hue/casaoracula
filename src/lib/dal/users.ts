/**
 * DAL — Users / Profiles Service
 * Handles profile reads, portal levels, and access flags.
 */

import { supabase } from './dbClient';

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, nome, portal, role, access_status, subscription_status, access_expires_at, avatar_url, cartografia_base, onboarding_complete')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return data;
}

export async function getUserPortal(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('portal')
    .eq('user_id', userId)
    .single();
  if (error) throw error;
  return data?.portal ?? 'visitante';
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  if (error) throw error;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const portal = await getUserPortal(userId);
  return portal === 'admin';
}
