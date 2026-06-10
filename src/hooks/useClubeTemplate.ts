import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Rota {
  id: string;
  slug: string;
  titulo: string;
  obra_regente: string;
  autor: string;
  frase_guia: string;
  descricao: string;
  banner_url: string;
  livro_capa_url: string;
  audio_acolhimento_url: string;
  ativa: boolean;
  ordem: number;
}

export interface Estacao {
  id: string;
  rota_id: string;
  slug: string;
  nome: string;
  titulo?: string;
  ordem: number;
  ativa: boolean;
  distrito_cidadela: string;
  ferramenta_oracular_nome: string;
  movimento_simbolico: string;
  frase_abertura: string;
  frase_voz_clareira: string;
  voz_clareira_texto?: string;
  caso_simbolico: any;
  revelacao: any;
  missao_campo: any;
  fechamento_texto: string;
  audio_voz_clareira_url: string;
  audio_abertura_url?: string;
  audio_floresta_url?: string;
  livro_imagem_banner_url: string;
  banner_url?: string;
  spotify_playlist_url?: string;
  spotify_playlists?: any[];
  conto_titulo?: string;
  conto_sintese?: string;
  conto_texto?: string;
  conto_audio_url?: string;
  conto_imagem_url?: string;
  conto_erro_comum?: string;
  conto_sussurro_guardia?: string;
  traducao_territorio_principal?: string;
  traducao_justificativa_principal?: string;
  traducao_territorio_secundario?: string;
  traducao_justificativa_secundaria?: string;
  traducao_porta?: string;
  traducao_torre?: string;
  traducao_labirinto?: string;
  traducao_ferramenta_associada?: string;
  traducao_pergunta_pessoal?: string;
  traducao_pergunta_profissional?: string;
  caso_nome_ficticio?: string;
  caso_idade?: string;
  caso_contexto?: string;
  caso_frase_central?: string;
  caso_campo_superficie?: string;
  caso_campo_simbolico?: string;
  caso_campo_nao_concluir?: string;
  caso_relacao_conto?: string;
  caso_pergunta_conducao?: string;
  caso_cautela_etica?: string;
  desafio_pergunta?: string;
  desafio_alternativas?: any[];
  desafio_leitura_modelo?: string;
  desafio_cuidado_etico?: string;
  ferramenta_nome?: string;
  ferramenta_descricao?: string;
  ferramenta_eixos?: any[];
  ferramenta_resultados?: any[];
  jardim_psique_pergunta?: string;
  jardim_psique_subperguntas?: string[];
  jardim_oficio_pergunta?: string;
  jardim_oficio_subperguntas?: string[];
}

export interface CamaraObra {
  id: string;
  titulo: string;
  tipo: string;
  autor: string | null;
  url: string;
  audio_regente_url?: string;
  funcao_escuta: string;
  pergunta_psique: string;
  pergunta_oficio: string;
  guia_escuta?: string[];
  guia_evitar?: string[];
  rastro_simbolo?: string;
  reflexao_opcional: string | null;
  territorio_principal: string;
  territorio_secundario_1: string | null;
  territorio_secundario_2: string | null;
  rota_id: string;
  estacao_id: string;
  ordem: number;
}


export function useRotaHub(rotaSlug: string) {
  return useQuery({
    queryKey: ['rota-hub', rotaSlug],
    queryFn: async () => {
      const client = supabase as any;
      const { data: rotaData, error: rotaError } = await client
        .from('clube_rotas')
        .select('*')
        .eq('slug', rotaSlug)
        .eq('ativa', true)
        .single();

      if (rotaError) throw rotaError;

      const { data: estacoesData, error: estacoesError } = await client
        .from('clube_estacoes')
        .select('*')
        .eq('rota_id', rotaData.id)
        .order('ordem', { ascending: true });

      if (estacoesError) throw estacoesError;

      return { 
        rota: rotaData as Rota, 
        estacoes: (estacoesData || []) as Estacao[] 
      };
    },
    enabled: !!rotaSlug
  });
}

export function useEstacaoConteudo(estacaoSlug: string) {
  return useQuery({
    queryKey: ['estacao-conteudo', estacaoSlug],
    queryFn: async () => {
      const client = supabase as any;
      const { data: estacaoData, error } = await client
        .from('clube_estacoes')
        .select('*')
        .eq('slug', estacaoSlug)
        .single();

      if (error) throw error;
      
      const { data: rotaData, error: rotaError } = await client
        .from('clube_rotas')
        .select('*')
        .eq('id', estacaoData.rota_id)
        .single();
        
      if (rotaError) throw rotaError;
      
      return {
        ...estacaoData,
        clube_rotas: rotaData as Rota
      } as Estacao & { clube_rotas: Rota };
    },
    enabled: !!estacaoSlug
  });
}

export function useCamaraObras(estacaoId: string) {
  return useQuery({
    queryKey: ['camara-obras', estacaoId],
    queryFn: async () => {
      const client = supabase as any;
      const { data, error } = await client
        .from('clube_camara_escuta_obras')
        .select('*')
        .eq('estacao_id', estacaoId)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as CamaraObra[];
    },
    enabled: !!estacaoId
  });
}

