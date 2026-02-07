import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AtelieTemplate {
  id: string;
  name: string;
  version: string | null;
  system_prompt: string;
  action_prompt: string;
  is_default: boolean;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface AtelieConteudo {
  id: string;
  template_id: string | null;
  jornada: string;
  portal: string;
  objetivo: string;
  ideias_chave: string;
  tom: string;
  duracao: string | null;
  conteudo_gerado: Record<string, string> | null;
  status: "rascunho" | "revisado" | "publicado";
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GenerateContentInput {
  jornada: string;
  portal: string;
  objetivo: string;
  ideias_chave: string;
  tom: string;
  duracao?: string;
  template_id?: string;
  save_draft?: boolean;
  status?: "rascunho" | "revisado" | "publicado";
}

export interface GenerateContentResponse {
  raw_content: string;
  sections: Record<string, string>;
  usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
  draft?: AtelieConteudo | null;
}

export function useAtelieTemplates() {
  return useQuery({
    queryKey: ["atelie-templates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("ativo", true)
        .order("is_default", { ascending: false })
        .order("name");

      if (error) throw error;
      return data as AtelieTemplate[];
    },
  });
}

export function useAtelieConteudos() {
  return useQuery({
    queryKey: ["atelie-conteudos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("atelie_conteudos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as AtelieConteudo[];
    },
  });
}

export function useGenerateContent() {
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = async (input: GenerateContentInput): Promise<GenerateContentResponse | null> => {
    setIsGenerating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (!token) {
        toast.error("Você precisa estar autenticado");
        return null;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-portal-content`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(input),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        
        if (response.status === 429) {
          toast.error("Limite de requisições excedido. Aguarde e tente novamente.");
          return null;
        }
        if (response.status === 402) {
          toast.error("Créditos insuficientes. Adicione créditos ao workspace.");
          return null;
        }
        
        throw new Error(errorData.error || "Erro na geração");
      }

      const data: GenerateContentResponse = await response.json();
      toast.success("Conteúdo gerado com sucesso!");
      return data;
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error(error instanceof Error ? error.message : "Erro ao gerar conteúdo");
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
}

export function useSaveConteudo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      template_id?: string;
      jornada: string;
      portal: string;
      objetivo: string;
      ideias_chave: string;
      tom: string;
      duracao?: string;
      conteudo_gerado: Record<string, string>;
      status?: "rascunho" | "revisado" | "publicado";
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("atelie_conteudos")
        .insert({
          ...input,
          created_by: userData.user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atelie-conteudos"] });
      toast.success("Conteúdo salvo com sucesso!");
    },
    onError: (error) => {
      console.error("Error saving content:", error);
      toast.error("Erro ao salvar conteúdo");
    },
  });
}

export function useUpdateConteudo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AtelieConteudo> & { id: string }) => {
      const { data, error } = await supabase
        .from("atelie_conteudos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atelie-conteudos"] });
      toast.success("Conteúdo atualizado!");
    },
    onError: (error) => {
      console.error("Error updating content:", error);
      toast.error("Erro ao atualizar conteúdo");
    },
  });
}

export function useDeleteConteudo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("atelie_conteudos")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["atelie-conteudos"] });
      toast.success("Conteúdo excluído!");
    },
    onError: (error) => {
      console.error("Error deleting content:", error);
      toast.error("Erro ao excluir conteúdo");
    },
  });
}
