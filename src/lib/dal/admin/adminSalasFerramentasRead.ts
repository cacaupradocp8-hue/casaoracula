import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type NivelSala = "NIVEL_0" | "NIVEL_1" | "NIVEL_2" | "NIVEL_3";
export type PortalType = Database['public']['Enums']['portal_type'];

export interface SalaFull {
  id: string;
  nivel_minimo: NivelSala;
  nome_exibicao: string;
  texto_entrada: string;
  texto_bloqueio: string;
  ativa: boolean;
  ordem: number;
}

export interface FerramentaFull {
  id: string;
  sala_id: string | null;
  ferramenta_chave: string;
  ferramenta_nome: string;
  ferramenta_descricao: string | null;
  icone: string | null;
  rota: string | null;
  familia_id: string | null;
  ordem: number;
  ativa: boolean;
  tipo_ferramenta: string | null;
  origem_metodologica: string | null;
  vinculo_metodologico: string | null;
  finalidade_pratica: string | null;
  tipo: string | null;
  portal_minimo: PortalType;
  has_blocks: boolean;
  slug: string | null;
}

export interface PortalSala {
  id: string;
  portal_type: PortalType;
  sala_id: string;
}

/**
 * Lista todas as salas com todos os campos para o Admin.
 */
export async function listAdminSalasFull(): Promise<SalaFull[]> {
  const { data, error } = await supabase
    .from("salas")
    .select("*")
    .order("ordem");

  if (error) throw error;
  return data as SalaFull[];
}

/**
 * Lista todas as ferramentas com todos os campos para o Admin.
 */
export async function listAdminSalaFerramentasFull(): Promise<FerramentaFull[]> {
  const { data, error } = await supabase
    .from("sala_ferramentas")
    .select("*")
    .order("ordem");

  if (error) throw error;
  return data as FerramentaFull[];
}

/**
 * Lista todos os vínculos entre portais e salas.
 */
export async function listAdminPortalSalas(): Promise<PortalSala[]> {
  const { data, error } = await supabase
    .from("portal_salas")
    .select("*");

  if (error) throw error;
  return data as PortalSala[];
}

/**
 * Lista salas ativas apenas com campos necessários para o formulário de ferramentas.
 */
export async function listAdminSalasForFerramentas() {
  const { data, error } = await supabase
    .from("salas")
    .select("id, nome_exibicao")
    .eq("ativa", true)
    .order("ordem");

  if (error) throw error;
  return data;
}
