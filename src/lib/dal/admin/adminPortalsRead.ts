import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type PortalType = Database['public']['Enums']['portal_type'];

export interface Portal {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao: string;
  texto_introducao: string;
  descricao_pedagogica: string;
  ordem: number;
  portal_minimo: PortalType;
  sala_id: string | null;
  capa_url: string | null;
  publicado: boolean;
  archived_at: string | null;
  archived_by: string | null;
  archive_reason: string | null;
}

export interface Aula {
  id: string;
  travessia_id: string;
  titulo: string;
  descricao_curta: string;
  texto_aula: string | null;
  ordem: number;
  video_url: string | null;
  audio_url: string | null;
  pdf_url: string | null;
  materiais_url: string | null;
  portal_minimo: PortalType;
  publicado: boolean;
  archived_at: string | null;
  archived_by: string | null;
  archive_reason: string | null;
}

export interface Sala {
  id: string;
  nome_exibicao: string;
  nivel_minimo: string;
}

export interface Ferramenta {
  id: string;
  ferramenta_nome: string;
  ferramenta_descricao: string;
  icone: string | null;
  ativa: boolean;
  ordem: number;
  sala_id: string;
  portal_id: string | null;
}

/**
 * Lista todos os portais (travessias) para o Admin.
 * @returns Promessa com a lista de portais.
 */
export async function listAdminConteudoPortais(): Promise<Portal[]> {
  const { data, error } = await supabase
    .from('conteudo_travessias')
    .select('*')
    .is('archived_at', null)
    .order('ordem', { ascending: true });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id: item.id,
    titulo: item.titulo,
    subtitulo: item.subtitulo || '',
    descricao: item.descricao,
    texto_introducao: item.texto_introducao || '',
    descricao_pedagogica: item.descricao_pedagogica || '',
    ordem: item.ordem,
    portal_minimo: item.portal_minimo,
    sala_id: item.sala_id,
    capa_url: item.capa_url,
    publicado: item.publicado ?? true,
    archived_at: item.archived_at,
    archived_by: item.archived_by,
    archive_reason: item.archive_reason,
  })) as Portal[];
}

/**
 * Lista todas as aulas de uma travessia específica para o Admin.
 * @param travessiaId ID da travessia (portal).
 * @returns Promessa com a lista de aulas.
 */
export async function listAdminConteudoAulas(travessiaId: string): Promise<Aula[]> {
  const { data, error } = await supabase
    .from('conteudo_aulas')
    .select('*')
    .eq('travessia_id', travessiaId)
    .is('archived_at', null)
    .order('ordem', { ascending: true });

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id: item.id,
    travessia_id: item.travessia_id,
    titulo: item.titulo,
    descricao_curta: item.descricao_curta,
    texto_aula: item.texto_aula,
    ordem: item.ordem,
    video_url: item.video_url,
    audio_url: item.audio_url,
    pdf_url: item.pdf_url,
    materiais_url: item.materiais_url,
    portal_minimo: item.portal_minimo,
    publicado: item.publicado ?? true,
    archived_at: item.archived_at,
    archived_by: item.archived_by,
    archive_reason: item.archive_reason,
  })) as Aula[];
}

/**
 * Lista todas as salas ativas para o Admin.
 * @returns Promessa com a lista de salas.
 */
export async function listAdminSalasAtivas(): Promise<Sala[]> {
  const { data, error } = await supabase
    .from('salas')
    .select('id, nome_exibicao, nivel_minimo')
    .eq('ativa', true)
    .order('ordem', { ascending: true });

  if (error) throw error;
  return data as Sala[];
}

/**
 * Lista todas as ferramentas de sala para o Admin.
 * @returns Promessa com a lista de ferramentas.
 */
export async function listAdminSalaFerramentas(): Promise<Ferramenta[]> {
  const { data, error } = await supabase
    .from('sala_ferramentas')
    .select('id, ferramenta_nome, ferramenta_descricao, icone, ativa, ordem, sala_id, portal_id')
    .order('ordem', { ascending: true });

  if (error) throw error;
  return data as Ferramenta[];
}
