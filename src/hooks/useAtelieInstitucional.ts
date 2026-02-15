import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ==================== TYPES ====================

export interface Jornada {
  id: string;
  nome: string;
  descricao: string | null;
  icone: string | null;
  cor_acento: string | null;
  ordem: number;
  ativa: boolean;
}

export interface PortalRecord {
  id: string;
  jornada_id: string;
  modulo_id: string | null;
  titulo: string;
  subtitulo: string | null;
  objetivo: string | null;
  descricao: string | null;
  ordem: number;
  status: "rascunho" | "revisado" | "publicado" | "arquivado";
  motor_geracao: "padrao" | "agente_casa_oracula";
  nivel_conteudo: "certificada" | "mentorada";
  portal_minimo: string;
  created_at: string;
}

export interface AulaRecord {
  id: string;
  portal_id: string;
  titulo: string;
  subtitulo: string | null;
  conteudo_gerado: Record<string, string> | null;
  conteudo_raw: string | null;
  ordem: number;
  status: "rascunho" | "revisado" | "publicado" | "arquivado";
  motor_geracao: "padrao" | "agente_casa_oracula";
  nivel_conteudo: "certificada" | "mentorada";
  duracao: string | null;
  tom: string | null;
  created_at: string;
}

export interface MissaoRecord {
  id: string;
  portal_id: string | null;
  aula_id: string | null;
  titulo: string;
  descricao: string | null;
  criterios_conclusao: string | null;
  compartilhamento_opcional: boolean;
  status: string;
  ordem: number;
}

export type ModoOperacao = "criar_portal_aula" | "criar_aula" | "atualizar_aula";
export type MotorGeracao = "padrao" | "agente_casa_oracula";
export type NivelConteudo = "certificada" | "mentorada";

export interface AtelieInstitucionalInput {
  // Structural
  jornada_id: string;
  modulo_id?: string;
  portal_id?: string;
  aula_id?: string;
  // Mode
  modo: ModoOperacao;
  motor: MotorGeracao;
  nivel: NivelConteudo;
  // Content
  titulo_portal: string;
  titulo_aula?: string;
  objetivo: string;
  ideias_chave: string;
  tom: string;
  duracao?: string;
  template_id?: string;
}

// ==================== QUERIES ====================

export function useJornadas() {
  return useQuery({
    queryKey: ["jornadas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jornadas")
        .select("*")
        .eq("ativa", true)
        .order("ordem");
      if (error) throw error;
      return data as Jornada[];
    },
  });
}

export function usePortaisByJornada(jornadaId?: string) {
  return useQuery({
    queryKey: ["portais", jornadaId],
    enabled: !!jornadaId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portais")
        .select("*")
        .eq("jornada_id", jornadaId!)
        .order("ordem");
      if (error) throw error;
      return data as PortalRecord[];
    },
  });
}

export function useAulasByPortal(portalId?: string) {
  return useQuery({
    queryKey: ["aulas", portalId],
    enabled: !!portalId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("aulas")
        .select("*")
        .eq("portal_id", portalId!)
        .order("ordem");
      if (error) throw error;
      return data as AulaRecord[];
    },
  });
}

// ==================== MUTATIONS ====================

