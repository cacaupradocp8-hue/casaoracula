import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TrainingCase } from './types';

export interface CamaraCaseRaw {
  id: string;
  titulo: string;
  idade: string | null;
  contexto: string | null;
  fala_inicial: string | null;
  distrito_dominante: string | null;
  torre_provavel: string | null;
  erro_comum: string | null;
  pergunta_ideal: string | null;
  leitura_simbolica: string | null;
  resposta_correta: string | null;
  dificuldade: 'iniciante' | 'intermediario' | 'avancado' | string;
  tipo_cliente: string | null;
  tema_emocional: string | null;
  ativo: boolean;
  ciclo_id: string | null;
  created_at: string;
  nivel_produto?: 'clube' | 'formacao';
  opcoes_leitura?: any;
  explicacao_simples?: string;
  explicacao_leve?: string;
  camadas_leitura?: string;
  risco_etico?: string;
  feedback_tecnico?: string;
  proximo_treino_id?: string;
}

async function fetchCamaraCases(cicloId?: string): Promise<TrainingCase[]> {
  let query = supabase
    .from('co_camara_sussurro_casos')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false });

  if (cicloId) {
    query = query.eq('ciclo_id', cicloId);
  }

  const { data, error } = await query;

  if (error) throw error;
  if (!data) return [];

  // Normalize to TrainingCase
  return data.map((c: CamaraCaseRaw) => ({
    id: c.id,
    title: c.titulo,
    nivel: c.dificuldade === 'iniciante' ? 'guiado' : c.dificuldade === 'intermediario' ? 'semi_guiado' : 'livre',
    tema: c.tema_emocional || c.tipo_cliente,
    caso_texto: `${c.contexto || ''}\n\nFala do Cliente: "${c.fala_inicial || ''}"`,
    distrito_esperado: c.distrito_dominante,
    distritos_alternativos: [],
    estado_esperado: 'receptiva', // default
    movimento_esperado: null,
    hipotese_esperada: c.resposta_correta || c.leitura_simbolica,
    vetor_esperado: c.pergunta_ideal,
    ferramenta_principal: null,
    ferramentas_apoio: [],
    erro_comum: c.erro_comum,
    ativo: c.ativo,
    ordem: 0,
    // Add raw data for components that can handle it
    rawCamara: c
  })) as any as TrainingCase[];
}

export function useCamaraCases(cicloId?: string) {
  return useQuery({
    queryKey: ['camara-cases', cicloId],
    queryFn: () => fetchCamaraCases(cicloId),
    staleTime: 5 * 60 * 1000,
  });
}