import { supabase } from '@/integrations/supabase/client';

const TOOL_DISTRICT_MAP: Record<string, string> = {
  labirinto: 'Labirinto Narrativo',
  torre_viva: 'Torres',
  atlas: 'Jardim',
  sonhos: 'Casa dos Sonhos',
};

export async function updateClientDistrict(
  clientId: string,
  toolKey: keyof typeof TOOL_DISTRICT_MAP
) {
  const distrito = TOOL_DISTRICT_MAP[toolKey];
  if (!distrito) return;

  await supabase
    .from('client_city_state')
    .upsert(
      {
        client_id: clientId,
        distrito_ativo: distrito,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'client_id' }
    );
}
