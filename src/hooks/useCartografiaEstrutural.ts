import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useBig5Oracular } from './useBig5Oracular';
import { montarProfileJson } from '@/lib/cartografia/montarProfileJson';
import { upsertCartografiaProfile } from '@/lib/dal/cartografiaProfile';
import { toast } from 'sonner';

export type CartografiaStepId = 'intro' | 'sintoma' | 'historia' | 'objetivas' | 'crencas' | 'recursos' | 'seguranca' | 'gerando' | 'resultado';

export interface CartografiaRespostas {
  // Objetivas (Perguntas baseadas nos territórios)
  objetivas: Record<string, string>;
  // Qualitativo (6 Territórios)
  sintoma: string;
  historia: string;
  crencas: string;
  recursos: string;
  seguranca: string;
}

export function useCartografiaEstrutural() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fatores, perguntas, loading: loadingBig5, calcularMedias } = useBig5Oracular();
  
  const [step, setStep] = useState<CartografiaStepId>('intro');
  const [respostas, setRespostas] = useState<CartografiaRespostas>({
    objetivas: {},
    sintoma: '',
    historia: '',
    crencas: '',
    recursos: '',
    seguranca: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasDraft, setHasDraft] = useState(false);

  // Referência para evitar salvar enquanto carrega
  const isInitialLoading = useRef(true);

  // Carregar progresso salvo
  useEffect(() => {
    async function loadDraft() {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('cartografia_estrutural_drafts')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data && (data as any).status === 'draft') {
          setHasDraft(true);
        }
      } catch (err) {
        console.error('Erro ao carregar rascunho:', err);
      } finally {
        setLoading(false);
        isInitialLoading.current = false;
      }
    }

    loadDraft();
  }, [user]);

  const retomarRascunho = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cartografia_estrutural_drafts')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const draft = data as any;
        setStep(draft.step as CartografiaStepId);
        setRespostas(draft.respostas as unknown as CartografiaRespostas);
        toast.success('Progresso retomado com sucesso');
      }
    } catch (err) {
      console.error('Erro ao retomar rascunho:', err);
      toast.error('Não foi possível retomar seu progresso');
    } finally {
      setLoading(false);
    }
  };

  const salvarRascunho = useCallback(async (currentStep: CartografiaStepId, currentRespostas: CartografiaRespostas) => {
    if (!user || isInitialLoading.current || currentStep === 'resultado' || currentStep === 'gerando') return;

    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('cartografia_estrutural_drafts' as any)
        .upsert({
          user_id: user.id,
          step: currentStep,
          respostas: currentRespostas as any,
          status: 'draft',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });

      if (error) throw error;
      setSaveStatus('saved');
      // Reset status after 3 seconds
      setTimeout(() => setSaveStatus(prev => prev === 'saved' ? 'idle' : prev), 3000);
    } catch (err) {
      console.error('Erro ao salvar rascunho:', err);
      setSaveStatus('error');
    }
  }, [user]);

  // Autosave quando step ou respostas mudam
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step !== 'intro' && step !== 'resultado' && step !== 'gerando') {
        salvarRascunho(step, respostas);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, respostas, salvarRascunho]);

  const updateResposta = (key: keyof CartografiaRespostas, value: any) => {
    setRespostas(prev => ({ ...prev, [key]: value }));
  };

  const updateObjetiva = (perguntaId: string, territorioKey: string) => {
    setRespostas(prev => ({
      ...prev,
      objetivas: { ...prev.objetivas, [perguntaId]: territorioKey }
    }));
  };

  const finalizar = async () => {
    if (!user) return;
    setStep('gerando');
    setLoading(true);

    try {
      // 1. Calcular médias a partir das perguntas objetivas (que agora pontuam territórios diretamente)
      const big5Medias = calcularMedias(respostas.objetivas as any);
      
      // 2. Montar Profile JSON Integrado (Territórios + Big Five)
      const { profileJson, leitura, cidadela } = montarProfileJson({ 
        rawMedias: big5Medias.medias, 
        territorios: {
          sintoma: respostas.sintoma,
          historia_vida: respostas.historia,
          crencas: respostas.crencas,
          recursos: respostas.recursos,
          seguranca: respostas.seguranca
        },
        contexto: 'clube' 
      });

      // 3. Salvar Cartografia Oficial
      const { data: cartoInserted, error: cartoError } = await supabase.from('cartografia_psiquica').insert({
        user_id: user.id,
        cor_predominante: cidadela.cor_derivada,
        atmosfera: cidadela.atmosfera_derivada,
        territorios_principais: cidadela.distritos_acesos,
        recursos_internos: respostas.recursos,
        conflitos_tensoes: respostas.sintoma,
        simbolo_pessoal: cidadela.simbolo_derivado,
        ponto_partida: cidadela.porta_inicial,
        indice_equilibrio: cidadela.indice_equilibrio,
        metadata_json: { 
          medias_big5: big5Medias.medias,
          respostas_qualitativas: {
            sintoma: respostas.sintoma,
            historia: respostas.historia,
            crencas: respostas.crencas,
            seguranca: respostas.seguranca
          },
          versao: '3.0-clube-estrutural',
          territorio_dominante: cidadela.territorio_dominante,
          territorio_tensao: cidadela.territorio_tensao,
          territorio_adormecido: cidadela.territorio_adormecido
        },
      } as any).select('id').single();

      if (cartoError) throw cartoError;

      // 4. Salvar Profile Detalhado
      await upsertCartografiaProfile({
        userId: user.id,
        cartografiaId: cartoInserted.id,
        profileJson,
        mediasRaw: big5Medias.medias,
      });

      // 5. Atualizar Auto Mapeamento (Cidadela)
      const DISTRITOS_ALL = [
        'portao_chegada', 'torres', 'portas', 'labirinto', 'conselho_interior',
        'bosque_arquetipos', 'casa_matriz', 'casa_sonhos', 'espelho_vinculos',
        'praca_abalo', 'forja', 'portal_renascimento', 'coracao_cidadela'
      ];
      
      const distritosJson: Record<string, any> = {};
      DISTRITOS_ALL.forEach(d => {
        distritosJson[d] = {
          nome: d.replace(/_/g, ' '),
          estado: d === cidadela.porta_inicial ? 'central' : cidadela.distritos_acesos.includes(d) ? 'ativo' : 'potencial',
        };
      });

      await supabase.from('auto_mapeamento').upsert({
        user_id: user.id,
        distritos_json: distritosJson,
        anotacoes: `Leitura Estrutural Orácula™ | Cor: ${cidadela.cor_derivada} | Ponto Inicial: ${cidadela.porta_inicial_nome}`,
      } as any, { onConflict: 'user_id' });

      // 6. Marcar rascunho como concluído
      await supabase
        .from('cartografia_estrutural_drafts' as any)
        .update({ status: 'completed' })
        .eq('user_id', user.id);

      setResult({ profileJson, leitura, cidadela });
      setStep('resultado');
      toast.success('Sua CidaDELA Interior foi revelada ✨');
      // A navegação agora é feita pelo componente de resultado via CTA

    } catch (err) {
      console.error(err);
      toast.error('Erro ao gerar sua cartografia. Tente novamente.');
      setStep('seguranca');
    } finally {
      setLoading(false);
    }
  };

  return {
    step,
    setStep,
    respostas,
    updateResposta,
    updateObjetiva,
    loading: loading || loadingBig5,
    fatores,
    perguntas,
    finalizar,
    result,
    saveStatus,
    hasDraft,
    retomarRascunho
  };
}