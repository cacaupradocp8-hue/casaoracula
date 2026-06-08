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
  caso_simbolico: any;
  revelacao: any;
  missao_campo: any;
  fechamento_texto: string;
  audio_voz_clareira_url: string;
  livro_imagem_banner_url: string;
}

export function useRotaHub(rotaSlug: string) {
  return useQuery({
    queryKey: ['rota-hub', rotaSlug],
    queryFn: async () => {
      const { data: rotaData, error: rotaError } = await supabase
        .from('clube_rotas' as any)
        .select('*' as any)
        .eq('slug' as any, rotaSlug as any)
        .eq('ativa' as any, true as any)
        .single();

      if (rotaError) throw rotaError;

      const { data: estacoesData, error: estacoesError } = await supabase
        .from('clube_estacoes' as any)
        .select('*' as any)
        .eq('rota_id' as any, (rotaData as any).id)
        .order('ordem' as any, { ascending: true });

      if (estacoesError) throw estacoesError;

      return { 
        rota: rotaData as unknown as Rota, 
        estacoes: (estacoesData || []) as unknown as Estacao[] 
      };
    },
    enabled: !!rotaSlug
  });
}

export function useEstacaoConteudo(estacaoSlug: string) {
  return useQuery({
    queryKey: ['estacao-conteudo', estacaoSlug],
    queryFn: async () => {
      const { data: estacaoData, error } = await supabase
        .from('clube_estacoes' as any)
        .select('*' as any)
        .eq('slug' as any, estacaoSlug as any)
        .single();

      if (error) throw error;
      
      const { data: rotaData, error: rotaError } = await supabase
        .from('clube_rotas' as any)
        .select('*' as any)
        .eq('id' as any, (estacaoData as any).rota_id)
        .single();
        
      if (rotaError) throw rotaError;
      
      return {
        ...(estacaoData as any),
        clube_rotas: rotaData as Rota
      } as Estacao & { clube_rotas: Rota };
    },
    enabled: !!estacaoSlug
  });
}
