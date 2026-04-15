/**
 * DAL — Persistência do Perfil Comportamental (co_cartografia_profile)
 * Upsert idempotente por cartografia_id
 */

import { supabase } from './dbClient';
import type { ProfileJsonFinal } from '@/lib/cartografia/montarProfileJson';

interface PersistProfileParams {
  userId: string;
  cartografiaId: string;
  profileJson: ProfileJsonFinal;
  mediasRaw: Record<string, number>;
  clientUserId?: string | null;
  therapistUserId?: string | null;
}

/**
 * Upsert do perfil comportamental com JSON estruturado completo.
 * Se já existe registro para o mesmo cartografia_id, atualiza.
 */
export async function upsertCartografiaProfile({
  userId,
  cartografiaId,
  profileJson,
  mediasRaw,
  clientUserId,
  therapistUserId,
}: PersistProfileParams) {
  const row = {
    user_id: userId,
    cartografia_id: cartografiaId,
    contexto: profileJson.derivacao.tensao_central ? 'casa_das_maquinas' : 'clube',
    medias_json: mediasRaw as unknown as Record<string, unknown>,
    profile_json: profileJson as unknown as Record<string, unknown>,
    oracula_inicial: profileJson.oracula_inicial,
    intensidade_oracular: profileJson.intensidade_oracular,
    client_user_id: clientUserId ?? null,
    therapist_user_id: therapistUserId ?? null,
  };

  const { data, error } = await supabase
    .from('co_cartografia_profile')
    .upsert(row as any, { onConflict: 'cartografia_id' })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}
