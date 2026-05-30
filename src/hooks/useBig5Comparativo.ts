import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBig5Funcional } from './useBig5Funcional';
import { useBig5Oracular } from './useBig5Oracular';

export function useBig5Comparativo() {
  const { user } = useAuth();
  const { ultimoRegistro: registroFuncional } = useBig5Funcional();
  const { historico: historicoOracular } = useBig5Oracular();
  const registroOracular = historicoOracular[0] || null;

  const { data: mappings = [] } = useQuery({
    queryKey: ['big5-porta-mapeamento'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('big5_porta_mapeamento')
        .select('*')
        .eq('ativo', true);
      if (error) throw error;
      return data;
    }
  });

  const getComparativo = () => {
    if (!registroFuncional || !registroOracular) return null;

    const mediasFuncionais = registroFuncional.medias_json as Record<string, number>;
    const mediasOraculares = registroOracular.medias_json as Record<string, number>;

    // Mapping keys
    // Functional: O, C, E, A, N (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
    // Oracular: abertura_misterio, eixo_suporte, fogo_expressao, pulso_relacional, sensibilidade_caos

    const factorMapping = [
      { f: 'abertura', o: 'abertura_misterio', label: 'Abertura ao Novo / Mistério' },
      { f: 'conscienciosidade', o: 'eixo_suporte', label: 'Realização / Suporte' },
      { f: 'extroversao', o: 'fogo_expressao', label: 'Expressão / Fogo' },
      { f: 'amabilidade', o: 'pulso_relacional', label: 'Conexão / Pulso' },
      { f: 'neuroticismo', o: 'sensibilidade_caos', label: 'Estabilidade / Sensibilidade' },
    ];

    let principalDivergencia = null;
    let principalConvergencia = null;

    for (const map of factorMapping) {
      const valF = mediasFuncionais[map.f] || 0;
      const valO = mediasOraculares[map.o] || 0;
      
      const diff = Math.abs(valF - valO);
      
      if (diff > 1.5) {
        if (!principalDivergencia || diff > principalDivergencia.diff) {
          principalDivergencia = { ...map, diff, valF, valO };
        }
      } else if (diff < 0.5) {
        if (!principalConvergencia || (valF + valO) > (principalConvergencia.valF + principalConvergencia.valO)) {
          principalConvergencia = { ...map, diff, valF, valO };
        }
      }
    }

    const item = principalDivergencia || principalConvergencia || factorMapping[0];
    const isDivergence = !!principalDivergencia;

    // Find Porta
    const mapping = mappings.find(m => m.fator_alto === (isDivergence ? item.o : item.f)) || mappings[0];

    return {
      item,
      isDivergence,
      porta: mapping?.porta_associada || 'Porta da Observação',
      textoAbertura: "Este não é um conflito. É um diálogo entre camadas.",
      conclusao: isDivergence 
        ? `Existe um hiato produtivo entre como você se move no mundo (${item.valF.toFixed(1)}) e como sua alma percebe essa força (${item.valO.toFixed(1)}).`
        : `Sua atuação prática e seu campo simbólico estão em harmonia profunda neste território.`
    };
  };

  return {
    getComparativo,
    loading: !registroFuncional || !registroOracular,
    hasBoth: !!registroFuncional && !!registroOracular
  };
}
