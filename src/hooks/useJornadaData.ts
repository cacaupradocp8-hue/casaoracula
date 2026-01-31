// ============================================
// JORNADA — Hook para dados dinâmicos do banco
// ============================================

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface JornadaConvite {
  id: string;
  nivel: 'iniciada' | 'terapeuta' | 'guardia';
  texto: string;
  ordem: number;
}

interface JornadaFraseSelo {
  id: string;
  texto: string;
  ordem: number;
}

interface JornadaProgressao {
  id: string;
  tipo_evento: string;
  desbloqueio: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Retorna o convite da semana baseado na rotação semanal
 */
function getConviteDaSemana(convites: JornadaConvite[]): string | null {
  if (!convites || convites.length === 0) return null;
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const sorted = [...convites].sort((a, b) => a.ordem - b.ordem);
  return sorted[weekNumber % sorted.length]?.texto || null;
}

/**
 * Retorna a frase-selo da semana baseado na rotação semanal
 */
function getFraseSeloDaSemana(frases: JornadaFraseSelo[]): string | null {
  if (!frases || frases.length === 0) return null;
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
  const sorted = [...frases].sort((a, b) => a.ordem - b.ordem);
  return sorted[weekNumber % sorted.length]?.texto || null;
}

/**
 * Hook principal para dados da Jornada
 */
export function useJornadaData(nivel: 'iniciada' | 'terapeuta' | 'guardia' | null, userId?: string) {
  // Buscar convites ativos para o nível
  const convitesQuery = useQuery({
    queryKey: ['jornada-convites', nivel],
    queryFn: async () => {
      if (!nivel) return [];
      const { data, error } = await supabase
        .from('jornada_convites')
        .select('id, nivel, texto, ordem')
        .eq('nivel', nivel)
        .eq('ativo', true)
        .order('ordem');
      
      if (error) throw error;
      return (data || []) as JornadaConvite[];
    },
    enabled: !!nivel,
  });

  // Buscar frases-selo ativas
  const frasesQuery = useQuery({
    queryKey: ['jornada-frases-selo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jornada_frases_selo')
        .select('id, texto, ordem')
        .eq('ativo', true)
        .order('ordem');
      
      if (error) throw error;
      return (data || []) as JornadaFraseSelo[];
    },
  });

  // Buscar progressão do usuário
  const progressaoQuery = useQuery({
    queryKey: ['jornada-progressao', userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('jornada_progressao')
        .select('id, tipo_evento, desbloqueio, metadata, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return (data || []) as JornadaProgressao[];
    },
    enabled: !!userId,
  });

  // Valores computados
  const conviteDaSemana = getConviteDaSemana(convitesQuery.data || []);
  const fraseSelo = getFraseSeloDaSemana(frasesQuery.data || []);

  return {
    // Dados brutos
    convites: convitesQuery.data || [],
    frases: frasesQuery.data || [],
    progressao: progressaoQuery.data || [],
    
    // Valores da semana atual
    conviteDaSemana,
    fraseSelo,
    
    // Estados de loading
    isLoading: convitesQuery.isLoading || frasesQuery.isLoading,
    isLoadingProgressao: progressaoQuery.isLoading,
    
    // Erros
    error: convitesQuery.error || frasesQuery.error || progressaoQuery.error,
  };
}

/**
 * Registrar evento de progressão
 */
export async function registrarProgressao(
  userId: string,
  tipoEvento: string,
  desbloqueio?: string,
  metadata?: Record<string, unknown>
) {
  const { error } = await supabase
    .from('jornada_progressao')
    .insert([{
      user_id: userId,
      tipo_evento: tipoEvento,
      desbloqueio: desbloqueio || null,
      metadata: (metadata || {}) as unknown as import('@/integrations/supabase/types').Json,
    }]);
  
  if (error) throw error;
}
