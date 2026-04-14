/**
 * DAL — User CidaDELA Estado (unified state)
 */

import { supabase } from './dbClient';

export interface UserCidadelaEstado {
  user_id: string;
  voz: string | null;
  distrito_atual: string | null;
  distritos_ativados: string[];
  intensidade_por_distrito: Record<string, number>;
  competencias: Record<string, any>;
  historico_travessias: any[];
  ultimo_movimento: string;
}

export async function getCidadelaEstado(userId: string): Promise<UserCidadelaEstado | null> {
  const { data, error } = await supabase
    .from('user_cidadela_estado' as any)
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data as unknown as UserCidadelaEstado | null;
}

export async function upsertCidadelaEstado(
  userId: string,
  updates: Partial<Omit<UserCidadelaEstado, 'user_id'>>
) {
  const { error } = await supabase
    .from('user_cidadela_estado' as any)
    .upsert({
      user_id: userId,
      ...updates,
      ultimo_movimento: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  if (error) throw error;
}

export async function addTravessiaToHistorico(
  userId: string,
  travessia: { distrito: string; tipo: string; completado_em: string; contexto?: string }
) {
  const current = await getCidadelaEstado(userId);
  const historico = current?.historico_travessias || [];
  historico.push(travessia);

  const distritos = current?.distritos_ativados || [];
  if (!distritos.includes(travessia.distrito)) {
    distritos.push(travessia.distrito);
  }

  await upsertCidadelaEstado(userId, {
    distrito_atual: travessia.distrito,
    distritos_ativados: distritos,
    historico_travessias: historico,
  });
}

export async function updateCompetencias(
  userId: string,
  competencia: { distrito: string; tipo: string; nivel: number; acerto: boolean }
) {
  const current = await getCidadelaEstado(userId);
  const competencias = current?.competencias || {};
  const key = `${competencia.distrito}_${competencia.tipo}`;
  
  if (!competencias[key]) {
    competencias[key] = { tentativas: 0, acertos: 0, nivel: 1 };
  }
  competencias[key].tentativas += 1;
  if (competencia.acerto) competencias[key].acertos += 1;
  competencias[key].nivel = competencia.nivel;

  await upsertCidadelaEstado(userId, { competencias });
}
