import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Play, FlaskConical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CasoSimulado, RespostaAluna, SimuladorStep, STEP_ORDER, STEP_LABELS } from './types';
import { BlocoCaso } from './BlocoCaso';
import { BlocoLeitura } from './BlocoLeitura';
import { BlocoPosicionamento } from './BlocoPosicionamento';
import { BlocoDirecao } from './BlocoDirecao';
import { BlocoFerramenta } from './BlocoFerramenta';
import { BlocoFeedback } from './BlocoFeedback';

const NIVEL_STYLES: Record<string, string> = {
  guiado: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'semi-guiado': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  livre: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

const NIVEL_DESC: Record<string, string> = {
  guiado: 'Perguntas e dicas orientam cada passo',
  'semi-guiado': 'Algumas orientações, mais autonomia',
  livre: 'Sem orientação — confie na sua leitura',
};

export function SimuladorConducao() {
  const { user } = useAuth();
  const [casos, setCasos] = useState<CasoSimulado[]>([]);
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    supabase
      .from('treinamento_casos_simulados')
      .select('*')
      .eq('ativo', true)
      .order('ordem')
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          toast.error('Erro ao carregar casos');
        }
        setCasos((data as CasoSimulado[]) || []);
        setLoading(false);
      });
  }, []);

  const caso = casos[casoIndex];
  const stepIdx = STEP_ORDER.indexOf(step);
  const progress = active ? ((stepIdx + 1) / STEP_ORDER.length) * 100 : 0;

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
    await supabase.from('treinamento_respostas').upsert({
      user_id: user.id,
      caso_id: caso.id,
      leitura_texto: resposta.leitura_texto,
      distrito_escolhido: resposta.distrito_escolhido,
      estado_escolhido: resposta.estado_escolhido,
      hipotese_texto: resposta.hipotese_texto,
      vetor_texto: resposta.vetor_texto,
      ferramenta_escolhida: resposta.ferramenta_escolhida,
      nivel_usado: caso.nivel,
      concluido: true,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,caso_id' });
  };

  const handleFeedbackEnter = () => {
    nextStep();
    salvarResposta();
  };

  if (loading) {
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
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Simulador de Condução
          </h2>
          <p className="text-sm text-muted-foreground">
            Pratique leitura clínica simbólica com casos fictícios. Não há certo ou errado — há coerência de leitura.
          </p>
        </div>

        {casos.length === 0 ? (
          <Card className="border-dashed border-primary/20">
            <CardContent className="py-12 text-center">
              <FlaskConical className="w-10 h-10 mx-auto text-primary/30 mb-3" />
              <p className="text-muted-foreground">Nenhum caso disponível ainda.</p>
              <p className="text-xs text-muted-foreground/50 mt-1">Casos serão adicionados pela equipe pedagógica.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {casos.map((c, i) => (
              <Card
                key={c.id}
                className="border-border/30 hover:border-primary/30 transition-all cursor-pointer group"
                onClick={() => iniciar(i)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Play className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.titulo}</p>
                    <p className="text-xs text-muted-foreground truncate">{c.contexto_breve}</p>
                  </div>
                  <Badge className={`text-[10px] shrink-0 capitalize ${NIVEL_STYLES[c.nivel] || ''}`}>
                    {c.nivel}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // --- ACTIVE SIMULATION ---
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <p className="text-sm font-medium text-foreground">{caso?.titulo}</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            {STEP_LABELS[step]} — Passo {stepIdx + 1} de {STEP_ORDER.length}
          </p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => setActive(false)}>
          Sair
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-1">
        <Progress value={progress} className="h-1" />
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

      {/* Blocks */}
      {caso && step === 'caso' && (
        <BlocoCaso caso={caso} onNext={nextStep} />
      )}
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
          onNextCaso={() => iniciar(Math.min(casoIndex + 1, casos.length - 1))}
          isLast={casoIndex >= casos.length - 1}
        />
      )}
    </div>
  );
}
