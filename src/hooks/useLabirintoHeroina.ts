import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ============================================
// LABIRINTO DA HEROÍNA INTERNA® - HOOKS
// Ferramenta-Mãe com 4 camadas sistêmicas
// ============================================

export interface LabirintoFase {
  id: string;
  ordem: number;
  nome: string;
  subtitulo: string | null;
  descricao: string | null;
  icone: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabirintoArquetipo {
  id: string;
  ordem: number;
  nome: string;
  territorio: string | null;
  descricao_luz: string | null;
  descricao_sombra: string | null;
  icone: string | null;
  imagem_url: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabirintoMetafora {
  id: string;
  ordem: number;
  nome: string;
  texto_evocativo: string | null;
  pergunta_reflexao: string | null;
  icone: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabirintoRitual {
  id: string;
  ordem: number;
  nome: string;
  descricao: string | null;
  instrucoes: string | null;
  duracao: string | null;
  icone: string | null;
  cor_acento: string | null;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface LabirintoRegistro {
  id: string;
  user_id: string;
  terapeuta_id: string | null;
  session_case_id: string | null;
  modo_uso: "individual" | "grupo" | "constelacao" | "mentoria";
  fase_id: string | null;
  arquetipo_id: string | null;
  metafora_id: string | null;
  ritual_id: string | null;
  reflexao_fase: string | null;
  reflexao_arquetipo: string | null;
  reflexao_metafora: string | null;
  reflexao_ritual: string | null;
  reflexao_final: string | null;
  concluido: boolean;
  concluido_em: string | null;
  notas_terapeuta: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// HOOKS DE LEITURA
// ============================================

export function useLabirintoFases() {
  return useQuery({
    queryKey: ["labirinto-heroina-fases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_fases")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error) throw error;
      return data as LabirintoFase[];
    },
  });
}

export function useLabirintoArquetipos() {
  return useQuery({
    queryKey: ["labirinto-heroina-arquetipos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_arquetipos")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error) throw error;
      return data as LabirintoArquetipo[];
    },
  });
}

export function useLabirintoMetaforas() {
  return useQuery({
    queryKey: ["labirinto-heroina-metaforas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_metaforas")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error) throw error;
      return data as LabirintoMetafora[];
    },
  });
}

export function useLabirintoRituais() {
  return useQuery({
    queryKey: ["labirinto-heroina-rituais"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_rituais")
        .select("*")
        .eq("ativo", true)
        .order("ordem");
      
      if (error) throw error;
      return data as LabirintoRitual[];
    },
  });
}

// Fetch all 4 layers at once
export function useLabirintoHeroinaData() {
  const fases = useLabirintoFases();
  const arquetipos = useLabirintoArquetipos();
  const metaforas = useLabirintoMetaforas();
  const rituais = useLabirintoRituais();

  return {
    fases: fases.data || [],
    arquetipos: arquetipos.data || [],
    metaforas: metaforas.data || [],
    rituais: rituais.data || [],
    isLoading: fases.isLoading || arquetipos.isLoading || metaforas.isLoading || rituais.isLoading,
    error: fases.error || arquetipos.error || metaforas.error || rituais.error,
  };
}

// Fetch user's registros
export function useLabirintoHeroinaRegistros() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["labirinto-heroina-registros", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_registros")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LabirintoRegistro[];
    },
    enabled: !!user,
  });
}

// ============================================
// HOOKS DE MUTAÇÃO
// ============================================

export function useCreateLabirintoRegistro() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      modo_uso?: "individual" | "grupo" | "constelacao" | "mentoria";
      terapeuta_id?: string;
      session_case_id?: string;
      fase_id?: string;
      arquetipo_id?: string;
      metafora_id?: string;
      ritual_id?: string;
      reflexao_fase?: string;
      reflexao_arquetipo?: string;
      reflexao_metafora?: string;
      reflexao_ritual?: string;
      reflexao_final?: string;
    }) => {
      const { data, error } = await supabase
        .from("labirinto_registros")
        .insert({
          user_id: user!.id,
          modo_uso: params.modo_uso || "individual",
          terapeuta_id: params.terapeuta_id || null,
          session_case_id: params.session_case_id || null,
          fase_id: params.fase_id || null,
          arquetipo_id: params.arquetipo_id || null,
          metafora_id: params.metafora_id || null,
          ritual_id: params.ritual_id || null,
          reflexao_fase: params.reflexao_fase || null,
          reflexao_arquetipo: params.reflexao_arquetipo || null,
          reflexao_metafora: params.reflexao_metafora || null,
          reflexao_ritual: params.reflexao_ritual || null,
          reflexao_final: params.reflexao_final || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labirinto-heroina-registros"] });
    },
  });
}

export function useUpdateLabirintoRegistro() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      id: string;
      fase_id?: string;
      arquetipo_id?: string;
      metafora_id?: string;
      ritual_id?: string;
      reflexao_fase?: string;
      reflexao_arquetipo?: string;
      reflexao_metafora?: string;
      reflexao_ritual?: string;
      reflexao_final?: string;
      concluido?: boolean;
    }) => {
      const { id, ...updates } = params;
      
      // Build update object with only provided fields
      const updateData: Record<string, unknown> = {};
      if (updates.fase_id !== undefined) updateData.fase_id = updates.fase_id;
      if (updates.arquetipo_id !== undefined) updateData.arquetipo_id = updates.arquetipo_id;
      if (updates.metafora_id !== undefined) updateData.metafora_id = updates.metafora_id;
      if (updates.ritual_id !== undefined) updateData.ritual_id = updates.ritual_id;
      if (updates.reflexao_fase !== undefined) updateData.reflexao_fase = updates.reflexao_fase;
      if (updates.reflexao_arquetipo !== undefined) updateData.reflexao_arquetipo = updates.reflexao_arquetipo;
      if (updates.reflexao_metafora !== undefined) updateData.reflexao_metafora = updates.reflexao_metafora;
      if (updates.reflexao_ritual !== undefined) updateData.reflexao_ritual = updates.reflexao_ritual;
      if (updates.reflexao_final !== undefined) updateData.reflexao_final = updates.reflexao_final;
      if (updates.concluido !== undefined) {
        updateData.concluido = updates.concluido;
        if (updates.concluido) {
          updateData.concluido_em = new Date().toISOString();
        }
      }
      
      const { error } = await supabase
        .from("labirinto_registros")
        .update(updateData)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labirinto-heroina-registros"] });
    },
  });
}
