import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Loader2, FlaskConical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { RespostaAluna, SimuladorStep, STEP_ORDER, STEP_LABELS } from './types';
import { useTrainingCases } from './useTrainingCases';
import { useTrainingProgress } from './useTrainingProgress';
import { ProgressCard } from './ProgressCard';
import { CaseList } from './CaseList';
import { BlocoCaso } from './BlocoCaso';
import { BlocoLeitura } from './BlocoLeitura';
import { BlocoPosicionamento } from './BlocoPosicionamento';
import { BlocoDirecao } from './BlocoDirecao';
import { BlocoFerramenta } from './BlocoFerramenta';
import { BlocoFeedback } from './BlocoFeedback';
import { useQueryClient } from '@tanstack/react-query';

export function SimuladorConducao() {
  const { user } = useAuth();
  const { data: cases = [], isLoading } = useTrainingCases();
  const { progress, completedCount, getCaseStatus } = useTrainingProgress();
  const queryClient = useQueryClient();
  const [casoIndex, setCasoIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [step, setStep] = useState<SimuladorStep>('caso');
  const [resposta, setResposta] = useState<RespostaAluna>({
    leitura_texto: '',
    distrito_escolhido: '',
    estado_escolhido: '',
    hipotese_texto: '',
    vetor_texto: '',
    ferramenta_escolhida: '',
  });

  const caso = cases[casoIndex];
  const stepIdx = STEP_ORDER.indexOf(step);
  const progressPct = active ? ((stepIdx + 1) / STEP_ORDER.length) * 100 : 0;

  const resetResposta = () => {
    setResposta({
      leitura_texto: '',
      distrito_escolhido: '',
      estado_escolhido: '',
      hipotese_texto: '',
      vetor_texto: '',
      ferramenta_escolhida: '',
    });
    setStep('caso');
  };

  const iniciar = (idx: number) => {
    setCasoIndex(idx);
    setActive(true);
    resetResposta();
  };

  const nextStep = () => {
    const nextIdx = stepIdx + 1;
    if (nextIdx < STEP_ORDER.length) {
      setStep(STEP_ORDER[nextIdx]);
    }
  };

  const salvarResposta = async () => {
    if (!user || !caso) return;
    await supabase.from('co_training_attempts').insert({
      user_id: user.id,
      case_id: caso.id,
      resposta_o_que_acontece: resposta.leitura_texto,
      resposta_parece_o_que: '',
      resposta_distrito: resposta.distrito_escolhido,
      resposta_estado: resposta.estado_escolhido,
      resposta_movimento: '',
      resposta_hipotese: resposta.hipotese_texto,
      resposta_vetor: resposta.vetor_texto,
      resposta_ferramenta: resposta.ferramenta_escolhida,
      status: 'concluido',
    });

    await supabase.from('co_training_progress').upsert({
      user_id: user.id,
      nivel_atual: caso.nivel,
      casos_concluidos: casoIndex + 1,
      ultimo_case_id: caso.id,
    }, { onConflict: 'user_id' });

    // Refresh progress data
    queryClient.invalidateQueries({ queryKey: ['training-progress'] });
    queryClient.invalidateQueries({ queryKey: ['training-attempts'] });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  // --- LIST VIEW ---
  if (!active) {
    return (
      <div className="space-y-6">
        <ProgressCard
          totalCases={cases.length}
          completedCount={completedCount}
          nivelAtual={progress?.nivel_atual || null}
        />

        {cases.length === 0 ? (
          <Card className="border-dashed border-primary/20">
            <CardContent className="py-12 text-center">
              <FlaskConical className="w-10 h-10 mx-auto text-primary/30 mb-3" />
              <p className="text-muted-foreground">Nenhum caso disponível ainda.</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Casos serão adicionados pela equipe pedagógica.</p>
            </CardContent>
          </Card>
        ) : (
          <CaseList
            cases={cases}
            getCaseStatus={getCaseStatus}
            onSelectCase={iniciar}
          />
        )}
      </div>
    );
  }

  // --- ACTIVE SIMULATION ---
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{caso?.title}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {STEP_LABELS[step]} — Passo {stepIdx + 1} de {STEP_ORDER.length}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setActive(false)}>
          Sair
        </Button>
      </div>

      <div className="space-y-1">
        <Progress value={progressPct} className="h-1" />
        <div className="flex justify-between">
          {STEP_ORDER.map((s, i) => (
            <span
              key={s}
              className={`text-[9px] uppercase tracking-wider ${
                i <= stepIdx ? 'text-primary font-medium' : 'text-muted-foreground/40'
              }`}
            >
              {STEP_LABELS[s]}
            </span>
          ))}
        </div>
      </div>

      {caso && step === 'caso' && <BlocoCaso caso={caso} onNext={nextStep} />}
      {caso && step === 'leitura' && (
        <BlocoLeitura
          caso={caso}
          value={resposta.leitura_texto}
          onChange={v => setResposta(r => ({ ...r, leitura_texto: v }))}
          onNext={nextStep}
        />
      )}
      {caso && step === 'posicionamento' && (
        <BlocoPosicionamento
          caso={caso}
          distrito={resposta.distrito_escolhido}
          estado={resposta.estado_escolhido}
          onDistritoChange={v => setResposta(r => ({ ...r, distrito_escolhido: v }))}
          onEstadoChange={v => setResposta(r => ({ ...r, estado_escolhido: v }))}
          onNext={nextStep}
        />
      )}
      {caso && step === 'direcao' && (
        <BlocoDirecao
          caso={caso}
          hipotese={resposta.hipotese_texto}
          vetor={resposta.vetor_texto}
          onHipoteseChange={v => setResposta(r => ({ ...r, hipotese_texto: v }))}
          onVetorChange={v => setResposta(r => ({ ...r, vetor_texto: v }))}
          onNext={nextStep}
        />
      )}
      {caso && step === 'ferramenta' && (
        <BlocoFerramenta
          caso={caso}
          ferramenta={resposta.ferramenta_escolhida}
          onChange={v => setResposta(r => ({ ...r, ferramenta_escolhida: v }))}
          onNext={() => { nextStep(); salvarResposta(); }}
        />
      )}
      {caso && step === 'feedback' && (
        <BlocoFeedback
          caso={caso}
          resposta={resposta}
          onReset={resetResposta}
          onNextCaso={() => iniciar(Math.min(casoIndex + 1, cases.length - 1))}
          isLast={casoIndex >= cases.length - 1}
        />
      )}
    </div>
  );
}
