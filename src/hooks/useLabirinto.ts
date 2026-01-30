import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PortalType } from "@/types/portal";

export interface LabirintoPorta {
  id: string;
  numero: number;
  nome: string;
  subtitulo: string | null;
  imagem_url: string | null;
  ai_generated_image_url: string | null;
  symbolic_focus: string | null;
  // Audio contemplativo
  audio_url: string | null;
  audio_titulo: string | null;
  // Campos Método ORÁCULA (estruturados)
  tipo_campo: string | null;
  forca_ativa: string | null;
  campo_pede: string | null;
  nao_fazer_aqui: string | null;
  postura_facilitadora: string | null;
  // Campos do Tratado das 39 Portas
  grupo_tratado: string | null;
  criterio_integracao: string | null;
  tipo_evento: string | null;
  // Campos legados (opcionais)
  cena_narrativa: string | null;
  eixo_psiquico: string | null;
  risco_clinico: string | null;
  pergunta_chave: string | null;
  // Caso Espelho (Modelo Completo)
  caso_espelho_titulo: string | null;
  caso_espelho_situacao: string | null;
  caso_espelho_erros_facilitadora: string | null;
  caso_espelho_postura_correta: string | null;
  // Campos legados (mantidos para retrocompatibilidade)
  caso_espelho_frase_chegada: string | null;
  caso_espelho_erro_comum: string | null;
  caso_espelho_como_sustentar: string | null;
  // Chave Facilitadora
  chave_frase_ancora: string | null;
  chave_o_que_nao_fazer: string | null;
  chave_quando_parar: string | null;
  chave_sinal_maturidade: string | null;
  ativa: boolean;
  ordem: number;
  portal_minimo: PortalType;
  portal_caso_espelho: PortalType;
  portal_chave_facilitadora: PortalType;
  created_at: string;
  updated_at: string;
}

export interface LabirintoAnotacao {
  id: string;
  porta_id: string;
  user_id: string;
  cliente_id: string | null;
  anotacao: string;
  tipo: string;
  created_at: string;
  updated_at: string;
}

export interface LabirintoLeitura {
  id: string;
  porta_id: string;
  user_id: string;
  cliente_id: string | null;
  metodo_ativacao: string;
  contexto: string | null;
  reflexoes: string | null;
  created_at: string;
  porta?: LabirintoPorta;
}

// Fetch all active doors
export function useLabirintoPortas() {
  const { user } = useAuth();
  const isAdmin = user?.portal === "admin";

  return useQuery({
    queryKey: ["labirinto-portas", isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("labirinto_portas")
        .select("*")
        .order("ordem");
      
      // Admin can see all, users only active
      if (!isAdmin) {
        query = query.eq("ativa", true);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as LabirintoPorta[];
    },
    enabled: !!user,
  });
}

// Fetch single door
export function useLabirintoPorta(portaId: string | undefined) {
  return useQuery({
    queryKey: ["labirinto-porta", portaId],
    queryFn: async () => {
      if (!portaId) throw new Error("ID da porta não informado");
      
      const { data, error } = await supabase
        .from("labirinto_portas")
        .select("*")
        .eq("id", portaId)
        .single();
      
      if (error) throw error;
      return data as LabirintoPorta;
    },
    enabled: !!portaId,
  });
}

// Fetch user's reading history
export function useLabirintoLeituras() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["labirinto-leituras", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_leituras")
        .select(`
          *,
          porta:labirinto_portas(id, numero, nome, imagem_url, ai_generated_image_url)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as (LabirintoLeitura & { porta: LabirintoPorta })[];
    },
    enabled: !!user,
  });
}

// Fetch user's notes for a specific door
export function useLabirintoAnotacoes(portaId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["labirinto-anotacoes", portaId, user?.id],
    queryFn: async () => {
      if (!portaId) throw new Error("ID da porta não informado");
      
      const { data, error } = await supabase
        .from("labirinto_anotacoes")
        .select("*")
        .eq("porta_id", portaId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as LabirintoAnotacao[];
    },
    enabled: !!portaId && !!user,
  });
}

// Create a reading (when door is activated)
export function useCreateLeitura() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      porta_id: string;
      metodo_ativacao: "manual" | "oraculo";
      cliente_id?: string;
      contexto?: string;
    }) => {
      const { data, error } = await supabase
        .from("labirinto_leituras")
        .insert({
          porta_id: params.porta_id,
          user_id: user!.id,
          cliente_id: params.cliente_id || null,
          metodo_ativacao: params.metodo_ativacao,
          contexto: params.contexto || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labirinto-leituras"] });
    },
  });
}

// Update reading with reflections
export function useUpdateLeitura() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { id: string; reflexoes: string }) => {
      const { error } = await supabase
        .from("labirinto_leituras")
        .update({ reflexoes: params.reflexoes })
        .eq("id", params.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labirinto-leituras"] });
    },
  });
}

// Create note
export function useCreateAnotacao() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      porta_id: string;
      anotacao: string;
      tipo?: string;
      cliente_id?: string;
    }) => {
      const { data, error } = await supabase
        .from("labirinto_anotacoes")
        .insert({
          porta_id: params.porta_id,
          user_id: user!.id,
          anotacao: params.anotacao,
          tipo: params.tipo || "geral",
          cliente_id: params.cliente_id || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["labirinto-anotacoes", variables.porta_id] });
    },
  });
}

// Delete note
export function useDeleteAnotacao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("labirinto_anotacoes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["labirinto-anotacoes"] });
    },
  });
}

// Oracle question: get random door
export function useLabirintoOraculo() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from("labirinto_portas")
        .select("*")
        .eq("ativa", true);
      
      if (error) throw error;
      if (!data || data.length === 0) throw new Error("Nenhuma porta disponível");
      
      // Return random door
      const randomIndex = Math.floor(Math.random() * data.length);
      return data[randomIndex] as LabirintoPorta;
    },
  });
}
