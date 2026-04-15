/**
 * Hook para salvar snapshots do Mapa Vivo Coletivo
 */

import { supabase } from '@/lib/dal/dbClient';
import { useAuth } from '@/contexts/AuthContext';
import type { DecisaoCampoColetivo } from '@/lib/cabine/decisaoCampoColetivo';
import type { LeituraCampoColetivo } from '@/lib/cabine/motorLeituraColetiva';
import type { LeituraSimbolica } from '@/lib/cabine/motorLeituraSimbolica';

export function useFieldSnapshot() {
  const { user } = useAuth();

  const salvarSnapshotGrupo = async (
    groupId: string,
    leitura: LeituraCampoColetivo,
    decisao: DecisaoCampoColetivo,
  ) => {
    if (!user?.id) return;
    try {
      await supabase.from('group_field_snapshots').insert({
        group_id: groupId,
        mode: 'grupo',
        therapist_id: user.id,
        estado_campo: leitura.estado_campo_coletivo,
        direcao: leitura.direcao_conducao,
        risco: leitura.risco_coletivo,
        tensao: leitura.tensao_coletiva,
        padrao: leitura.padrao_predominante,
        pode_aprofundar: decisao.pode_aprofundar,
        nivel_intervencao: decisao.nivel_intervencao,
        recomendacao: decisao.recomendacao_direta,
        frase_simbolica: leitura.frase_simbolica,
      });
    } catch (e) {
      console.error('Erro ao salvar snapshot grupo:', e);
    }
  };

  const salvarSnapshotCirculo = async (
    circuloId: string,
    leitura: LeituraSimbolica,
    decisao: DecisaoCampoColetivo,
  ) => {
    if (!user?.id) return;
    try {
      await supabase.from('group_field_snapshots').insert({
        circulo_id: circuloId,
        mode: 'circulo',
        therapist_id: user.id,
        estado_campo: leitura.estado_circulo,
        direcao: leitura.direcao_ritual,
        risco: leitura.risco_coletivo,
        tensao: null,
        padrao: null,
        pode_aprofundar: decisao.pode_aprofundar,
        nivel_intervencao: decisao.nivel_intervencao,
        recomendacao: decisao.recomendacao_direta,
        frase_simbolica: leitura.frase_ritual,
      });
    } catch (e) {
      console.error('Erro ao salvar snapshot círculo:', e);
    }
  };

  return { salvarSnapshotGrupo, salvarSnapshotCirculo };
}
