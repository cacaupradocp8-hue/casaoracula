import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ArquetipoRegistro {
  id: string;
  user_id: string;
  arquetipo_id: string;
  polaridade_percebida: string | null;
  registrado_em: string;
  created_at: string;
}

export function useHeroinaArquetipoRegistros() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["heroina-arquetipo-registros", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("heroina_arquetipo_registros")
        .select("*")
        .order("registrado_em", { ascending: false });

      if (error) throw error;
      return data as ArquetipoRegistro[];
    },
    enabled: !!user,
  });
}

export function useRegistrarArquetipo() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      arquetipo_id: string;
      polaridade_percebida?: string;
    }) => {
      const { data, error } = await supabase
        .from("heroina_arquetipo_registros")
        .insert({
          user_id: user!.id,
          arquetipo_id: params.arquetipo_id,
          polaridade_percebida: params.polaridade_percebida || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroina-arquetipo-registros"] });
    },
  });
}