export function useCreatePortalComAula() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      jornada_id: string;
      modulo_id?: string;
      titulo: string;
      objetivo?: string;
      motor_geracao: MotorGeracao;
      nivel_conteudo: NivelConteudo;
      aula: {
        titulo: string;
        conteudo_gerado: Record<string, string>;
        conteudo_raw: string;
        tom?: string;
        duracao?: string;
      };
      missao?: {
        titulo: string;
        descricao?: string;
        criterios_conclusao?: string;
      };
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      // 1. Create Portal
      const { data: portal, error: portalError } = await supabase
        .from("portais")
        .insert({
          jornada_id: input.jornada_id,
          modulo_id: input.modulo_id || null,
          titulo: input.titulo,
          objetivo: input.objetivo || null,
          status: "rascunho",
          motor_geracao: input.motor_geracao,
          nivel_conteudo: input.nivel_conteudo,
          created_by: userId,
        })
        .select()
        .single();

      if (portalError) throw portalError;

      // 2. Create Aula
      const { data: aula, error: aulaError } = await supabase
        .from("aulas")
        .insert({
          portal_id: portal.id,
          titulo: input.aula.titulo,
          conteudo_gerado: input.aula.conteudo_gerado,
          conteudo_raw: input.aula.conteudo_raw,
          tom: input.aula.tom || null,
          duracao: input.aula.duracao || null,
          status: "rascunho",
          motor_geracao: input.motor_geracao,
          nivel_conteudo: input.nivel_conteudo,
          created_by: userId,
        })
        .select()
        .single();

      if (aulaError) throw aulaError;

      // 3. Create Missão (if provided)
      if (input.missao) {
        await supabase.from("missoes").insert({
          portal_id: portal.id,
          aula_id: aula.id,
          titulo: input.missao.titulo,
          descricao: input.missao.descricao || null,
          criterios_conclusao: input.missao.criterios_conclusao || null,
          status: "pendente",
          created_by: userId,
        });
      }

      return { portal, aula };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portais"] });
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      toast.success("Portal e Aula criados como rascunho!");
    },
    onError: (error) => {
      console.error("Error creating portal+aula:", error);
      toast.error("Erro ao criar portal e aula");
    },
  });
}

export function useCreateAulaEmPortal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      portal_id: string;
      titulo: string;
      conteudo_gerado: Record<string, string>;
      conteudo_raw: string;
      motor_geracao: MotorGeracao;
      nivel_conteudo: NivelConteudo;
      tom?: string;
      duracao?: string;
      missao?: {
        titulo: string;
        descricao?: string;
        criterios_conclusao?: string;
      };
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;

      const { data: aula, error } = await supabase
        .from("aulas")
        .insert({
          portal_id: input.portal_id,
          titulo: input.titulo,
          conteudo_gerado: input.conteudo_gerado,
          conteudo_raw: input.conteudo_raw,
          tom: input.tom || null,
          duracao: input.duracao || null,
          status: "rascunho",
          motor_geracao: input.motor_geracao,
          nivel_conteudo: input.nivel_conteudo,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      if (input.missao) {
        await supabase.from("missoes").insert({
          portal_id: input.portal_id,
          aula_id: aula.id,
          titulo: input.missao.titulo,
          descricao: input.missao.descricao || null,
          criterios_conclusao: input.missao.criterios_conclusao || null,
          status: "pendente",
          created_by: userId,
        });
      }

      return aula;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      toast.success("Aula criada como rascunho!");
    },
    onError: (error) => {
      console.error("Error creating aula:", error);
      toast.error("Erro ao criar aula");
    },
  });
}

export function useUpdateAulaExistente() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: {
      aula_id: string;
      conteudo_gerado: Record<string, string>;
      conteudo_raw: string;
      motor_geracao: MotorGeracao;
      nivel_conteudo: NivelConteudo;
    }) => {
      const { data, error } = await supabase
        .from("aulas")
        .update({
          conteudo_gerado: input.conteudo_gerado,
          conteudo_raw: input.conteudo_raw,
          motor_geracao: input.motor_geracao,
          nivel_conteudo: input.nivel_conteudo,
          status: "rascunho",
        })
        .eq("id", input.aula_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aulas"] });
      toast.success("Aula atualizada (rascunho)!");
    },
    onError: (error) => {
      console.error("Error updating aula:", error);
      toast.error("Erro ao atualizar aula");
    },
  });
}

export function usePublishPortal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portalId: string) => {
      const { error } = await supabase
        .from("portais")
        .update({ status: "publicado" })
        .eq("id", portalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portais"] });
      toast.success("Portal publicado!");
    },
  });
}

export function useArchivePortal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (portalId: string) => {
      const { error } = await supabase
        .from("portais")
        .update({ status: "arquivado" })
        .eq("id", portalId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portais"] });
      toast.success("Portal arquivado!");
    },
  });
}
