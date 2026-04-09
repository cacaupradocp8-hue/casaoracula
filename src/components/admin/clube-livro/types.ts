// ============================================
// TIPOS COMPARTILHADOS — Admin Clube do Livro
// ============================================

export interface Ciclo {
  id: string;
  titulo: string;
  subtitulo?: string;
  autor_livro?: string;
  capa_url?: string;
  por_que_este_livro?: string;
  como_ler?: string;
  manifesto?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
  portal_minimo: string;
  tema_simbolico?: string;
  orientacao_clinica_uso?: string;
  orientacao_clinica_evitar?: string;
  orientacao_clinica_riscos?: string;
  orientacao_clinica_indicado?: string;
  orientacao_clinica_contraindicado?: string;
  ritual_aceite_obrigatorio?: boolean;
  portal_minimo_clinico?: string;
  campo_simbolico?: string;
  mensagem_campo_url?: string;
  mensagem_campo_texto?: string;
  por_que_slides?: any[];
  por_que_audio_url?: string;
  como_ler_slides?: any[];
  como_ler_audio_url?: string;
}

export interface Fase {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  icone?: string;
  ordem: number;
  ativo: boolean;
  tipo_fase?: string;
  orientacao_curta?: string;
  numero_semana?: number;
  leitura_orientada?: string;
  alerta_clinico?: string;
  observacao_clinica?: string;
  lista_uso_inadequado?: string[];
  ponte_sala_id?: string;
  ponte_sala_texto?: string;
  texto_fechamento?: string;
}

export interface Pergunta {
  id: string;
  fase_id: string;
  texto_pergunta: string;
  ordem: number;
  ativo: boolean;
}

export interface Escuta {
  id: string;
  ciclo_id: string;
  fase_id?: string;
  titulo: string;
  descricao?: string;
  tipo: 'audio' | 'texto';
  audio_url?: string;
  texto_conteudo?: string;
  duracao_segundos?: number;
  ordem: number;
  ativo: boolean;
}

export interface Encontro {
  id: string;
  ciclo_id: string;
  titulo: string;
  descricao?: string;
  orientacao_encontro?: string;
  data_encontro?: string;
  link_ao_vivo?: string;
  replay_url?: string;
  ativo: boolean;
}

export interface AulaAdmin {
  id: string;
  ciclo_id: string;
  titulo: string;
  subtitulo?: string;
  descricao?: string;
  duracao?: string;
  conteudo?: string;
  media_url?: string;
  media_type?: string;
  ordem: number;
  ativo: boolean;
  publicado: boolean;
}
