import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Hook to manage the user's active phase in the Heroine's Map
 * Only one phase can be active at a time, but history is preserved
 */
export function useHeroinaFaseAtiva() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's active phase
  const { data: faseAtiva, isLoading } = useQuery({
    queryKey: ["heroina-fase-ativa", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("heroina_fase_ativa")
        .select("*, labirinto_fases(*)")
        .eq("ativa", true)
        .order("registrado_em", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch user's phase history
  const { data: historico, isLoading: isLoadingHistorico } = useQuery({
    queryKey: ["heroina-fase-historico", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("heroina_fase_ativa")
        .select("*, labirinto_fases(nome, icone)")
        .order("registrado_em", { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Register a new active phase
  const registrarFase = useMutation({
    mutationFn: async (faseId: string) => {
      if (!user) throw new Error("Usuária não autenticada");

      // First, deactivate any currently active phase
      await supabase
        .from("heroina_fase_ativa")
        .update({ ativa: false })
        .eq("user_id", user.id)
        .eq("ativa", true);

      // Then, create the new active phase
      const { data, error } = await supabase
        .from("heroina_fase_ativa")
        .insert({
          user_id: user.id,
          fase_id: faseId,
          ativa: true,
        })
        .select("*, labirinto_fases(nome)")
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      const faseName = data.labirinto_fases?.nome || "Nova fase";
      toast.success(`Fase registrada: ${faseName}`, {
        description: "Sua travessia foi atualizada no Mapa da Heroína",
      });
      queryClient.invalidateQueries({ queryKey: ["heroina-fase-ativa"] });
      queryClient.invalidateQueries({ queryKey: ["heroina-fase-historico"] });
    },
    onError: (error) => {
      console.error("Erro ao registrar fase:", error);
      toast.error("Não foi possível registrar a fase");
    },
  });

  return {
    faseAtiva,
    faseAtivaId: faseAtiva?.fase_id || null,
    historico: historico || [],
    isLoading,
    isLoadingHistorico,
    registrarFase: registrarFase.mutate,
    isRegistering: registrarFase.isPending,
  };
}
