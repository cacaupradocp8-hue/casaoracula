import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface HeroinaRitualRegistro {
  id: string;
  user_id: string;
  ritual_id: string;
  reflexao: string | null;
  completado_em: string;
  created_at: string;
}

export function useHeroinaRitualRegistros() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["heroina-ritual-registros", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("heroina_ritual_registros")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as HeroinaRitualRegistro[];
    },
    enabled: !!user?.id,
  });
}

export function useRegistrarRitual() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      ritualId,
      reflexao,
    }: {
      ritualId: string;
      reflexao?: string;
    }) => {
      if (!user?.id) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("heroina_ritual_registros")
        .insert({
          user_id: user.id,
          ritual_id: ritualId,
          reflexao: reflexao || null,
          completado_em: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["heroina-ritual-registros"] });
      toast.success("Ritual registrado no seu Mapa da Heroína ✨");
    },
    onError: (error) => {
      console.error("Erro ao registrar ritual:", error);
      toast.error("Erro ao registrar ritual");
    },
  });
}
