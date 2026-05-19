import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useBig5Oracular } from './useBig5Oracular';
import { montarProfileJson } from '@/lib/cartografia/montarProfileJson';
import { upsertCartografiaProfile } from '@/lib/dal/cartografiaProfile';
import { toast } from 'sonner';

export type CartografiaStepId = 'intro' | 'sintoma' | 'historia' | 'tracos' | 'crencas' | 'recursos' | 'seguranca' | 'gerando' | 'resultado';

export interface CartografiaRespostas {
  // Big Five (Traços)
  big5: Record<string, number>;
  // Qualitativo (6 Territórios)
  sintoma: string;
  historia: string;
  tracos_qualitativo: string;
  crencas: string;
  recursos: string;
  seguranca: string;
}

export function useCartografiaEstrutural() {
  const { user } = useAuth();
  const { fatores, perguntas, loading: loadingBig5, calcularMedias } = useBig5Oracular();
  
  const [step, setStep] = useState<CartografiaStepId>('intro');
  const [respostas, setRespostas] = useState<CartografiaRespostas>({
    big5: {},
    sintoma: '',
    historia: '',
    tracos_qualitativo: '',
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
          .from('cartografia_estrutural_drafts' as any)
          .select('step, respostas, status')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data && data.status === 'draft') {
          setHasDraft(true);
          // Não aplicamos o rascunho automaticamente para permitir que a usuária escolha "Continuar"
          // Armazenamos para uso posterior se solicitado
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
        .from('cartografia_estrutural_drafts' as any)
        .select('step, respostas')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setStep(data.step as CartografiaStepId);
        setRespostas(data.respostas as unknown as CartografiaRespostas);
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

  const updateBig5 = (perguntaId: string, value: number) => {
    setRespostas(prev => ({
      ...prev,
      big5: { ...prev.big5, [perguntaId]: value }
    }));
  };

  const finalizar = async () => {
    if (!user) return;
    setStep('gerando');
    setLoading(true);

    try {
      // 1. Calcular médias do Big Five
      const big5Medias = calcularMedias(respostas.big5);
      
      // 2. Montar Profile JSON Integrado (Territórios + Big Five)
      const { profileJson, leitura, cidadela } = montarProfileJson({ 
        rawMedias: big5Medias.medias, 
        territorios: {
          sintoma: respostas.sintoma,
          historia_vida: respostas.historia,
          crencas: respostas.crencas,
          recursos: respostas.recursos
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
            seguranca: respostas.seguranca,
            tracos_qualitativo: respostas.tracos_qualitativo
          },
          versao: '2.0-estrutural'
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
        'portao_chegada', 'torres', 'portas', 'jardim_arquetipos', 'praca_abalo',
        'casa_sonhos', 'espelho_vinculos', 'forja', 'conselho_interior',
        'labirinto', 'praca_integracao', 'portal_renascimento',
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
        anotacoes: `Cartografia Estrutural | Cor: ${cidadela.cor_derivada} | Nível Atenção: ${profileJson.derivacao.atencao_seguranca}`,
      } as any, { onConflict: 'user_id' });

      // 6. Marcar rascunho como concluído
      await supabase
        .from('cartografia_estrutural_drafts' as any)
        .update({ status: 'completed' })
        .eq('user_id', user.id);

      setResult({ profileJson, leitura, cidadela });
      setStep('resultado');
      toast.success('Sua CidaDELA Interior foi revelada ✨');
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
    updateBig5,
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
