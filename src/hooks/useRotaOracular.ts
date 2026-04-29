import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// ================================================
// ROTA ORACULAR — Hook central de estado da estrada
// ================================================

export type PontoEstado = 'completed' | 'in_progress' | 'available' | 'locked';
export type PontoEstadoUI = 'concluído' | 'agora' | 'depois';

export interface PontoRota {
  id: string;
  slug: string;
  nome: string;
  subtitulo?: string;
  descricao?: string;
  icone: string;
  ordem: number;
  estado: PontoEstado;
  estadoUI: PontoEstadoUI;
  rota: string;
  tipo: string;
  ref_tipo?: string;
  ref_id?: string;
  
  // Cartografia unificada
  porta?: string;
  campo?: string;
  torre?: string;
  labirinto?: string;
  frase_guia?: string;
  jardim_prompt?: string;
  cenario_treinamento?: string;
  leitura_referencia?: string;
  image_url?: string;
  
  conteudo_inline?: any;
  metadata?: any;
  impacto_cidadela?: {
    distrito: string;
    tipo_impacto: string;
    intensidade: number;
    condicao?: string;
  }[];
}

export interface Estacao {
  id: string;
  titulo: string;
  subtitulo: string;
  descricao?: string;
  banner_url?: string;
  numero: number;
  livro_titulo: string;
  livro_autor: string | null;
  livro_capa_url: string | null;
  livro_imagem_banner_url?: string | null;
  essencia_nucleo: string | null;
  essencia_tensao: string | null;
  essencia_transformacao: string | null;
  ativa: boolean;
  status: 'draft' | 'published' | 'archived';
}

export interface EncontroAtivo {
  id: string;
  titulo: string;
  data_encontro: string | null;
  link_ao_vivo: string | null;
}

function mapEstado(estado: PontoEstado): PontoEstadoUI {
  switch (estado) {
    case 'completed': return 'concluído';
    case 'in_progress': return 'agora';
    default: return 'depois';
  }
}

/**
 * Resolve a rota com base no tipo e referência
 */
function resolveRota(tipo: string, refId: string | null, rotaCustom?: string): string {
  if (rotaCustom) return rotaCustom;

  switch (tipo) {
    case 'portal':       return `/clube/rota/${refId}`;
    case 'audio':
    case 'escuta':        return `/clube/rota/${refId}`;
    case 'aula':         return `/clube/rota/${refId}`;
    case 'chat_livro':   return `/clube/rota/${refId}`;
    case 'laboratorio':  return `/clube/rota/${refId}`;
    case 'jardim':       return `/clube/rota/${refId}`;
    case 'encontro':     return `/clube/rota/${refId}`;
    case 'aplicacao':    return `/clube/rota/${refId}`;
    default:             return '#';
  }
}

