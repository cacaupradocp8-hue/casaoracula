import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// ================================================
// ROTA ORACULAR — Hook central de estado da estrada
// ================================================

export type PontoEstado = 'completed' | 'in_progress' | 'available' | 'locked';
export type PontoEstadoUI = 'concluído' | 'agora' | 'depois';

export interface PontoRota {
  id: string;
  slug: string;
  nome: string;
  icone: string;
  ordem: number;
  estado: PontoEstado;
  estadoUI: PontoEstadoUI;
  rota: string;
}

export interface Estacao {
  id: string;
  titulo: string;
  subtitulo: string;
  numero: number;
  livro_titulo: string;
  livro_autor: string | null;
  livro_capa_url: string | null;
  essencia_nucleo: string | null;
  essencia_tensao: string | null;
  essencia_transformacao: string | null;
  ativa: boolean;
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
 * Pontos fixos estruturais da Rota.
 * Cada ponto mapeia para uma rota real existente.
 * A ordem e existência dependem dos dados da estação.
 */
function buildPontosEstruturais(estacaoId: string): Omit<PontoRota, 'estado' | 'estadoUI'>[] {
  // O ID do ciclo legado que contém as jornadas/portas configuradas
  const CICLO_LEGADO_ID = '90745cf3-c6e2-4334-9ebf-7a13d617e129';
  
  return [
    { id: 'portal', slug: 'portal', nome: 'Portal', icone: '🚪', ordem: 1, rota: `/clube-livro/${CICLO_LEGADO_ID}/porta/2a408a59-177f-4b69-bb7a-32b1351a7909` },
    { id: 'audio', slug: 'audio', nome: 'Áudio', icone: '🎧', ordem: 2, rota: '/clube/escuta' },
    { id: 'chat', slug: 'chat', nome: 'Chat com o Livro', icone: '💬', ordem: 3, rota: '/clube/chat-livro' },
    { id: 'laboratorio', slug: 'laboratorio', nome: 'Laboratório 80/20', icone: '⚗️', ordem: 4, rota: '/clube/laboratorio' },
    { id: 'jardim', slug: 'jardim', nome: 'Jardim', icone: '🌿', ordem: 5, rota: '/jardim-psique' },
    { id: 'aplicacao', slug: 'aplicacao', nome: 'Aplicação', icone: '✨', ordem: 6, rota: '#aplicacao' },
  ];
}

export function useRotaOracular() {
  const { user } = useAuth();

  // 1. Estação ativa
  const { data: estacaoAtual, isLoading: loadingEstacao } = useQuery({
    queryKey: ['rota-estacao-ativa'],
    queryFn: async () => {
      const { data } = await supabase
        .from('clube_estacoes')
        .select('id, titulo, subtitulo, numero, livro_titulo, livro_autor, livro_capa_url, essencia_nucleo, essencia_tensao, essencia_transformacao, ativa')
        .eq('publicada', true)
        .eq('ativa', true)
        .order('numero', { ascending: false })
        .limit(1)
        .maybeSingle();
      return data as Estacao | null;
    },
  });

  // 2. Jornadas da estação (para saber se está completa)
  const { data: jornadas } = useQuery({
    queryKey: ['rota-jornadas', estacaoAtual?.id],
    queryFn: async () => {
      if (!estacaoAtual?.id) return [];
      const { data } = await supabase
        .from('clube_jornadas')
        .select('id, nome, slug, tipo, ordem, ativa')
        .eq('estacao_id', estacaoAtual.id)
        .eq('ativa', true)
        .order('ordem');
      return data || [];
    },
    enabled: !!estacaoAtual?.id,
  });

  // 3. Engajamento da usuária
  const { data: engajamento } = useQuery({
    queryKey: ['rota-engajamento', user?.id, estacaoAtual?.id],
    queryFn: async () => {
      if (!user?.id || !estacaoAtual?.id) return null;
      const { data } = await (supabase as any)
        .from('clube_engajamento')
        .select('*')
        .eq('user_id', user.id)
        .eq('estacao_id', estacaoAtual.id)
        .maybeSingle();
      return data;
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
        .select('id, titulo, subtitulo, numero, livro_titulo, livro_autor, ativa')
        .eq('publicada', true)
        .eq('ativa', false)
        .order('numero', { ascending: false })
        .limit(5);
      return (data || []) as Estacao[];
    },
  });

  // Build road points
  const progresso = engajamento?.progresso ?? 0;
  const pontosBase = estacaoAtual ? buildPontosEstruturais(estacaoAtual.id) : [];

  // Derive states from progress percentage
  const pontos: PontoRota[] = pontosBase.map((p) => {
    const threshold = ((p.ordem - 1) / pontosBase.length) * 100;
    const nextThreshold = (p.ordem / pontosBase.length) * 100;

    let estado: PontoEstado;
    if (progresso >= nextThreshold) {
      estado = 'completed';
    } else if (progresso >= threshold) {
      estado = 'in_progress';
    } else if (progresso > 0 || p.ordem === 1) {
      estado = 'available';
    } else {
      estado = 'locked';
    }

    return { ...p, estado, estadoUI: mapEstado(estado) };
  });

  // Find the current (in_progress) point for the "Continuar jornada" CTA
  const pontoAtual = pontos.find(p => p.estado === 'in_progress') || pontos.find(p => p.estado === 'available') || pontos[0];

  const estacaoIncompleta = jornadas !== undefined && jornadas.length < 1;

  return {
    estacaoAtual,
    estacoesPrevias: estacoesPrevias || [],
    pontos,
    pontoAtual,
    progresso,
    encontro,
    engajamento,
    estacaoIncompleta,
    isLoading: loadingEstacao,
  };
}
