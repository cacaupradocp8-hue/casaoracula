import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ============================================
// SESSÕES DO LABIRINTO — HOOKS DE PERSISTÊNCIA
// ============================================

export interface SessaoLabirinto {
  id: string;
  user_id: string;
  modo: "pessoal" | "profissional";
  cliente_nome: string | null;
  porta_id: string | null;
  data_sessao: string;
  observacoes_clinicas: string | null;
  hipotese_terapeutica: string | null;
  emocao_dominante: string | null;
  padrao_defensivo: string | null;
  direcionamento_terapeutico: string | null;
  micro_acao_definida: string | null;
  registro_acao: string | null;
  registro_percepcao: string | null;
  concluida: boolean;
  created_at: string;
  updated_at: string;
}

export interface RespostaExercicio {
  id: string;
  sessao_id: string;
  pergunta_1: string | null;
  pergunta_2: string | null;
  pergunta_3: string | null;
  campo_corporal: string | null;
  created_at: string;
}

export interface MapaHeroinaEntry {
  id: string;
  user_id: string;
  cliente_nome: string | null;
  porta_id: string | null;
  data_registro: string;
  status: "ativa" | "integrada";
  evolucao_texto: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// SESSÕES
// ============================================

export function useSessoesLabirinto(clienteNome?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sessoes-labirinto", user?.id, clienteNome],
    queryFn: async () => {
      let query = supabase
        .from("sessoes_labirinto")
        .select("*")
        .order("data_sessao", { ascending: false });

      if (clienteNome) {
        query = query.eq("cliente_nome", clienteNome);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as SessaoLabirinto[];
    },
    enabled: !!user,
  });
}

export function useCreateSessao() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      modo: "pessoal" | "profissional";
      porta_id: string;
      cliente_nome?: string;
      observacoes_clinicas?: string;
      hipotese_terapeutica?: string;
      emocao_dominante?: string;
      padrao_defensivo?: string;
      direcionamento_terapeutico?: string;
      micro_acao_definida?: string;
      registro_acao?: string;
      registro_percepcao?: string;
      concluida?: boolean;
    }) => {
      const { data, error } = await supabase
        .from("sessoes_labirinto")
        .insert({
          user_id: user!.id,
          modo: params.modo,
          porta_id: params.porta_id,
          cliente_nome: params.cliente_nome || null,
          observacoes_clinicas: params.observacoes_clinicas || null,
          hipotese_terapeutica: params.hipotese_terapeutica || null,
          emocao_dominante: params.emocao_dominante || null,
          padrao_defensivo: params.padrao_defensivo || null,
          direcionamento_terapeutico: params.direcionamento_terapeutico || null,
          micro_acao_definida: params.micro_acao_definida || null,
          registro_acao: params.registro_acao || null,
          registro_percepcao: params.registro_percepcao || null,
          concluida: params.concluida || false,
        })
        .select()
        .single();

      if (error) throw error;
      return data as SessaoLabirinto;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessoes-labirinto"] });
    },
  });
}

export function useCreateRespostaExercicio() {
  return useMutation({
    mutationFn: async (params: {
      sessao_id: string;
      pergunta_1?: string;
      pergunta_2?: string;
      pergunta_3?: string;
      campo_corporal?: string;
    }) => {
      const { data, error } = await supabase
        .from("respostas_exercicios")
        .insert({
          sessao_id: params.sessao_id,
          pergunta_1: params.pergunta_1 || null,
          pergunta_2: params.pergunta_2 || null,
          pergunta_3: params.pergunta_3 || null,
          campo_corporal: params.campo_corporal || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });
}

// ============================================
// MAPA DA HEROÍNA
// ============================================

export function useMapaHeroina(clienteNome?: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["mapa-heroina", user?.id, clienteNome],
    queryFn: async () => {
      let query = supabase
        .from("mapa_heroina")
        .select("*")
        .order("data_registro", { ascending: true });

      if (clienteNome) {
        query = query.eq("cliente_nome", clienteNome);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as MapaHeroinaEntry[];
    },
    enabled: !!user,
  });
}

export function useCreateMapaEntry() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      porta_id: string;
      cliente_nome?: string;
      evolucao_texto?: string;
    }) => {
      const { data, error } = await supabase
        .from("mapa_heroina")
        .insert({
          user_id: user!.id,
          porta_id: params.porta_id,
          cliente_nome: params.cliente_nome || null,
          evolucao_texto: params.evolucao_texto || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mapa-heroina"] });
    },
  });
}

export function useUpdateMapaEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      status?: "ativa" | "integrada";
      evolucao_texto?: string;
    }) => {
      const { id, ...updates } = params;
      const { error } = await supabase
        .from("mapa_heroina")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mapa-heroina"] });
    },
  });
}

// ============================================
// AUDITORIA (Admin)
// ============================================

export function useLabirintoAuditoria() {
  return useQuery({
    queryKey: ["labirinto-auditoria"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessoes_labirinto")
        .select("porta_id, modo, concluida, created_at");

      if (error) throw error;

      // Aggregate metrics
      const porPorta: Record<string, number> = {};
      let pessoal = 0;
      let profissional = 0;
      let total = (data || []).length;

      (data || []).forEach((s: { porta_id: string | null; modo: string }) => {
        if (s.porta_id) {
          porPorta[s.porta_id] = (porPorta[s.porta_id] || 0) + 1;
        }
        if (s.modo === "pessoal") pessoal++;
        if (s.modo === "profissional") profissional++;
      });

      return { porPorta, pessoal, profissional, total };
    },
  });
}