export function useRotaOracular() {
  const { user } = useAuth();

  // 1. Estação ativa
  const { data: estacaoAtual, isLoading: loadingEstacao } = useQuery({
    queryKey: ['rota-estacao-ativa'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('clube_estacoes')
          .select('id, titulo, subtitulo, descricao, banner_url, numero, livro_titulo, livro_autor, livro_capa_url, livro_imagem_banner_url, essencia_nucleo, essencia_tensao, essencia_transformacao, ativa, status')
          .eq('status', 'published')
          .eq('ativa', true)
          .order('numero', { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) {
          console.error('[useRotaOracular] Erro ao carregar estação ativa:', error);
          return null;
        }
        return data as Estacao | null;
      } catch (err) {
        console.error('[useRotaOracular] Falha catastrófica ao carregar estação:', err);
        return null;
      }
    },
  });

  // 2. Jornadas da estação (para saber se está completa)
  const { data: jornadas } = useQuery({
    queryKey: ['rota-jornadas', estacaoAtual?.id],
    queryFn: async () => {
      try {
        if (!estacaoAtual?.id) return [];
        const { data, error } = await supabase
          .from('clube_jornadas')
          .select('id, nome, slug, tipo, ordem, ativa')
          .eq('estacao_id', estacaoAtual.id)
          .eq('ativa', true)
          .order('ordem');
        if (error) {
          console.error('[useRotaOracular] Erro jornadas:', error);
          return [];
        }
        return data || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!estacaoAtual?.id,
  });

  // 3. Itens da Rota (Nova Fonte de Verdade)
  const { data: itensRota } = useQuery({
    queryKey: ['rota-itens', estacaoAtual?.id],
    queryFn: async () => {
      if (!estacaoAtual?.id) return [];
      const { data, error } = await supabase
        .from('clube_rota_itens')
        .select('*')
        .eq('estacao_id', estacaoAtual.id)
        .eq('status', 'published')
        .order('ordem');
      if (error) throw error;
      return data || [];
    },
    enabled: !!estacaoAtual?.id,
  });

  // 4. Progresso da usuária na rota
  const { data: progressoRota } = useQuery({
    queryKey: ['rota-progresso', user?.id, estacaoAtual?.id],
    queryFn: async () => {
      if (!user?.id || !estacaoAtual?.id) return [];
      const { data } = await supabase
        .from('clube_rota_progresso')
        .select('*')
        .eq('user_id', user.id)
        .eq('estacao_id', estacaoAtual.id);
      return data || [];
    },
    enabled: !!user?.id && !!estacaoAtual?.id,
  });

  // 4. Próximo encontro
  const { data: encontro } = useQuery({
    queryKey: ['rota-encontro', estacaoAtual?.id],
    queryFn: async () => {
      if (!estacaoAtual?.id) return null;
      const { data } = await supabase
        .from('clube_livro_encontros')
        .select('id, titulo, data_encontro, link_ao_vivo')
        .eq('estacao_id', estacaoAtual.id)
        .eq('ativo', true)
        .order('data_encontro', { ascending: true })
        .limit(1)
        .maybeSingle();
      return data as EncontroAtivo | null;
    },
    enabled: !!estacaoAtual?.id,
  });

  // 5. Estações anteriores
  const { data: estacoesPrevias } = useQuery({
    queryKey: ['rota-estacoes-previas'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, subtitulo, numero, livro_titulo, livro_autor, ativa, status')
        .eq('status', 'published')
        .eq('ativa', false)
        .order('numero', { ascending: false })
        .limit(5);
      return (data || []) as Estacao[];
    },
  });

  // Build road points from the new source of truth
  const pontos: PontoRota[] = (itensRota || []).map((item) => {
    if (!item) return null;

    const registroProgresso = (progressoRota || []).find(p => p.rota_item_id === item.id);
    const status = registroProgresso?.status || 'not_started';
    
    let estado: PontoEstado = 'locked';
    if (status === 'completed') {
      estado = 'completed';
    } else if (status === 'in_progress') {
      estado = 'in_progress';
    } else {
      // Check if previous item is completed to unlock
      const currentItems = itensRota || [];
      const index = currentItems.findIndex(i => i.id === item.id);
      
      if (index === 0) {
        estado = 'available';
      } else if (index > 0) {
        const prevItem = currentItems[index - 1];
        const prevProgresso = (progressoRota || []).find(p => p.rota_item_id === prevItem.id);
        if (prevProgresso?.status === 'completed') {
          estado = 'available';
        } else {
          estado = 'locked';
        }
      }
    }

    return {
      id: item.id,
      slug: item.slug,
      nome: item.titulo,
      subtitulo: item.subtitulo,
      descricao: (item as any).descricao,
      icone: item.icone || '📍',
      ordem: item.ordem,
      tipo: item.tipo,
      ref_tipo: item.ref_tipo,
      ref_id: item.ref_id,
      
      // Map unified fields
      porta: item.porta,
      campo: item.campo,
      torre: item.torre,
      labirinto: item.labirinto,
      frase_guia: item.frase_guia,
      jardim_prompt: item.jardim_prompt,
      cenario_treinamento: item.cenario_treinamento,
      leitura_referencia: item.leitura_referencia,
      image_url: item.image_url,
      
      conteudo_inline: item.conteudo_inline,
      metadata: item.metadata,
      impacto_cidadela: item.impacto_cidadela,
      estado,
      estadoUI: mapEstado(estado),
      rota: resolveRota(item.tipo, item.slug, item.rota_custom),
    } as PontoRota;
  }).filter((p): p is PontoRota => p !== null);

  // 6. Concluir item
  const queryClient = useQueryClient();
  const concluirPonto = useMutation({
    mutationFn: async (itemId: string) => {
      if (!user?.id || !estacaoAtual?.id) throw new Error('Usuária não autenticada');
      
      const { error } = await supabase
        .from('clube_rota_progresso')
        .upsert({
          user_id: user.id,
          estacao_id: estacaoAtual.id,
          rota_item_id: itemId,
          status: 'completed',
          data_conclusao: new Date().toISOString()
        }, {
          onConflict: 'user_id, rota_item_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rota-progresso'] });
      queryClient.invalidateQueries({ queryKey: ['cidadela-mapa'] });
      toast.success('Progresso registrado na sua jornada!');
    },
    onError: (error) => {
      console.error('Erro ao salvar progresso:', error);
      toast.error('Não foi possível salvar seu progresso.');
    }
  });

  // Calculate percentage progress for legacy UI if needed
  const itemsArray = itensRota || [];
  const progressoArray = progressoRota || [];
  
  const totalObrigatorios = itemsArray.filter(i => i.obrigatorio).length;
  const concluidosObrigatorios = progressoArray.filter(p => {
    const item = itemsArray.find(i => i.id === p.rota_item_id);
    return item?.obrigatorio && p.status === 'completed';
  }).length;
  
  const progresso = totalObrigatorios > 0 ? (concluidosObrigatorios / totalObrigatorios) * 100 : 0;

  // Find the current (in_progress) point for the "Continuar jornada" CTA
  const pontoAtual = pontos.find(p => p.estado === 'in_progress') || 
                     pontos.find(p => p.estado === 'available') || 
                     (pontos.length > 0 ? pontos[0] : undefined);

  const estacaoIncompleta = itemsArray.length < 1;

  return {
    estacaoAtual: estacaoAtual || null,
    estacoesPrevias: estacoesPrevias || [],
    pontos,
    pontoAtual,
    progresso,
    encontro: encontro || null,
    progressoRota: progressoArray,
    concluirPonto,
    estacaoIncompleta,
    isLoading: loadingEstacao,
  };
}
