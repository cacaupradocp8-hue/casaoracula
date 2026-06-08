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
  ordem: number;
  ativa: boolean;
  distrito_cidadela: string;
  ferramenta_oracular_nome: string;
  movimento_simbolico: string;
  frase_abertura: string;
  frase_voz_clareira: string;
  caso_simbolico: {
    titulo: string;
    texto: string;
    pergunta: string;
    opcoes: string[];
  };
  revelacao: {
    porta: string;
    campo: string;
    torre: string;
    labirinto: string;
    pergunta: string;
  };
  missao_campo: {
    titulo: string;
    instrucao: string;
  };
  fechamento_texto: string;
  audio_voz_clareira_url: string;
  livro_imagem_banner_url: string;
}

export function useRotaHub(rotaSlug: string) {
  return useQuery({
    queryKey: ['rota-hub', rotaSlug],
    queryFn: async () => {
      const { data: rota, error: rotaError } = await supabase
        .from('clube_rotas')
        .select('*')
        .eq('slug', rotaSlug)
        .eq('ativa', true)
        .single();

      if (rotaError) throw rotaError;

      const { data: estacoes, error: estacoesError } = await supabase
        .from('clube_estacoes')
        .select('*')
        .eq('rota_id', rota.id)
        .order('ordem', { ascending: true });

      if (estacoesError) throw estacoesError;

      return { rota: rota as Rota, estacoes: estacoes as Estacao[] };
    },
    enabled: !!rotaSlug
  });
}

export function useEstacaoConteudo(estacaoSlug: string) {
  return useQuery({
    queryKey: ['estacao-conteudo', estacaoSlug],
    queryFn: async () => {
      const { data: estacao, error } = await supabase
        .from('clube_estacoes')
        .select('*, clube_rotas(*)')
        .eq('slug', estacaoSlug)
        .single();

      if (error) throw error;
      return estacao as Estacao & { clube_rotas: Rota };
    },
    enabled: !!estacaoSlug
  });
}
