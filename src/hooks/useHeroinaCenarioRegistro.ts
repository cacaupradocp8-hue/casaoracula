import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// ============================================
// REINO DOS CENÁRIOS — Hook de Registros
// Paisagens psíquicas contempladas
// ============================================

export interface CenarioRegistro {
  id: string;
  user_id: string;
  metafora_id: string;
  anotacao_livre: string | null;
  registrado_em: string;
  created_at: string;
}

export function useHeroinaCenarioRegistros() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["heroina-cenario-registros", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("heroina_cenario_registros")
        .select("*")
        .eq("user_id", user.id)
        .order("registrado_em", { ascending: false });
      
      if (error) throw error;
      return data as CenarioRegistro[];
    },
    enabled: !!user,
  });
}

export function useRegistrarCenario() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      metafora_id: string;
      anotacao_livre?: string;
    }) => {
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("heroina_cenario_registros")
        .insert({
          user_id: user.id,
          metafora_id: params.metafora_id,
          anotacao_livre: params.anotacao_livre || null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroina-cenario-registros"] });
    },
  });
}

export function useAtualizarAnotacaoCenario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      registro_id: string;
      anotacao_livre: string;
    }) => {
      const { error } = await supabase
        .from("heroina_cenario_registros")
        .update({ anotacao_livre: params.anotacao_livre })
        .eq("id", params.registro_id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroina-cenario-registros"] });
    },
  });
}
