export interface CollectiveBed {
  id: string;
  season_id: string | null;
  ciclo_id: string | null;
  status: string;
  aberto_em: string;
  encerrado_em: string | null;
}

export type EntryType = 'reflexao' | 'pergunta' | 'semente_pratica' | 'eco_de_leitura' | 'fragmento';
export type ReactionType = 'ecoou' | 'guardar_refletir' | 'levar_travessia';

export interface CollectiveBedEntry {
  id: string;
  bed_id: string;
  user_id: string;
  season_id: string | null;
  ciclo_id: string | null;
  origem: 'psique' | 'oficio';
  texto: string;
  entry_type: EntryType;
  published_title: string | null;
  aprovado_por_admin: boolean;
  publicado_em: string | null;
  exibicao_anonima: boolean;
  rejeitado: boolean;
  created_at: string;
  profiles?: { nome: string | null } | null;
  author_nome?: string | null;
}

export interface CanteiroEntry extends CollectiveBedEntry {}

export interface PublicacaoCanteiro {
  id: string;
  texto: string;
  origem: 'psique' | 'oficio';
  aprovado_por_admin: boolean;
  publicado_em: string | null;
  rejeitado: boolean;
  exibicao_anonima: boolean;
  created_at: string;
  source_entry_id: string | null;
  entry_type: string | null;
  published_title: string | null;
}
