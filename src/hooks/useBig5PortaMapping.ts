import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface RitualSimbolico {
  id: string;
  slug: string;
  nome: string;
  porta_associada: string | null;
  material: string | null;
  instrucao: string;
  duracao_segundos: number;
  frase_unica: string | null;
  silencio_obrigatorio: boolean;
  observacoes_facilitadora: string | null;
  ativo: boolean;
  ordem: number;
}

export interface PortaMapping {
  id: string;
  fator_alto: string;
  fator_baixo: string;
  porta_associada: string;
  porta_tipo_campo: string | null;
  narrativa_curta: string | null;
  ritual: RitualSimbolico | null;
}

export function useBig5PortaMapping(fatorAlto?: string, fatorBaixo?: string) {
  const [mapping, setMapping] = useState<PortaMapping | null>(null);
  const [allMappings, setAllMappings] = useState<PortaMapping[]>([]);
  const [ritual, setRitual] = useState<RitualSimbolico | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all mappings once
  useEffect(() => {
    async function fetchMappings() {
      try {
        setLoading(true);
        
        const { data: mappingsData, error: mappingsError } = await supabase
          .from('big5_porta_mapeamento')
          .select('*')
          .eq('ativo', true)
          .order('ordem');

        if (mappingsError) throw mappingsError;

        const { data: rituaisData, error: rituaisError } = await supabase
          .from('rituais_simbolicos')
          .select('*')
          .eq('ativo', true)
          .order('ordem');

        if (rituaisError) throw rituaisError;

        // Map rituais to mappings
        const mappingsWithRituais: PortaMapping[] = (mappingsData || []).map(m => ({
          ...m,
          ritual: rituaisData?.find(r => r.id === m.ritual_id) || null,
        }));

        setAllMappings(mappingsWithRituais);
      } catch (err) {
        console.error('Erro ao carregar mapeamentos:', err);
        setError('Erro ao carregar mapeamentos');
      } finally {
        setLoading(false);
      }
    }

    fetchMappings();
  }, []);

  // Find specific mapping when factors are provided
  useEffect(() => {
    if (!fatorAlto || !fatorBaixo || allMappings.length === 0) {
      setMapping(null);
      setRitual(null);
      return;
    }

    // Find exact match first
    let found = allMappings.find(
      m => m.fator_alto === fatorAlto && m.fator_baixo === fatorBaixo
    );

    // If no exact match, try reverse
    if (!found) {
      found = allMappings.find(
        m => m.fator_alto === fatorBaixo && m.fator_baixo === fatorAlto
      );
    }

    // If still no match, use fallback based on predominant factor
    if (!found) {
      found = allMappings.find(m => m.fator_alto === fatorAlto);
    }

    if (found) {
      setMapping(found);
      setRitual(found.ritual);
    } else {
      // Default fallback
      setMapping(null);
      setRitual(null);
    }
  }, [fatorAlto, fatorBaixo, allMappings]);

  return {
    mapping,
    ritual,
    allMappings,
    loading,
    error,
  };
}
