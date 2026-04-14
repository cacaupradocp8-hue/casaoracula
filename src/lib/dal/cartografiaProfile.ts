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
  mediasRaw: Record<string, number>;
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
  mediasRaw,
  clientUserId,
  therapistUserId,
}: PersistProfileParams) {
  const row = {
    user_id: userId,
    cartografia_id: cartografiaId,
    contexto: leitura.contexto,
    medias_json: mediasRaw as unknown as Record<string, unknown>,
    profile_json: leitura.profile as unknown as Record<string, unknown>,
    oracula_inicial: leitura.oracula_inicial,
    intensidade_oracular: leitura.intensidade_oracular,
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
