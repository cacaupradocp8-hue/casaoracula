/**
 * DAL — Cidadela / City State Service
 * Client psychic map and district state.
 */

import { supabase } from './dbClient';

export async function getClientCityState(clientId: string) {
  const { data, error } = await supabase
    .from('client_city_state')
    .select('*')
    .eq('client_id', clientId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getJourneyDistricts(clientId: string) {
  const { data, error } = await supabase
    .from('journey_districts')
    .select('*, district:city_districts(id, nome, descricao, cor)')
    .eq('journey_id', clientId);
  if (error) throw error;
  return data;
}

export async function getCidadelaMap(clientId: string, therapistId: string) {
  const { data, error } = await supabase
    .from('client_cidadela_map')
    .select('*')
    .eq('client_id', clientId)
    .eq('therapist_id', therapistId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
