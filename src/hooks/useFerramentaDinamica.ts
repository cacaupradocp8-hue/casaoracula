import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PortalType } from "@/types/portal";

export interface FerramentaDinamica {
  id: string;
  sala_id: string;
  ferramenta_chave: string;
  ferramenta_nome: string;
  ferramenta_descricao: string;
  icone: string;
  rota: string;
  ordem: number;
  ativa: boolean;
  tipo: string | null;
  portal_minimo: PortalType;
  has_blocks: boolean;
  slug: string;
}

interface UseFerramentaDinamicaResult {
  ferramenta: FerramentaDinamica | null;
  isLoading: boolean;
  error: Error | null;
  hasAccess: boolean;
}

export function useFerramentaDinamica(slug: string | undefined): UseFerramentaDinamicaResult {
  const { canAccess, user } = useAuth();
  const isAdmin = user?.portal === "admin";

  const { data, isLoading, error } = useQuery({
    queryKey: ["ferramenta-dinamica", slug],
    queryFn: async () => {
      if (!slug) throw new Error("Slug não informado");

      const { data, error } = await supabase
        .from("sala_ferramentas")
        .select("*")
        .eq("slug", slug)
        .eq("ativa", true)
        .single();

      if (error) throw error;
      return data as FerramentaDinamica;
    },
    enabled: !!slug,
  });

  const hasAccess = isAdmin || (data?.portal_minimo ? canAccess(data.portal_minimo) : false);

  return {
    ferramenta: data ?? null,
    isLoading,
    error: error as Error | null,
    hasAccess,
  };
}
