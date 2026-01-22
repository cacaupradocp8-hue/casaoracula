import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TorreId } from "./useTorrePortaIntegracao";

export interface BibliotecaCaso {
  id: string;
  torre_id: TorreId;
  porta_id: string | null;
  porta_nome: string | null;
  titulo: string | null;
  cena: string;
  erro_comum: string;
  leitura_oracula: string;
  resultado: string;
  risco_tipo: 'pressa' | 'interpretacao' | 'confronto' | 'moralizacao' | 'resiliencia' | 'explicacao' | 'outro' | null;
  tags: string[] | null;
  fonte: string | null;
  autor_id: string | null;
  ativa: boolean;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export interface BibliotecaFiltros {
  torre_id?: TorreId;
  porta_id?: string;
  risco_tipo?: string;
  fonte?: string;
}

/**
 * Busca todos os casos da biblioteca com filtros opcionais
 */
export function useBibliotecaCasos(filtros?: BibliotecaFiltros) {
  return useQuery({
    queryKey: ["biblioteca-casos", filtros],
    queryFn: async () => {
      let query = supabase
        .from("biblioteca_casos")
        .select("*")
        .eq("ativa", true)
        .order("torre_id")
        .order("ordem");
      
      if (filtros?.torre_id) {
        query = query.eq("torre_id", filtros.torre_id);
      }
      if (filtros?.porta_id) {
        query = query.eq("porta_id", filtros.porta_id);
      }
      if (filtros?.risco_tipo) {
        query = query.eq("risco_tipo", filtros.risco_tipo);
      }
      if (filtros?.fonte) {
        query = query.eq("fonte", filtros.fonte);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as BibliotecaCaso[];
    },
  });
}

/**
 * Busca um caso específico
 */
export function useBibliotecaCaso(casoId: string | undefined) {
  return useQuery({
    queryKey: ["biblioteca-caso", casoId],
    queryFn: async () => {
      if (!casoId) return null;
      
      const { data, error } = await supabase
        .from("biblioteca_casos")
        .select("*")
        .eq("id", casoId)
        .single();
      
      if (error) throw error;
      return data as BibliotecaCaso;
    },
    enabled: !!casoId,
  });
}

/**
 * Busca todos os casos (admin)
 */
export function useBibliotecaCasosAdmin() {
  return useQuery({
    queryKey: ["biblioteca-casos-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("biblioteca_casos")
        .select("*")
        .order("torre_id")
        .order("ordem");
      
      if (error) throw error;
      return data as BibliotecaCaso[];
    },
  });
}

/**
 * Criar novo caso
 */
export function useCreateBibliotecaCaso() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (caso: Omit<BibliotecaCaso, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from("biblioteca_casos")
        .insert(caso)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biblioteca-casos"] });
      queryClient.invalidateQueries({ queryKey: ["biblioteca-casos-admin"] });
    },
  });
}

/**
 * Atualizar caso
 */
export function useUpdateBibliotecaCaso() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BibliotecaCaso> & { id: string }) => {
      const { error } = await supabase
        .from("biblioteca_casos")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biblioteca-casos"] });
      queryClient.invalidateQueries({ queryKey: ["biblioteca-casos-admin"] });
    },
  });
}

/**
 * Deletar caso
 */
export function useDeleteBibliotecaCaso() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("biblioteca_casos")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["biblioteca-casos"] });
      queryClient.invalidateQueries({ queryKey: ["biblioteca-casos-admin"] });
    },
  });
}
