import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Porta, buildInitialPortas, calcStats, GRUPOS, EstadoPorta } from './constants';
import { TelaAbertura } from './TelaAbertura';
import { TelaGrupos } from './TelaGrupos';
import { TelaMapeamento } from './TelaMapeamento';
import { TelaExploracao } from './TelaExploracao';
import { TelaPadrao } from './TelaPadrao';
import { TelaGrupoDestaque } from './TelaGrupoDestaque';
import { TelaSintese } from './TelaSintese';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface Props {
  clienteId: string;
}

const TOTAL_TELAS = 10;

export function Labirinto39Portas({ clienteId }: Props) {
  const { user } = useAuth();
  const [tela, setTela] = useState(0);
  const [portas, setPortas] = useState<Porta[]>(buildInitialPortas);
  const [reflexaoAbertas, setReflexaoAbertas] = useState('');
  const [reflexaoFechadas, setReflexaoFechadas] = useState('');
  const [reflexaoTrancadas, setReflexaoTrancadas] = useState('');
  const [reflexaoGrupoAcessivel, setReflexaoGrupoAcessivel] = useState('');
  const [reflexaoGrupoInacessivel, setReflexaoGrupoInacessivel] = useState('');
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [clienteId]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('labirinto_39_portas')
      .select('*')
      .eq('client_id', clienteId)
      .order('created_at', { ascending: false });
    setHistory(data || []);
    setLoadingHistory(false);
  };

  const stats = calcStats(portas);

  const setEstado = (emocao: string, estado: EstadoPorta) => {
    setPortas(prev => prev.map(p => p.emocao === emocao ? { ...p, estado } : p));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('labirinto_39_portas').insert({
      client_id: clienteId,
      therapist_id: user.id,
      portas_json: portas,
      reflexao_abertas: reflexaoAbertas || null,
      reflexao_fechadas: reflexaoFechadas || null,
      reflexao_trancadas: reflexaoTrancadas || null,
      reflexao_grupo_acessivel: reflexaoGrupoAcessivel || null,
      reflexao_grupo_inacessivel: reflexaoGrupoInacessivel || null,
      grupo_mais_acessivel: stats.maisAcessivel?.nome || null,
      grupo_menos_acessivel: stats.menosAcessivel?.nome || null,
      total_abertas: stats.abertas,
      total_fechadas: stats.fechadas,
      total_trancadas: stats.trancadas,
    } as any);

    if (error) {
      toast.error('Erro ao salvar mapeamento');
      console.error(error);
    } else {
      toast.success('Mapeamento do labirinto salvo');
      loadHistory();
    }
    setSaving(false);
  };

  const reset = () => {
    setTela(0);
    setPortas(buildInitialPortas());
    setReflexaoAbertas('');
    setReflexaoFechadas('');
    setReflexaoTrancadas('');
    setReflexaoGrupoAcessivel('');
    setReflexaoGrupoInacessivel('');
  };

  const next = () => setTela(t => Math.min(t + 1, TOTAL_TELAS - 1));
  const prev = () => setTela(t => Math.max(t - 1, 0));

  if (loadingHistory) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const progressPercent = ((tela + 1) / TOTAL_TELAS) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {tela > 0 && (
        <Progress value={progressPercent} className="h-1.5 bg-muted" />
      )}

      {tela === 0 && (
        <TelaAbertura onStart={next} history={history} onLoadMapping={(m: any) => {
          setPortas((m.portas_json as Porta[]) || buildInitialPortas());
          setReflexaoAbertas(m.reflexao_abertas || '');
          setReflexaoFechadas(m.reflexao_fechadas || '');
          setReflexaoTrancadas(m.reflexao_trancadas || '');
          setTela(9); // go to synthesis
        }} />
      )}
      {tela === 1 && <TelaGrupos grupos={GRUPOS} onNext={next} onPrev={prev} />}
      {tela === 2 && (
        <TelaMapeamento
          portas={portas}
          grupos={GRUPOS}
          stats={stats}
          onSetEstado={setEstado}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 3 && (
        <TelaExploracao
          titulo="Portas Abertas"
          subtitulo="Quais emoções você acessa facilmente?"
          pergunta="Como essas emoções ajudam você?"
          portas={portas.filter(p => p.estado === 'aberta')}
          cor="#556B57"
          reflexao={reflexaoAbertas}
          onReflexao={setReflexaoAbertas}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 4 && (
        <TelaExploracao
          titulo="Portas Fechadas"
          subtitulo="Quais emoções você tem dificuldade em acessar?"
          pergunta="Por que essas portas estão fechadas?"
          portas={portas.filter(p => p.estado === 'fechada')}
          cor="#6B7280"
          reflexao={reflexaoFechadas}
          onReflexao={setReflexaoFechadas}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 5 && (
        <TelaExploracao
          titulo="Portas Trancadas"
          subtitulo="Há emoções que você sente que não pode expressar?"
          pergunta="O que aconteceria se você as expressasse?"
          portas={portas.filter(p => p.estado === 'trancada')}
          cor="#991B1B"
          reflexao={reflexaoTrancadas}
          onReflexao={setReflexaoTrancadas}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 6 && <TelaPadrao stats={stats} onNext={next} onPrev={prev} />}
      {tela === 7 && (
        <TelaGrupoDestaque
          titulo="Grupo Emocional Mais Acessível"
          grupo={stats.maisAcessivel}
          pergunta="Como esse grupo emocional te serve?"
          reflexao={reflexaoGrupoAcessivel}
          onReflexao={setReflexaoGrupoAcessivel}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 8 && (
        <TelaGrupoDestaque
          titulo="Grupo Emocional Menos Acessível"
          grupo={stats.menosAcessivel}
          pergunta="Como seria acessar mais essas emoções?"
          reflexao={reflexaoGrupoInacessivel}
          onReflexao={setReflexaoGrupoInacessivel}
          onNext={next}
          onPrev={prev}
        />
      )}
      {tela === 9 && (
        <TelaSintese
          portas={portas}
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
