import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type EstacaoStatusUI = 'completed' | 'in_progress' | 'available' | 'locked';

export interface EstacaoCatalogo {
  id: string;
  numero: number;
  titulo: string;
  subtitulo: string | null;
  banner_url: string | null;
  livro_titulo: string;
  livro_autor: string | null;
  livro_capa_url: string | null;
  livro_imagem_banner_url: string | null;
  essencia_nucleo: string | null;
  essencia_tensao: string | null;
  essencia_transformacao: string | null;
  ativa: boolean;
  publicada: boolean;
  total_itens: number;
  itens_obrigatorios: number;
  itens_concluidos: number;
  itens_obrigatorios_concluidos: number;
  progresso_pct: number;
  status: EstacaoStatusUI;
  primeiro_slug: string | null;
}

/**
 * useTodasRotas — agrega todas as estações publicadas com progresso da usuária
 * e aplica lógica de lock progressivo (estação N só desbloqueia se N-1 estiver
 * 100% completa em itens obrigatórios). Admin vê tudo desbloqueado via flag.
 */
export function useTodasRotas(opts?: { isAdmin?: boolean }) {
  const { user } = useAuth();
  const isAdmin = !!opts?.isAdmin;

  return useQuery({
    queryKey: ['todas-rotas', user?.id, isAdmin],
    queryFn: async (): Promise<EstacaoCatalogo[]> => {
      const { data: estacoes, error: errEst } = await supabase
        .from('clube_estacoes')
        .select(
          'id, numero, titulo, subtitulo, banner_url, livro_titulo, livro_autor, livro_capa_url, livro_imagem_banner_url, essencia_nucleo, essencia_tensao, essencia_transformacao, ativa, publicada'
        )
        .eq('publicada', true)
        .order('numero', { ascending: true });
      if (errEst) throw errEst;
      if (!estacoes?.length) return [];

      const estacaoIds = estacoes.map((e) => e.id);

      const { data: itens } = await supabase
        .from('clube_rota_itens')
        .select('id, estacao_id, slug, ordem, obrigatorio, publicado')
        .in('estacao_id', estacaoIds)
        .eq('publicado', true)
        .order('ordem', { ascending: true });

      let progresso: any[] = [];
      if (user?.id) {
        const { data: pr } = await supabase
          .from('clube_rota_progresso')
          .select('rota_item_id, estacao_id, status')
          .eq('user_id', user.id)
          .in('estacao_id', estacaoIds);
        progresso = pr || [];
      }

      const result: EstacaoCatalogo[] = estacoes.map((e) => {
        const itensEstacao = (itens || []).filter((i) => i.estacao_id === e.id);
        const obrigatorios = itensEstacao.filter((i) => i.obrigatorio);
        const concluidosIds = new Set(
          progresso
            .filter((p) => p.estacao_id === e.id && p.status === 'completed')
            .map((p) => p.rota_item_id)
        );
        const emAndamento = progresso.some(
          (p) => p.estacao_id === e.id && p.status === 'in_progress'
        );
        const itens_concluidos = itensEstacao.filter((i) => concluidosIds.has(i.id)).length;
        const itens_obrigatorios_concluidos = obrigatorios.filter((i) =>
          concluidosIds.has(i.id)
        ).length;
        const total_obrig = obrigatorios.length;
        const progresso_pct =
          itensEstacao.length > 0
            ? Math.round((itens_concluidos / itensEstacao.length) * 100)
            : 0;

        const completa =
          total_obrig > 0 && itens_obrigatorios_concluidos >= total_obrig;

        return {
          id: e.id,
          numero: e.numero,
          titulo: e.titulo,
          subtitulo: e.subtitulo,
          banner_url: e.banner_url,
          livro_titulo: e.livro_titulo,
          livro_autor: e.livro_autor,
          livro_capa_url: e.livro_capa_url,
          livro_imagem_banner_url: e.livro_imagem_banner_url,
          essencia_nucleo: e.essencia_nucleo,
          essencia_tensao: e.essencia_tensao,
          essencia_transformacao: e.essencia_transformacao,
          ativa: e.ativa,
          publicada: e.publicada,
          total_itens: itensEstacao.length,
          itens_obrigatorios: total_obrig,
          itens_concluidos,
          itens_obrigatorios_concluidos,
          progresso_pct,
          status: completa
            ? 'completed'
            : emAndamento || itens_concluidos > 0
            ? 'in_progress'
            : 'available',
          primeiro_slug: itensEstacao[0]?.slug ?? null,
        };
      });

      // Lock progressivo: estação N bloqueada se N-1 não foi concluída.
      // Admin vê tudo desbloqueado.
      if (!isAdmin) {
        for (let i = 0; i < result.length; i++) {
          if (i === 0) continue;
          const prev = result[i - 1];
          if (prev.status !== 'completed') {
            // Mantém in_progress/completed se já há registro real;
            // caso contrário tranca.
            if (result[i].status === 'available') {
              result[i].status = 'locked';
            }
          }
        }
      }

      return result;
    },
    enabled: true,
  });
}
