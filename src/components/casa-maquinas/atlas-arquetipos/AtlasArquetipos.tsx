import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AtlasState, INITIAL_STATE, calcAtlasStats, ARQUETIPOS } from './constants';
import { AtlasAbertura } from './AtlasAbertura';
import { AtlasApresentacao } from './AtlasApresentacao';
import { AtlasSelecao } from './AtlasSelecao';
import { AtlasCaracterizacao } from './AtlasCaracterizacao';
import { AtlasDinamica } from './AtlasDinamica';
import { AtlasDominante } from './AtlasDominante';
import { AtlasDormindo } from './AtlasDormindo';
import { AtlasVisualizacao } from './AtlasVisualizacao';
import { AtlasSintese } from './AtlasSintese';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface Props {
  clienteId: string;
}

const TOTAL_TELAS = 9;

export function AtlasArquetipos({ clienteId }: Props) {
  const { user } = useAuth();
  const [tela, setTela] = useState(0);
  const [state, setState] = useState<AtlasState>({ ...INITIAL_STATE });
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => { loadHistory(); }, [clienteId]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('atlas_arquetipos_registros')
      .select('*')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: false });
    setHistory(data || []);
    setLoadingHistory(false);
  };

  const stats = calcAtlasStats(state);

  const update = <K extends keyof AtlasState>(key: K, val: AtlasState[K]) =>
    setState(prev => ({ ...prev, [key]: val }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const dom = stats.dominante?.nome || state.selecionados[0] || null;
    const media = Math.round(stats.media * 10) / 10;

    const { error } = await supabase.from('atlas_arquetipos_registros').insert({
      client_id: clienteId,
      therapist_id: user.id,
      arquetipos_selecionados: state.selecionados,
      arquetipos_descricao: state.descricoes,
      arquetipos_atividade: state.atividades,
      arquetipos_situacoes: state.situacoes,
      dinamica_geral: state.dinamicaGeral || null,
      conflitos_arquetipos: state.conflitos || null,
      harmonias_arquetipos: state.harmonias || null,
      arquetipo_dominante: dom,
      arquetipo_dormindo: state.arquetipoDormindo || null,
      o_que_poderia_trazer: state.oQuePoderia || null,
      reflexao_dominante: state.reflexaoDominante || null,
      atividade_media: media,
    } as any);

    if (error) {
      toast.error('Erro ao salvar atlas');
      console.error(error);
    } else {
      toast.success('Atlas de Arquétipos salvo');
      loadHistory();
    }
    setSaving(false);
  };

  const reset = () => { setTela(0); setState({ ...INITIAL_STATE }); };
  const next = () => setTela(t => Math.min(t + 1, TOTAL_TELAS - 1));
  const prev = () => setTela(t => Math.max(t - 1, 0));

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {tela > 0 && <Progress value={((tela + 1) / TOTAL_TELAS) * 100} className="h-1.5 bg-muted" />}

      {tela === 0 && (
        <AtlasAbertura
          onStart={next}
          history={history}
          onLoadMapping={(m: any) => {
            setState({
              selecionados: m.arquetipos_selecionados || [],
              descricoes: (m.arquetipos_descricao as Record<string, string>) || {},
              atividades: (m.arquetipos_atividade as Record<string, number>) || {},
              situacoes: (m.arquetipos_situacoes as Record<string, string>) || {},
              dinamicaGeral: m.dinamica_geral || '',
              conflitos: m.conflitos_arquetipos || '',
              harmonias: m.harmonias_arquetipos || '',
              arquetipoDominante: m.arquetipo_dominante || '',
              arquetipoDormindo: m.arquetipo_dormindo || '',
              oQuePoderia: m.o_que_poderia_trazer || '',
              reflexaoDominante: m.reflexao_dominante || '',
            });
            setTela(8);
          }}
        />
      )}
      {tela === 1 && <AtlasApresentacao onNext={next} onPrev={prev} />}
      {tela === 2 && (
        <AtlasSelecao
          selecionados={state.selecionados}
          onUpdate={v => update('selecionados', v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 3 && (
        <AtlasCaracterizacao
          selecionados={state.selecionados}
          descricoes={state.descricoes}
          atividades={state.atividades}
          situacoes={state.situacoes}
          onDescricao={(n, v) => update('descricoes', { ...state.descricoes, [n]: v })}
          onAtividade={(n, v) => update('atividades', { ...state.atividades, [n]: v })}
          onSituacao={(n, v) => update('situacoes', { ...state.situacoes, [n]: v })}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 4 && (
        <AtlasDinamica
          dinamica={state.dinamicaGeral}
          conflitos={state.conflitos}
          harmonias={state.harmonias}
          onDinamica={v => update('dinamicaGeral', v)}
          onConflitos={v => update('conflitos', v)}
          onHarmonias={v => update('harmonias', v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 5 && (
        <AtlasDominante
          dominante={stats.dominante}
          reflexao={state.reflexaoDominante}
          onReflexao={v => update('reflexaoDominante', v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 6 && (
        <AtlasDormindo
          naoSelecionados={stats.naoSelecionados}
          dormindo={state.arquetipoDormindo}
          oQuePoderia={state.oQuePoderia}
          onDormindo={v => update('arquetipoDormindo', v)}
          onOQuePoderia={v => update('oQuePoderia', v)}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 7 && (
        <AtlasVisualizacao
          selecionados={state.selecionados}
          atividades={state.atividades}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 8 && (
        <AtlasSintese
          state={state}
          stats={stats}
          saving={saving}
          onSave={handleSave}
          onPrev={prev}
          onReset={reset}
        />
      )}
    </div>
  );
}
