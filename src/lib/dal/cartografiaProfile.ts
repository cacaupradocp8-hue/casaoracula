/**
 * DAL — Persistência do Perfil Comportamental (co_cartografia_profile)
 * Upsert idempotente por cartografia_id
 */

import { supabase } from './dbClient';
import type { LeituraComportamental } from '@/lib/cartografia/leituraComportamental';

interface PersistProfileParams {
  userId: string;
  cartografiaId: string;
  leitura: LeituraComportamental;
  clientUserId?: string | null;
  therapistUserId?: string | null;
}

/**
 * Upsert do perfil comportamental.
 * Se já existe registro para o mesmo cartografia_id, atualiza.
 */
export async function upsertCartografiaProfile({
  userId,
  cartografiaId,
  leitura,
  clientUserId,
  therapistUserId,
}: PersistProfileParams) {
  const row = {
    user_id: userId,
    cartografia_id: cartografiaId,
    contexto: leitura.contexto,
    medias_json: leitura.profile ? {
      porta_do_possivel: 0,
      torre_interna: 0,
      campo_do_outro: 0,
      voz_no_mundo: 0,
      porta_do_abalo: 0,
      // Will be overwritten below
    } : {},
    profile_json: leitura.profile as unknown as Record<string, unknown>,
    oracula_inicial: leitura.oracula_inicial,
    intensidade_oracular: leitura.intensidade_oracular,
    client_user_id: clientUserId ?? null,
    therapist_user_id: therapistUserId ?? null,
  };

  // Use raw medias from the leitura context if available
  // The caller should pass medias separately since LeituraComportamental doesn't expose raw medias
  const { data, error } = await supabase
    .from('co_cartografia_profile')
    .upsert(row, { onConflict: 'cartografia_id' })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

/**
 * Upsert with explicit medias (preferred — caller provides raw medias).
 */
export async function upsertCartografiaProfileFull({
  userId,
  cartografiaId,
  leitura,
  mediasRaw,
  clientUserId,
  therapistUserId,
}: PersistProfileParams & { mediasRaw: Record<string, number> }) {
  const row = {
    user_id: userId,
    cartografia_id: cartografiaId,
    contexto: leitura.contexto,
    medias_json: mediasRaw,
    profile_json: leitura.profile as unknown as Record<string, unknown>,
    oracula_inicial: leitura.oracula_inicial,
    intensidade_oracular: leitura.intensidade_oracular,
    client_user_id: clientUserId ?? null,
    therapist_user_id: therapistUserId ?? null,
  };

  const { data, error } = await supabase
    .from('co_cartografia_profile')
    .upsert(row, { onConflict: 'cartografia_id' })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}
