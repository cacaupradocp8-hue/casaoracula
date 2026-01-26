import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Dimensao {
  id: string;
  chave: string;
  nome: string;
  nome_ingles: string;
  descricao: string;
  cor: string;
  ordem: number;
  ativo: boolean;
}

export interface Pergunta {
  id: string;
  dimensao_id: string;
  texto_pergunta: string;
  ordem: number;
  ativo: boolean;
  dimensao?: Dimensao;
}

export interface Registro {
  id: string;
  user_id: string;
  respostas_json: Record<string, number>;
  medias_json: Record<string, number>;
  dimensao_alta: string | null;
  dimensao_baixa: string | null;
  created_at: string;
}

export interface ResultadoCalculado {
  medias: Record<string, number>;
  dimensaoAlta: { chave: string; nome: string; descricao: string; cor: string; media: number } | null;
  dimensaoBaixa: { chave: string; nome: string; descricao: string; cor: string; media: number } | null;
}

export function useBig5Funcional() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch dimensions
  const { data: dimensoes = [], isLoading: loadingDimensoes } = useQuery({
    queryKey: ['big5-funcional-dimensoes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('big5_funcional_dimensoes')
        .select('*')
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Dimensao[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch questions with dimensions
  const { data: perguntas = [], isLoading: loadingPerguntas } = useQuery({
    queryKey: ['big5-funcional-perguntas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('big5_funcional_perguntas')
        .select(`
          *,
          dimensao:big5_funcional_dimensoes(*)
        `)
        .eq('ativo', true)
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as (Pergunta & { dimensao: Dimensao })[];
    },
    staleTime: 10 * 60 * 1000,
  });

  // Fetch user history
  const { data: historico = [], isLoading: loadingHistorico, refetch: refetchHistorico } = useQuery({
    queryKey: ['big5-funcional-historico', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('big5_funcional_registros')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Registro[];
    },
    enabled: !!user?.id,
  });

  // Calculate averages from responses
  const calcularResultado = (respostas: Record<string, number>): ResultadoCalculado => {
    const mediasTemp: Record<string, { soma: number; count: number }> = {};

    // Initialize
    dimensoes.forEach(dim => {
      mediasTemp[dim.chave] = { soma: 0, count: 0 };
    });

    // Calculate sums
    perguntas.forEach(pergunta => {
      const valor = respostas[pergunta.id];
      if (valor !== undefined && pergunta.dimensao) {
        const chave = pergunta.dimensao.chave;
        if (mediasTemp[chave]) {
          mediasTemp[chave].soma += valor;
          mediasTemp[chave].count += 1;
        }
      }
    });

    // Calculate averages
    const medias: Record<string, number> = {};
    Object.entries(mediasTemp).forEach(([chave, { soma, count }]) => {
      medias[chave] = count > 0 ? Math.round((soma / count) * 100) / 100 : 0;
    });

    // Find highest and lowest
    let dimensaoAlta: ResultadoCalculado['dimensaoAlta'] = null;
    let dimensaoBaixa: ResultadoCalculado['dimensaoBaixa'] = null;
    let maxMedia = -Infinity;
    let minMedia = Infinity;

    Object.entries(medias).forEach(([chave, media]) => {
      const dim = dimensoes.find(d => d.chave === chave);
      if (!dim) return;

      if (media > maxMedia) {
        maxMedia = media;
        dimensaoAlta = {
          chave,
          nome: dim.nome,
          descricao: dim.descricao,
          cor: dim.cor,
          media,
        };
      }
      if (media < minMedia) {
        minMedia = media;
        dimensaoBaixa = {
          chave,
          nome: dim.nome,
          descricao: dim.descricao,
          cor: dim.cor,
          media,
        };
      }
    });

    return { medias, dimensaoAlta, dimensaoBaixa };
  };

  // Save result mutation
  const salvarResultado = useMutation({
    mutationFn: async (respostas: Record<string, number>) => {
      if (!user?.id) throw new Error('Usuário não autenticado');

      const resultado = calcularResultado(respostas);

      const { data, error } = await supabase
        .from('big5_funcional_registros')
        .insert({
          user_id: user.id,
          respostas_json: respostas,
          medias_json: resultado.medias,
          dimensao_alta: resultado.dimensaoAlta?.chave || null,
          dimensao_baixa: resultado.dimensaoBaixa?.chave || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Registro;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['big5-funcional-historico'] });
      toast.success('Resultado salvo com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar resultado');
    },
  });

  // Get sorted questions by dimension order
  const perguntasOrdenadas = [...perguntas].sort((a, b) => {
    const ordemDimA = a.dimensao?.ordem ?? 0;
    const ordemDimB = b.dimensao?.ordem ?? 0;
    if (ordemDimA !== ordemDimB) return ordemDimA - ordemDimB;
    return a.ordem - b.ordem;
  });

  return {
    dimensoes,
    perguntas: perguntasOrdenadas,
    historico,
    ultimoRegistro: historico[0] || null,
    isLoading: loadingDimensoes || loadingPerguntas,
    loadingHistorico,
    calcularResultado,
    salvarResultado,
    refetchHistorico,
  };
}
