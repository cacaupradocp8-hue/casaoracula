import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Big5OracularFator {
  id: string;
  chave: string;
  nome: string;
  nome_ocean: string;
  simbolo: string;
  cor_primaria: string;
  descricao_simbolica: string;
  narrativa_elevada: string;
  narrativa_fragil: string;
  ordem: number;
}

export interface Big5OracularPergunta {
  id: string;
  fator_id: string;
  texto_pergunta: string;
  ordem: number;
}

export interface Big5OracularRegistro {
  id: string;
  user_id: string;
  respostas_json: Record<string, number>;
  medias_json: Record<string, number>;
  fator_predominante: string | null;
  fator_fragilizado: string | null;
  reflexao_pessoal: string | null;
  created_at: string;
}

export interface Big5OracularResult {
  medias: Record<string, number>;
  predominante: Big5OracularFator | null;
  fragilizado: Big5OracularFator | null;
}

export function useBig5Oracular() {
  const { user } = useAuth();
  const [fatores, setFatores] = useState<Big5OracularFator[]>([]);
  const [perguntas, setPerguntas] = useState<Big5OracularPergunta[]>([]);
  const [historico, setHistorico] = useState<Big5OracularRegistro[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch fatores e perguntas
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch fatores
        const { data: fatoresData, error: fatoresError } = await supabase
          .from('big5_oracular_fatores')
          .select('*')
          .eq('ativo', true)
          .order('ordem');
        
        if (fatoresError) throw fatoresError;
        
        // Fetch perguntas
        const { data: perguntasData, error: perguntasError } = await supabase
          .from('big5_oracular_perguntas')
          .select('*')
          .eq('ativo', true)
          .order('ordem');
        
        if (perguntasError) throw perguntasError;
        
        setFatores((fatoresData || []) as Big5OracularFator[]);
        setPerguntas((perguntasData || []) as Big5OracularPergunta[]);
        
        // Fetch histórico do usuário
        if (user?.id) {
          const { data: historicoData, error: historicoError } = await supabase
            .from('big5_oracular_registros')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
          
          if (!historicoError && historicoData) {
            setHistorico(historicoData as Big5OracularRegistro[]);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados Big5 Oracular:', error);
        toast.error('Erro ao carregar dados da ferramenta');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [user?.id]);

  // Calcular médias por fator
  const calcularMedias = (respostas: Record<string, number>): Big5OracularResult => {
    const medias: Record<string, number> = {};
    
    fatores.forEach(fator => {
      const perguntasFator = perguntas.filter(p => p.fator_id === fator.id);
      const valores = perguntasFator.map(p => respostas[p.id] || 0).filter(v => v > 0);
      
      if (valores.length > 0) {
        medias[fator.chave] = valores.reduce((a, b) => a + b, 0) / valores.length;
      } else {
        medias[fator.chave] = 0;
      }
    });
    
    // Encontrar predominante (maior média) e fragilizado (menor média)
    const entries = Object.entries(medias).filter(([_, v]) => v > 0);
    
    let predominante: Big5OracularFator | null = null;
    let fragilizado: Big5OracularFator | null = null;
    
    if (entries.length > 0) {
      const maxEntry = entries.reduce((a, b) => a[1] > b[1] ? a : b);
      const minEntry = entries.reduce((a, b) => a[1] < b[1] ? a : b);
      
      predominante = fatores.find(f => f.chave === maxEntry[0]) || null;
      fragilizado = fatores.find(f => f.chave === minEntry[0]) || null;
    }
    
    return { medias, predominante, fragilizado };
  };

  // Salvar resultado
  const saveResult = async (
    respostas: Record<string, number>,
    reflexao?: string
  ): Promise<Big5OracularRegistro | null> => {
    if (!user?.id) {
      toast.error('Você precisa estar logada para salvar');
      return null;
    }
    
    setSaving(true);
    
    try {
      const { medias, predominante, fragilizado } = calcularMedias(respostas);
      
      const registro = {
        user_id: user.id,
        respostas_json: respostas,
        medias_json: medias,
        fator_predominante: predominante?.chave || null,
        fator_fragilizado: fragilizado?.chave || null,
        reflexao_pessoal: reflexao || null,
      };
      
      const { data, error } = await supabase
        .from('big5_oracular_registros')
        .insert(registro)
        .select()
        .single();
      
      if (error) throw error;
      
      // Atualizar histórico local
      setHistorico(prev => [data as Big5OracularRegistro, ...prev]);
      
      toast.success('Mapa salvo com sucesso!');
      return data as Big5OracularRegistro;
    } catch (error) {
      console.error('Erro ao salvar resultado:', error);
      toast.error('Erro ao salvar resultado');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Obter perguntas agrupadas por fator
  const getPerguntasPorFator = () => {
    const grupos: Record<string, { fator: Big5OracularFator; perguntas: Big5OracularPergunta[] }> = {};
    
    fatores.forEach(fator => {
      grupos[fator.id] = {
        fator,
        perguntas: perguntas.filter(p => p.fator_id === fator.id).sort((a, b) => a.ordem - b.ordem),
      };
    });
    
    return grupos;
  };

  // Mapear intensidade para visualização
  const getIntensidade = (media: number): 'low' | 'medium' | 'high' | 'dominant' => {
    if (media <= 2) return 'low';
    if (media <= 3) return 'medium';
    if (media <= 4) return 'high';
    return 'dominant';
  };

  return {
    fatores,
    perguntas,
    historico,
    loading,
    saving,
    calcularMedias,
    saveResult,
    getPerguntasPorFator,
    getIntensidade,
  };
}
