import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CidadelaMapaVivo {
  id: string;
  user_id: string;
  distrito: string;
  nivel: number;
  status: string;
  historico: any[];
  ultima_atualizacao: string;
}

export interface CityDistrict {
  id: string;
  nome: string;
  slug: string;
  descricao: string | null;
  funcao_simbolica: string | null;
  quando_ativo: string | null;
  cor_principal: string | null;
  icone: string | null;
  ordem: number | null;
  ativo: boolean | null;
}

export interface FoundingArchetype {
  id: string;
  nome: string;
  slug: string;
  titulo_simbolico: string | null;
  descricao: string | null;
  essencia: string | null;
  ferida_central: string | null;
  sombra: string | null;
  caminho_evolucao: string | null;
  distrito_principal_id: string | null;
  elemento: string | null;
  cor_principal: string | null;
  icone: string | null;
}

export interface ClientCityState {
  id: string;
  client_id: string;
  distrito_ativo: string | null;
  distrito_id: string | null;
  arquetipo_ativo: string | null;
  ultima_ferramenta_id: string | null;
  ultima_sessao_id: string | null;
}

export interface ClientArchetypeState {
  id: string;
  client_id: string;
  arquitipo_regente_id: string | null;
  arquitipo_sombra_id: string | null;
  arquitipo_evolucao_id: string | null;
  fonte: string | null;
  observacoes: string | null;
}

export interface CityHistoryEvent {
  id: string;
  client_id: string;
  session_id: string | null;
  tool_id: string | null;
  evento: string | null;
  distrito: string | null;
  detalhe: string | null;
  created_at: string;
}

export interface ToolDistrict {
  id: string;
  tool_id: string;
  district_id: string;
  tipo: string;
  tool?: { id: string; nome: string; slug: string; icone: string | null; rota: string | null };
}

export function useCityDistricts() {
  return useQuery({
    queryKey: ['city-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('city_districts')
        .select('*')
        .eq('ativo', true)
        .order('ordem');
      if (error) throw error;
      return data as CityDistrict[];
    },
  });
}

export function useFoundingArchetypes() {
  return useQuery({
    queryKey: ['founding-archetypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('founding_archetypes')
        .select('*')
        .eq('ativo', true)
        .order('nome');
      if (error) throw error;
      return data as FoundingArchetype[];
    },
  });
}

export function useClientCityState(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client-city-state', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const { data, error } = await supabase
        .from('client_city_state')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();
      if (error) throw error;
      return data as ClientCityState | null;
    },
    enabled: !!clientId,
  });
}

export function useClientArchetypeState(clientId: string | undefined) {
  return useQuery({
    queryKey: ['client-archetype-state', clientId],
    queryFn: async () => {
      if (!clientId) return null;
      const { data, error } = await supabase
        .from('client_archetype_state')
        .select('*')
        .eq('client_id', clientId)
        .maybeSingle();
      if (error) throw error;
      return data as ClientArchetypeState | null;
    },
    enabled: !!clientId,
  });
}

export function useCityHistory(clientId: string | undefined) {
  return useQuery({
    queryKey: ['city-history', clientId],
    queryFn: async () => {
      if (!clientId) return [];
      const { data, error } = await supabase
        .from('co_city_history')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as CityHistoryEvent[];
    },
    enabled: !!clientId,
  });
}

export function useToolDistricts() {
  return useQuery({
    queryKey: ['tool-districts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tool_districts')
        .select(`
          *,
          tool:tools(id, nome, slug, icone, rota)
        `);
      if (error) throw error;
      return data as ToolDistrict[];
    },
  });
}
